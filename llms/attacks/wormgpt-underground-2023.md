# WormGPT underground malicious LLM

- ID: wormgpt-underground-2023
- Reported: 2023-07-13
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/wormgpt-underground-2023/

## Summary
GPT-J-based unrestricted LLM marketed on dark-web forums for phishing and malware assistance without ethical filters.

Evidence qualification: Underground tool offering; Check Point assessed WormGPT likely real but not clearly superior to jailbroken mainstream models.

## Category
adversary-use-of-ai

## Attribution
underground cybercrime marketplace

- Actor: underground cybercrime marketplace
- Motivation: financially-motivated

## AI involvement confidence
unverified

## Attack flow
### step-1: Underground seller markets WormGPT (access)

A GPT-J-based tool is offered through cybercrime forums.

Evidence: <https://research.checkpoint.com/2023/opwnai-cybercriminals-starting-to-use-chatgpt/> <https://www.wired.com/story/chatgpt-scams-fraudgpt-wormgpt-crime/>

### step-2: Unrestricted assistance is advertised (ai)

The offering claims support for phishing and malware without safety filters.

Evidence: <https://research.checkpoint.com/2023/opwnai-cybercriminals-starting-to-use-chatgpt/> <https://www.wired.com/story/chatgpt-scams-fraudgpt-wormgpt-crime/>

### step-3: Individual victim use is not established (unknown)

The seed documents an offering and researcher assessment, not a confirmed exploit chain.

Evidence: <https://research.checkpoint.com/2023/opwnai-cybercriminals-starting-to-use-chatgpt/> <https://www.wired.com/story/chatgpt-scams-fraudgpt-wormgpt-crime/>

### Connections

- step-1 -> step-2
- step-2 -> step-3

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Classic phishing/malware controls; monitor for AI-polished lure language

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in WormGPT underground malicious LLM. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- WormGPT (GPT-J based)

### Other tooling
- unknown

## Sources
- <https://research.checkpoint.com/2023/opwnai-cybercriminals-starting-to-use-chatgpt/>
- <https://www.wired.com/story/chatgpt-scams-fraudgpt-wormgpt-crime/>
