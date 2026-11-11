# Plus 5.6 Custom GPT ClickFix RAT

- ID: huntress-plus56-custom-gpt-clickfix-2026-09
- Reported: 2026-09-28
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/huntress-plus56-custom-gpt-clickfix-2026-09/

## Summary
Attacker Custom GPT 'Plus 5.6' on chatgpt.com (Google Ads) directs users to Google Sites ClickFix; paste runs PowerShell → MSI → DLL sideload via Canon COTFileReadApp.exe / ceiinfolog.dll / rdCore.dll (later Stardock DeElevate64). Dual persistence Run key + scheduled task. Multi-stage obfuscated RAT.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: Custom GPT attracts a user (access)

Ads promote an attacker-controlled Plus 5.6 GPT hosted on ChatGPT.

Evidence: <https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat>

### step-2: Chat directs the user to ClickFix (ai)

The GPT points to a Google Sites page that requests a pasted command.

Evidence: <https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat>

### step-3: PowerShell launches the payload chain (execution)

The command retrieves an MSI and triggers DLL sideloading.

Evidence: <https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat>

### step-4: RAT establishes persistence (impact)

The chain adds Run-key and scheduled-task persistence.

Evidence: <https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0073](https://atlas.mitre.org/techniques/AML.T0073) Impersonation — An AI-branded Custom GPT provides a social-engineering pretext.
  Evidence: <https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat>
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — The GPT directs the user into a ClickFix delivery flow.
  Evidence: <https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat>

## Prevention
Prevent signed binaries from user folders; HijackLibs entries for ceiinfolog/DeElevator64; hunt COTFileReadApp/DeElevate64 under %LOCALAPPDATA%\Programs\

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Plus 5.6 Custom GPT ClickFix RAT. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [ChatGPT](https://chatgpt.com/) Custom GPT 'Plus 5.6'

### Other tooling
- Google Sites / gptverification.com
- [PowerShell](https://github.com/PowerShell/PowerShell)
- msiexec
- Canon CaptureOnTouch sideload
- Stardock DeElevate64 sideload
- GOMCam follow-on

### MagicSword projects
- [HijackLibs](https://hijacklibs.net)

## Sources
- <https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat>
