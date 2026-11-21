# Suggestion intake

The [suggestion page](https://openattacks.ai/suggest/) accepts incident leads, catalog suggestions, and catalog corrections. The form publishes the submission to the public `magicsword-io/openattacks` issue tracker after explicit consent. It accepts a description, an optional catalog incident, and an optional public source URL. The page also links to the existing GitHub issue templates and private vulnerability reporting.

## Vercel deployment

The form uses the Astro Vercel adapter for a single on-demand endpoint at `/suggest/intake.json`. Let Vercel use the Astro framework's build output. Clear any **Output Directory** override in Vercel project settings so the adapter's `.vercel/output` is picked up. Keep Vercel's automatic system environment variables available to the build so `VERCEL=1` selects the adapter. Builds for GitHub Pages and other static hosts offer the existing GitHub links.

Set the following server-side environment variables in the intended Vercel environment. Keep them out of source control and client-exposed settings.

| Variable                               | Value                                                                                                                                                                                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPENATTACKS_SUGGESTIONS_GITHUB_TOKEN` | An expiring fine-grained PAT scoped to **only** `magicsword-io/openattacks`, with **Issues: Read and write** and the mandatory metadata permission. Use a dedicated account where possible. Approve the token for the organization if required. |
| `OPENATTACKS_SUGGESTIONS_REDIS_URL`    | A dedicated [Upstash Redis REST endpoint](https://upstash.com/docs/redis/features/restapi), using its HTTPS origin.                                                                                                                             |
| `OPENATTACKS_SUGGESTIONS_REDIS_TOKEN`  | The REST write token for that database, with permission to run the atomic rate and duplicate checks.                                                                                                                                            |
| `OPENATTACKS_SUGGESTIONS_ENABLED`      | Set to `true` to enable posting after the other settings are configured. Omit it or set it to `false` to disable posting.                                                                                                                       |

Use separate settings per environment. Keep automatic posting disabled on public previews and use the mocked verification below. Redeploy after changing the settings. The form displays the GitHub fallback when the endpoint or its configuration is unavailable.

The endpoint caps new posting attempts at four per client IP and 25 total per hour. It uses Vercel's client IP header and stores a keyed hash of the IP, keyed hashes of normalized submissions, counters, and public issue numbers. Rate records expire after an hour and duplicate records expire after 24 hours. Redis downtime blocks new writes. If GitHub's response is inconclusive, the reservation stays in place and the form directs the submitter to check recent issues.

Issue bodies render descriptions and source URLs as literal text. The endpoint sends no contact fields, fetches no source links, and creates only a GitHub issue. Review submitted evidence as untrusted input.

## Verification

`node --test tests/suggestions.test.mjs` runs the server flow against mocked GitHub and Redis endpoints using dummy credentials. After `npm run build`, run `npm run test:browser -- tests/browser/suggestions.spec.ts` to verify the form and fallback. The tests create no GitHub issues.
