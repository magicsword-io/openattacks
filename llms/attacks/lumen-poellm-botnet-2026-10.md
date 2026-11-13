# PoeLLM botnet targets 3,400+ exposed LiteLLM/Ollama servers for mining

- ID: lumen-poellm-botnet-2026-10
- Reported: 2026-10-07
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/lumen-poellm-botnet-2026-10/

## Summary
PoeLLM malware exploits vulnerable internet-facing AI/LLM deployments (LiteLLM, Ollama, Gotenberg, Gitea, possibly Ivanti Sentry CVE-2026-10520). Derives C2 from keywords in poem 'On the Nature of Connection' hosted in GitHub repo ejejejdfbbebe/nodejs.org fork (dash.css file). Malware parses poem to extract 4 words/phrases via pattern matching ('In the silent hum of X,', 'each pulse of X threading', 'Beyond the wall of X,', 'the X servers'), converts words to numbers via hardcoded dictionary, combines to form IPv4 C2 address. Deploys XMRig and Iron crypto miners connecting to Kryptex (5.180.174.162). Converts victims into HTTP/S scanners and exploit servers for expansion. Poem updated 11 times since Apr 13, 2026 to rotate C2. Italian-speaking actor. 3,400+ victims, peak 800 active/day, predominantly US/Western Europe.

## Category
uncategorized

## Attribution
Canto Incognito campaign; Italian-speaking threat actor (assessment); financially motivated cryptocurrency mining operation

## AI involvement confidence
not assessed

## Attack flow
### vuln-exploit: Exploit vulnerable AI/LLM services (access)

Target publicly exposed LiteLLM, Ollama, Gotenberg, Gitea, possibly Ivanti Sentry CVE-2026-10520; Gotenberg docs explicitly warn not to expose to internet

Evidence: <https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware>

### poem-c2: GitHub poem-derived C2 (execution)

Malware queries GitHub repo ejejejdfbbebe/nodejs.org fork for dash.css; parses poem 'On the Nature of Connection' to extract 4 words ('In the silent hum of X', 'each pulse of X threading', 'Beyond the wall of X', 'the X servers'); converts words to numbers via hardcoded dictionary; combines to IPv4 C2 address; poem updated 11 times since Apr 13, 2026

Evidence: <https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware>

### deploy-malware: Deploy libgcrypt malware (execution)

Downloads and executes ELF 'libgcrypt' from C2; malware includes remote shell, XMRig and Iron crypto miners, HTTP/S scanning capabilities, exploit deployment

Evidence: <https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware>

### mining: Cryptocurrency mining (ai)

Deploys XMRig and Iron miners; connects to Kryptex mining service at 5.180.174.162; GPU hardware attractive target for mining

Evidence: <https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware>

### expand-botnet: Convert victims to scanners (impact)

Infected servers become HTTP/S vulnerability scanners and exploit servers; proxy attacks through compromised hosts to expand botnet; repurposed routers for C2 infrastructure; recent experiments with distributed brute-force

Evidence: <https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware>

### Connections

- vuln-exploit -> poem-c2
- poem-c2 -> deploy-malware
- deploy-malware -> mining
- deploy-malware -> expand-botnet
- expand-botnet -> vuln-exploit [loop]

## MITRE ATLAS
- [AML.T0010](https://atlas.mitre.org/techniques/AML.T0010) AI Supply Chain Compromise — Supply chain-style targeting of exposed AI/LLM services (LiteLLM, Ollama) for compromise and cryptocurrency mining
  Evidence: <https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware>
- [AML.T0034](https://atlas.mitre.org/techniques/AML.T0034) Cost Harvesting — Exploitation of vulnerabilities in AI/LLM infrastructure (possibly Ivanti Sentry CVE-2026-10520, vulnerable LiteLLM/Ollama versions)
  Evidence: <https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware>

## Prevention
Do not expose AI/LLM services to internet (Gotenberg guidance explicit); vulnerability patching for LiteLLM/Ollama/Gitea/Ivanti Sentry; monitor for crypto mining (Kryptex 5.180.174.162); GitHub repository monitoring; C2 poem pattern detection; HTTP scanning from AI servers; GPU utilization anomalies

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- LiteLLM
- [Ollama](https://github.com/ollama/ollama)

### Other tooling
- PoeLLM malware (libgcrypt)
- XMRig crypto miner
- Iron crypto miner
- Kryptex mining service
- GitHub for C2 poem hosting
- Gotenberg (PDF converter)
- Gitea (software development toolkit)
- Ivanti Sentry (possibly CVE-2026-10520)

## Sources
- [Canto incognito: tracking the PoeLLM malware](https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware)
