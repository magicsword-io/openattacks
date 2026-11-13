# APT42 Gemini phishing + Data Processing Agent attempt

- ID: apt42-gemini-phishing-data-agent-2025
- Reported: 2025-11-05
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/apt42-gemini-phishing-data-agent-2025/

## Summary
Iranian APT42 used Gemini for phishing lure drafting, translation, and geopolitical research. Also attempted to build a 'Data Processing Agent' that turns natural language into SQL over sensitive personal schemas (phone→owner, travel patterns).

## Category
adversary-use-of-ai

## Attribution
APT42; Iranian government-backed

- Actor: APT42
- Country: Iran
- Motivation: nation-state
- Attributed by: Google GTIG
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### step-1: Actor requests lure and research help (access)

APT42 uses geopolitical research and translated phishing material.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-2: Gemini supports content generation (ai)

The model drafts lures and assists a proposed natural-language data-processing agent.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-3: Phishing and agent development (execution)

The reported activity includes phishing preparation and attempted SQL-over-sensitive-schema tooling.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-4: Agent deployment is unconfirmed (unknown)

The data-processing agent is described as an attempt, not a confirmed deployed capability.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

## Prevention
Phishing awareness for AI-polished lures; monitor for novel NL-SQL agents on sensitive DBs

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Gemini](https://gemini.google.com/)
- planned NL-to-SQL data agent

### Other tooling
- unknown

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
