import { readCatalog } from "./lib/catalog.mjs";

const { entries, errors } = readCatalog();
if (errors.length) {
  console.error(
    `Catalog validation failed:\n${errors.map((error) => `  • ${error}`).join("\n")}`,
  );
  process.exitCode = 1;
} else
  console.log(
    `Validated ${entries.length} attack entries against schema.yaml.`,
  );
