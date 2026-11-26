const reportFormId = import.meta.env.PUBLIC_INCIDENT_REPORT_FORM_ID?.trim();

export const incidentReportAction =
  reportFormId && /^[a-z0-9]+$/i.test(reportFormId)
    ? `https://formspree.io/f/${reportFormId}`
    : undefined;
