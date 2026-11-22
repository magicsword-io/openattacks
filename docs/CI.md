# CI and merge checks

Attack PRs are checked as a complete catalog so collisions and stale references cannot hide behind validation of only the new YAML files.

| Check                                                                        | What it verifies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate`                                                                   | YAML syntax and duplicate keys; merge conflict markers; strict schema, enums, dates, ID/filename agreement and duplicate IDs; HTTP(S) evidence links and duplicate sources; flow and ATLAS references; generated simulation consistency; type checks; production build; catalog/export parity and sidecar references; browser behavior, internal links and accessibility. |
| `source-links`                                                               | Published evidence and coverage links in added or modified attack entries. Confirmed 404/410 responses, invalid destinations and broken redirect chains fail. Other failures produce warnings for review.                                                                                                                                                                                                                                                                                         |
| `attack-detections`                                                          | The catalog and generated artifacts validate. Changed-entry completeness, detection URL reachability, and rule-platform fit are reported as an advisory editorial check. Guidance-only entries receive a reviewable security-detections-mcp suggestion artifact.                                                                                                                                                                                                                                  |
| `runner (macos-latest)`, `runner (ubuntu-latest)`, `runner (windows-latest)` | Portable simulation runner tests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

Source URLs must be public HTTP(S) links with no credentials or whitespace. The live checker validates DNS answers and redirect destinations before connecting, deduplicates repeated evidence URLs, and avoids downloading response bodies. It excludes IOC and free-text URLs. See [the contributor guide](../CONTRIBUTING.md) for timeout, retry and warning behavior. A successful HTTP response establishes reachability; reviewers still confirm primary sourcing, factual support, qualifications and whether a proposed record duplicates an existing incident.

`attack-detections` runs on `pull_request` and `merge_group` with read-only repository access and no secrets or persisted checkout credentials. It does not use `pull_request_target` or push to contributor branches. The job runs required catalog validation, then reports changed-entry completeness, detection URL reachability, and platform fit as an advisory editorial check. Guidance-only changed entries are matched with security-detections-mcp, and a seven-day suggestion artifact is uploaded for manual review. The rule index is cached for the ISO week and rebuilt when that cache is missing. Details and local commands are in [Detection rules on pull requests](../CONTRIBUTING.md#detection-rules-on-pull-requests).

## Protect `main`

After this workflow has run once, configure the repository's branch ruleset or protection rule for `main`:

1. Require a pull request and at least one approving review.
2. Require the `validate` and `source-links` status checks, plus the three simulation `runner` checks if those are required for the repository.
3. Require branches to be up to date before merging, or enable a merge queue when the repository's plan supports it. Resolve review conversations before merging.

Workflow files define checks; they do not enable repository protection settings. Keep the job names stable after making them required. Checks have no path filters, so documentation-only PRs still report required statuses; the link job succeeds without network requests when no attack files changed. Browser failure traces are uploaded as the `browser-test-results` artifact.

Branch protection also depends on repository visibility and the GitHub plan. If Settings or the API reports an upgrade requirement for a private repository, CI still reports results, but maintainers must check them before merging until protection is available. See GitHub's [protected branch availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

The default PR checkout tests GitHub's proposed merge commit. A conflicting PR must resolve its conflicts before GitHub can run `pull_request` checks. When PRs merge concurrently, an up-to-date requirement forces checks against the new base, while a merge queue tests changes together with the current base and queued PRs. The catalog, source-link, and attack-detection workflows listen for `merge_group` so required checks can run on that combined result. See GitHub's [PR event documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request) and [merge queue configuration](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue).

## Local verification and link audits

```sh
npm ci
npm run validate
npm run test:validation
npm run check
npm run build
npm test
npx playwright install chromium
npm run test:browser

# All published evidence/coverage links (requires network access):
npm run check:links -- --all

# Added/modified entries in committed changes since this base:
git fetch origin main
npm run check:links -- --base origin/main
```

The **Audit catalog source links** workflow runs every Monday at 09:23 UTC and can be run manually from Actions. Its summary lists failed and unverified URLs with entry filenames and field paths. Review warnings, replace dead links with the publisher's canonical report or a suitable archived source, and document source limitations in the entry.

## Publishing

Vercel's existing connected Git deployment rebuilds `main` using `npm run check && npm run build && npm test`. This validates records and generated outputs before publishing; PRs receive preview deployments. Branch protection supplies the pre-merge gate for browser and live-link checks. The live network audit stays outside deployment builds so an external site's rate limit cannot stop an otherwise valid build. The GitHub Pages workflow remains manually triggered.
