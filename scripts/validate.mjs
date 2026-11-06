import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import { actorErrors, toolErrors } from "../src/lib/schema.mjs";
import { readCatalog } from "./lib/catalog.mjs";

const { entries, errors } = readCatalog();

function readCollection(relativeDirectory, validate) {
  const directory = fileURLToPath(
    new URL(`../${relativeDirectory}/`, import.meta.url),
  );
  const files = readdirSync(directory)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort();
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
      errors.push(
        ...validate(data, filename).map(
          (error) => `${relativeDirectory}/${error}`,
        ),
      );
      if (typeof data?.id === "string") {
        if (ids.has(data.id))
          errors.push(
            `${relativeDirectory}/${filename}: duplicate id ${data.id}`,
          );
        ids.add(data.id);
      }
    } catch (error) {
      errors.push(`${relativeDirectory}/${filename}: ${error.message}`);
    }
  }

  if (!files.length) errors.push(`${relativeDirectory}/: no YAML entries found`);
  return files.length;
}

const actorCount = readCollection("actors", actorErrors);
const toolCount = readCollection("tools", toolErrors);

if (errors.length) {
  console.error(
    `Catalog validation failed:\n${errors.map((error) => `  • ${error}`).join("\n")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${entries.length} attack entries, ${actorCount} actor entries, and ${toolCount} tool entries.`,
  );
}
