# Arup Hong Kong deepfake video-conference $25M fraud

- ID: arup-deepfake-video-fraud-2024-01
- Reported: 2024-05-16
- AI role: other
- Entry: https://openattacks.ai/attacks/arup-deepfake-video-fraud-2024-01/

## Summary
Jan 2024: Hong Kong finance employee joined video call with deepfake of UK CFO and colleagues; authorized 15 transfers totaling ~HK$200M (~US$25.6M) to five local accounts. Arup said internal IT systems were not compromised.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: Finance employee joins a video call (access)

The victim is approached through a meeting impersonating company executives.

Evidence: <https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk> <https://www.theguardian.com/technology/article/2024/may/17/uk-engineering-arup-deepfake-scam-hong-kong-ai-video>

### step-2: Deepfake executives appear on screen (ai)

Synthetic video and audio impersonate the UK CFO and colleagues.

Evidence: <https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk> <https://www.theguardian.com/technology/article/2024/may/17/uk-engineering-arup-deepfake-scam-hong-kong-ai-video>

### step-3: Payment requests are authorized (execution)

The employee approves 15 transfers to five local accounts.

Evidence: <https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk> <https://www.theguardian.com/technology/article/2024/may/17/uk-engineering-arup-deepfake-scam-hong-kong-ai-video>

### step-4: Approximately US$25.6M lost (impact)

Arup disclosed the loss and said its internal IT systems were not compromised.

Evidence: <https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk> <https://www.theguardian.com/technology/article/2024/may/17/uk-engineering-arup-deepfake-scam-hong-kong-ai-video>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0088](https://atlas.mitre.org/techniques/AML.T0088) Generate Deepfakes — Synthetic video and audio impersonate executives.
  Evidence: <https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk> <https://www.theguardian.com/technology/article/2024/may/17/uk-engineering-arup-deepfake-scam-hong-kong-ai-video>
- [AML.T0073](https://atlas.mitre.org/techniques/AML.T0073) Impersonation — The payment request relies on executive impersonation.
  Evidence: <https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk> <https://www.theguardian.com/technology/article/2024/may/17/uk-engineering-arup-deepfake-scam-hong-kong-ai-video>

## Prevention
Out-of-band payment verification; dual control; challenge deepfake meetings

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Arup Hong Kong deepfake video-conference $25M fraud. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Deepfake video/audio of executives

### Other tooling
- unknown

## Sources
- <https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk>
- <https://www.theguardian.com/technology/article/2024/may/17/uk-engineering-arup-deepfake-scam-hong-kong-ai-video>
