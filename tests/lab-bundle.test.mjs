import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  realpathSync,
  cpSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
function sandbox(t) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "oa-bundle-test-")));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const p of ["simulations", "attacks", "docs"])
    cpSync(p, join(root, p), { recursive: true });
  mkdirSync(join(root, "scripts"));
  for (const p of ["build-simulations.mjs", "build-lab-bundle.mjs"])
    cpSync(join("scripts", p), join(root, "scripts", p));
  writeFileSync(join(root, "package.json"), '{"type":"module"}');
  symlinkSync(
    realpathSync("node_modules"),
    join(root, "node_modules"),
    "junction",
  );
  return root;
}
function build(root) {
  return execFileSync(
    process.execPath,
    [join(root, "scripts/build-lab-bundle.mjs")],
    { cwd: root, encoding: "utf8" },
  );
}
test("archive excludes extra files, preserves notices and has an exact digest inventory", (t) => {
  const root = sandbox(t);
  writeFileSync(join(root, "simulations/.env"), "SYNTHETIC-DO-NOT-PUBLISH");
  writeFileSync(
    join(root, "simulations/AGENTS.md"),
    "SYNTHETIC-ACTIVE-INSTRUCTION",
  );
  build(root);
  const file = join(root, "public/downloads/openattacks-labs.tar.gz");
  const names = execFileSync("tar", ["-tzf", file], { encoding: "utf8" });
  assert(!names.includes(".env"));
  assert(!names.includes("AGENTS.md"));
  assert(names.includes("simulations/LICENSE"));
  assert(names.includes("simulations/fixtures/NOTICE.txt"));
  assert(names.includes("docs/SIMULATION_VERIFICATION.md"));
  assert(!names.includes("node_modules"));
  const manifest = JSON.parse(
    readFileSync(join(root, "public/downloads/openattacks-labs.manifest.json")),
  );
  assert.equal(
    manifest.sha256,
    createHash("sha256").update(readFileSync(file)).digest("hex"),
  );
  assert.equal(manifest.definition_count, 7);
  for (const item of manifest.files)
    assert.equal(
      item.sha256,
      createHash("sha256")
        .update(readFileSync(join(root, item.path)))
        .digest("hex"),
    );
});
test("archive builder refuses symlink source and stale catalog", (t) => {
  const root = sandbox(t);
  const file = join(root, "simulations/LICENSE");
  unlinkSync(file);
  symlinkSync(realpathSync("simulations/LICENSE"), file);
  assert.throws(() => build(root), /Bundle source links/);
  unlinkSync(file);
  cpSync("simulations/LICENSE", file);
  writeFileSync(join(root, "simulations/catalog.json"), "{}");
  assert.throws(() => build(root), /drift/);
});
