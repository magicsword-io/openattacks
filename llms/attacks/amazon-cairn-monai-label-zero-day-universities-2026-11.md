# Amazon - Chinese-nexus operator's Cairn agents found and exploited a MONAI Label zero-day at East Asian universities

- ID: amazon-cairn-monai-label-zero-day-universities-2026-11
- Reported: 2026-11-20
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/amazon-cairn-monai-label-zero-day-universities-2026-11/

## Summary
CJ Moses (Amazon Threat Intelligence, AWS Security Blog, 20 November 2026) describes a Chinese-nexus operator using the open-source Cairn framework (https://github.com/oritera/Cairn). On 10 September 2026 Amazon found a publicly reachable Cairn instance with no authentication. Its operational history was visible, including project configurations, actor prompts, and AI output. Prompts were in Simplified Chinese, and timestamps in executed scripts used China Standard Time. The visible campaign lasted about 48 hours starting 8 September 2026 and targeted IP addresses of universities in East Asia outside mainland China. The operator gave target address lists and variations of the goal to obtain shell access. The agents then planned, executed, and changed approach without the operator choosing each next step. One operation spent about 16 hours and 148 sequential actions on an unauthenticated Redis instance at one university. Amazon says the agents tried known Redis control techniques, including replication abuse to load code, a Lua sandbox escape, configuration-file writes, and memory corruption, then a Log4Shell attempt against another service on the same host. After those failed, the agents used server-side request forgery in a co-located Qdrant instance to map the internal Docker network and sprayed credentials at PostgreSQL, SSH, and other services. That operation failed. A separate operation of more than 6 hours targeted a university GPU server. The agents built about 80 real usernames from faculty directories, lab sites, archived pages, and papers, then tried more than 30,000 credential combinations against SSH, an admin dashboard, a NAS, a VPN server, and the campus portal. That operation also failed. The successful operation targeted an open-source medical-imaging AI application. BleepingComputer and The Register identify that application as MONAI Label. The agents fingerprinted the framework, mapped API endpoints, found an upload endpoint with a filename parameter, and confirmed path traversal. Amazon says the gap from API mapping to arbitrary file write was about 11 minutes. A later session wrote a Python reverse shell into sitecustomize.py, which Python imports at startup, triggered a training API endpoint so a new Python process would load it, and obtained a root reverse shell. GHSA-qc22-rmgc-vg94 (published 18 November 2026, reported by aws-sec-vdp, fixed in pull request 1915) says PUT /datastore/image takes an unvalidated image parameter and PUT /datastore/label builds its path the same way. The advisory's example value is a relative path such as ../../../tmp/x. Authentication is off by default (MONAI_LABEL_AUTH_ENABLE=False). When authentication is on, the ANNOTATOR role is enough. Affected versions are 0.8.5 and earlier. The advisory's patched-versions field is None, and it says the fix will be in the next MONAI Label release. CVE-2026-133968 (GHSA-2f43-rwqm-6h67) describes the same traversal and says it was exploited in the wild starting in September 2026. Amazon assessed the bug as a zero-day with high confidence because, at the time of the activity, it had no matching fix, issue, advisory, or vulnerability-database entry. After the agents found the bug, the operator supplied a proxy that tunneled into a second university network. The server at the far end ran the same vulnerable software. Amazon infers the operator had already used the zero-day there to build the tunnel, and then directed the agents at other machines on that network. Attribution is Chinese-nexus at moderate confidence, from language, timezone, and targeting. The universities are not named. The victims were not AWS customers. Amazon notified the maintainers and worked with a government partner to notify the victims. Amazon also points to a separate Gambit Security report on a financially motivated actor using Cairn against online retailers. That report is not this campaign. Link unit42-cairn-cl-sta-1238-2026-11 and cairn-norforge-2026-10.

## Category
adversary-use-of-ai

## Attribution
Unnamed Chinese-nexus operator. Amazon Threat Intelligence assesses moderate confidence from Simplified Chinese prompts, China Standard Time script timestamps, and targeting of universities it describes as likely of strategic interest to China. This is not CL-STA-1238.

- Actor: Chinese-nexus (unnamed)
- Country: China
- Motivation: unknown
- Attributed by: Amazon Threat Intelligence
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Operator-supplied university IP addresses and a goal to obtain shell access, run by Cairn agents. The successful path was an unauthenticated path traversal in MONAI Label's datastore upload API. The Redis and credential-spray operations failed. The initial access vector for the Cairn host itself is unknown.
- Victims and sectors: Universities in East Asia outside mainland China. One university Redis host and one GPU server were attacked without success. One MONAI Label server was compromised with a root shell. A second university network was reached through an operator-supplied proxy. Amazon does not name the universities.
- Regions: Asia
- Region notes: Amazon says the targets were universities in East Asia outside mainland China and does not name the countries. Mainland China is excluded by that wording, so it is not a victim region. Simplified Chinese and China Standard Time are operator signals. San Jose geolocation in the Censys lead is hosting infrastructure, not a victim country.
- Scale and metrics: About 48 hours starting 8 September 2026. Redis operation about 16 hours and 148 actions, failed. GPU-server operation more than 6 hours, about 80 usernames and more than 30,000 credential combinations, failed. MONAI Label path from API mapping to arbitrary file write about 11 minutes, then a root shell in a later session. Two published addresses, records dated 8-10 September 2026. Victim count beyond those operations is unknown.

## Attack flow
### exposed: Exposed Cairn instance (access)

On 10 September 2026 Amazon found a public unauthenticated Cairn instance. Project configs, prompts in Simplified Chinese, and AI output were visible. The campaign had started on 8 September against university addresses in East Asia outside mainland China.

Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/>

### agents: Agents get a shell-access goal (ai)

The operator supplied target addresses and variations of a goal to obtain shell access. Cairn agents planned and adapted without the operator choosing each step. Amazon does not name the model.

Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/>

### failed: Redis and password attempts fail (execution)

About 16 hours and 148 actions against unauthenticated Redis failed, including a Log4Shell attempt, Qdrant SSRF, and credential sprays. A separate GPU-server operation tried more than 30,000 combinations from about 80 public usernames and also failed.

Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/>

### traversal: MONAI Label path traversal (execution)

Agents mapped a medical-imaging AI application's API, found an upload filename parameter, and confirmed path traversal in about 11 minutes. The maintainers' advisory identifies the application as MONAI Label and the endpoints PUT /datastore/image and PUT /datastore/label.

Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/> <https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94>

### shell: Root shell via sitecustomize.py (impact)

A later session wrote a Python reverse shell into sitecustomize.py and triggered a training API endpoint. The new Python process loaded the file and opened a root reverse shell.

Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/>

### second: Proxy into a second university (impact)

The operator then gave the agents a proxy into a second university network whose server ran the same vulnerable software. Amazon infers the zero-day was used to build that tunnel. The agents were directed at other machines there.

Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/>

### Connections

- exposed -> agents
- agents -> failed
- agents -> traversal
- traversal -> shell
- shell -> second

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The operator ran Cairn, the same offensive framework mapped on the other Cairn entries, and Amazon reviewed its prompts and AI output.
  Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/> <https://github.com/oritera/Cairn>
- [AML.T0103](https://atlas.mitre.org/techniques/AML.T0103) Deploy AI Agent — The operator deployed Cairn agents with target addresses and a goal to obtain shell access, and the agents chose the next steps.
  Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — Amazon says the agents planned, executed, and adapted across Redis, credential spraying, and the MONAI Label upload API without the operator choosing each step.
  Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/>
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — The successful intrusion was path traversal on a reachable MONAI Label datastore upload endpoint, followed by a file write that produced a root shell.
  Evidence: <https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/> <https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94>

## Prevention
Do not expose MONAI Label to untrusted networks. The advisory's workarounds are to set MONAI_LABEL_AUTH_ENABLE=True, not to grant ANNOTATOR to untrusted users, and to run the server as an unprivileged user that can write only the datastore directory. The code fix is pull request 1915. The advisory still lists no patched release. Do not leave Cairn panels on 0.0.0.0:8000 without authentication. Alert on writes to sitecustomize.py and on Redis instances that allow unauthenticated access. Block the two published addresses. A same-host-key lead is not an indicator from the Amazon report.

## Detections
- [Python Site or User Customize File Creation](https://github.com/elastic/detection-rules/blob/main/rules/linux/persistence_site_and_user_customize_file_creation.toml) (elastic) — Elastic rule on Linux file events. It alerts when sitecustomize.py or usercustomize.py is created. Amazon says a later session wrote a Python reverse shell into sitecustomize.py. Amazon does not name the operating system, so a host that is not covered by this rule's Linux file telemetry will not match. The rule does not detect the MONAI Label upload or the training API call.
- Redis abuse and the failed credential sprays (guidance) — No Sigma, Splunk, or Elastic rule reviewed for this entry names Cairn or the MONAI Label datastore endpoints. Amazon's failed Redis operation used replication abuse, a Lua sandbox escape, configuration writes, memory corruption, a Log4Shell attempt, Qdrant SSRF, and credential sprays against PostgreSQL and SSH. Hunt unauthenticated Redis, unexpected Redis replication, and credential failures from a single source against SSH, PostgreSQL, and campus portals. Those hunts are not a confirmed rule match for this incident.

## Timeline
- First seen: 2026-09-08
- Last updated: 2026-11-21
- 2026-09-08 (Amazon Threat Intelligence): Visible campaign starts against university addresses in East Asia outside mainland China. Records Amazon later published are dated 8-10 September 2026.
- 2026-09-10 (Amazon Threat Intelligence): Amazon finds the public unauthenticated Cairn instance and its operational history, including the failed Redis and GPU-server operations and the MONAI Label root shell.
- 2026-11-18 (Project MONAI): GHSA-qc22-rmgc-vg94 is published for MONAI Label 0.8.5 and earlier. The fix is pull request 1915. The advisory lists no patched release.
- 2026-11-20 (Amazon Threat Intelligence): AWS Security Blog publishes the campaign. CVE-2026-133968 is published the same day and says the traversal was exploited in the wild starting in September 2026.

## Tools
### AI tooling and models
- [Cairn](https://github.com/oritera/Cairn) (https://github.com/oritera/Cairn)
- Model unknown. Amazon does not name the model behind this instance.

### Other tooling
- unknown

### Offensive frameworks
- [Cairn](https://openattacks.ai/tools/cairn/) (`cairn`)

## Source notes
Campaign dates, the three operations, the root shell, attribution, and the two addresses are from the AWS Security Blog. Amazon's post does not print the product name MONAI Label. BleepingComputer and The Register do, and GHSA-qc22-rmgc-vg94 was reported by aws-sec-vdp and describes the same upload traversal. The advisory's patched-versions field was None on review, even though pull request 1915 is merged. CVE wording is from GHSA-2f43-rwqm-6h67. Amazon cites Gambit Security's report at https://gambit.security/blog-posts/autonomous-ai-agents-online-retailers-25-a-company for a separate financially motivated Cairn case against online retailers. No catalog entry is that report. Link unit42-cairn-cl-sta-1238-2026-11 and cairn-norforge-2026-10. Censys lead, not an IOC. A Censys host snapshot queried at 2026-09-09T12:00:00Z shows 142.4.98[.]145 and 142.4.107[.]34 in AS54600 (PEG TECH INC), geolocated to San Jose, serving an HTTP page titled Cairn on port 8000 (uvicorn) and SSH on port 12686 with the same SSH host key (SHA-256 af825c8d0b6dfc2505b0c59040f8b97effcd37e28bbece0ba693d462fd5e2bce). 142.4.107[.]34 also served a Python SimpleHTTP/0.6 directory listing on port 9999. The listing included cairn-prompts/, 51 files named claude-XXXX-cwd plus a claude-1000 directory, attack1_traversal.snapshot through attack7_pax.snapshot, craft_malicious_snapshot.py, docker_ssrf_probe.sh, docker_exec_rce.py, dns_server.py, dns_callbacks.log, combined_134_passwords.txt, context_passwords.txt, and err_CommonsCollections1.txt and similar err_CommonsCollections names. Whether the claude-XXXX-cwd names are Claude Code working-directory files is not established by the directory listing. A third address, 142.4.107[.]57, presented the same SSH host key in that 9 September snapshot and no Cairn page. It is an unconfirmed lead and is not an IOC. An October snapshot of 142.4.98[.]145 (14 October 2026) no longer showed the Cairn page or port 9999. It showed Apache with PHP 5.6.40 on 8081 and 18082, MySQL 5.6.51 on 33062, and SSH on 12686. The same October check was not repeated here for the other two addresses. No victim IP addresses are included.

## Sources
- [Chinese-nexus actor's Cairn AI agents found a zero-day on their own](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/) — Amazon
- [Path traversal in datastore upload endpoints allows arbitrary file write](https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94) — Project MONAI
- [CVE-2026-133968](https://github.com/advisories/GHSA-2f43-rwqm-6h67) — GitHub Advisory Database
- [Amazon says Chinese hackers used Cairn AI tool to discover apparent zero-day during attack on university](https://therecord.media/amazon-research-cairn-ai-university-attacks-possible-zero-day) — The Record
- [Hackers use autonomous AI tool Cairn to find zero-day, take over server](https://www.bleepingcomputer.com/news/security/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server/) — BleepingComputer
- [China attackers deployed AI agents that autonomously found and exploited a 0-day to take over a university server](https://www.theregister.com/security/2026/11/20/china-attackers-deployed-ai-agents-that-autonomously-found-and-exploited-a-0-day-to-take-over-a-university-server/5311382) — The Register
- [Cairn](https://github.com/oritera/Cairn) — oritera
- [AI Agents Are Hacking Online Retailers for $25 a Company](https://gambit.security/blog-posts/autonomous-ai-agents-online-retailers-25-a-company) — Gambit Security
