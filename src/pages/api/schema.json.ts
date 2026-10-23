import rawSchema from "../../../schema.yaml?raw";
import { parse } from "yaml";
export function GET() {
  const publicSchema = parse(rawSchema);
  delete publicSchema.properties.typefully;
  // Publish standard JSON Schema so external clients need no custom Ajv formats.
  delete publicSchema.properties.date_reported.format;
  publicSchema.properties.date_reported.anyOf = [
    { format: 'date' },
    { pattern: '^\\d{4}-(0[1-9]|1[0-2])$' },
  ];
  return new Response(JSON.stringify(publicSchema, null, 2), {
    headers: { "Content-Type": "application/schema+json; charset=utf-8" },
  });
}
