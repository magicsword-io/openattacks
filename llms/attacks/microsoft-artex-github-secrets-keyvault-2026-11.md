# Microsoft Threat Intelligence - ARTEX agents mining GitHub secrets into Entra & Azure Key Vault

- ID: microsoft-artex-github-secrets-keyvault-2026-11
- Reported: 2026-11-05
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/microsoft-artex-github-secrets-keyvault-2026-11/

## Summary
Microsoft Threat Intelligence (Nov 5, 2026) reports unattributed cloud-credential harvesting campaign using ARTEX autonomous agent framework. Attackers conduct mass GitHub secret searches querying organization names, cloud keywords (Azure, AWS, Entra, Key Vault), and AI provider keys. ARTEX agents authenticate as compromised Azure Entra service principals, then autonomously enumerate and exfiltrate Azure Key Vault secrets, storage account keys, App Service configuration settings, AKS cluster credentials, SharePoint/OneDrive files, Microsoft Graph queries, Azure AI Studio keys, and Azure Foundry credentials within approximately 5 minutes per compromised tenant. Agents feature adaptive retry logic that automatically corrects Azure Resource Manager API version errors on failed calls, demonstrating autonomous error recovery. Campaign operates from IPs 199.19.77.84, Tor exit 199.19.77.18, 65.87.223.26, and 157.22.126.128. Microsoft notes median dwell time of 8 minutes from initial service principal authentication to complete key-vault enumeration, indicating highly automated credential-harvesting workflow targeting cloud and AI infrastructure.

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

## Prevention
Scan public repositories for accidentally committed Azure credentials; implement Azure AD Conditional Access policies requiring managed device or IP restrictions for service principals; enable Azure Key Vault firewall and private endpoints; activate Microsoft Defender for Cloud Apps for anomalous Graph API usage; rotate service principal secrets regularly; use managed identities instead of service principal passwords where possible; monitor for rapid sequential ARM API calls and Key Vault enumeration patterns; implement Azure Sentinel detections for service principal authentication from Tor exits or VPN/proxy infrastructure

## Detections
- [Entra ID Device with ROADtools Default OS Build](https://github.com/elastic/detection-rules/blob/main/rules/integrations/entityanalytics_entra_id/persistence_entra_id_device_roadtools_default_os_build.toml) (elastic) — Detects anomalous Entra ID device registration patterns; relevant for detecting unauthorized service principal usage
- [Entra ID Protection - Risk Detection - Sign-in Risk](https://github.com/elastic/detection-rules/blob/main/rules/integrations/azure/initial_access_entra_id_protection_sign_in_risk_detected.toml) (elastic) — Detects Entra ID sign-in risk events; directly applicable to ARTEX campaign service principal authentication from Tor/VPN
- Azure Key Vault secret enumeration monitoring (guidance) — Monitor for rapid sequential Key Vault secret list/get operations; alert on service principal authentication from Tor exit nodes (199.19.77.18) or known VPN/proxy IPs; detect ARM API calls with version-correction retry patterns (ARTEX adaptive error recovery); flag Graph API queries for all users/applications from single service principal; monitor for SharePoint/OneDrive bulk access from service principals; alert on Azure AI Studio / Foundry key access from non-development IPs
- Microsoft Defender for Cloud Apps anomalous Graph API usage (guidance) — Enable Defender for Cloud Apps policies for unusual Graph API query volumes, service principal activity from unexpected geolocations, and rapid tenant enumeration patterns

## Timeline
- First seen: 2026-11-01
- Last updated: 2026-11-05
- 2026-11-05 (Microsoft Threat Intelligence): Microsoft reports ARTEX-based campaign harvesting GitHub-exposed Azure credentials and autonomously enumerating Key Vault, storage, AKS, AI/Foundry secrets within ~5 minutes per tenant; campaign IPs 199.19.77.84, 199.19.77.18, 65.87.223.26, 157.22.126.128

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) autonomous agent framework (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- LLM-driven Azure API enumeration with adaptive retry

### Other tooling
- GitHub API for secret search
- Azure Resource Manager API
- Microsoft Graph API
- Tor network for anonymization

## Sources
- [Threat actors use agentic AI tooling to find and abuse exposed secrets](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/) — Microsoft Threat Intelligence
