# Chainstack - ARTEX intrusion from a default-credential Grafana to production password hashes

- ID: chainstack-intruder-reached-production-user-password-2026-11
- Reported: 2026-11-03
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/chainstack-intruder-reached-production-user-password-2026-11/

## Summary
Chainstack's incident page (created Nov 3, 2026, technical update Nov 10, page updated Nov 11) says an attacker reached production and customer account data, including password hashes. The Nov 10 update replaces the earlier unknown entry point. A test Grafana instance, deployed in July to a development Kubernetes cluster, was exposed to the internet with the default administrator credentials unchanged and without SSO or basic authentication in front. From Oct 26 at 19:26 UTC the attacker used Grafana's data-source proxy to reach internal services. A Grafana administrator can point a data source at any URL, and the proxy forwards the request. Over about two hours that reached dozens of internal services, including identity, database, automation, and monitoring. At 21:01 the proxy reached an internal MCP tool server that exposes Kubernetes operations to AI agents. It required no authentication, and its service account was bound to cluster-admin. Chainstack says network flows and the changes that followed show this server was the command executor; the individual tool calls were not recovered. The same night the attacker tested an internal workflow engine with names artx-check-* and artex-verify-*, created administrator users in the development identity provider, and replaced JavaScript in a development web app by mounting ConfigMaps over the served files. On Oct 27 the same loader was applied to staging and to the development Grafana. The loader referenced hxxps://silverbullet[.]icu/p/17fbad90-3094-4198-9b60-49fc852e331d/bootstrap.js and the marker window.__artx7f3a. No software vulnerability was exploited. Development machine credentials also worked in production. On Oct 29 those credentials and a BI-tool API key were used from 187.15.134[.]80. Between 17:03 and 17:12 a workflow was rewritten in the platform database so it ran shell commands, triggered with a valid webhook token through Grafana, then restored. That returned the automation pod's environment, its Kubernetes service-account token, and a machine identity. At 17:49 production Kubernetes secrets were listed from 18.237.52[.]142. On Oct 31, from 01:40 to 08:31, 187.15.134[.]45 bulk-read the production cloud secrets manager, created extra keys, and created a Kubernetes service account artx-sa with role artx-observer and token artx-sa-token. A short-lived pod on the host network took the node's cloud token from the instance metadata service. Another cluster ran a privileged pod with host networking and host PID and installed a static-pod relay to 185.242.233[.]68:39443. A compromised VPN peer key from that address reached the database network and flapped the tunnel, which is how the intrusion was noticed. Attacker pods queried production databases, including PostgreSQL pg_shadow on one instance. On Oct 30 a cron job ran Chisel (https://github.com/jpillora/chisel) as a reverse SOCKS tunnel to 185.242.233[.]68:10800, and a systemd timer named artx-guard beaconed to 185.242.233[.]68:8088/artx-beacon. The same host also served a VPN client on port 9331. Access paths were cut on Oct 31. Copied tokens kept working until 06:28 UTC on Nov 2. Chainstack assesses with high confidence that the attacker used ARTEX, from artx/artex markers such as artex-i37257-*, parallel paths, and chisel, and says the indicators do not match the actor-specific lists published for Vapor Panda, Storm-0940, or Storm-3358. Customer nodes, the console, and the API were not modified. Password hashes, organization and account names, member emails, and node credentials are treated as exposed. Payment card data is not stored. ATT&CK techniques Chainstack maps include T1078.001, T1078.004, T1609, T1610, T1611, T1053.003, T1053.006, T1552.005, T1552.007, and T1572.

## Category
adversary-use-of-ai

## Attribution
Unnamed. Chainstack attributes the tooling to ARTEX with high confidence and says that does not identify the operator. None of the indicators match the actor-specific sets published for Vapor Panda, Storm-0940, or Storm-3358.

- Actor: Unnamed
- Country: Unknown
- Motivation: unknown
- Attributed by: Chainstack
- Confidence: high

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: Internet-exposed test Grafana in a development Kubernetes cluster, left on the default administrator credentials, then Grafana's data-source proxy into an unauthenticated MCP tool server whose service account had cluster-admin
- Victims and sectors: Chainstack, a blockchain infrastructure provider, and its customers' account records (organization names, account-holder names, member emails, password hashes) and node credentials, which Chainstack treats as exposed
- Regions: unknown
- Region notes: Chainstack lists offices in the United States and Singapore. The report does not say which country the compromised clusters ran in. Actor attribution is not a victim location.
- Scale and metrics: Development access from Oct 26 19:26 UTC. Production Kubernetes secrets read Oct 29 17:49 UTC. Production secrets-manager bulk reads Oct 31 01:40-08:31 UTC. Last use of a copied credential Nov 2 06:28 UTC. Customer-facing services kept running. Password hashes and node credentials are in scope. Card data was not stored.

