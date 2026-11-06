import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import { entryErrors } from "../../src/lib/schema.mjs";

export function readCatalog(
  directory = fileURLToPath(new URL("../../attacks/", import.meta.url)),
) {
  const files = readdirSync(directory)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort();
  const errors = [];
  const entries = [];
  const ids = new Set();
  for (const filename of files) {
    try {
      const raw = readFileSync(join(directory, filename), "utf8");
      if (/^\s*(?:<{7}(?: .*)?|={7}|>{7}(?: .*)?|\|{7}(?: .*)?)\s*$/m.test(raw))
        throw new Error("unresolved merge conflict marker");
      const document = parseDocument(raw, { uniqueKeys: true });
      if (document.errors.length)
        throw new Error(
          document.errors.map((error) => error.message).join("; "),
        );
      const data = document.toJS();
      const issues = entryErrors(data, filename);
      errors.push(...issues);
      if (typeof data?.id === "string") {
        if (ids.has(data.id))
          errors.push(`${filename}: duplicate id ${data.id}`);
        ids.add(data.id);
      }
      if (!issues.length) entries.push({ filename, data });
    } catch (error) {
      errors.push(`${filename}: ${error.message}`);
    }
  }
  if (!files.length) errors.push("attacks/: no YAML entries found");
  return { entries, errors };
}
