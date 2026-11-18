# Email prompt injection against mail AI assistants (Sublime, Barracuda)

- ID: email-prompt-injection-ai-assistants-2026-11
- Reported: 2026-11-06
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/email-prompt-injection-ai-assistants-2026-11/

## Summary
Sublime Security (Harley Halsey, Brandon Murphy, Randy Pargman) primary research documents invoice fraud campaign hiding forward this email with its PDF to ap.confirm+<controller>@<target> instructions in zero-size HTML span elements and Unicode Tag characters invisible to humans. Barracuda (Merium Khalid, Nov 7) via Cybersecurity Insiders reports recruiting email hiding HTML playbook telling assistant to forward to all-staff mailing lists for self-propagation and search mailbox for seed phrases, private keys, wallet data to exfiltrate to outside Gmail accounts. Both campaigns target email AI assistants reading/processing messages on behalf of users. Unattributed actors; confirmed in wild by Sublime and Barracuda independently.

## Category
attacks-on-ai

## Attribution
Unattributed campaigns; confirmed active in wild Nov 2026 by Sublime and Barracuda

- Actor: Unattributed campaigns
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Sublime Security / Barracuda
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Phishing emails with hidden HTML prompt injection targeting email AI assistants
- Victims and sectors: Organizations using email AI assistants; finance teams (invoice fraud); general workforce (recruiting fraud)
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Active Nov 2026; confirmed by two independent security vendors

## Attack flow
### craft-injection: Craft hidden prompt injection (execution)

Attacker embeds instructions in zero-size HTML spans and Unicode Tag characters invisible to users

Evidence: <https://sublime.security/blog/invoice-fraud-campaign-adds-prompt-injection-aimed-at-email-ai-agents/>

### deliver-email: Deliver phishing email (access)

Invoice fraud or recruiting email delivered to target organization

Evidence: <https://sublime.security/blog/invoice-fraud-campaign-adds-prompt-injection-aimed-at-email-ai-agents/>

### ai-reads: Email AI assistant processes message (ai)

AI assistant reads email including hidden instructions

Evidence: <https://sublime.security/blog/invoice-fraud-campaign-adds-prompt-injection-aimed-at-email-ai-agents/>

### execute-forward: AI forwards email or searches mailbox (execution)

Assistant follows hidden instructions to forward email with PDF to attacker-controlled address or search for sensitive data

Evidence: <https://sublime.security/blog/invoice-fraud-campaign-adds-prompt-injection-aimed-at-email-ai-agents/>

### self-propagate: Self-propagate via all-staff forwards (impact)

Barracuda case: AI forwards to all-staff lists for organizational spread

Evidence: <https://www.cybersecurity-insiders.com/phishing-has-a-new-target-the-ai-assistant-reading-your-email/>

### Connections

- craft-injection -> deliver-email
- deliver-email -> ai-reads
- ai-reads -> execute-forward
- execute-forward -> self-propagate

## MITRE ATLAS
- [AML.T0051](https://atlas.mitre.org/techniques/AML.T0051) LLM Prompt Injection — Hidden HTML instructions inject prompts into email AI assistant processing
  Evidence: <https://sublime.security/blog/invoice-fraud-campaign-adds-prompt-injection-aimed-at-email-ai-agents/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — Email AI assistants manipulated to forward emails and search mailboxes without user awareness
  Evidence: <https://sublime.security/blog/invoice-fraud-campaign-adds-prompt-injection-aimed-at-email-ai-agents/>
- [AML.T0086](https://atlas.mitre.org/techniques/AML.T0086) Exfiltration via AI Agent Tool Invocation — AI assistants instructed to exfiltrate seed phrases, private keys, and wallet data
  Evidence: <https://www.cybersecurity-insiders.com/phishing-has-a-new-target-the-ai-assistant-reading-your-email/>

## Prevention
Strip hidden HTML elements from emails before AI processing; sanitize Unicode Tag characters; implement AI assistant output validation; restrict AI assistant forwarding capabilities; require human approval for bulk forwards; monitor for unusual mailbox search patterns; educate users on prompt injection risks; implement strict email content security policies

## Detections
- Email AI assistant security controls (guidance) — Strip zero-size HTML elements before AI processing; sanitize Unicode Tag characters (U+E0000–U+E007F); detect hidden text with display:none, font-size:0, opacity:0; validate AI assistant actions (forwards, searches); require human approval for bulk operations; monitor for ap.confirm+ email patterns; alert on mailbox searches for seed phrase, private key, wallet; log all AI assistant forwarding actions; implement AI output validation

## Timeline
- First seen: 2026-11-01
- Last updated: 2026-11-07
- 2026-11-06 (Sublime Security): Sublime reports invoice fraud campaign using zero-size HTML spans and Unicode Tag characters to inject hidden instructions targeting email AI assistants
- 2026-11-07 (Barracuda / Cybersecurity Insiders): Barracuda documents recruiting email hiding HTML playbook for all-staff self-propagation and mailbox search for cryptocurrency data

## Tools
### AI tooling and models
- Email AI assistants (unspecified vendors)
- Mailbox automation agents

### Other tooling
- Zero-size HTML span elements
- Unicode Tag characters
- HTML playbook instructions

## Source notes
Sublime Security blog (primary source) documents invoice fraud campaign with zero-size span and Unicode Tag injection; Barracuda report via Cybersecurity Insiders adds recruiting fraud with all-staff self-propagation and mailbox search for crypto data; both confirm active attacks Nov 2026

## Sources
- [Sublime: Invoice Fraud Campaign Adds Prompt Injection Aimed at Email AI Agents](https://sublime.security/blog/invoice-fraud-campaign-adds-prompt-injection-aimed-at-email-ai-agents/) — Sublime Security
- [Phishing Has a New Target - The AI Assistant Reading Your Email](https://www.cybersecurity-insiders.com/phishing-has-a-new-target-the-ai-assistant-reading-your-email/) — Cybersecurity Insiders