## Attack flow
### grafana: Default-credential Grafana (access)

From Oct 26 19:26 UTC a test Grafana on a development cluster, reachable from the internet with unchanged default administrator credentials, proxies requests to internal services.

Evidence: <https://chainstack.com/security-incident-nov-2026/>

### mcp-exec: MCP server runs commands (ai)

At 21:01 the proxy reaches an unauthenticated MCP tool server whose service account is cluster-admin. Chainstack says that server was the command executor. artx and artex names appear on the artifacts.

Evidence: <https://chainstack.com/security-incident-nov-2026/>

### prod-secrets: Development credentials reach production (execution)

Machine credentials from development work in production. Oct 31 brings a bulk read of the production secrets manager, a VPN key into the database network, and queries against production databases.

Evidence: <https://chainstack.com/security-incident-nov-2026/>

### persist: Chisel and a systemd timer (impact)

On Oct 30, cron starts a Chisel reverse SOCKS tunnel to 185.242.233[.]68:10800 and the artx-guard systemd timer beacons to port 8088. Copied credentials last work at Nov 2 06:28 UTC.

Evidence: <https://chainstack.com/security-incident-nov-2026/>

### Connections

- grafana -> mcp-exec
- mcp-exec -> prod-secrets
- prod-secrets -> persist

## MITRE ATLAS
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — The entry point was an internet-exposed Grafana. Chainstack says no software vulnerability was exploited; the data-source proxy and the unchanged default administrator account were abused.
  Evidence: <https://chainstack.com/security-incident-nov-2026/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — An unauthenticated MCP tool server became the command executor, and Chainstack says the attacker used ARTEX.
  Evidence: <https://chainstack.com/security-incident-nov-2026/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Development credentials, a production secrets-manager bulk read, Kubernetes secrets, and the instance-metadata token were stolen.
  Evidence: <https://chainstack.com/security-incident-nov-2026/>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — The Grafana default administrator account, cloud service-account keys, and a VPN peer key were reused as valid accounts, including from development into production.
  Evidence: <https://chainstack.com/security-incident-nov-2026/>

## Prevention
Do not publish a test Grafana, or any admin UI, without SSO or an equivalent extra login, and replace default administrator credentials at deploy time. Treat a data-source proxy as privileged: allowlist destinations and block cluster-internal addresses that are not approved data sources. An MCP or other AI tool server needs authentication and must not run as cluster-admin. Development credentials must not be valid in production. Alert on secret lists, bulk cloud secret reads, a new privileged or hostPath pod, a systemd timer, cron launching a tunnel, and the same VPN peer key presented from two addresses. artx and artex resource names are a hunt clue only when tied to this behavior.

