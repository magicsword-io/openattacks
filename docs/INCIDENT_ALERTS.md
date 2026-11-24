# OpenAttacks incident alerts

OpenAttacks offers a daily email digest on [Get incident alerts](https://openattacks.ai/alerts/). A reader requests a confirmation email and explicitly confirms through a link that expires after 24 hours. Each digest is addressed to one reader and includes a visible unsubscribe link and a mailbox one-click unsubscribe header. Existing opt-outs remain effective when signup is paused.

Vercel invokes `/api/incident-alert-digest` at 14:00 UTC using the schedule in `vercel.json`. The job reads the catalog served by the production domain and compares its stable entry IDs with the IDs already recorded in Postgres. The first successful run records a baseline and sends zero emails. A later run creates one digest for that UTC day when it sees IDs for the first time. Edits, report dates, restored IDs, and empty runs generate no new digest. An entry must remain published long enough to appear in a daily snapshot. The digest uses titles, short summaries based on catalog roles, and canonical OpenAttacks links.

## Set up Vercel and Resend

1. Use the existing Vercel project connected to `magicsword-io/openattacks`. Keep `main` as its Production Branch, `openattacks.ai` assigned to Production, Node.js 22.x, the Astro preset, and the repository's build settings. The site remains static, with two Vercel Node.js Functions under `api/`. Enable automatic system environment variables so Vercel supplies `VERCEL_ENV`. [Vercel deployment environments](https://vercel.com/docs/deployments/environments)
2. Use the team's existing Postgres database if one is available. Otherwise, connect [Neon from Vercel Marketplace](https://vercel.com/marketplace/neon) to the project. Apply [the alerts schema](../server/incident-alerts/schema.sql) to the designated production database, for example with `psql "$INCIDENT_ALERTS_DATABASE_URL" -v ON_ERROR_STOP=1 -f server/incident-alerts/schema.sql`. Use a TLS connection and grant the application role access to the alert tables only. The repository has no existing incident-alert subscriber list. If a separate legacy list exists, preserve only addresses with documented verified incident-alert consent and any opt-outs. Account registration or consent to a generic newsletter does not qualify.
3. Connect [Resend from Vercel Marketplace](https://vercel.com/marketplace/resend). In Resend, add a sender domain you own, such as `alerts.openattacks.ai`. Add the exact SPF and DKIM records Resend provides to the domain's DNS, complete verification in Resend, and configure DMARC for the sending domain. Keep open and click tracking off. Use a sending key scoped to the verified domain. [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction)
4. Add the following variables in **Vercel → Project → Settings → Environment Variables** for **Production**. Keep the Preview and Development environments free of live credentials. Redeploy after changes to apply the new values.

| Variable                          | Value                                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `INCIDENT_ALERTS_DATABASE_URL`    | TLS Postgres connection string for the runtime role. Use the pooled URL with Neon.                                                  |
| `CRON_SECRET`                     | At least 32 random characters safe for an HTTP header. Generate one with `openssl rand -hex 32`. Vercel sends it as a bearer token. |
| `RESEND_API_KEY`                  | Production sending key from the Resend integration.                                                                                 |
| `INCIDENT_ALERTS_FROM`            | Verified sender, for example `OpenAttacks <incidents@alerts.openattacks.ai>`.                                                       |
| `INCIDENT_ALERTS_MAILING_ADDRESS` | MagicSword's public mailing address for the digest footer.                                                                          |
| `INCIDENT_ALERTS_MODE`            | Start with `baseline`. Change to `live` after dry-run checks. Use `paused` to stop sending and keep unsubscribe available.          |

## Dry run and activate

1. Run the mocked suite with `node --test tests/incident-alerts.test.mjs`. To include the SQL integration test, run the same command with `ALERTS_TEST_DATABASE_URL` set to a disposable local Postgres connection. It creates and drops its own test schema. Both use mock email data. Build the site and run `npx playwright test tests/browser/incident-alerts.spec.ts` to verify the signup UI.
2. Deploy `main` to Production in `baseline` mode. In **Schedules → Cron Jobs**, check that `/api/incident-alert-digest` appears once. Sign into the preview if Deployment Protection is enabled, then check that `/alerts/` shows signup as unavailable and both alert functions return 503. An unauthenticated request to the active production cron should return 401. [Vercel cron setup and logs](https://vercel.com/docs/schedules/cron-jobs/manage-cron-jobs)
3. From a trusted shell with `CRON_SECRET` already set, make an authenticated dry run. This returns aggregate counts and leaves storage and mail untouched.

   ```sh
   curl --silent --show-error --fail-with-body \
     --header "Authorization: Bearer $CRON_SECRET" \
     'https://openattacks.ai/api/incident-alert-digest?dry-run=1'
   ```

4. To record the initial baseline, call the same endpoint without `?dry-run=1` while in `baseline` mode, or await the first scheduled run. Check for `status: "baseline"` and `baselined: true`. Repeat the dry run to confirm `initialized: true`. The baseline records the catalog served at that moment.
5. Set `INCIDENT_ALERTS_MODE=live` and redeploy when the sender, database, and baseline are ready. Verify that **Get alerts** in the site header opens the signup form. An initial delivery check, if authorized, can use an owner-controlled inbox. Continue to use mocked recipients for repeated testing, including unsubscribe, retries, and duplicate jobs.

## Monitor and pause

Check aggregate job responses in Vercel's runtime logs and inspect provider events in Resend. A completed delivery stores the provider's receipt. If a run returns `pending` or `retry-needed`, check the provider's quota and service status. Vercel does not retry failed cron calls automatically. Re-run the authenticated request after five minutes for failed sends, within 23 hours of the first attempt. Each retry uses the same Resend idempotency key. An unresolved attempt expires before Resend's 24-hour key window ends and needs manual reconciliation with provider records. [Vercel cron retries](https://vercel.com/docs/schedules/cron-jobs/manage-cron-jobs) · [Resend idempotency](https://resend.com/changelog/idempotency-keys)

Each invocation has a bounded send window. Monitor `pending` counts as the list grows, and manually drain large queues with the same authenticated endpoint. Check the applicable [Resend quotas](https://resend.com/docs/api-reference/rate-limit) and [Vercel limits](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing) before a larger rollout.

To pause, set `INCIDENT_ALERTS_MODE=paused` and redeploy with the database connected. Restrict access to the database, provider records, and request URLs containing verification or unsubscribe tokens. Application logs and job responses contain status and counts. Expired unconfirmed addresses are pruned during scheduled runs. Keep the catalog IDs and delivery records when rotating provider credentials or redeploying so previously sent alerts remain deduplicated.
