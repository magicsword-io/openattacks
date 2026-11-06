import { readFileSync } from "node:fs";
import { parse } from "yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { entryLinks, sourceUrlError } from "./source-urls.mjs";

export const schema = parse(
  readFileSync(new URL("../../schema.yaml", import.meta.url), "utf8"),
);
export const actorSchema = parse(
  readFileSync(new URL("../../actor-schema.yaml", import.meta.url), "utf8"),
);
export const toolSchema = parse(
  readFileSync(new URL("../../tool-schema.yaml", import.meta.url), "utf8"),
);
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addFormat("report-date", {
  type: "string",
  validate: (value) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/.test(value))
      return false;
    if (value.length === 7) return true;
    const date = new Date(`${value}T12:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  },
});
export const validateEntry = ajv.compile(schema);
export const validateActor = ajv.compile(actorSchema);
export const validateTool = ajv.compile(toolSchema);
export function entryErrors(data, filename) {
  const errors = [];
  if (!validateEntry(data)) {
    errors.push(
      ...validateEntry.errors.map(
        (error) =>
          `${filename}${error.instancePath || "/"}: ${error.message}${error.params.additionalProperty ? ` (${error.params.additionalProperty})` : ""}`,
      ),
    );
    return errors;
  }
  if (data?.id && filename !== `${data.id}.yaml`)
    errors.push(`${filename}: id must match the filename (${data.id}.yaml)`);
  for (const { field, url } of entryLinks(data)) {
    const issue = sourceUrlError(url);
    if (issue) errors.push(`${filename}${field}: ${issue}`);
  }
  if (new Set(data.sources.map(({ url }) => url)).size !== data.sources.length)
    errors.push(`${filename}/sources: source URLs must be unique`);
  if (data?.attack_flow?.nodes && data?.attack_flow?.edges) {
    const ids = data.attack_flow.nodes.map((node) => node.id);
    if (new Set(ids).size !== ids.length)
      errors.push(`${filename}/attack_flow/nodes: node IDs must be unique`);
    const linked = new Set();
    for (const edge of data.attack_flow.edges) {
      if (!ids.includes(edge.source) || !ids.includes(edge.target))
        errors.push(
          `${filename}/attack_flow/edges: unknown source or target node`,
        );
      if (edge.source === edge.target)
        errors.push(
          `${filename}/attack_flow/edges: self edges are not allowed`,
        );
      linked.add(edge.source);
      linked.add(edge.target);
    }
    if (ids.some((id) => !linked.has(id)))
      errors.push(
        `${filename}/attack_flow: every node must connect to an edge`,
      );
    const sourceURLs = new Set(data.sources?.map((source) => source.url) || []);
    for (const node of data.attack_flow.nodes)
      if (node.source_urls?.some((url) => !sourceURLs.has(url)))
        errors.push(
          `${filename}/attack_flow/${node.id}: sources must appear in entry sources`,
        );
  }
  for (const mapping of data?.atlas_techniques || [])
    if (
      mapping.source_urls?.some(
        (url) => !data.sources?.some((source) => source.url === url),
      )
    )
      errors.push(
        `${filename}/atlas_techniques: evidence must appear in entry sources`,
      );
  if (
    data?.date_activity_start &&
    data?.date_activity_end &&
    data.date_activity_start > data.date_activity_end
  )
    errors.push(`${filename}: activity start must precede activity end`);
  return errors;
}

export function actorErrors(data, filename) {
  const errors = [];
  if (!validateActor(data)) {
    errors.push(
      ...validateActor.errors.map(
        (error) =>
          `${filename}${error.instancePath || "/"}: ${error.message}${error.params.additionalProperty ? ` (${error.params.additionalProperty})` : ""}`,
      ),
    );
    return errors;
  }
  if (data?.id && filename !== `${data.id}.yaml`)
    errors.push(`${filename}: id must match the filename (${data.id}.yaml)`);
  return errors;
}

export function toolErrors(data, filename) {
  const errors = [];
  if (!validateTool(data)) {
    errors.push(
      ...validateTool.errors.map(
        (error) =>
          `${filename}${error.instancePath || "/"}: ${error.message}${error.params.additionalProperty ? ` (${error.params.additionalProperty})` : ""}`,
      ),
    );
    return errors;
  }
  if (data?.id && filename !== `${data.id}.yaml`)
    errors.push(`${filename}: id must match the filename (${data.id}.yaml)`);
  return errors;
}
