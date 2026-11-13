# GreyNoise PaperCut campaign uses Codex-harness agents with DeepSeek against 395 organizations

- ID: greynoise-papercut-ai-campaign-2026-09
- Reported: 2026-09-09
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/greynoise-papercut-ai-campaign-2026-09/

## Summary
Sep 9, 2026: GreyNoise identified campaign exploiting PaperCut NG/MF print management servers (CVE-2023-27350, CVE-2023-27351 path traversal + RCE). Attacker deploys 'Codex-harness' framework with DeepSeek Coder and DeepSeek V3 models. Workflow: (1) Mass scan for exposed PaperCut servers (9191/tcp, 9192/tcp); (2) Exploit CVEs to gain initial RCE; (3) Deploy AI agent with 'post-exploitation', 'credential-harvesting', 'lateral-movement' skills; (4) Agent autonomously enumerates Active Directory, identifies print job logs containing credentials, extracts passwords from print queues; (5) Pivots to fileservers and workstations; (6) Deploys ransomware or sells access. GreyNoise observed 395 organizations compromised Aug-Sep 2026 (healthcare, education, government, finance). Agents generated exploits in real-time adapting to endpoint security. Detection: monitor PaperCut servers for exploitation (CVE-2023-27350, CVE-2023-27351); detect DeepSeek API traffic from print servers; alert on rapid AD enumeration post-PaperCut compromise; review print job logs for credential exposure; monitor lateral movement from print infrastructure.

## Category
uncategorized

## Attribution
Unknown actor; financially motivated (ransomware, access sales); sophisticated AI agent deployment

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: Exploitation of PaperCut NG/MF servers via CVE-2023-27350 and CVE-2023-27351 (path traversal + RCE)
- Victims and sectors: 395 organizations compromised Aug-Sep 2026; healthcare, education, government, finance; print management infrastructure
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: 395 organizations compromised Aug-Sep 2026 via PaperCut exploitation + AI agent post-exploitation

## Attack flow
### scan-exploit: Mass scan and exploit PaperCut (access)

Attacker scans internet for exposed PaperCut NG/MF servers (9191/tcp, 9192/tcp); exploits CVE-2023-27350 and CVE-2023-27351 for path traversal + RCE; gains foothold on print management infrastructure

Evidence: <https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf>

### deploy-agent: Deploy Codex-harness AI agent (ai)

Install Codex-harness framework with DeepSeek Coder and DeepSeek V3 on compromised PaperCut server; agent loads 'post-exploitation', 'credential-harvesting', 'lateral-movement' skills

Evidence: <https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf>

### autonomous-post-exploit: Automated credential harvesting and lateral movement (execution)

Agent autonomously enumerates AD, extracts credentials from print job logs (users print docs with passwords visible), identifies fileservers and workstations, pivots laterally, adapts exploits to endpoint security in real-time

Evidence: <https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf>

### ransomware-sales: Ransomware deployment or access sales (impact)

Deploy ransomware or sell access to other actors; 395 organizations compromised Aug-Sep 2026; print infrastructure pivot enables enterprise-wide compromise

Evidence: <https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf>

### Connections

- scan-exploit -> deploy-agent
- deploy-agent -> autonomous-post-exploit
- autonomous-post-exploit -> ransomware-sales

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Attacker deploys autonomous AI agents for post-exploitation following PaperCut vulnerability exploitation
  Evidence: <https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf>
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — AI automates credential harvesting and lateral movement
  Evidence: <https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf>

## Prevention
Patch PaperCut NG/MF (CVE-2023-27350, CVE-2023-27351); segment print management servers; monitor DeepSeek API traffic from infrastructure hosts; implement least-privilege for print servers; disable print job logging where possible or encrypt logs; detect rapid AD enumeration; use EDR on print servers; monitor lateral movement from print infrastructure

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Codex-harness autonomous agent framework
- [DeepSeek](https://github.com/deepseek-ai) Coder
- [DeepSeek](https://github.com/deepseek-ai) V3

### Other tooling
- PaperCut NG/MF CVE-2023-27350, CVE-2023-27351 exploits
- Active Directory enumeration
- Print job credential harvesting
- Ransomware (some cases)

## Source notes
GreyNoise Intelligence analysis. Campaign demonstrates AI agent use in mass exploitation and post-compromise automation. Detection: alert on PaperCut CVE exploitation attempts, monitor DeepSeek API traffic (api.deepseek.com) from print servers or unexpected hosts, detect rapid AD queries from print server IPs, review print job logs for credential exposure, monitor lateral movement patterns from print infrastructure to fileservers/workstations.

## Sources
- [GreyNoise: AI-Orchestrated Campaign Against PaperCut NG/MF](https://www.greynoise.io/blog/ai-orchestrated-campaign-against-papercut-ng-mf)
