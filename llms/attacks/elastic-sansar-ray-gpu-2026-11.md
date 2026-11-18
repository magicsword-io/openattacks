# Elastic REF3364 SANSAR takes over exposed Ray GPU hosts and hides utilization

- ID: elastic-sansar-ray-gpu-2026-11
- Reported: 2026-11-12
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/elastic-sansar-ray-gpu-2026-11/

## Summary
Elastic Security Labs (Salim Bitam, Nov 12, 2026) tracks REF3364. The Ray dashboard was bound to loopback, but the job agent was reachable from the internet and accepted unauthenticated Jobs API submissions. External probes appeared in the Ray logs on October 22, 2026. On October 24 a submitted job ran nvidia-smi and sent the GPU inventory out. On October 25 a Python reverse-shell job connected to an external listener under the account that owned the Ray session. The actor added an SSH key to that account's authorized_keys, obtained root, and staged SANSAR under /opt/vadi_ on three GPU hosts. SANSAR is a Rust orchestrator (v0.1.3) with Tor/Arti command and control and Lyrebird obfs4/WebTunnel. It supervises XMRig, stored as kurt, and SRBMiner-MULTI, stored as tilki (https://github.com/xmrig/xmrig and https://github.com/doktor83/SRBMiner-Multi). A replaced libnvidia-ml.so.1 wraps the real NVML library and reports GPU use as 0 percent, randomizes temperature between 36 and 46 C and power between 100 and 200 W, and filters process lists, so nvidia-smi and other NVML clients lie. An ftrace rootkit, acpi_thermal_mgr.ko, is built with DKMS, loaded through the initramfs, and hides processes, files, and sockets. A systemd backdoor named netns reads its command-and-control address from an Ethereum smart contract and connects on TCP 8080. Elastic publishes YARA rules for SANSAR and netns. Link shadowray-2-0-hijacks-exposed-ray-2025-11.

## Category
attacks-on-ai

## Attribution
REF3364. Elastic does not attribute the activity to a named group or country.

- Actor: REF3364
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Elastic Security Labs
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Unauthenticated Ray Jobs API on an internet-reachable job agent
- Victims and sectors: Three GPU hosts running Ray. Elastic did not name the organizations.
- Regions: unknown
- Region notes: Elastic did not name the countries of the GPU hosts.
- Scale and metrics: Three GPU hosts. Activity from October 22 through October 25, 2026, from probe to persistent access.

## Attack flow
### probe: Unauthenticated Ray job (access)

October 22 probes, then an October 24 job that runs nvidia-smi and sends the GPU inventory out.

Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>

### shell: Python reverse shell (execution)

On October 25 a Python reverse-shell job connects out as the Ray session account.

Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>

### keys: SSH key and root (impact)

An SSH key is added to authorized_keys. The actor then stages SANSAR under /opt/vadi_.

Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>

### hide: NVML wrapper and DKMS rootkit (execution)

libnvidia-ml.so.1 reports 0 percent GPU use. acpi_thermal_mgr.ko is loaded through DKMS and the initramfs.

Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>

### Connections

- probe -> shell
- shell -> keys
- keys -> hide

## MITRE ATLAS
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — The internet-reachable Ray Jobs API accepted unauthenticated job submissions.
  Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>
- [AML.T0050](https://atlas.mitre.org/techniques/AML.T0050) Command and Scripting Interpreter — Submitted jobs ran nvidia-smi and a Python reverse shell.
  Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>
- [AML.T0072](https://atlas.mitre.org/techniques/AML.T0072) Reverse Shell — The October 25 job was a Python reverse shell to an external listener.
  Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>
- [AML.T0034](https://atlas.mitre.org/techniques/AML.T0034) Cost Harvesting — SANSAR mined on the stolen GPU capacity while reporting 0 percent utilization.
  Evidence: <https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware>

## Prevention
Do not expose the Ray job agent. Require authentication on the Jobs API. Alert on a Python reverse shell from the Ray account, a new authorized_keys entry, an out-of-tree kernel module, and a miner command line even when the binary is named kurt or tilki. Compare nvidia-smi with a second GPU telemetry source so a wrapped libnvidia-ml.so.1 cannot be the only reading.

## Detections
- [Python Reverse Shell Execution Via PTY And Socket Modules](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_python_reverse_shell.yml) (sigma) — Linux process creation. python -c with import, pty, socket, spawn, and connect. Matches that common reverse-shell form. A job that is a script file without those strings on one command line will not match.
- [Linux SSH Authorized Keys Modification](https://github.com/splunk/security_content/blob/develop/detections/endpoint/linux_ssh_authorized_keys_modification.yml) (splunk) — Linux endpoint. Modification of authorized_keys, which is how the actor kept access after the reverse shell.
- [Linux Install Kernel Module Using Modprobe Utility](https://github.com/splunk/security_content/blob/develop/detections/endpoint/linux_install_kernel_module_using_modprobe_utility.yml) (splunk) — Linux endpoint. modprobe loading a kernel module. DKMS loads acpi_thermal_mgr.ko this way.
- [Tainted Out-Of-Tree Kernel Module Load](https://github.com/elastic/detection-rules/blob/main/rules/linux/persistence_tainted_kernel_module_out_of_tree_load.toml) (elastic) — Linux endpoint. An out-of-tree module that taints the kernel. Fits the DKMS-built acpi_thermal_mgr.ko rootkit.
- [Linux Crypto Mining Indicators](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_crypto_mining.yml) (sigma) — Linux process creation. Stratum URLs, --donate-level=0, and related miner flags. The binaries are renamed kurt and tilki, so a process-name rule for xmrig does not match. These command-line flags still can.
- NVML wrapper and netns contract (guidance) — No cited rule looks for a replaced libnvidia-ml.so.1, the path /opt/vadi_, or a systemd unit that reads an Ethereum contract. LD_PRELOAD rules do not match this library replacement.

## Timeline
- First seen: 2026-10-22
- Last updated: 2026-11-12
- 2026-10-22 (Elastic Security Labs): External probes appear in the Ray job logs.
- 2026-10-24 (Elastic Security Labs): A submitted job runs nvidia-smi and sends the GPU inventory to an external server.
- 2026-10-25 (Elastic Security Labs): A Python reverse-shell job connects out. The actor adds an SSH key, gains root, and stages SANSAR under /opt/vadi_.
- 2026-11-12 (Elastic Security Labs): Elastic publishes REF3364, the seven file hashes, the NVML wrapper, and the DKMS rootkit.

## Tools
### AI tooling and models
- Ray (https://github.com/ray-project/ray)

### Other tooling
- SANSAR orchestrator
- XMRig, filename kurt (https://github.com/xmrig/xmrig)
- SRBMiner-MULTI, filename tilki (https://github.com/doktor83/SRBMiner-Multi)
- Lyrebird obfs4/WebTunnel
- NVML wrapper libnvidia-ml.so.1

## Source notes
Dates, paths, component names, and the seven SHA-256 hashes are from the Elastic Security Labs article. The miners are renamed, so a rule that requires the process name xmrig or srbminer will miss kurt and tilki. The NVML change is a replaced libnvidia-ml.so.1, not an LD_PRELOAD or ld.so.preload edit, so those rules are not cited.

## Sources
- [0% GPU utilization: How SANSAR hides Linux cryptomining](https://www.elastic.co/security-labs/threat-command/sansar-linux-cryptomining-malware) — Elastic Security Labs
