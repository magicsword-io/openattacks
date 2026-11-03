// Release only the reviewed Node lab files; never archive a working directory.
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  lstatSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, dirname, relative, sep } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const root = resolve(import.meta.dirname, "..");
execFileSync(
  process.execPath,
  [join(root, "scripts/build-simulations.mjs"), "--check"],
  { stdio: "pipe" },
);
const catalog = JSON.parse(
  readFileSync(join(root, "simulations/catalog.json"), "utf8"),
);
const files = [
  "simulations/lab.mjs",
  "simulations/lib/strict-json.mjs",
  "simulations/catalog.json",
  "simulations/LICENSE",
  "simulations/NOTICE",
  "docs/SIMULATION_VERIFICATION.md",
  "simulations/fixtures/LICENSE.txt",
  "simulations/fixtures/NOTICE.txt",
  ...catalog.simulations.flatMap((sim) => [
    `simulations/definitions/${sim.id}.yaml`,
    ...sim.fixtures.map((f) => `simulations/fixtures/${f.path}`),
  ]),
];
function bytesFor(name) {
  const source = resolve(root, name);
  if (relative(root, source).startsWith(`..${sep}`))
    throw new Error("Bundle path escapes source root");
  let current = root;
  for (const part of relative(root, source).split(sep)) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink())
      throw new Error("Bundle source links are prohibited");
  }
  const stat = lstatSync(source);
  if (
    !stat.isFile() ||
    stat.nlink !== 1 ||
    stat.size > 1024 * 1024 ||
    realpathSync(source) !== source
  )
    throw new Error("Unsafe bundle source");
  return readFileSync(source);
}
const temp = mkdtempSync(join(tmpdir(), "openattacks-bundle-"));
const output = join(root, "public/downloads");
try {
  const dir = join(temp, "openattacks-labs");
  mkdirSync(dir);
  const inventory = [];
  for (const name of files) {
    const bytes = bytesFor(name);
    const dest = join(dir, name);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, bytes);
    inventory.push({
      path: name,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      {
        name: "openattacks-labs",
        private: true,
        type: "module",
        engines: { node: ">=22.22.0" },
        scripts: { simulate: "node simulations/lab.mjs" },
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(join(dir, "README.md"), bytesFor("docs/SIMULATIONS.md"));
  mkdirSync(output, { recursive: true });
  const archive = join(output, "openattacks-labs.tar.gz");
  execFileSync("tar", ["-czf", archive, "-C", temp, "openattacks-labs"], {
    stdio: "pipe",
  });
  const bytes = readFileSync(archive);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  writeFileSync(
    join(output, "openattacks-labs.manifest.json"),
    JSON.stringify(
      {
        format: "openattacks-labs/v1",
        sha256,
        bytes: bytes.length,
        definition_count: catalog.simulations.length,
        files: inventory,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Lab bundle: ${bytes.length} bytes · SHA256 ${sha256}`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
