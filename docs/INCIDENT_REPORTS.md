# OpenAttacks incident reports

The header opens a report dialog. The same form is available at `/suggest/`, and an incident's correction link prefills its entry ID.

1. Create a [Formspree form](https://help.formspree.io/articles/building-your-form/building-an-html-form/) that delivers to the inbox the OpenAttacks team uses to review submissions.
2. In Vercel, set `PUBLIC_INCIDENT_REPORT_FORM_ID` to the ID from the form's `https://formspree.io/f/<id>` URL. Set it for the environments where you want to accept reports and redeploy. The ID is public.
3. Open **Report an incident** on that deployment. Verify a submission using sample public information and an inbox you control.

Reports and optional reply email addresses go to Formspree for private review. GitHub issue links are available when the form ID is unset. Vulnerabilities in OpenAttacks go through [private GitHub reporting](https://github.com/magicsword-io/openattacks/security/advisories/new).
