import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const cors = { "Access-Control-Allow-Origin": "*" };
const canonicalBase = "https://openattacks.ai/";

/** Read a committed generator output. The site serves these bytes unchanged. */
export function generated(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

/** Keep committed exports canonical while making alternate deployments self-contained. */
export function generatedForSite(path: string, publicBase: URL) {
  const base = publicBase.href.endsWith("/")
    ? publicBase.href
    : `${publicBase.href}/`;
  return generated(path).replaceAll(canonicalBase, base);
}

export function generatedNames(directory: string, extension: string) {
  return readdirSync(join(process.cwd(), directory))
    .filter((name) => name.endsWith(extension))
    .sort();
}
