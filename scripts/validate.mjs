import { readdirSync, readFileSync } from "node:fs";
import { parseDocument } from "yaml";
import { entryErrors } from "../src/lib/schema.mjs";

const files = readdirSync(new URL("../attacks", import.meta.url)).filter(
  (name) => /\.ya?ml$/.test(name),
);
const errors = [];
const ids = new Set();
for (const filename of files) {
  try {
    const document = parseDocument(
      readFileSync(new URL(`../attacks/${filename}`, import.meta.url), "utf8"),
      { uniqueKeys: true },
    );
    if (document.errors.length)
      throw new Error(document.errors.map((error) => error.message).join("; "));
    const data = document.toJS();
    errors.push(...entryErrors(data, filename));
    if (ids.has(data.id)) errors.push(`${filename}: duplicate id ${data.id}`);
    ids.add(data.id);
  } catch (error) {
    errors.push(`${filename}: ${error.message}`);
  }
}
if (!files.length) errors.push("attacks/: no YAML entries found");
if (errors.length) {
  console.error(
    `Catalog validation failed:\n${errors.map((error) => `  • ${error}`).join("\n")}`,
  );
  process.exitCode = 1;
} else
  console.log(`Validated ${files.length} attack entries against schema.yaml.`);
