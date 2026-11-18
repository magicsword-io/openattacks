# BOSSAI 12-agent AI attack mesh targeting Taiwan emergency services

- ID: bossai-12-agent-attack-mesh-2026-11
- Reported: 2026-11-04
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/bossai-12-agent-attack-mesh-2026-11/

## Summary
Nov 4, 2026: Acronis TRU discovered BOSSAI, a mesh of 12 AI agents (9 active, 3 inactive) operated by single actor 'bossjy' (aliases TIAN0517, lstjks) based in Hualien, Taiwan. Agents divided into infrastructure builders (Grok, OpenClaw, Claude Code) running commercial models, and offensive agents (Hermes, HalberdStrike, CyberStrike) running abliterated local models (DeepSeek-V4, Qwen 3.5 122B). Commercial models repeatedly refused attack commands, forcing use of locally-run abliterated models. Agent mesh targeted hundreds of organizations across government emergency services, banks, universities, military systems in 11 countries. Confirmed breaches at Taiwan emergency services (patient care records, 119 dispatch data), universities (Thailand SQL injection), and financial institutions. Operator ran mesh from home IP alongside legitimate businesses (gas store, K-beauty reseller, Facebook auto-post SaaS). Attack mesh generated high volumes of data with frequent hallucinations and false positives; agents sometimes refused lucrative targets (Honduran military base) due to autonomous scope decisions. MCP servers provided GitHub security, CVE lookup, OSINT, cloud auditing, Ghidra, Radare2, Playwright automation, and Kali Linux tools (nmap, sqlmap, Metasploit, Hydra). GPU fleet: RTX 4090s serving abliterated models via llama.cpp, plus 8 VPS nodes for proxying. OPSEC failures exposed entire operation: GitHub account linked to physical storefront, SSH sessions exposed home IP, credentials hardcoded throughout.

## Category
adversary-use-of-ai

## Attribution
bossjy (TIAN0517, lstjks), Hualien City, Taiwan; high confidence single operator

- Actor: bossjy
- Actor ID: bossjy
- Aliases: TIAN0517, lstjks
- Country: Taiwan
- Motivation: financially-motivated
- Attributed by: Acronis TRU
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Vulnerability exploitation (SQL injection, RCE), credential harvesting, exposed systems
- Victims and sectors: Taiwan emergency services (fire department, 119 dispatch, disaster response), financial institutions (lending, mobile payment, fire-dispatch vendors), universities (Thailand: 3 confirmed SQL injection with data exfiltration, 2 partial), Mexico (206,800+ residential phone records, 124,000+ yellow pages records), Honduras military air force personnel system (characterized but not exploited), government agencies across 11 countries
- Regions: Taiwan, Thailand, Mexico, Honduras, United States, United Kingdom, Australia, Sri Lanka, China, Vietnam
- Region notes: unknown
- Scale and metrics: 12-agent mesh; hundreds of organizations targeted across 11 countries; ~10 confirmed breaches; 206,800+ Mexican residential phone records; 124,000+ Mexican yellow pages records; Taiwan emergency medical data (ECG, ambulance video, vitals from 2018), 119 dispatch case records (7 Taipei districts); 3 Thai universities SQL injection with data extraction; 16 SQL injection points at Taiwan lending firm; ~95 Hermes offensive sessions; attack mesh ran for 12+ days under observation; 9GB evidence (90,000+ files); false positive rate >50% on high-severity findings from HalberdStrike

## Attack flow
### mesh-deploy: Deploy 12-agent BOSSAI mesh (ai)

Operator bossjy deploys mesh: 3 infrastructure agents (Grok, OpenClaw, Claude Code) with commercial models; 9 offensive agents (Hermes, HalberdStrike, CyberStrike, Cursor, Trae, etc.) with abliterated models

Evidence: <https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/>

### recon: FOFA reconnaissance and target selection (execution)

Agents scan hundreds of organizations across 11 countries; FOFA reconnaissance feeds target lists to offensive agents

Evidence: <https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/>

### vuln-scan: Autonomous vulnerability scanning (execution)

HalberdStrike, AWVS, CyberStrike scan targets; agents generate vulnerability reports (many false positives due to hallucinations)

Evidence: <https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/>

### exploit: Autonomous exploitation (access)

Hermes agent executes SQL injection, RCE, credential harvesting autonomously; uses MCP tools (nmap, sqlmap, Metasploit, Hydra) via Kali MCP server

Evidence: <https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/>

### exfiltrate: Data exfiltration (impact)

Emergency medical data (Taiwan), 119 dispatch records, university student data (Thailand), 206K+ phone records (Mexico), financial data extracted

Evidence: <https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/>

### Connections

- mesh-deploy -> recon
- recon -> vuln-scan
- vuln-scan -> exploit
- exploit -> exfiltrate

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — 12-agent AI mesh autonomously conducted offensive operations including reconnaissance, vulnerability scanning, and exploitation across multiple countries
  Evidence: <https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/>

