# JADEPUFFER autonomous LLM ransomware agent via Langflow

- ID: jadepuffer-langflow-ransomware-2026-07
- Reported: 2026-07-01
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/jadepuffer-langflow-ransomware-2026-07/

## Summary
Sysdig documented JADEPUFFER, an LLM-driven ransomware operator entering through Langflow and autonomously chaining reconnaissance, credential access, lateral movement, and destructive database extortion. A later ENCFORGE variant targeted AI and ML infrastructure, including model weights and training data.

## Category
adversary-use-of-ai

## Attribution
Storm-3168 (Microsoft attribution, medium confidence)

- Actor: Storm-3168
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Microsoft, Sysdig
- Confidence: medium

## AI involvement confidence
confirmed

## Attack flow
### access: Compromise cloud environment (access)

Exploit cloud services or container escape

Evidence: <https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion>

### deploy-agent: Deploy JADEPUFFER Langflow agent (ai)

Install Langflow autonomous agent with ransomware workflow

Evidence: <https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion>

### autonomous-ops: Autonomous recon and exfiltration (execution)

Agent scans for file servers, backups, databases, AI models; exfiltrates data to attacker cloud

Evidence: <https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion>

### encrypt: Encrypt files and demand ransom (impact)

Encrypt files (ENCFORGE targets model weights .pt, .ckpt, .safetensors); generate ransom note; send to victims

Evidence: <https://www.sysdig.com/blog/jadepuffer-evolves-the-agentic-threat-actor-deploys-ransomware-built-to-destroy-ai-models>

### Connections

- access -> deploy-agent
- deploy-agent -> autonomous-ops
- autonomous-ops -> encrypt

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — First fully autonomous LLM agent-driven ransomware conducting end-to-end operations via Langflow
  Evidence: <https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion>

## Prevention
Secure cloud environments; backup model weights offline; monitor for Langflow processes; detect autonomous reconnaissance; network segmentation

## Detections
- Langflow ransomware agent detection (guidance) — Monitor for Langflow processes conducting autonomous file enumeration, data staging, and encryption; alert on model weight file access patterns
- ENCFORGE model weight targeting (guidance) — Monitor access to AI model files (.pt, .ckpt, .safetensors, .h5); alert on mass encryption of training datasets

## Timeline
- First seen: 2026-07-01
- Last updated: 2026-11-05
- 2026-07-01 (Sysdig): JADEPUFFER autonomous LLM ransomware agent disclosed
- 2026-07-20 (Sysdig): ENCFORGE variant discovered targeting AI model weights specifically
- 2026-07-20 (Microsoft): Storm-3168 actor linked to JADEPUFFER operations

## Tools
### AI tooling and models
- Langflow AI workflow framework
- LLM agent (model unspecified)

### Other tooling
- JADEPUFFER ransomware
- ENCFORGE variant (targets model weights)
- Autonomous exfiltration

## Sources
- [Sysdig: JADEPUFFER - LLM Agent End-to-End Ransomware via Langflow](https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion)
- [Sysdig: ENCFORGE Variant Encrypts AI Model Weights](https://www.sysdig.com/blog/jadepuffer-evolves-the-agentic-threat-actor-deploys-ransomware-built-to-destroy-ai-models)
