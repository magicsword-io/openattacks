# ESET GuardBreaker - UAC-0099 plants a refusal-bait comment in a MATCHBOIL script

- ID: eset-guardbreaker-uac-0099-decoy-prompt-2026-08
- Reported: 2026-08-27
- AI role: other
- Entry: https://openattacks.ai/attacks/eset-guardbreaker-uac-0099-decoy-prompt-2026-08/

## Summary
ESET Research described GuardBreaker in posts on X on Aug 27, 2026. Tomáš Foltýn's WeLiveSecurity article followed on Sep 10, 2026. In a VBScript used early in an attack on a target in Ukraine, UAC-0099 left inert REM comments. Help Net Security quotes the opening as a request to make a nuclear weapon and to help, followed by uranium-enrichment text. The comment has no runtime effect. ESET says it is there so an LLM-powered code scanner's safety guardrails refuse the file and stop reading before the payload logic. ESET names this a reverse jailbreak: the point is to cause a refusal, not to talk a model into complying. The script's job is to download and install MATCHBOIL, a loader ESET says is used only by UAC-0099. The same group has checked for IDA and Wireshark processes in other attacks. ESET did not test whether the comment works and did not name a targeted model. DugganUSA, in an independent write-up dated Sep 1, 2026, ran one A/B pass on a synthetic inert script: GPT-4o and Mistral analyzed the treatment and flagged the decoy, and Claude Sonnet 4.5 returned an empty refusal. That test is not ESET's, and DugganUSA says it is a single sample on one day. UAC-0099 is Russia-aligned, active since at least 2022, and has targeted Ukrainian transportation and energy. Reporting says the group has handed validated access to Sandworm. On Jul 21, 2026 CERT-UA documented an updated chain: a VBS script with a fake extension and a long run of spaces before .vbs, Notepad++ 8.8.3 components, and the tools LUNCHPOKE, BURNYBEAR, and MATCHBOIL.V2. That advisory is about the group and the loader, not about the GuardBreaker comment. ATT&CK does not have a technique for a refusal bait in a comment. The script execution itself is T1059.005.

## Category
attacks-on-ai

## Attribution
UAC-0099, Russia-aligned, espionage. ESET attributes the script and the GuardBreaker comment. CERT-UA attributes the group's MATCHBOIL, LUNCHPOKE, and BURNYBEAR tooling. ESET does not claim this sample was handed to Sandworm.

- Actor: UAC-0099
- Country: Russia
- Motivation: nation-state
- Attributed by: ESET Research; CERT-UA for the group and its loaders
- Confidence: high

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: A VBScript used in the early stage of an intrusion at a Ukrainian organization. ESET does not describe how the script arrived. CERT-UA's July chain for the same group starts from a phishing ZIP that contains a VBS file disguised with a fake extension.
- Victims and sectors: An unnamed organization in Ukraine. UAC-0099's usual targets include transportation and energy.
- Regions: Ukraine
- Region notes: Ukraine is the victim location ESET gives for this script. Russia is the actor alignment, not a victim region.
- Scale and metrics: One documented script in one early-stage intrusion. ESET did not report how often the comment has been used or whether a scanner refused this sample.

## Attack flow
### vbs-stage: VBScript in an early stage (access)

UAC-0099 uses a VBScript early in an intrusion against a target in Ukraine. The script's runtime job is to download and install MATCHBOIL.

Evidence: <https://www.welivesecurity.com/en/business-security/guardbreaker-derailing-ai-assisted-malware-analysis-code-comment/>

### decoy-comment: Inert refusal-bait comment (ai)

REM comments request help with a nuclear weapon and then add enrichment text. They do not execute. ESET says they are meant to make an LLM scanner refuse before it reaches the loader logic.

Evidence: <https://www.welivesecurity.com/en/business-security/guardbreaker-derailing-ai-assisted-malware-analysis-code-comment/> <https://www.helpnetsecurity.com/2026/08/31/russian-hackers-ai-safety-filters-manipulation/>

### loader: MATCHBOIL still installs (execution)

If the script is run, it still downloads MATCHBOIL, the group's loader. CERT-UA's July chain uses a double-extension VBS, Notepad++ components, LUNCHPOKE, BURNYBEAR, and MATCHBOIL.V2.

Evidence: <https://www.welivesecurity.com/en/business-security/guardbreaker-derailing-ai-assisted-malware-analysis-code-comment/> <https://cert.gov.ua/article/6318634>

### scanner-gap: A refusal is the gap (impact)

ESET did not measure the effect. DugganUSA's separate one-day test saw one of three models return an empty refusal and the other two flag the decoy and continue.

Evidence: <https://www.welivesecurity.com/en/business-security/guardbreaker-derailing-ai-assisted-malware-analysis-code-comment/> <https://www.dugganusa.com/post/we-tested-the-russian-anti-analysis-trick-on-three-models-two-analyzed-the-sample-and-flagged-the-d>

### Connections

- vbs-stage -> decoy-comment
- vbs-stage -> loader
- decoy-comment -> scanner-gap

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — The refusal bait is indirect prompt injection: untrusted text inside a file being analyzed is meant to reach the model and cut the analysis short.
  Evidence: <https://www.welivesecurity.com/en/business-security/guardbreaker-derailing-ai-assisted-malware-analysis-code-comment/>
