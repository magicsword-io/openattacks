# Run an OpenAttacks simulation

OpenAttacks includes small, synthetic exercises linked to the attack stages they help explain. An **agent exercise** prepares context for your separately configured target agent. A **local comparison** produces fixed mock observations without starting an agent. Neither establishes your EDR detection or reproduces an entire incident.

## Get the lab

Use this repository or extract the website's **Download lab** archive. Both contain the same runner, definitions and fixtures. Node.js 22.22.0 or newer is the only runtime dependency. Website dependencies and `npm ci` are not needed to run the lab.

From the extracted `openattacks-labs` folder or repository root:

```sh
npm run simulate -- list
node simulations/lab.mjs list
```

The npm command forwards arguments to the same Node entry point. Commands use separate quoted arguments rather than Bash variables and work in ordinary shells, including PowerShell, subject to the platform verification listed on the test page.

## Prepare and compare

```sh
npm run simulate -- prepare mcp-tool-poisoning --clean
npm run simulate -- prepare mcp-tool-poisoning
```

Save the exact returned paths for each condition. Preparation does not launch a model, configure global MCP settings, read provider histories, or upload evidence. For MCP exercises the returned configuration starts the included closed stdio server. Use a fresh target session with only that server's listed tools and enable your authorized tool trace before the clean trial. Disable unrelated shell, filesystem, browser and connector tools. Stop if isolation cannot be verified.

Paste the returned legitimate task into each separate session. The task asks for ordinary work; the synthetic poisoned content is delivered through the selected fixture. Keep model/provider traffic, budget and timeout under the operator's control. Compare both sessions using the same provider settings. Refusal is a valid result; do not escalate permissions or strengthen a payload after a block.

Project and skill exercises materialize instructions only inside the returned disposable workspace. They request at most a synthetic marker; a prompt does not enforce OS isolation. Use a disposable externally constrained agent environment. The configuration-change comparison manipulates mock JSON only and never installs or activates a provider configuration.

Retrieved-context cases require `--case error-report` or `--case documentation`. Split-channel exercises require `--condition clean`, `schema-only`, `result-only` or `combined`; compare all four rather than attributing an outcome to combined fragments alone. Use `list` and the individual attack-page instructions for exact supported commands.

## Verify and clean up

After ending the target session and stopping its server, replace these example paths with each exact returned record path:

```sh
npm run simulate -- verify "/exact/run/record.json"
npm run simulate -- cleanup "/exact/run/record.json"
```

The verifier reports the helper's actual observations and provenance separately from agent attribution and detection. Provider tool traces are required to attribute activity to the target agent. A manual protocol client can create the same MCP server events. A local synthetic receipt is not network exfiltration or proof that an alert fired.

Retain only authorized evidence outside the run directory before cleanup. Unknown files, changed artifacts, links, mismatched identity or an active server stop cleanup; inspect the specific run rather than deleting a broader temporary tree. These current-user checks are not a privilege boundary against a concurrently malicious process with the same identity.

## Support and evidence

Platform labels describe tested runner mechanics, not provider susceptibility or security-product outcomes. See `docs/SIMULATION_VERIFICATION.md` in the repository for recorded native macOS/Linux Tart evidence. Windows CI is a separate result and is not inferred from Node compatibility. Agent execution requires an operator-approved provider, configuration and trace; the runner does not supply credentials.

The lab code and source fixture notices are scoped under `simulations/LICENSE` and `simulations/NOTICE`. Original researcher credit is preserved in the definitions. Incident-source relationships and bounded analogues remain explicit on each attack page.
