# BUGSTER campaign uses DeepSeek Hermes agent and Cursor against Indian universities

- ID: bugster-deepseek-hermes-2026-10
- Reported: 2026-10-21
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/bugster-deepseek-hermes-2026-10/

## Summary
Oct 21, 2026: Unit 42 tracked BUGSTER campaign targeting Indian universities (IIT Delhi, IIT Bombay, IIM Bangalore, NIT Trichy, others). Initial access via phishing with fake scholarship/research collaboration offers. Post-compromise: (1) Install Hermes autonomous agent (github.com/Hermes-Autonomous-Intelligence/hermes) backed by DeepSeek R1/V3 models (Chinese); (2) Install Cursor IDE with attacker-controlled API keys; (3) Hermes agent navigates network, identifies vulnerable systems (unpatched ERP, student portals, research databases); (4) Cursor IDE used to generate exploits for discovered vulnerabilities (SQLi, auth bypass, file upload); (5) Agent automates data theft (student records, research IP, financial data); (6) Deploys ransomware or sells access to other actors. Unit 42 observed 19 compromised universities Oct-Nov 2026. Hermes agent makes autonomous decisions on targets and methods. Detection: monitor for Hermes agent processes (Python, hermes CLI), detect Cursor IDE usage from unexpected accounts, alert on DeepSeek API traffic (api.deepseek.com), review automated scanning patterns, check for rapid exploitation of multiple vulnerabilities.

## Category
uncategorized

## Attribution
Unknown actor(s); BUGSTER campaign cluster; financially motivated (data theft, access brokering, ransomware)

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: Spearphishing emails with fake scholarship/research collaboration offers targeting faculty and students
- Victims and sectors: 19 Indian universities compromised Oct-Nov 2026: IIT Delhi, IIT Bombay, IIM Bangalore, NIT Trichy, others; education sector; research institutions
- Regions: India
- Region notes: unknown
- Scale and metrics: 19 confirmed compromised universities Oct-Nov 2026; student records, research IP, financial data stolen; some victims received ransomware

## Attack flow
### phishing: Spearphishing campaign (access)

BUGSTER sends fake scholarship/research collaboration offers to Indian university faculty and students; malicious attachments or links deliver initial access

Evidence: <https://unit42.paloaltonetworks.com/ai-assisted-cybercrime-analysis/>

### deploy-tools: Deploy Hermes agent and Cursor (ai)

Install Hermes autonomous agent backed by DeepSeek R1/V3; install Cursor IDE with attacker API keys; tools operate with user privileges post-compromise

Evidence: <https://unit42.paloaltonetworks.com/ai-assisted-cybercrime-analysis/>

### autonomous-exploitation: Automated vulnerability discovery and exploitation (execution)

Hermes agent autonomously scans network, identifies unpatched ERP, student portals, research databases; Cursor generates SQLi, auth bypass, file upload exploits; agent decides targets and methods autonomously; exploits multiple vulnerabilities in sequence

Evidence: <https://unit42.paloaltonetworks.com/ai-assisted-cybercrime-analysis/>

### data-theft-ransom: Data exfiltration and monetization (impact)

Agent automates theft of student records, research IP, financial data; some cases deploy ransomware; other cases sell network access; 19 universities compromised Oct-Nov 2026

Evidence: <https://unit42.paloaltonetworks.com/ai-assisted-cybercrime-analysis/>

### Connections

- phishing -> deploy-tools
- deploy-tools -> autonomous-exploitation
- autonomous-exploitation -> data-theft-ransom

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Attacker deploys autonomous AI agent (Hermes + DeepSeek) to navigate networks, identify vulnerabilities, and automate exploitation
  Evidence: <https://unit42.paloaltonetworks.com/ai-assisted-cybercrime-analysis/>

## Prevention
Security awareness training on phishing; MFA for all accounts; patch ERP and student portals; segment research networks; monitor for Hermes agent and Cursor IDE usage from unexpected accounts; block or alert on DeepSeek API traffic from non-approved sources; implement behavioral analytics detecting automated scanning and exploitation patterns; use EDR monitoring for AI agent processes

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Hermes autonomous agent framework
- [DeepSeek](https://github.com/deepseek-ai) R1 and [DeepSeek](https://github.com/deepseek-ai) V3 models
- [Cursor IDE](https://cursor.com/)

### Other tooling
- SQL injection exploits (AI-generated)
- Authentication bypass exploits
- File upload vulnerabilities
- Data exfiltration tools
- Ransomware (some cases)

## Source notes
Unit 42 analysis. BUGSTER demonstrates targeting of education sector with AI agents for automated exploitation and data theft. Hermes agent GitHub github.com/Hermes-Autonomous-Intelligence/hermes. Detection: look for Hermes Python process (hermes, autonomous-agent), monitor Cursor IDE installs on non-developer machines, check DeepSeek API traffic (api.deepseek.com), alert on rapid multi-vulnerability scanning, review exploit payloads for AI generation patterns (detailed comments, specific error handling).

## Sources
- [Unit 42: BUGSTER - AI-Assisted Cybercrime Analysis](https://unit42.paloaltonetworks.com/ai-assisted-cybercrime-analysis/)
- [Hermes - Autonomous AI Agent Framework](https://github.com/NousResearch/hermes-agent)
