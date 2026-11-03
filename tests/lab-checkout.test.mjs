import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  realpathSync,
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  readdirSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
test("a CRLF-default Git checkout preserves hashed lab bytes and runs without dependencies", (t) => {
  const temp = realpathSync(mkdtempSync(join(tmpdir(), "oa-checkout-")));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const source = join(temp, "source"),
    dest = join(temp, "checkout");
  mkdirSync(source);
  mkdirSync(dest);
  execFileSync("git", ["init", "-q", source]);
  cpSync(".gitattributes", join(source, ".gitattributes"));
  cpSync("simulations", join(source, "simulations"), { recursive: true });
  execFileSync("git", ["-C", source, "-c", "core.autocrlf=true", "add", "."]);
  execFileSync("git", [
    "-C",
    source,
    "-c",
    "core.autocrlf=true",
    "checkout-index",
    "--all",
    `--prefix=${dest.replaceAll("\\", "/")}/`,
  ]);
  let checked = 0;
  for (const relative of readdirSync("simulations", { recursive: true })) {
    const p = join("simulations", relative);
    if (statSync(p).isFile()) {
      assert.equal(sha(join(dest, p)), sha(p), p);
      checked++;
    }
  }
  assert(checked > 20);
  const cli = join(dest, "simulations/lab.mjs");
  const run = JSON.parse(
    execFileSync(
      process.execPath,
      [cli, "prepare", "mcp-tool-poisoning", "--clean"],
      { cwd: dest, encoding: "utf8" },
    ),
  );
  assert.equal(run.provider_started, false);
  execFileSync(process.execPath, [cli, "verify", run.recordPath], {
    cwd: dest,
  });
  execFileSync(process.execPath, [cli, "cleanup", run.recordPath], {
    cwd: dest,
  });
});
