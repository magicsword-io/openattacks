---
layout: ../layouts/MarkdownLayout.astro
title: Patterns — AI Attacks
description: Recurring patterns in reported AI-enabled attacks, with source-backed examples and practical prevention questions.
last_reviewed: '2026-10-20'
---

The catalog tracks where AI changes an attack path. These are editorial observations from the supplied reports, rather than a forecast or a measure of prevalence. Research demonstrations and uncertain cases retain their entry-level caveats.

## 01 / The agent becomes part of the toolchain

In the reported [GTG-2002 campaign](../attacks/gtg-2002-vibe-hacking-extortion-2025-08/), Claude Code supported data theft and extortion workflows. The [Cairn research](../attacks/cairn-norforge-2026-10/) describes agent harnesses looping through web exploitation tasks using familiar tools. AI can reduce the manual effort required to repeat existing intrusion steps.

**Prevention question:** Which binaries, credentials, and network destinations can an agent reach? Apply least privilege to the agent and to the tools it launches. Review skills before loading them, and keep harness panels private.

## 02 / A new brand delivers a familiar payload

[Fake ChatGPT Android applications](../attacks/unit42-android-chatgpt-malware-2023/) and [Adception’s fake Claude installer](../attacks/adception-claude-mac-2026-10/) use AI demand to attract victims. The resulting attack can still be a conventional stealer or a script executed by the user.

**Prevention question:** Can a user distinguish an official download from an ad, extension, or copy-and-paste installation flow? Use verified distribution channels and application controls appropriate to the environment.

## 03 / Connecting an agent creates a trust boundary

[MCP tool poisoning research](../attacks/invariant-mcp-tool-poisoning-2025-04/) describes malicious instructions in tool descriptions. [Cursor MCPoison](../attacks/cursor-mcpoison-cve-2025-54136/) concerns persistent trust in MCP configuration. The permission to connect a tool can create lasting consequences.

**Prevention question:** What is trusted when a connector or configuration changes? Review manifests and configuration as code, pin dependencies, and reapprove material changes. Treat retrieved content and tool descriptions as untrusted input.

## 04 / Code can be generated during execution

[PROMPTSTEAL / LAMEHUG](../attacks/promptsteal-lamehug-apt28-2025-07/) uses model output to generate commands. [PROMPTFLUX](../attacks/promptflux-gtig-2025-06/) explores self-modifying code through a model API. The [BlackMamba proof of concept](../attacks/hyas-blackmamba-poc-2023-08/) illustrates a related idea in a controlled setting.

**Prevention question:** Are detections anchored to behavior as well as static files? Review unexpected model API connections, suspicious process chains, and executable content generated at runtime.

## 05 / AI access is an asset worth stealing

[Sysdig’s LLMjacking report](../attacks/llmjacking-sysdig-2024-05/) describes stolen cloud credentials used to resell inference access. [QUIETVAULT](../attacks/quietvault-gtig-2025/) and [GhostAction](../attacks/ghostaction-ai-creds-2026-10/) extend the catalog’s credential-theft picture to local AI tools and services.

**Prevention question:** Where do API keys and AI sessions live? Limit permissions, rotate exposed credentials, and monitor inference use and billing for behavior inconsistent with the legitimate workload.

## 06 / Impersonation can move into the meeting

The [Arup deepfake fraud report](../attacks/arup-deepfake-video-fraud-2024-01/) describes video impersonation in a payment-authorizing workflow. AI’s role was the social-engineering channel.

**Prevention question:** Does a familiar voice or face bypass a payment control? Verify sensitive requests through an independently established channel and require dual control for high-impact transactions.

---

These patterns will evolve as the evidence changes. Contribute a correction or a new sourced entry through the project repository. Explore [free MagicSword.io](https://magicsword.io/?utm_source=ai-attacks&utm_medium=referral&utm_content=patterns) for related community resources.
