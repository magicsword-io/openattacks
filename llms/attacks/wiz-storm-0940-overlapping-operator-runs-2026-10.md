# Wiz: Storm-0940-overlapping operator runs ARTEX agents against Okta, Entra and Cognito logins at IT and software vendors

- ID: wiz-storm-0940-overlapping-operator-runs-2026-10
- Reported: 2026-10-22
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/wiz-storm-0940-overlapping-operator-runs-2026-10/

## Summary
Wiz saw an ARTEX-driven operator sharing Microsoft-attributed Storm-0940 IPs password-spray and probe auth flows at IT and software vendors throughout October; most attempts failed.

## Category
adversary-use-of-ai

## Attribution
Storm-0940 (overlap per Wiz)

- Actor: Storm-0940 (overlap per Wiz)
- Country: China
- Motivation: nation-state
- Attributed by: Wiz Research
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Technology and AI companies
- Regions: unknown
- Region notes: Target geography was not captured by the Notion feed. Actor attribution is not used as a victim location.
- Scale and metrics: unknown

## Attack flow
No attack flow is recorded.

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
unknown

## Detections
- [Potential Okta Password Spray (Single Source)](https://github.com/elastic/detection-rules/blob/main/rules/integrations/okta/credential_access_okta_password_spray_single_source.toml) (elastic) — Matched Okta password spray with security-detections-mcp. Wiz describes one-second Okta and Entra login bursts lasting 20 to 60 minutes. Wiz also names its own Okta password-spray alert, which is not this rule.
- [Potential Okta Password Spray (Multi-Source)](https://github.com/elastic/detection-rules/blob/main/rules/integrations/okta/credential_access_okta_password_spray_multi_source.toml) (elastic) — Matched Okta password spray with security-detections-mcp. Wiz says a new address appeared within minutes after an IP was blocked, so the spray is not confined to one source.
- [Azure AD Multiple Users Failing To Authenticate From Ip](https://github.com/splunk/security_content/blob/develop/detections/cloud/azure_ad_multiple_users_failing_to_authenticate_from_ip.yml) (splunk) — Matched T1110.003 with security-detections-mcp. Wiz says the same actor password-sprayed Entra ID as well as Okta, using infrastructure Microsoft attributes to Storm-0940.
- Cognito SignUp and source-map harvesting (guidance) — security-detections-mcp's Cognito search returned only unauthenticated identity-pool credentials. Wiz describes Cognito SignUp, ForgotPassword, and InitiateAuth, plus downloads of JavaScript source maps and OpenAPI documents. That identity-pool rule does not match. Hunt those API events and the source-map requests Wiz lists.

## Timeline
- First seen: 2026-10
- Last updated: 2026-11-15
- 2026-10-22 (Wiz Research): Wiz reports an ARTEX operator, overlapping Microsoft's Storm-0940, password-spraying Okta and Entra and probing Cognito at IT and software vendors through October 2026. Most attempts failed.
- 2026-11-15 (OpenAttacks): Tagged ARTEX and backfilled attribution confidence, detections, and timeline from the cited Wiz report.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) multi-agent pentest framework (LLM backends not named) — Community-maintained fork; the original repository is unavailable.
- Okta, Entra ID, AWS Cognito login flows

### Other tooling
- unknown

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: Medium. Feed novelty: Evolution.

## Sources
- <https://wiz.io/blog/artex-in-the-wild-storm-0940-expands-targeting-of-it-and-software-vendors> — Wiz Research
- <https://aimatter.in/2026/10/22/wiz-finds-an-ai-agent-that-attacks-software-vendors>
