# Unit 42 CL-STA-1238 uses Cairn with Zhipu GLM and DeepSeek against semiconductor, defense, and civil-society targets

- ID: unit42-cairn-cl-sta-1238-2026-11
- Reported: 2026-11-12
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/unit42-cairn-cl-sta-1238-2026-11/

## Summary
Palo Alto Networks Unit 42 (published Nov 12, 2026) tracks CL-STA-1238, assessed with moderate confidence as China-nexus intelligence collection. From August through September 2026, Chinese-speaking operators used the open-source Cairn framework (https://github.com/oritera/Cairn) for 25 operations against at least 19 organizations and confirmed unauthorized access or data retrieval at 10. They paired Cairn with Zhipu GLM 5.2 (13 operations), DeepSeek V4 Flash (8), and DeepSeek V4 Pro (4), using the higher-tier Pro model for repeats against targets that resisted Flash. Each operation loaded a skill pack named AIScan Runner Skills, which Unit 42 says is not in upstream Cairn. A worker system-prompt preamble framed every Reason and Explore phase as authorized security testing, CTF, assessment, vulnerability research, or code audit and forbade refusal. Each operation also wrote AUTHORIZATION.md treating task creation as a client-approved engagement. Neither model refused that framing. Operators supplied a one-line goal and a root domain, and sometimes prior intelligence such as VPN gateway addresses, group names, and shared group passwords. Cairn then mapped the target, broke the goal into three to seven stages, and looped until the model judged the goal met, options exhausted, or the operator stopped it. Individual operations ran from 20 minutes to more than 50 hours. Confirmed outcomes include weak-password spraying that yielded dozens of valid credentials and non-public directory data at an industry standards body, plus an unauthenticated cloud-storage write that overwrote a live standards-ballot document; a brute-forced production credential at a semiconductor company followed by unauthorized administrator accounts and a persistent API token; an unauthenticated account-creation bypass at a U.S. teachers' union that logged access to more than one million member records, roughly 31,000 CRM contacts, and staff password hashes; an open registration endpoint on a defense-policy identity platform exposing roughly 500 user records, including .mil and .gov accounts; and five further cases covering tens of thousands of content-management records, employee data at a semiconductor-lithography manufacturer, roughly 150,000 internal documents at an industrial-automation manufacturer, and student data at an education nonprofit. Targeting concentrated on semiconductor and advanced-manufacturing supply chain (seven organizations), defense and defense policy (three, including a space technology company, a defense-analytics vendor, and a policy think tank), and human rights and civil society (four, including a Canadian human-rights body, a U.S. teachers' union, a science-policy advocacy group, and an education nonprofit). Unit 42 assesses a single operator or small team. The exploited flaws were known classes: authentication bypasses, insecure direct object references, mass-assignment privilege escalation, weak and default credentials, exposed cloud APIs, and dated public CVEs. Infrastructure: Cairn hosting 154.44.31.4 (Hong Kong, AS979, NetLab Global) and egress and staging 82.29.129.54 (United States, AS142036, Hosteons Pte. Ltd.). Link cairn-norforge-2026-10 and cert-in-crafty-falcon-bfsi-2026-11.

## Category
adversary-use-of-ai

## Attribution
CL-STA-1238. Unit 42 assesses moderate confidence of China-nexus intelligence collection from Chinese tasking and authorization files, exclusive use of Zhipu GLM and DeepSeek, and the target set.

- Actor: CL-STA-1238
- Country: China
- Motivation: nation-state
- Attributed by: Palo Alto Networks Unit 42
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Operator-supplied root domain, sometimes with pre-gathered VPN gateways, group names, and shared passwords. Cairn then used authentication bypasses, weak or default credentials, insecure object references, and exposed cloud APIs.
- Victims and sectors: At least 19 organizations in semiconductor and advanced manufacturing, defense and defense policy, and human rights and civil society. Confirmed access or data retrieval at 10.
- Regions: Multiple regions
- Region notes: Named targets include U.S. defense-policy organizations, a U.S. teachers' union, and a Canadian human-rights body. Other organizations' countries were not stated. Hong Kong and the U.S. egress host are infrastructure, not victim regions, so the entry uses Multiple regions.
- Scale and metrics: 25 operations, at least 19 organizations, confirmed unauthorized access or data retrieval at 10. Thirteen operations on GLM 5.2, eight on DeepSeek V4 Flash, four on DeepSeek V4 Pro. One organization exceeded one million member records. Operations lasted from 20 minutes to more than 50 hours.

## Attack flow
### task: Operator sets a one-line goal (access)

The operator creates a Cairn task with a Chinese goal and a root domain, and sometimes VPN gateways, group names, and shared passwords.

Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>

### models: GLM or DeepSeek plans the operation (ai)

GLM 5.2 or DeepSeek V4 Flash or Pro runs bootstrap, Reason, and Explore under an authorization preamble and the AIScan Runner Skills pack.

Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>

### loop: Autonomous exploit loop (execution)

The model maps the target into three to seven stages and loops from 20 minutes to more than 50 hours until the goal is met or the operator stops it.

Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>

### access: Credentials, records, or admin accounts (impact)

Unit 42 confirmed unauthorized access or data retrieval at 10 of at least 19 organizations, including password spraying, cloud-storage overwrite, and minted administrator accounts.

Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>

### Connections

- task -> models
- models -> loop
- loop -> access

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Operators drove Cairn with Zhipu GLM 5.2 and DeepSeek V4 Flash and Pro
  Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>
- [AML.T0054](https://atlas.mitre.org/techniques/AML.T0054) LLM Jailbreak — A Chinese preamble and AUTHORIZATION.md told the models the work was authorized and never to refuse
  Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — Each operation loaded the AIScan Runner Skills pack for scanning and exploitation
  Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — Confirmed access used authentication bypasses, weak credentials, and exposed cloud APIs on public-facing systems
  Evidence: <https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/>

## Prevention
Treat agent-driven scanning as ordinary vulnerability volume, not a new exploit class. Remove weak and default credentials, close unauthenticated registration and cloud-storage writes, and patch known public-facing flaws. Block the two published IPs. Do not treat a same-/24 scan lead as this cluster without Unit 42's indicators.

## Detections
- Cairn web outcomes have no single host rule (guidance) — Unit 42 describes weak-password spraying, unauthenticated cloud-storage writes, account-creation bypasses, and minted administrator accounts on unnamed application stacks. No Sigma, Splunk, or Elastic rule names Cairn, AIScan Runner Skills, or those application flaws. Hunt the published IPs 154.44.31.4 and 82.29.129.54, unexpected administrator accounts and API tokens, and unauthenticated writes to standards or directory data. A same-/24 panel lead is not an indicator from this report.

## Timeline
- First seen: 2026-08
- Last updated: 2026-11-12
- 2026-09 (Palo Alto Networks Unit 42): CL-STA-1238 completes 25 Cairn operations, August through September 2026, with confirmed access or data retrieval at 10 organizations
- 2026-11-12 (Palo Alto Networks Unit 42): Unit 42 publishes the CL-STA-1238 report, including GLM and DeepSeek model counts, the AIScan Runner Skills pack, and IPs 154.44.31.4 and 82.29.129.54. A same-/24 address, 154.44.31.104, is an unconfirmed Censys panel lead and is not an IOC.

## Tools
### AI tooling and models
- [Cairn](https://github.com/oritera/Cairn) (https://github.com/oritera/Cairn), customized fork
- Zhipu GLM 5.2
- [DeepSeek](https://github.com/deepseek-ai) V4 Flash
- [DeepSeek](https://github.com/deepseek-ai) V4 Pro
- AIScan Runner Skills pack (not in upstream [Cairn](https://github.com/oritera/Cairn))

### Other tooling
- unknown

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
Counts, models, the AIScan Runner Skills pack, the authorization preamble, the confirmed outcomes, and the two IPs are from the Unit 42 article. 154.44.31.104 was described as another live Cairn panel in the same /24 as the controller 154.44.31.4, attributed to a Censys observation. It is not in the Unit 42 indicator list, and no public Censys report naming that address was available to confirm it. It is an unconfirmed lead only and is not an IOC. Cairn is open source, so an exposed panel is not by itself this cluster. Link cairn-norforge-2026-10, the cairn tool page, and cert-in-crafty-falcon-bfsi-2026-11. No victim organization names are repeated beyond the sector descriptions Unit 42 published.

## Sources
- [Attackers Use Autonomous AI to Target Semiconductor, Defense and Civil Society Sectors](https://unit42.paloaltonetworks.com/cairn-framework-ai-autonomous-attacks/) — Palo Alto Networks Unit 42
- [Cairn](https://github.com/oritera/Cairn) — oritera