## Detections
- [Potential Protocol Tunneling via Chisel Client](https://github.com/elastic/detection-rules/blob/main/rules/linux/command_and_control_linux_chisel_client_activity.toml) (elastic) — Selected from a security-detections-mcp search for chisel. Linux endpoint. Chisel client command-line flags followed by a network connection from an uncommon process. Matches the reverse SOCKS tunnel Chainstack found on development hosts. The Windows chisel.exe rule is not cited.
- [Systemd Timer Created](https://github.com/elastic/detection-rules/blob/main/rules/linux/persistence_systemd_scheduled_timer_created.toml) (elastic) — Selected from a security-detections-mcp search for systemd timer. Linux endpoint. Creation of a systemd timer, including user timers. Matches artx-guard.timer. The rule does not look for the artx-guard name or the :8088/artx-beacon URL.
- [Cron Job Created or Modified](https://github.com/elastic/detection-rules/blob/main/rules/linux/persistence_cron_job_creation.toml) (elastic) — Selected from a security-detections-mcp search under T1053.003. Linux endpoint. A new or changed cron job. Chainstack found /etc/cron.d/artx-ngx launching Chisel. The rule is the cron write, not the Chisel binary.
- [Kubernetes Privileged Pod Created](https://github.com/elastic/detection-rules/blob/main/rules/integrations/kubernetes/privilege_escalation_privileged_pod_created.toml) (elastic) — Selected from a security-detections-mcp search for privileged pod. Kubernetes audit. Creation of a pod or container with privileged mode. Matches the production pod Chainstack described with host networking and host PID. A hostPath mount that is not privileged needs the hostPath rule instead.
- [Kubernetes Pod Exec Cloud Instance Metadata Access](https://github.com/elastic/detection-rules/blob/main/rules/integrations/kubernetes/credential_access_kubernetes_pod_exec_cloud_instance_metadata.toml) (elastic) — Selected from a security-detections-mcp search for instance metadata. Kubernetes audit of pod exec commands that reference a cloud metadata endpoint. Chainstack says a host-network pod took the node cloud token from the instance metadata service. A token read that never appears in an exec command line will not match.
- [Kubernetes Secrets Enumeration](https://github.com/SigmaHQ/sigma/blob/master/rules/application/kubernetes/audit/kubernetes_audit_secrets_enumeration.yml) (sigma) — Selected from a security-detections-mcp search for Kubernetes secrets. Kubernetes audit list on secrets. Chainstack says a production list request returned secret contents, which this list event covers. The follow-on individual reads are a separate get.
- Grafana default login, the data-source proxy, and the MCP server (guidance) — security-detections-mcp search for Grafana returned no rule about default administrator credentials or /api/datasources/proxy/. The hits were unrelated process rules, so they are not cited. Hunt Grafana logins that still use the default administrator account, new data sources aimed at cluster-internal addresses, and proxy requests to those addresses. The cluster-admin role-binding creation rules are also not cited: Chainstack says the MCP server's service account already had cluster-admin. No indexed rule alerts on an unauthenticated MCP server using a pre-existing cluster-admin account.

## Timeline
- First seen: 2026-10-26
- Last updated: 2026-11-11
- 2026-07-01 (Chainstack): July 2026, day not stated: a test Grafana is deployed on a development cluster with default administrator credentials and no SSO or basic authentication in front.
- 2026-10-26 (Chainstack): 19:26 UTC first use of the Grafana data-source proxy. 21:01 first connection to the unauthenticated MCP tool server. A JavaScript loader is injected the same night.
- 2026-10-29 (Chainstack): Development cloud credentials are used from 187.15.134\[.\]80. A rewritten workflow yields a machine identity. Production Kubernetes secrets are read at 17:49 UTC.
- 2026-10-30 (Chainstack): Chisel reverse SOCKS to 185.242.233\[.\]68:10800 and the artx-guard systemd timer to :8088/artx-beacon are installed on development hosts.
- 2026-10-31 (Chainstack): Bulk production secrets-manager reads, new keys, the VPN peer key, database queries, and containment. A malicious deployment commit at 15:54 fails because cluster access is already cut.
- 2026-11-02 (Chainstack): 06:28 UTC last observed use of a copied credential. Two development hosts that were brought back up tried to run their implants and the outbound connections were blocked.
- 2026-11-03 (Chainstack): Initial public incident report. Entry is described as a third-party component. Customer account data and password hashes are in scope.
- 2026-11-10 (Chainstack): Technical update: Grafana default credentials, the MCP server as command executor, ARTEX markers, and the indicator table.
- 2026-11-11 (Chainstack): Incident page marked updated. Chainstack says customer nodes, the console, and the API were not modified.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- Unauthenticated MCP tool server bound to cluster-admin, used as the command executor

### Other tooling
- Grafana data-source proxy
- Chisel (https://github.com/jpillora/chisel)
- systemd timer artx-guard

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
The Nov 10 technical section is the source for the Grafana entry, the MCP server, the ARTEX assessment, the IPs, and the hashes. The page was updated Nov 11. The Hacker News article is the Nov 3 report, before that section existed. Hashes are of application files the attacker modified to carry the loader, not of a second stage or of host binaries. Chainstack also published Grafana bundle hashes 07691e5949a123e313e1d589288e3831ec8ac30b90c45ab99d3b6ad07f23789a and 455473033f7ecbeafaa70e38f41f924377d54013efedeb0996ee84d3422c10ce, and test-page hashes 7c5925a3bc97983bfbfccdc514edb4dadbdb5b796a0747a764b0dcc4f103ea15 and b4a701949a1489e81754637238ed3f8177520f9f950e655f9357900d9e30aea8. Link barracuda-artex-cloud-key-intrusion-2026-11 and srm-artex-ir-host-artifacts-2026-11 for the i-counter artifact pattern.

## Sources
- [Incident report: what happened and what customers need to do](https://chainstack.com/security-incident-nov-2026/) — Chainstack
- [Chainstack reports production systems were reached in the late-October campaign](https://thehackernews.com/2026/11/chainstack-reports-production-systems.html) — The Hacker News
- [Chisel](https://github.com/jpillora/chisel) — jpillora
