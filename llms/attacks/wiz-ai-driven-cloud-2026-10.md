# Wiz CIRT AI-driven multi-cloud intrusions

- ID: wiz-ai-driven-cloud-2026-10
- Reported: 2026-10-19
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/wiz-ai-driven-cloud-2026-10/

## Summary
AI agent ran full cloud operations: initial access, credential theft, pivots across GCP/AWS/K8s/CI-CD/IdP, debugging its own scripts. Loud (thousands of actions/hour), pentest-named resources, numeric task IDs with -b/-c retries, commented generated scripts. Lived off SSM, SA token minting, IdP admin creation, GitOps manifests, runner-log exfil.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Confirmed Java RCE in exposed Kafka UI among multiple probed doors; same source IP scanned 600+ other Wiz customer environments
- Victims and sectors: Large multi-cloud organization (Wiz customer); opportunistic scanning across many other customers
- Regions: unknown
- Region notes: unknown
- Scale and metrics: Hundreds–thousands of actions per hour; 600+ environments scanned from same IP

## Attack flow
### step-1: Exposed Kafka UI is exploited (access)

The report confirms a Java RCE route among multiple probed entry points.

Evidence: <https://www.wiz.io/blog/anatomy-of-ai-driven-cloud-attacks>

### step-2: Agent executes and debugs cloud operations (ai)

The automation generates and retries scripts at high volume.

Evidence: <https://www.wiz.io/blog/anatomy-of-ai-driven-cloud-attacks>

### step-3: Credentials enable cross-service pivots (execution)

Reported paths span cloud accounts, Kubernetes, identity and CI/CD.

Evidence: <https://www.wiz.io/blog/anatomy-of-ai-driven-cloud-attacks>

### step-4: Data leaves through operational channels (impact)

The research describes runner-log exfiltration and abuse of legitimate cloud-management capabilities.

Evidence: <https://www.wiz.io/blog/anatomy-of-ai-driven-cloud-attacks>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://www.wiz.io/blog/anatomy-of-ai-driven-cloud-attacks>

## Prevention
Unify multi-platform logs; runtime visibility on runners/VMs/pods; restrict cross-system trust; rotate credentials on compromise; correlate loud agent tells (pentest- prefixes, task IDs)

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Wiz CIRT AI-driven multi-cloud intrusions. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Unnamed AI agent system (Wiz: agent ran the whole operation)

### Other tooling
- Kafka UI exploit
- [SSM](https://aws.amazon.com/systems-manager/)
- GCP SA token creation
- IdP admin APIs
- CI/CD pipelines
- GitOps/K8s manifests
- [webhook.site](https://github.com/webhooksite/webhook.site)
- IMDS credential harvest

## Source notes
unknown

## Sources
- <https://www.wiz.io/blog/anatomy-of-ai-driven-cloud-attacks>
