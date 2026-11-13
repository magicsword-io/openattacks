# Microsoft Threat Intelligence - ARTEX agents mining GitHub secrets into Entra & Azure Key Vault

- ID: microsoft-artex-github-secrets-keyvault-2026-11
- Reported: 2026-11-05
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/microsoft-artex-github-secrets-keyvault-2026-11/

## Summary
Microsoft Threat Intelligence (Nov 5, 2026) reports unattributed cloud-credential harvesting campaign using ARTEX autonomous agent framework. Attackers conduct mass GitHub secret searches querying organization names, cloud keywords (Azure, AWS, Entra, Key Vault), and AI provider keys. ARTEX agents authenticate as compromised Azure Entra service principals, then autonomously enumerate and exfiltrate Azure Key Vault secrets, storage account keys, App Service configuration settings, AKS cluster credentials, SharePoint/OneDrive files, Microsoft Graph queries, Azure AI Studio keys, and Azure Foundry credentials within approximately 5 minutes per compromised tenant. Agents feature adaptive retry logic that automatically corrects Azure Resource Manager API version errors on failed calls, demonstrating autonomous error recovery. Campaign operates from IPs 199.19.77.84, Tor exit 199.19.77.18, 65.87.223.26, and 157.22.126.128. Microsoft notes median dwell time of 8 minutes from initial service principal authentication to complete key-vault enumeration, indicating highly automated credential-harvesting workflow targeting cloud and AI infrastructure. VulnCheck (Patrick Garrity, Nov 8, 2026) reports 199.19.77.84 hit VulnCheck canaries Nov 7 exploiting CVE-2025-3248 (Langflow /api/v1/validate/code endpoint). Agent staged Python using @exec decorator, _lf_probe() wrapper function, and |RAISE| exception-based exfiltration channel; dumped env/.env files and langflow.db; checked Docker socket and cloud metadata endpoint 169.254.169.254; grepped for sk-, AIza, AKIA key patterns; read mem0 configuration; decrypted Langflow Fernet-encrypted variables. Linked to Microsoft campaign via shared IP 199.19.77.84; vendor-asserted AI involvement (VulnCheck notes network traffic alone cannot definitively prove agent autonomy).

## Category
adversary-use-of-ai

## Attribution
Unattributed activity cluster; Microsoft Threat Intelligence notes related infrastructure observed by Todyl; cloud and AI credential harvesting for follow-on cybercrime operations

- Actor: Unknown (ARTEX cloud-secrets cluster)
- Country: Unknown
- Motivation: cybercrime
- Attributed by: Microsoft Threat Intelligence
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Exposed credentials in public GitHub repositories; compromised Azure Entra service principal credentials
- Victims and sectors: Organizations with exposed Azure service principal credentials on GitHub; targets include AI/ML development teams, cloud infrastructure operators, and enterprises using Azure AI Studio / Foundry
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Active Nov 2026; median 8-minute dwell time from service principal authentication to complete Key Vault enumeration; ~5 minutes per tenant for full credential exfiltration; campaign IPs observed across multiple tenants

## Attack flow
### github-search: Mass GitHub secret queries (execution)

Mass GitHub secret queries

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>

### credential-harvest: Harvest Azure service principal credentials (execution)

Harvest Azure service principal credentials

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>

### entra-auth: Authenticate as Entra service principal (execution)

Authenticate as Entra service principal

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>

### keyvault-enum: Enumerate Azure Key Vault secrets (execution)

Enumerate Azure Key Vault secrets

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>

### storage-keys: Exfiltrate storage account keys (execution)

Exfiltrate storage account keys

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>

### aks-creds: Steal AKS cluster credentials (execution)

Steal AKS cluster credentials

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>

### ai-keys: Harvest Azure AI/Foundry keys (impact)

Harvest Azure AI/Foundry keys

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>

### Connections

