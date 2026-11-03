> Historical design record. Superseded by [portable simulation labs](PORTABLE_SIMULATION_LABS.md).

# One attack simulation preview

2026-11-03 · A2 · READY for local design review.

Intent: demonstrate how one existing OpenAttacks record can offer an associated simulation. Only `invariant-mcp-tool-poisoning-2025-04` receives an exercise, based on Agent Atomics AAT-0020. Keep this reviewable before choosing a broader migration.

SP-01: A page/header and catalog indicator link to one compact simulation section. The relevant attack-flow stage links to the same section on desktop and mobile.
SP-02: The section explains the bounded behavior, prerequisites, clean comparison, copyable preparation/prompt, expected collection, verification and cleanup. YAML is canonical for preview content. No fake execution or captured-result UI.
SP-03: State that the commands use the existing Agent Atomics checkout; no helper is bundled into OpenAttacks. Prepare does not launch an agent. Synthetic local receipts and provider traffic are distinguished; no native exploit, exfiltration, detection or prevention result is claimed.
SP-04: All other records, schemas and public incident exports retain current behavior. No new matrix, runner, dependency, provider invocation, deployment or bulk content migration.
SP-05 (user refinement): Hide the legacy identifier badge and adaptation byline while retaining research attribution. Keep the required legacy helper argument internally until packaging is separately approved. Verification/cleanup examples use direct quoted record paths instead of shell-specific variables. This is syntax cleanup, not proof of native Windows/Linux compatibility.

Evidence: type/build/unit checks; browser regression for one-page availability, navigation, copy buttons and unchanged negative-control entry; mobile/no-JS and accessibility checks; screenshots and independent review. Review against base `6cfb324be2a70ba723afb80a1a5d0d07da4d3e49`. Keep the preview on local port 4331.

Completion: type checking has zero diagnostics; all 20 unit tests and 44 browser tests pass; the static build generates 75 pages. Browser proof covers desktop/mobile, light/dark accessibility, every copy control, both stage-link directions, catalog discovery, no-JavaScript reading and a second attack without an exercise. Screenshots were inspected, with no observed page errors or failed requests. `git diff --check` passes.

Review fixed the trace-capture prerequisite and React Flow pointer handling for the new desktop link. An initial build-time data-path failure was fixed by bundling the YAML as a raw import. Native agent execution and provider/EDR collection were not run; this slice changes presentation and copyable instructions only. No runner, attack record, public incident export, dependency or deployment changed. Local evidence and independent review are under `.context/`.

SP-05 checks: zero type diagnostics, 75-page build, 3/3 focused browser checks including badge/byline absence, all copy controls, desktop/mobile accessibility and no-JavaScript reading. Independent follow-up review READY. Packaging and supported-platform labels remain a design proposal, not implemented work.
