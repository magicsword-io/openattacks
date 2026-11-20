# Eye Security ARTEX intrusion from a PHP webshell to GitOps and CI runners

- ID: eye-security-artex-gitops-2026-11
- Reported: 2026-11-12
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/eye-security-artex-gitops-2026-11/

## Summary
Eye Security (Bas van den Berg, Nov 12, 2026) describes a multi-day ARTEX intrusion that started at a vulnerable custom PHP upload function. Uploads were extension-fuzzed (.phtml, .php5, .php7, .phar, .inc, .PHP) into webshells such as artx_s5.php and zzartx0000.php. The shell accepted header X-ARTX-KEY or parameter k, used key k=x9f3c2b7e, and returned ### ARTX-AGENT. Environment variables on the pod leaked API keys, and the first call with a stolen key landed within minutes. When a rate limiter engaged, the agents rewrote their client in about three minutes to rotate a spoofed client-IP header and peaked at over 9,000 requests a minute. After that path was blocked they used a pool of more than 17,000 residential proxies. They pulled Neo-reGeorg (https://github.com/L-codes/Neo-reGeorg) and changed it to keep state in the internal cache so it worked across load-balanced pods. Its default user agent is Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0. With an engineer's Git hosting identity they changed the deployment repo so GitOps deployed attacker pods, including artx-pod and a privileged pod on a staging host. Deleting the pod brought it back within a second. From the privileged pod they broke out to the node with nsenter. Separately, Eye counted thirteen logins in under three minutes, one socket per login, asking a file-transfer server to forward Docker, containerd, CRI-O, lightweight Kubernetes, the system bus, the PHP worker pool, the process supervisor, and sshd. The server refused every one of those forwards. A CI app key from the secret store was used to register self-hosted GitHub runners named sink-*, re-registered about every eight minutes through the night. Backdoor admins looked like QA or audit accounts (qa_probe_*, qa.audit29a). In phpMyAdmin they used LOAD DATA LOCAL INFILE into databases named artx_* and INTO OUTFILE write tests at /tmp/x.php5. The operators went after gift-card codes. Eye also publishes OSINT infrastructure from similar ARTEX activity: 207.5.195.93, artex.lol, staging.artex.lol, artex.tokena2b.top, artex.ok7777.eu.cc, artex.noog2infra.site, images tomicdd/artex and congdonglinux/artex, and callbacks on dnslog.cn, oast.me, and webhook.site. Data markers include ARTEX_WRITE_PROBE, ARTEX-PROBE-0001, ARTX_PERSIST_OK, and artex_control_marker_zz9q. Link srm-artex-ir-host-artifacts-2026-11, datadog-artex-aws-cognito-2026-11, arctic-wolf-antifox-iis-aws-2026-11, microsoft-artex-github-secrets-keyvault-2026-11, and badbyte-artex-backdoor-docker-2026-11.

## Category
adversary-use-of-ai

## Attribution
Unnamed. Eye ties one address to public ARTEX reporting on payment-API abuse. No country is given.

- Actor: Unnamed ARTEX operators
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Eye Security
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Vulnerable custom PHP upload function, then extension-fuzzed webshells
- Victims and sectors: A company running payment and gift-card services. Eye did not name the company.
- Regions: unknown
- Region notes: Eye did not name the victim's country. Infrastructure countries are not recorded as victim regions.
- Scale and metrics: Peak over 9,000 requests a minute. More than 17,000 residential proxy addresses. Thirteen socket-forward logins in under three minutes, all refused by the server. GitOps recreated a deleted attacker pod within a second. Runners were re-registered about every eight minutes.

## Attack flow
### upload: PHP upload becomes a webshell (access)

Extension-fuzzed uploads such as artx_s5.php and zzartx0000.php accept X-ARTX-KEY and return ### ARTX-AGENT.

Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>

### secrets: Pod secrets used within minutes (execution)

Environment variables and the secret store yield API keys. A rate limiter is bypassed in about three minutes.

Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>

### tunnel: Neo-reGeorg across pods (execution)

Neo-reGeorg is modified to keep state in the internal cache so the tunnel survives load-balanced pods.

Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>

### gitops: GitOps restores the attacker pod (impact)

A deployment-repo change creates artx-pod. Deleting it brings the pod back within a second.

Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>

### escape: Privileged pod to the node (execution)

