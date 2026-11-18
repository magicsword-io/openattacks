# Datadog - ARTEX agents read anonymous S3, trawl CloudWatch, and self-sign-up to Cognito

- ID: datadog-artex-aws-cognito-2026-11
- Reported: 2026-11-09
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/datadog-artex-aws-cognito-2026-11/

## Summary
Datadog Security Labs (Julie Agnes Sparks, Nov 9, 2026) saw ARTEX activity against several AWS environments in October 2026, focused on financial data. Every session opened with unauthenticated S3 reads (userIdentity.type AWSAccount, accountId anonymous, GetObject and ListObjects). The agent read front-end build manifests and runtime configs from S3-hosted web apps. Before each guessing burst it requested a placeholder key that should not exist (zzz_nonexistent_abc.txt, Notexist-xyz), the same habit Wiz described with /zzz-nonexistent-xyz123. With leaked long-term IAM keys, ARTEX ran repeated FilterLogEvents over CloudWatch, always with limit 1000, searching for crypto firms, hedge funds, and names like Fund, Invoice, Billing, and LLC. On October 20 a later session from 103.54.154.40 (zeofast.cn) searched for s3://, presigned, .pdf, .xlsx, .csv, rawData_, transformedData_, and the terms mongo, password, and AKIA. On October 26-27, from 154.64.252.77, ARTEX called Cognito SignUp with user agents such as Mozilla/5.0 ARTeX, iterated against a PreSignUp Lambda tenant-domain check (errors include artex-hqheizfk.invalid and custom:isAdmin), then ran InitiateAuth, RespondToAuthChallenge, GetUser, and GetTokensFromRefreshToken, swapped tokens for CognitoIdentityCredentials, and tried ListBuckets, ListSecrets, DescribeParameters, ListTopics, DescribeLogGroups, GetRestApis, DescribeRepositories, and ListFunctions20150331. Exposed consoles used titles ARTEX autonomous pentest console, ScopeWeaver Autonomous Penetration Testing Console, LUCK autonomous asset console, and Guanlan SEC pentest platform, with API routes including /tasks, /exploration, /llm/pool, /intercept, /mcp, /skills, and /agents, and a default blocklist of .gov, .gov.cn, .edu, and .edu.cn. 154.64.252.77 is also listed in the WorkOS bulletin. Hunting references named by Datadog: Stratus Red Team https://github.com/DataDog/stratus-red-team and TrailDiscover https://github.com/adanalvarez/TrailDiscover. ARTEX fork https://github.com/RuoJi6/ARTEX.

## Category
adversary-use-of-ai

## Attribution
Unattributed ARTEX operators. Consoles are mostly in Mandarin and hosted with providers including locations in Singapore and Hong Kong. Datadog attributes the activity to ARTEX usage.

- Actor: Unattributed ARTEX operators
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Datadog Security Labs
- Confidence: medium

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: Unauthenticated S3 reads, leaked long-term IAM keys, and public Cognito user pools that allow SignUp
- Victims and sectors: AWS environments holding financial data, including names consistent with funds, invoices, and billing
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Several AWS environments in October 2026. Hundreds of exposed consoles under several titles.

## Attack flow
### anon-s3: Anonymous S3 reads (access)

Sessions start with unauthenticated GetObject and ListObjects, including placeholder keys zzz_nonexistent_abc.txt and Notexist-xyz.

Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>

### cloudwatch: CloudWatch log trawl (execution)

Leaked IAM keys run FilterLogEvents with limit 1000, searching for funds, invoices, file extensions, and AKIA.

Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>

### cognito: Cognito self-sign-up (ai)

From 154.64.252.77 the agent calls SignUp, fights a PreSignUp Lambda, then exchanges tokens and lists AWS resources.

Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>

### enumerate: Cross-service enumeration (impact)

Cognito identity credentials are used for ListBuckets, ListSecrets, DescribeParameters, and related discovery calls.

Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>

### Connections

- anon-s3 -> cloudwatch
- anon-s3 -> cognito
- cognito -> enumerate

## MITRE ATLAS
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Leaked long-term IAM keys were used for CloudWatch and later API calls
  Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>
