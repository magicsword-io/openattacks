import { readdirSync, readFileSync } from "node:fs";
import { parseDocument } from "yaml";
import { entryErrors, actorErrors, toolErrors } from "../src/lib/schema.mjs";

const attackFiles = readdirSync(new URL("../attacks", import.meta.url)).filter(
  (name) => /\.ya?ml$/.test(name),
);
const actorFiles = readdirSync(new URL("../actors", import.meta.url)).filter(
  (name) => /\.ya?ml$/.test(name),
);
const toolFiles = readdirSync(new URL("../tools", import.meta.url)).filter(
  (name) => /\.ya?ml$/.test(name),
);

const errors = [];
const attackIds = new Set();
const actorIds = new Set();
const toolIds = new Set();

// Validate attacks
for (const filename of attackFiles) {
  try {
    const document = parseDocument(
      readFileSync(new URL(`../attacks/${filename}`, import.meta.url), "utf8"),
      { uniqueKeys: true },
    );
    if (document.errors.length)
      throw new Error(document.errors.map((error) => error.message).join("; "));
    const data = document.toJS();
    errors.push(...entryErrors(data, filename));
    if (attackIds.has(data.id)) errors.push(`${filename}: duplicate id ${data.id}`);
    attackIds.add(data.id);
  } catch (error) {
    errors.push(`${filename}: ${error.message}`);
  }
}

// Validate actors
for (const filename of actorFiles) {
  try {
    const document = parseDocument(
      readFileSync(new URL(`../actors/${filename}`, import.meta.url), "utf8"),
      { uniqueKeys: true },
    );
    if (document.errors.length)
      throw new Error(document.errors.map((error) => error.message).join("; "));
    const data = document.toJS();
    errors.push(...actorErrors(data, filename).map((e) => `actors/${e}`));
    if (actorIds.has(data.id)) errors.push(`actors/${filename}: duplicate id ${data.id}`);
    actorIds.add(data.id);
  } catch (error) {
    errors.push(`actors/${filename}: ${error.message}`);
  }
}

// Validate tools
for (const filename of toolFiles) {
  try {
    const document = parseDocument(
      readFileSync(new URL(`../tools/${filename}`, import.meta.url), "utf8"),
      { uniqueKeys: true },
    );
    if (document.errors.length)
      throw new Error(document.errors.map((error) => error.message).join("; "));
    const data = document.toJS();
    errors.push(...toolErrors(data, filename).map((e) => `tools/${e}`));
    if (toolIds.has(data.id)) errors.push(`tools/${filename}: duplicate id ${data.id}`);
    toolIds.add(data.id);
  } catch (error) {
    errors.push(`tools/${filename}: ${error.message}`);
  }
}

if (!attackFiles.length) errors.push("attacks/: no YAML entries found");
if (!actorFiles.length) errors.push("actors/: no YAML entries found");
if (!toolFiles.length) errors.push("tools/: no YAML entries found");

if (errors.length) {
  console.error(
    `Catalog validation failed:\n${errors.map((error) => `  • ${error}`).join("\n")}`,
  );
  process.exitCode = 1;
} else
  console.log(
    `Validated ${attackFiles.length} attack entries, ${actorFiles.length} actor entries, and ${toolFiles.length} tool entries.`,
  );
