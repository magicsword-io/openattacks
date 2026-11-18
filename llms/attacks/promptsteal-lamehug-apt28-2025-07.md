# PROMPTSTEAL / LAMEHUG LLM command-generating data miner

- ID: promptsteal-lamehug-apt28-2025-07
- Reported: 2025-07-17
- AI role: llm_generated_malware
- Entry: https://openattacks.ai/attacks/promptsteal-lamehug-apt28-2025-07/

## Summary
Python/PyInstaller data miner queries Hugging Face API (Qwen2.5-Coder-32B-Instruct) to generate one-line Windows recon and document-collection commands, executes them, exfiltrates. Masquerades as image-generation tool. GTIG: first observed malware querying LLM in live ops.

## Category
adversary-use-of-ai

## Attribution
APT28 / FROZENLAKE (GTIG); CERT-UA moderate confidence APT28

- Actor: APT28
- Aliases: FROZENLAKE
- Country: Russia
- Motivation: nation-state
- Attributed by: Google GTIG, CERT-UA
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Phishing emails with ZIP (Додаток.pdf.zip) impersonating ministry representative
- Victims and sectors: Ukrainian government / security and defence sector
- Regions: Ukraine
- Region notes: unknown
- Scale and metrics: Observed in operations mid-2025; continued sample development with obfuscation/C2 changes

## Attack flow
### step-1: Phishing delivers a ZIP attachment (access)

The message impersonates a ministry representative.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.catonetworks.com/blog/cato-ctrl-threat-research-analyzing-lamehug/> <https://csirt.csi.cip.gov.ua/en/posts/apt28-targets-security-and-defence-sector-with-ai-powered-software>

### step-2: Miner queries a hosted code model (ai)

The executable requests Windows reconnaissance and collection commands through Hugging Face.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.catonetworks.com/blog/cato-ctrl-threat-research-analyzing-lamehug/> <https://csirt.csi.cip.gov.ua/en/posts/apt28-targets-security-and-defence-sector-with-ai-powered-software>

### step-3: Generated commands run on the host (execution)

The Python/PyInstaller malware executes the returned one-line commands.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.catonetworks.com/blog/cato-ctrl-threat-research-analyzing-lamehug/> <https://csirt.csi.cip.gov.ua/en/posts/apt28-targets-security-and-defence-sector-with-ai-powered-software>

### step-4: Documents and information are exfiltrated (impact)

The report links the data-mining campaign to Ukrainian government targets.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.catonetworks.com/blog/cato-ctrl-threat-research-analyzing-lamehug/> <https://csirt.csi.cip.gov.ua/en/posts/apt28-targets-security-and-defence-sector-with-ai-powered-software>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — The miner generates collection commands using a hosted Qwen model.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.catonetworks.com/blog/cato-ctrl-threat-research-analyzing-lamehug/> <https://csirt.csi.cip.gov.ua/en/posts/apt28-targets-security-and-defence-sector-with-ai-powered-software>

## Prevention
Block unexpected Hugging Face API from endpoints; detect PyInstaller 'image gen' lures; app control on unexpected recon binaries

## Detections
- Detect Hugging Face API connections from endpoints (guidance) — Monitor outbound HTTPS connections to Hugging Face API endpoints (api-inference.huggingface.co) from workstations and servers. Legitimate developer activity is expected; focus on unexpected or unauthorized hosts.
- PyInstaller executable masquerading as image tools (guidance) — Detect PyInstaller-packaged executables with image generation or graphics tool names that make unexpected network connections to AI model APIs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Qwen2.5-Coder-32B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct) via [Hugging Face API](https://huggingface.co/) — Official model page; the former GitHub repository redirects to a newer model family.
- ~270 HF tokens per Cato analysis

### Other tooling
- [PyInstaller](https://github.com/pyinstaller/pyinstaller)
- SFTP or HTTP POST exfil (variant-dependent)

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Source notes
unknown

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
- <https://www.catonetworks.com/blog/cato-ctrl-threat-research-analyzing-lamehug/>
- <https://csirt.csi.cip.gov.ua/en/posts/apt28-targets-security-and-defence-sector-with-ai-powered-software>
