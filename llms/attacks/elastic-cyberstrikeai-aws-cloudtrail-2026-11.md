# Elastic CyberStrikeAI server reads AWS user data, secrets, and sends an SSM command

- ID: elastic-cyberstrikeai-aws-cloudtrail-2026-11
- Reported: 2026-11-13
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/elastic-cyberstrikeai-aws-cloudtrail-2026-11/

## Summary
Elastic Security Labs (Samir Bousseaden, Bryan Porras Blanch, Terrance DeJesus; Nov 13, 2026) describes one CyberStrikeAI server, 43.240.29.11 (AS133199, SonderCloud Limited, Hong Kong), using stolen credentials for eight identities across four AWS accounts from Sep 30 to Oct 16, 2026. Five were IAM users and three were EC2 instance roles. The role sessions were named after instance IDs, and using them from an outside IP means the credentials were taken off the instances. Activity fell on four days and produced 78 alerts, all medium or low, which Elastic says only cohered once correlated by source IP. On Sep 30 the server called GetCallerIdentity on four IAM users across three accounts within 51 minutes, three of those calls in the same second, plus GetSessionToken. The same day app-role read Secrets Manager and then issued 56 DescribeInstanceAttribute userData calls in 141 milliseconds (about 2.5 ms per call), part of 57 user-data reads from one assumed-role session that day and 58 user-data alerts overall. On Oct 1 it revalidated credentials, read more secrets with app-role, and used nonprod-role for two GetSecretValue calls. On Oct 2 container-role called GetParameter with decryption on an SSM SecureString and SendCommand 29 seconds later. CloudTrail does not show the command text or whether it succeeded. After 14 quiet days, on Oct 16 the server called GetSessionToken for a previously unseen user in a fourth account and rechecked two earlier users. Internet scan data showed 43.240.29.11 serving a CyberStrikeAI page on port 8080, with a self-signed certificate (CN CyberStrikeAI, serial 3356730520974368630, issued 2026-09-15), one day before the first alert. 43.240.29.28 and 43.240.29.33 served the same page, FOFA fid, and certificate but were not in this AWS telemetry. Elastic says none of the three was still serving that interface as of November 2026. Six Elastic rules fired: AWS EC2 User Data Retrieval for EC2 Instance (58, medium), AWS STS GetCallerIdentity API Called for the First Time (11, medium), First Time Seen AWS Secret Value Accessed in Secrets Manager (4, medium), AWS STS GetSessionToken Usage (3, low), AWS SSM SendCommand Execution by Rare User (1, low), and AWS Systems Manager SecureString Parameter Request with Decryption Flag (1, medium). Elastic added two high-severity rules: AWS EC2 Bulk User Data Enumeration (more than 20 distinct instances in 10 minutes) and AWS STS GetCallerIdentity Bulk Account Enumeration (three or more distinct non-role identities from the same external IP and ASN in 10 minutes). Elastic, citing Will Thomas at Team Cymru, says 21 CyberStrikeAI IPs were counted in early 2026, aimed at Fortinet edge devices, and that this is the first Elastic case of the same tooling turned on AWS. The repository contains 24 SKILL.md files, including skills/unlimited-attack-scope/SKILL.md and skills/cloud-attack-methods/SKILL.md. Elastic cites https://github.com/Ed1s0nZ/CyberStrikeAI, which redirects to https://github.com/AIPentest/CyberStrikeAI. Link kaspersky-cyberstrikeai-schools-2026 and trendai-chinese-language-operators-used-cyberstrikeais-2026-10.

## Category
adversary-use-of-ai

## Attribution
Unnamed operator. Elastic confirms the source IP served CyberStrikeAI. No country or motivation is stated. Hong Kong is the hosting location.

- Actor: Unnamed CyberStrikeAI operator
- Motivation: unknown
- Attributed by: Elastic Security Labs
- Confidence: medium

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: Stolen AWS credentials for five IAM users and three EC2 instance roles, used from an external IP. Elastic does not know how the credentials were obtained.
- Victims and sectors: Four AWS accounts. Account and identity names were replaced with aliases. No sector was named.
- Regions: unknown
- Region notes: No victim country is stated. Hong Kong and AS133199 are the server's hosting location and are not recorded as a target region.
- Scale and metrics: One server, eight identities, four accounts, 78 alerts, four active days from Sep 30 to Oct 16, 2026. Fifty-six userData calls in 141 milliseconds. Sixty-five of 78 alerts fell on Sep 30.

## Attack flow
### validate: GetCallerIdentity sweeps (access)

On Sep 30 the server validates four IAM users across three accounts, with three GetCallerIdentity calls in one second, and requests GetSessionToken.

Evidence: <https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion>

### userdata: 56 userData reads in 141 ms (ai)

app-role calls DescribeInstanceAttribute for userData 56 times in 141 milliseconds after an earlier GetSecretValue.

Evidence: <https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion>

### ssm: Decrypt a parameter, then SendCommand (execution)

On Oct 2 container-role reads an SSM SecureString and issues SendCommand 29 seconds later. The command text is not in the audit log.

Evidence: <https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion>

### return: Recheck after 14 days (impact)

On Oct 16 the same server calls GetSessionToken in a fourth account and revalidates two earlier users.