- [AML.T0015](https://atlas.mitre.org/techniques/AML.T0015) Evade AI Model — The intended effect is evasion of an AI model used as a code scanner, by provoking a safety refusal before the payload logic is read.
  Evidence: <https://www.welivesecurity.com/en/business-security/guardbreaker-derailing-ai-assisted-malware-analysis-code-comment/>

## Prevention
Keep the scanner's instructions separate from the file under analysis, and treat text inside the sample as data. A refusal, an empty completion, or a safety block on a malware sample should raise a review, not end it. Fall back to analysis that does not depend on a model, and do not give one model the only vote on whether a file is safe. The comment does not change what the script does when Windows runs it, so script-host and loader detections still apply.

## Detections
- [Cscript/Wscript Uncommon Script Extension Execution](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_wscript_cscript_uncommon_extension_exec.yml) (sigma) — Selected from a security-detections-mcp search for wscript. Windows process creation. wscript.exe or cscript.exe whose command line contains a non-script extension such as .pdf, .doc, or .txt. CERT-UA described UAC-0099 VBS names with a fake document extension, spaces, and then .vbs. A command line that still contains .pdf matches. A plain .vbs path with no fake extension does not.
- [Suspicious Double Extension Files](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/file/file_event/file_event_win_susp_double_extension.yml) (sigma) — Selected from a security-detections-mcp search for double extension. Windows file event. A created file whose name ends in a document extension immediately followed by .vbs, .exe, or another listed payload extension, including .pdf.vbs. The spaced form described by CERT-UA, with characters between pdf and .vbs, does not match this regex.
- [Vbscript Execution Using Wscript App](https://github.com/splunk/security_content/blob/develop/detections/endpoint/vbscript_execution_using_wscript_app.yml) (splunk) — Selected from a security-detections-mcp search for VBScript. Endpoint process data for wscript.exe executing VBScript. This is the generic script-host path for the GuardBreaker file. It does not know that the comment is a refusal bait.
- Refusal-bait comments and MATCHBOIL (guidance) — security-detections-mcp searches for VBScript, wscript, and double extension did not return a rule that looks for refusal-bait wording or for MATCHBOIL. A YARA or Sigma hunt for inert comments that request help building a weapon, sitting above a downloader, is still a written hunt rather than a published rule. Do not treat a scanner refusal as a benign verdict. CERT-UA's July chain also drops Notepad++ components and LUNCHPOKE, BURNYBEAR, and MATCHBOIL.V2; those names are not in the indexed rules.

## Timeline
- First seen: 2026-08-27
- Last updated: 2026-09-10
- 2026-07-21 (CERT-UA): CERT-UA documents UAC-0099's updated chain, including a double-extension VBS, Notepad++ 8.8.3 components, LUNCHPOKE, BURNYBEAR, and MATCHBOIL.V2. The advisory does not describe the refusal-bait comment.
- 2026-08-27 (ESET Research): ESET posts the GuardBreaker finding on X: a UAC-0099 VBScript used early against a target in Ukraine carries an inert comment meant to make an LLM code scanner refuse.
- 2026-08-31 (Help Net Security): Help Net Security recounts the X posts, the nuclear-weapon comment, and the MATCHBOIL downloader.
- 2026-09-01 (DugganUSA): Independent A/B test on a synthetic script. One of three models returned an empty refusal. The other two analyzed the sample and flagged the decoy. DugganUSA says this is not a benchmark.
- 2026-09-10 (WeLiveSecurity): Tomáš Foltýn publishes the GuardBreaker article. ESET still does not report a test of the comment or name a targeted model.

## Tools
### AI tooling and models
- Unnamed LLM-powered code scanner. ESET did not name a model.
- DugganUSA's independent test used [Claude](https://claude.com/product/overview) Sonnet 4.5, GPT-4o, and Mistral. That test is not the incident.

### Other tooling
- MATCHBOIL loader, delivered by the script
- Windows Script Host (wscript.exe or cscript.exe)

## Source notes
The comment's role, the MATCHBOIL purpose, the Ukraine victim, and the IDA and Wireshark checks are from the WeLiveSecurity article (Sep 10, 2026) and the Aug 31 Help Net Security recap of the X posts. The enrichment procedure is not repeated here. DugganUSA is independent research on a synthetic sample; it is not a test of the incident file. CERT-UA article 6318634 (Jul 21, 2026) is the government write-up of the group's VBS, Notepad++, LUNCHPOKE, BURNYBEAR, and MATCHBOIL.V2 chain. https://cybernews.com/security/russian-hackers-nuclear-prompt-ai-guardrails/ returned HTTP 403 during link checks and is omitted. No YARA or Sigma rule in the detection index matches the refusal-bait wording or the name MATCHBOIL.

## Sources
- [GuardBreaker: derailing AI-assisted malware analysis with a code comment](https://www.welivesecurity.com/en/business-security/guardbreaker-derailing-ai-assisted-malware-analysis-code-comment/) — WeLiveSecurity
- [Russian hackers plant a nuclear-weapon prompt in malware to trip AI safety filters](https://www.helpnetsecurity.com/2026/08/31/russian-hackers-ai-safety-filters-manipulation/) — Help Net Security
- [UAC-0099: LUNCHPOKE, BURNYBEAR, updated MATCHBOIL.V2, and Notepad++ 8.8.3](https://cert.gov.ua/article/6318634) — CERT-UA
- [Independent A/B test of the decoy comment on three models](https://www.dugganusa.com/post/we-tested-the-russian-anti-analysis-trick-on-three-models-two-analyzed-the-sample-and-flagged-the-d) — DugganUSA
