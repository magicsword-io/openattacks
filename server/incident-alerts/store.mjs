import postgres from "postgres";

let sql;

export function getStore(databaseUrl) {
  sql ??= postgres(databaseUrl, {
    max: 2,
    connect_timeout: 5,
    idle_timeout: 20,
    connection: { statement_timeout: 5000 },
  });
  return createStore(sql);
}

export function createStore(sql) {
  return {
    async allowSignup(clientBucket) {
      const [{ count }] = await sql`
        INSERT INTO incident_alert_signup_limits (bucket, hour, count)
        VALUES (${clientBucket}, date_trunc('hour', now()), 1)
        ON CONFLICT (bucket, hour) DO UPDATE
          SET count = incident_alert_signup_limits.count + 1
        RETURNING count
      `;
      return count <= 10;
    },

    async requestConfirmation(email, hash) {
      // The per-address cooldown, global budget, and token change commit together.
      return sql.begin(async (transaction) => {
        const [budget] = await transaction`
          INSERT INTO incident_alert_signup_limits (bucket, hour, count)
          VALUES ('confirmation-mail', date_trunc('hour', now()), 0)
          ON CONFLICT (bucket, hour) DO UPDATE
            SET count = incident_alert_signup_limits.count
          RETURNING count
        `;
        if (budget.count >= 50) return false;

        const [subscriber] = await transaction`
          INSERT INTO incident_alert_subscribers (
            email, confirmation_hash, confirmation_requested_at, confirmation_expires_at
          ) VALUES (${email}, ${hash}, now(), now() + interval '24 hours')
          ON CONFLICT (email) DO UPDATE SET
            confirmation_hash = excluded.confirmation_hash,
            confirmation_requested_at = excluded.confirmation_requested_at,
            confirmation_expires_at = excluded.confirmation_expires_at
          WHERE (
            incident_alert_subscribers.opted_in_at IS NULL
            OR incident_alert_subscribers.opted_out_at IS NOT NULL
          ) AND (
            incident_alert_subscribers.confirmation_requested_at IS NULL
            OR incident_alert_subscribers.confirmation_requested_at <= now() - interval '1 hour'
          )
          RETURNING id
        `;
        if (!subscriber) return false;
        await transaction`
          UPDATE incident_alert_signup_limits SET count = count + 1
          WHERE bucket = 'confirmation-mail' AND hour = date_trunc('hour', now())
        `;
        return true;
      });
    },

    async confirm(hash) {
      const [subscriber] = await sql`
        UPDATE incident_alert_subscribers SET
          confirmation_hash = NULL,
          confirmation_expires_at = NULL,
          consent_id = gen_random_uuid(),
          opted_in_at = now(),
          opted_out_at = NULL
        WHERE confirmation_hash = ${hash} AND confirmation_expires_at > now()
        RETURNING id
      `;
      return Boolean(subscriber);
    },

    async unsubscribe(consentId) {
      await sql`
        UPDATE incident_alert_subscribers SET opted_out_at = now()
        WHERE consent_id = ${consentId} AND opted_out_at IS NULL
      `;
    },

    async catalogStatus(items) {
      const [status] = await sql`
        SELECT initialized_at IS NOT NULL AS initialized,
          (SELECT count(*)::integer FROM jsonb_array_elements(${sql.json(items)}) AS item
            WHERE NOT EXISTS (
              SELECT FROM incident_alert_catalog WHERE incident_id = item->>'id'
            )) AS unseen,
          (SELECT count(*)::integer FROM incident_alert_deliveries WHERE status = 'queued') AS pending
        FROM incident_alert_state
      `;
      return status;
    },

    async acquireLease(id) {
      const [lease] = await sql`
        UPDATE incident_alert_state
        SET lease_id = ${id}, lease_expires_at = now() + interval '90 seconds'
        WHERE lease_expires_at IS NULL OR lease_expires_at <= now()
        RETURNING lease_id
      `;
      return Boolean(lease);
    },

    async releaseLease(id) {
      await sql`
        UPDATE incident_alert_state SET lease_id = NULL, lease_expires_at = NULL
        WHERE lease_id = ${id}
      `;
    },

    async plan(items, sender, baselineOnly) {
      return sql.begin(async (transaction) => {
        const [state] = await transaction`
          SELECT initialized_at IS NOT NULL AS initialized,
            (now() AT TIME ZONE 'UTC')::date::text AS today,
            last_digest_day::text
          FROM incident_alert_state FOR UPDATE
        `;

        if (
          state.initialized &&
          (baselineOnly || state.last_digest_day === state.today)
        ) {
          return { baselined: false, newEntries: 0 };
        }

        const inserted = await transaction`
          INSERT INTO incident_alert_catalog (incident_id)
          SELECT item->>'id' FROM jsonb_array_elements(${transaction.json(items)}) AS item
          ON CONFLICT DO NOTHING
          RETURNING incident_id
        `;

        if (!state.initialized) {
          await transaction`UPDATE incident_alert_state SET initialized_at = now()`;
          return { baselined: true, newEntries: 0 };
        }

        await transaction`
          UPDATE incident_alert_state SET last_digest_day = ${state.today}
        `;
        if (inserted.length) {
          const newIds = new Set(
            inserted.map(({ incident_id }) => incident_id),
          );
          const entries = items.filter(({ id }) => newIds.has(id));
          await transaction`
            INSERT INTO incident_alert_digests VALUES (
              ${state.today}, ${transaction.json(entries)}, ${transaction.json(sender)}
            )
          `;
          await transaction`
            INSERT INTO incident_alert_deliveries (digest_day, subscriber_id, consent_id)
            SELECT ${state.today}, id, consent_id FROM incident_alert_subscribers
            WHERE opted_in_at IS NOT NULL AND opted_out_at IS NULL
          `;
        }

        return { baselined: false, newEntries: inserted.length };
      });
    },

    async cleanUp() {
      const [, , expired] = await sql.begin((transaction) => [
        transaction`
          DELETE FROM incident_alert_signup_limits WHERE hour < now() - interval '2 days'
        `,
        transaction`
          DELETE FROM incident_alert_subscribers
          WHERE opted_in_at IS NULL AND confirmation_expires_at < now() - interval '7 days'
        `,
        transaction`
          UPDATE incident_alert_deliveries SET status = 'expired'
          WHERE status = 'queued' AND first_attempt_at <= now() - interval '23 hours'
        `,
        transaction`
          UPDATE incident_alert_deliveries AS delivery SET status = 'skipped'
          FROM incident_alert_subscribers AS subscriber
          WHERE delivery.status = 'queued' AND delivery.subscriber_id = subscriber.id
            AND (subscriber.opted_out_at IS NOT NULL OR delivery.consent_id <> subscriber.consent_id)
        `,
      ]);
      return expired.count;
    },

    async claimDelivery() {
      const [delivery] = await sql`
        WITH candidate AS (
          SELECT delivery.id, subscriber.email, digest.items, digest.sender
          FROM incident_alert_deliveries AS delivery
          JOIN incident_alert_subscribers AS subscriber ON subscriber.id = delivery.subscriber_id
          JOIN incident_alert_digests AS digest USING (digest_day)
          WHERE delivery.status = 'queued' AND delivery.next_attempt_at <= now()
            AND (delivery.first_attempt_at IS NULL OR delivery.first_attempt_at > now() - interval '23 hours')
            AND subscriber.opted_out_at IS NULL AND delivery.consent_id = subscriber.consent_id
          ORDER BY delivery.digest_day, delivery.next_attempt_at, delivery.id
          LIMIT 1
          FOR UPDATE OF delivery SKIP LOCKED
        )
        UPDATE incident_alert_deliveries AS delivery SET
          first_attempt_at = coalesce(delivery.first_attempt_at, now()),
          next_attempt_at = now() + interval '5 minutes'
        FROM candidate WHERE delivery.id = candidate.id
        RETURNING delivery.id, delivery.consent_id, candidate.email, candidate.items, candidate.sender
      `;
      return delivery;
    },

    async completeDelivery(id, providerId) {
      await sql`
        UPDATE incident_alert_deliveries SET status = 'sent', provider_id = ${providerId}
        WHERE id = ${id} AND status = 'queued'
      `;
    },

    async pendingCount() {
      const [{ count }] = await sql`
        SELECT count(*)::integer FROM incident_alert_deliveries WHERE status = 'queued'
      `;
      return count;
    },
  };
}