Evidence: <https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion>

### Connections

- validate -> userdata
- userdata -> ssm
- ssm -> return

## MITRE ATLAS
- [AML.T0016.001](https://atlas.mitre.org/techniques/AML.T0016.001) Software Tools — Elastic ties the calls to a host that was serving the CyberStrikeAI console
  Evidence: <https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Stolen IAM user and EC2 instance-role credentials were used from an external IP
  Evidence: <https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The server read Secrets Manager values, EC2 user data, and a decrypted SSM SecureString
  Evidence: <https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion>

## Prevention
Rotate every identity that touched 43.240.29.11 and revoke active sessions. Replace instance profiles whose role credentials were used off-instance. Treat secrets in EC2 user data as exposed. Review SSM command history for the Oct 2 SendCommand. Restrict ec2:DescribeInstanceAttribute for userData. Correlate medium and low CloudTrail alerts by source IP across multi-day gaps.

## Detections
- [AWS EC2 User Data Retrieval for EC2 Instance](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/discovery_ec2_userdata_request_for_ec2_instance.toml) (elastic) — AWS CloudTrail. DescribeInstanceAttribute for userData. Elastic says this rule fired 58 times.
- [AWS EC2 Bulk User Data Enumeration](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/discovery_ec2_bulk_user_data_enumeration.toml) (elastic) — AWS CloudTrail. Elastic added this high-severity rule for more than 20 distinct userData reads by one principal and source IP in 10 minutes. The intrusion had 56 calls in 141 milliseconds.
- [AWS STS GetCallerIdentity API Called for the First Time](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/discovery_new_terms_sts_getcalleridentity.toml) (elastic) — AWS CloudTrail. First GetCallerIdentity for an identity. Elastic says this rule fired 11 times.
- [AWS STS GetCallerIdentity Bulk Account Enumeration](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/discovery_sts_getcalleridentity_bulk_account_enumeration.toml) (elastic) — AWS CloudTrail. Elastic added this high-severity rule for three or more distinct non-role identities calling GetCallerIdentity from the same external IP and ASN in 10 minutes.
- [First Time Seen AWS Secret Value Accessed in Secrets Manager](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/credential_access_new_terms_secretsmanager_getsecretvalue.toml) (elastic) — AWS CloudTrail. First GetSecretValue. Elastic says this rule fired 4 times, including app-role and nonprod-role.
- [AWS Systems Manager SecureString Parameter Request with Decryption Flag](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/credential_access_retrieve_secure_string_parameters_via_ssm.toml) (elastic) — AWS CloudTrail. GetParameter with decryption. Matches the Oct 2 container-role read.
- [AWS SSM `SendCommand` Execution by Rare User](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/execution_ssm_sendcommand_by_rare_user.toml) (elastic) — AWS CloudTrail. Rare SendCommand. Matches the command issued 29 seconds after the SecureString read. The article's low-severity rule name is AWS SSM SendCommand Execution by Rare User.
- GetSessionToken and off-instance role use (guidance) — The article also names AWS STS GetSessionToken Usage (3 low alerts). The public rule titled AWS IAM API Calls via Temporary Session Tokens describes later IAM calls that use a temporary token, not the GetSessionToken API itself, so it is not cited. Also hunt instance-role credentials whose source IP is not the instance or the organization's NAT, and the certificate serial 3356730520974368630.

## Timeline
- First seen: 2026-09-30
- Last updated: 2026-11-13
- 2026-09-30 (Elastic Security Labs): 43.240.29.11 validates IAM users, reads Secrets Manager, and issues 56 userData calls in 141 milliseconds
- 2026-10-02 (Elastic Security Labs): container-role reads a decrypted SSM parameter and calls SendCommand 29 seconds later
- 2026-10-16 (Elastic Security Labs): The same server returns after 14 days and revalidates credentials, including a fourth account
- 2026-11-13 (Elastic Security Labs): Elastic publishes the CloudTrail write-up and two high-severity bulk enumeration rules

## Tools
### AI tooling and models
- CyberStrikeAI (https://github.com/AIPentest/CyberStrikeAI), web interface on TCP 8080
- 24 SKILL.md files in the repository, including unlimited-attack-scope and cloud-attack-methods

### Other tooling
- AWS APIs GetCallerIdentity, GetSessionToken, GetSecretValue, DescribeInstanceAttribute, GetParameter, SendCommand

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
API sequence, alert counts, rule names, certificate serial 3356730520974368630, and the three IPs are from the Elastic article. Only 43.240.29.11 appeared in the AWS alerts. The 24 SKILL.md count was checked on the repository default branch on 2026-11-15. Elastic cites https://github.com/Ed1s0nZ/CyberStrikeAI; that URL redirected to https://github.com/AIPentest/CyberStrikeAI. Link kaspersky-cyberstrikeai-schools-2026 and trendai-chinese-language-operators-used-cyberstrikeais-2026-10.

## Sources
- [56 AWS API calls in 141 milliseconds: Inside an AI-run intrusion](https://www.elastic.co/security-labs/threat-command/cyberstrikeai-aws-cloudtrail-intrusion) — Elastic Security Labs
- [CyberStrikeAI](https://github.com/AIPentest/CyberStrikeAI) — AIPentest
