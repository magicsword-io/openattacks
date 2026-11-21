BEGIN;

CREATE TABLE IF NOT EXISTS incident_alert_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  confirmation_hash text UNIQUE,
  confirmation_expires_at timestamptz,
  confirmation_requested_at timestamptz,
  consent_id uuid UNIQUE,
  opted_in_at timestamptz,
  opted_out_at timestamptz,
  CHECK ((consent_id IS NULL) = (opted_in_at IS NULL))
);

CREATE TABLE IF NOT EXISTS incident_alert_signup_limits (
  bucket text NOT NULL,
  hour timestamptz NOT NULL,
  count integer NOT NULL,
  PRIMARY KEY (bucket, hour)
);

CREATE TABLE IF NOT EXISTS incident_alert_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  initialized_at timestamptz,
  last_digest_day date,
  lease_id uuid,
  lease_expires_at timestamptz
);

INSERT INTO incident_alert_state DEFAULT VALUES ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS incident_alert_catalog (
  incident_id text PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS incident_alert_digests (
  digest_day date PRIMARY KEY,
  items jsonb NOT NULL,
  sender jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS incident_alert_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_day date NOT NULL REFERENCES incident_alert_digests (digest_day),
  subscriber_id uuid NOT NULL REFERENCES incident_alert_subscribers (id) ON DELETE CASCADE,
  consent_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'sent', 'skipped', 'expired')),
  first_attempt_at timestamptz,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  provider_id text,
  UNIQUE (digest_day, subscriber_id)
);

CREATE INDEX IF NOT EXISTS incident_alert_deliveries_pending
  ON incident_alert_deliveries (digest_day, next_attempt_at) WHERE status = 'queued';

COMMIT;