- [AML.T0021](https://atlas.mitre.org/techniques/AML.T0021) Establish Accounts — ARTEX called Cognito SignUp and iterated against a PreSignUp tenant check
  Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — FilterLogEvents searches looked for AKIA keys, passwords, and financial file names
  Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>
- [AML.T0016](https://atlas.mitre.org/techniques/AML.T0016) Obtain Capabilities — The activity is tied to the ARTEX agent framework and exposed operator consoles
  Evidence: <https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/>

## Prevention
Block public access on S3 buckets that hold front-end configs. Alert on anonymous GetObject and on placeholder keys such as zzz_nonexistent_abc.txt. Alert on high-volume FilterLogEvents with limit 1000. Disable self-sign-up on Cognito user pools that are not meant to be public, and review PreSignUp Lambda failures for artex and .invalid tenant domains. Tie the listed user agents and source IPs to CloudTrail.

## Detections
- [AWS S3 Unauthenticated Bucket Access by Rare Source](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/collection_s3_unauthenticated_bucket_access_by_rare_source.toml) (elastic) — AWS CloudTrail. Matches anonymous GetObject and ListObjects, which opened every Datadog session (userIdentity accountId anonymous).
- [AWS Repeated CloudWatch Logs Read Operations](https://github.com/splunk/security_content/blob/develop/detections/cloud/aws_repeated_cloudwatch_logs_read_operations.yml) (splunk) — AWS CloudTrail. Matches high-volume FilterLogEvents, GetLogEvents, and related reads. Datadog saw FilterLogEvents with limit 1000.
- [AWS S3 Bucket Enumeration or Brute Force](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/impact_aws_s3_bucket_enumeration_or_brute_force.toml) (elastic) — AWS CloudTrail. High-rate S3 discovery. Use alongside the placeholder object names zzz_nonexistent_abc.txt and Notexist-xyz, which this rule does not name.
- Cognito SignUp and ARTEX user agents (guidance) — The indexed rules do not alert on Cognito SignUp or PreSignUp Lambda errors. Hunt CloudTrail for SignUp, InitiateAuth, RespondToAuthChallenge, and GetTokensFromRefreshToken from 154.64.252.77, and for user agents artex-readonly/1.0, artex-pentest/1.0, artex-audit/1.0, Mozilla/5.0 ARTeX, artex-spawn/1, artex-verify/1.0, ARTeX-authorized-pentest, artex-i21861-canary, and ARTEX-worker/1.0. The Cognito unauthenticated-identity-pool rule does not match this user-pool SignUp path, so it is not cited.

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-09
- 2026-10-20 (Datadog Security Labs): Long-term IAM key from 103.54.154.40 (zeofast.cn) widens CloudWatch searches to s3://, presigned URLs, office files, and AKIA
- 2026-10-26 (Datadog Security Labs): 154.64.252.77 runs Cognito SignUp with ARTEX user agents and iterates against a PreSignUp tenant-domain check through Oct 27
- 2026-11-09 (Datadog Security Labs): Julie Agnes Sparks publishes the AWS control-plane write-up, including console titles, user agents, and the anonymous S3 canary keys

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) autonomous pentest console (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- Related console titles ScopeWeaver, LUCK, and Guanlan SEC

### Other tooling
- AWS CloudTrail APIs: FilterLogEvents, Cognito SignUp, InitiateAuth, ListBuckets, ListSecrets
- Stratus Red Team (https://github.com/DataDog/stratus-red-team)
- TrailDiscover (https://github.com/adanalvarez/TrailDiscover)

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
IPs, user agents, API names, placeholder keys, and console titles are from the Datadog article. GetSecretValue is not claimed here; the Cognito path tried ListSecrets and other List/Describe calls. 154.64.252.77 also appears in the WorkOS bulletin covered by workos-artex-unintended-agent-escape-2026-10. Link microsoft-artex-github-secrets-keyvault-2026-11, unit42-artex-api-recon-2026-10, crowdstrike-artex-sk-finance-2026-10, and the Check Point, S-RM, and Storm-3358 ARTEX entries.

## Sources
- [On the hunt for ARTEX: understanding agentic attacks in AWS environments](https://securitylabs.datadoghq.com/articles/artex-agentic-attacks-aws-environments/) — Datadog Security Labs
