import type { APIRoute } from "astro";
import { getAttacks } from "../../lib/catalog";
import { attackGuidance, detectionMcp } from "../../lib/stage-guidance";

export const GET: APIRoute = async () =>
  new Response(
    JSON.stringify(
      {
        schema_version: 1,
        description:
          "Stage-level editorial hunt hypotheses, draft query templates, and conditional policy opportunities. Not validated detection or prevention coverage. Original attack records remain at api/attacks.json.",
        detection_mcp: detectionMcp,
        integration:
          "Copyable MCP research briefs; no live MCP connection, credentials or rule search is performed by the site.",
        query_origin: "catalog_authored",
        query_downloads:
          "api/detections/{profile}.sigma.yml, .kql and .spl; stage-specific URLs are included with each stage",
        custom_audit_schema: {
          table: "OpenAttacksAudit_CL",
          splunk_sourcetype: "openattacks:audit",
          fields: {
            TimeGenerated: "datetime; _time in Splunk",
            EventType: "string; proposed normalized event name",
            Actor: "string",
            Asset: "string",
            Action: "string",
            Target: "string",
            CorrelationId: "string",
          },
        },
        entries: (await getAttacks()).map(attackGuidance),
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
