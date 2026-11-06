import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";

// Same file set as `npm run format:data:check`. Simulation definitions are
// excluded on purpose: build-simulations.mjs hashes their exact bytes.
const root = new URL("../", import.meta.url);
const dataFiles = [
  ...readdirSync(new URL("attacks/", root))
    .filter((name) => name.endsWith(".yaml"))
    .map((name) => `attacks/${name}`),
  "schema.yaml",
];

const isFormatted = async (path, source) => {
  const filepath = fileURLToPath(new URL(path, root));
  const options = await prettier.resolveConfig(filepath);
  assert.ok(options, `${path}: no Prettier config resolved`);
  return prettier.check(source, { ...options, filepath });
};

test("catalog YAML files are formatted with Prettier", async () => {
  const unformatted = [];
  for (const path of dataFiles) {
    const source = readFileSync(new URL(path, root), "utf8");
    if (!(await isFormatted(path, source))) unformatted.push(path);
  }
  assert.deepEqual(
    unformatted,
    [],
    `Run \`npm run format:data\` to fix: ${unformatted.join(", ")}`,
  );
});

test("the formatting check rejects badly formatted YAML", async () => {
  const bad = "id:    example\nsources:\n    - url: https://example.org\n";
  assert.equal(await isFormatted("attacks/example.yaml", bad), false);
  const good = await prettier.format(bad, {
    ...(await prettier.resolveConfig(
      fileURLToPath(new URL("attacks/example.yaml", root)),
    )),
    filepath: "attacks/example.yaml",
  });
  assert.equal(await isFormatted("attacks/example.yaml", good), true);
});
