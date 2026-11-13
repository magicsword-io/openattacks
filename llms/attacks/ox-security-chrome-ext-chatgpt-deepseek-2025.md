# Malicious Chrome extensions steal ChatGPT and DeepSeek chats

- ID: ox-security-chrome-ext-chatgpt-deepseek-2025
- Reported: 2025-12-01
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/ox-security-chrome-ext-chatgpt-deepseek-2025/

## Summary
AITOPIA-impersonating Chrome extensions stole ChatGPT and DeepSeek conversation content plus browsing URLs. Reported impact over 900,000 users for related malicious AI-themed extensions in the campaign cluster.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Victims install malicious Chrome Web Store extensions
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: 900,000+ users cited for related extension cluster

## Attack flow
### step-1: Impersonating extension is installed (access)

A Chrome Web Store extension presents itself as an AI assistant product.

Evidence: <https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/>

### step-2: Extension accesses AI conversations (ai)

The malicious extension reads ChatGPT and DeepSeek chat content.

Evidence: <https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/>

### step-3: Chats and browsing URLs are collected (execution)

The reported behavior includes conversation and browser activity theft.

Evidence: <https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/>

### step-4: Conversation content is stolen (impact)

The campaign affects a large population of extension users.

Evidence: <https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0085](https://atlas.mitre.org/techniques/AML.T0085) Data from AI Services — Malicious extensions collect conversation content from AI services.
  Evidence: <https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/>

## Prevention
Extension allowlists; review ChatGPT/DeepSeek sessions after removal

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Malicious Chrome extensions steal ChatGPT and DeepSeek chats. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Fake AI productivity Chrome extensions

### Other tooling
- unknown

## Source notes
unknown

## Sources
- <https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/>