A privileged staging pod is used with nsenter to reach the host node.

Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>

### runner: Self-hosted runners named sink-* (impact)

A CI app key registers self-hosted GitHub runners that are re-registered through the night.

Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>

### Connections

- upload -> secrets
- secrets -> tunnel
- secrets -> gitops
- gitops -> escape
- secrets -> runner

## MITRE ATLAS
- [AML.T0016](https://atlas.mitre.org/techniques/AML.T0016) Obtain Capabilities — The operators deployed the ARTEX agent framework and Neo-reGeorg.
  Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — Initial access was a vulnerable PHP upload function turned into webshells.
  Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Pod environment variables and the cloud secret store exposed API keys and a CI app key.
  Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Stolen keys and an engineer's Git hosting identity were reused for API calls, GitOps, and runner registration.
  Evidence: <https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/>

## Prevention
Block the published webshell names and the X-ARTX-KEY header. Alert on php-fpm or the web server spawning a shell, nsenter into the host PID namespace, a privileged pod, and a new self-hosted GitHub runner such as sink-*. Treat GitOps reconciliation as a persistence path: a deleted artx-pod that returns immediately is the deployment repo, not a restart.

## Detections
- [Linux Webshell Indicators](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_webshell_detection.yml) (sigma) — Linux process creation. A web server parent spawning a shell utility. Parent images in the rule include httpd, nginx, and apache2. php-fpm is not in that parent list, so a shell whose parent is only php-fpm will not match.
- [Potential Docker Escape via Nsenter](https://github.com/elastic/detection-rules/blob/main/rules/linux/privilege_escalation_docker_escape_via_nsenter.toml) (elastic) — Linux endpoint. nsenter changing into another namespace, including the host breakout Eye saw from the privileged pod.
- [Kubernetes Privileged Pod Created](https://github.com/elastic/detection-rules/blob/main/rules/integrations/kubernetes/privilege_escalation_privileged_pod_created.toml) (elastic) — Kubernetes audit. Creation of a privileged pod. Matches the staging pod used before nsenter.
- [Remote GitHub Actions Runner Registration](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/execution_register_github_actions_runner.toml) (elastic) — Endpoint, cross-platform. Runner.Listener registering a self-hosted runner. Matches the sink-* runners.
- [New GitHub Self Hosted Action Runner](https://github.com/elastic/detection-rules/blob/main/rules/integrations/github/initial_access_github_register_self_hosted_runner.toml) (elastic) — GitHub audit log. A new self-hosted runner registered on a repository.
- ARTEX shell key and Neo-reGeorg user agent (guidance) — No cited rule contains X-ARTX-KEY, k=x9f3c2b7e, ### ARTX-AGENT, artx_s5.php, or the Firefox/38.0 Neo-reGeorg agent. The Sigma ReGeorg web-log rule requires a null user agent, so it misses this tunnel.

## Timeline
- First seen: 2026-11-12
- Last updated: 2026-11-12
- 2026-11-12 (Eye Security): Eye publishes the incident: PHP webshells, a three-minute rate-limit bypass, Neo-reGeorg, GitOps pod restoration, nsenter, and sink-* GitHub runners.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable. MoLeft/ARTEX also returned HTTP 200 on 2026-11-16. The original Autumn-27/ARTEX repository returned HTTP 404.

### Other tooling
- Neo-reGeorg (https://github.com/L-codes/Neo-reGeorg)
- nsenter container breakout
- Self-hosted [GitHub Actions](https://github.com/features/actions) runners

### MagicSword projects
- [LOTTunnels](https://lottunnels.github.io)

## Source notes
File names, the shell key, the request peak, the proxy count, the GitHub runner names, and the nsenter breakout are from the Eye Security incident write-up. 207.5.195.93 and the artex.* domains are in Eye's OSINT infrastructure list for similar ARTEX activity, not described as addresses observed inside this victim. Neo-reGeorg is tracked by LOTTunnels at https://lottunnels.github.io/lottunnels/Binaries/neo-regeorg/. The Sigma ReGeorg web-log rule requires a null user agent, and this tunnel used Firefox/38.0, so that rule is not cited.

## Sources
- [Machine speed: how we defended against an AI-driven attack](https://labs.eye.security/how-we-defended-against-an-ai-driven-attack/) — Eye Security
