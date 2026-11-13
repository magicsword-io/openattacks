import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const cors = { "Access-Control-Allow-Origin": "*" };

/** Read a committed generator output. The site serves these bytes unchanged. */
export function generated(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

export function generatedNames(directory: string, extension: string) {
  return readdirSync(join(process.cwd(), directory))
    .filter((name) => name.endsWith(extension))
    .sort();
}