## Prevention
Monitor for autonomous AI agent behavior patterns; detect nmap, sqlmap, Metasploit execution from unexpected contexts; block MCP server abuse; restrict abliterated model access; monitor FOFA/Shodan reconnaissance patterns; detect multi-agent mesh communication; secure emergency services APIs; patch SQL injection vulnerabilities; monitor for hallucinated vulnerability reports; detect AWVS signatures

## Detections
- [Nmap/Zenmap Execution](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_pua_nmap_zenmap.yml) (sigma) — Detects nmap/zenmap execution used by BOSSAI agents for network reconnaissance
- [Linux HackTool Execution](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_susp_hktl_execution.yml) (sigma) — Detects execution of hacktools including nmap, sqlmap, Metasploit used by offensive agents
- [Linux Network Service Scanning](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/auditd/syscall/lnx_auditd_network_service_scanning.yml) (sigma) — Detects network service enumeration via auditd syscalls
- [SQL Injection in Web Logs](https://github.com/SigmaHQ/sigma/blob/master/rules/web/webserver_generic/web_sql_injection_in_access_logs.yml) (sigma) — Detects SQL injection attempts in web server access logs (BOSSAI targeted Thai universities with SQL injection)
- Multi-agent AI mesh detection (guidance) — Monitor for patterns indicating multiple AI agents working in coordination: autonomous tool execution from unexpected contexts, MCP server traffic, high-volume reconnaissance, parallel targeting across multiple organizations
- [Suspicious Network Tool Launched Inside Container](https://github.com/elastic/detection-rules/blob/main/rules/linux/discovery_suspicious_network_tool_launched_inside_container.toml) (elastic) — Detects nmap, sqlmap, Metasploit tools in containers; directly applicable to BOSSAI mesh MCP-wrapped tooling
- [Web Application Suspicious Activity - sqlmap User Agent](https://github.com/elastic/detection-rules/blob/main/rules/apm/apm_sqlmap_user_agent.toml) (elastic) — Detects sqlmap tool used by BOSSAI against Thai universities
- Abliterated model abuse (guidance) — Detect locally-run abliterated LLM models (DeepSeek-V4, Qwen, GLM variants) serving offensive agents; monitor for llama.cpp GPU inference serving attack frameworks

## Timeline
- First seen: 2026-07-01
- Last updated: 2026-11-05
- 2026-11-04 (Acronis TRU): BOSSAI 12-agent mesh disclosed; single operator bossjy targeted Taiwan emergency services and 11 countries with AI-driven attack infrastructure

## Tools
### AI tooling and models
- BOSSAI 12-agent mesh
- Hermes Agent (github.com/NousResearch/hermes-agent)
- HexStrike AI (github.com/0x4m4/hexstrike-ai)
- PentestGPT (github.com/GreyDGL/PentestGPT)
- HalberdStrike (PentestGPT fork)
- CyberStrike (github.com/CyberStrikeAI/CyberStrikeAI)
- [Grok](https://x.ai/grok) 4.5 (infrastructure)
- [Claude Code](https://github.com/anthropics/claude-code) (infrastructure)
- MiniMax M3 (infrastructure, OpenClaw agent)
- Abliterated DeepSeek-V4 (DS4, 64K context, offensive)
- Abliterated Qwen 3.5 122B (offensive)
- Abliterated GLM (offensive)
- DeepSeek-R1 70B (offensive, later replaced)

### Other tooling
- MCP servers: HexStrike AI, Kali Linux, Ghidra, Radare2, [Playwright](https://github.com/microsoft/playwright)
- [nmap](https://github.com/nmap/nmap), sqlmap, Metasploit, Hydra
- FOFA reconnaissance
- Acunetix Web Vulnerability Scanner (cracked)
- Hikvision Comprehensive Vulnerability Exploitation Tool
- RTX 4090 GPU fleet with llama.cpp
- SOCKS5 proxy pool
- BrightData datacenter proxies
- WeChat gateway
- LINE messenger

### Offensive frameworks
- [CyberStrikeAI](https://openattacks.ai/tools/cyberstrikeai/) (`cyberstrikeai`)
- [HexStrike](https://openattacks.ai/tools/hexstrike/) (`hexstrike`)

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)
- [GTFOBins](https://gtfobins.github.io)
- [LOLSkills](https://lolskills.io)

## Source notes
Acronis TRU analysis. Attribution via OPSEC failures: GitHub account TIAN0517 with email linking to 99 Gas Store (九九瓦斯行) in Hualien County; lstjks SSH key identity matching GitHub; Jy技術團隊 logo across infrastructure; home IP exposed in SSH sessions; legitimate SaaS 行銷快手 (SnapPost) Facebook auto-post tool, INCELLDERM K-beauty reseller, and gas delivery business ran from same residential IP; WeChat QR tied to Tencent iLink enterprise registration; hardcoded credentials throughout (Shodan API, Cloudflare API, MiniMax API, NVIDIA API keys)

## Sources
- [Acronis TRU: BOSSAI - Inside the AI Attack Mesh That Targeted Taiwan's Emergency Services](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/)