- github-search -> credential-harvest
- credential-harvest -> entra-auth
- entra-auth -> keyvault-enum
- keyvault-enum -> storage-keys
- keyvault-enum -> aks-creds
- keyvault-enum -> ai-keys

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Adversaries deploy ARTEX autonomous AI agent to automatically discover exposed cloud credentials, authenticate to Azure, and systematically exfiltrate Key Vault secrets and Azure AI service keys
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Agent autonomously exploits CVE-2025-3248 in Langflow to steal API keys and credentials
  Evidence: <https://www.vulncheck.io/blog/microsoft-secret-hunter>
- [AML.T0083](https://atlas.mitre.org/techniques/AML.T0083) Credentials from AI Agent Configuration — Agent targets AI platform credentials including Langflow Fernet-encrypted variables and mem0 configuration
  Evidence: <https://www.vulncheck.io/blog/microsoft-secret-hunter>

## Prevention
Scan public repositories for accidentally committed Azure credentials; implement Azure AD Conditional Access policies requiring managed device or IP restrictions for service principals; enable Azure Key Vault firewall and private endpoints; activate Microsoft Defender for Cloud Apps for anomalous Graph API usage; rotate service principal secrets regularly; use managed identities instead of service principal passwords where possible; monitor for rapid sequential ARM API calls and Key Vault enumeration patterns; implement Azure Sentinel detections for service principal authentication from Tor exits or VPN/proxy infrastructure

## Detections
- [Package Runtime Secret File Access Followed by IMDS Request](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/credential_access_secret_file_access_followed_by_imds_request.toml) (elastic) — Detects IMDS 169.254.169.254 access and Docker socket enumeration patterns
- Azure Key Vault and credential enumeration (guidance) — Monitor Azure Resource Manager API calls from compromised service principals; detect Key Vault secret enumeration; alert on storage account key access; monitor AKS credential retrieval; detect Azure AI Studio and Foundry key access
- Langflow CVE-2025-3248 exploitation (guidance) — Monitor /api/v1/validate/code endpoint POST requests; detect @exec decorator usage; alert on _lf_probe() wrapper functions; detect |RAISE| exception-based exfiltration; monitor Fernet decryption attempts

## Timeline
- First seen: 2026-11-01
- Last updated: 2026-11-08
- 2026-11-05 (Microsoft Threat Intelligence): Microsoft reports ARTEX-based campaign harvesting GitHub-exposed Azure credentials and autonomously enumerating Key Vault, storage, AKS, AI/Foundry secrets within ~5 minutes per tenant; campaign IPs 199.19.77.84, 199.19.77.18, 65.87.223.26, 157.22.126.128
- 2026-11-08 (VulnCheck): VulnCheck reports 199.19.77.84 exploited CVE-2025-3248 (Langflow /api/v1/validate/code) against canaries Nov 7; agent staged Python with @exec, _lf_probe() wrapper, |RAISE| exfil channel; dumped env/.env, langflow.db; checked Docker socket and 169.254.169.254; grepped sk-, AIza, AKIA patterns; decrypted Fernet variables; linked to Microsoft campaign via shared IP

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) autonomous agent framework (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- LLM-driven Azure API enumeration with adaptive retry
- Langflow (https://github.com/langflow-ai/langflow) - targeted for credential theft via CVE-2025-3248

### Other tooling
- GitHub API for secret search
- Azure Resource Manager API
- Microsoft Graph API
- Tor network for anonymization

## Source notes
Microsoft Threat Intelligence blog (Nov 5, 2026) primary source; Todyl-observed related infrastructure noted; all IOCs (199.19.77.84, 199.19.77.18, 65.87.223.26, 157.22.126.128) verified from Microsoft post

## Sources
- [Threat actors use agentic AI tooling to find and abuse exposed secrets](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/) — Microsoft Threat Intelligence
- [VulnCheck: Microsoft Secret Hunter](https://www.vulncheck.io/blog/microsoft-secret-hunter) — VulnCheck
