// Publish skills/openattacks as a zip whose top folder is the skill name.
import { createHash } from "node:crypto";
import { lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { deflateRawSync } from "node:zlib";

const root = resolve(import.meta.dirname, "..");
const source = "skills/openattacks/SKILL.md";
const entryName = "openattacks/SKILL.md";
const output = join(root, "public/downloads/openattacks-skill.zip");

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1)
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function u16(value) {
  const bytes = Buffer.alloc(2);
  bytes.writeUInt16LE(value);
  return bytes;
}

function u32(value) {
  const bytes = Buffer.alloc(4);
  bytes.writeUInt32LE(value >>> 0);
  return bytes;
}

function zipStoredDeflated(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name);
    const data = deflateRawSync(file.data);
    const crc = crc32(file.data);
    const local = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(8),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(file.data.length),
      u16(name.length),
      u16(0),
      name,
      data,
    ]);
    const central = Buffer.concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(8),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(file.data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const centralDir = Buffer.concat(centrals);
  const end = Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralDir.length),
    u32(offset),
    u16(0),
  ]);
  return Buffer.concat([...locals, centralDir, end]);
}

function skillBytes() {
  const path = resolve(root, source);
  if (relative(root, path).startsWith(`..${sep}`))
    throw new Error("Skill path escapes the repository");
  let current = root;
  for (const part of relative(root, path).split(sep)) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink())
      throw new Error("Skill source links are prohibited");
  }
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.nlink !== 1 || realpathSync(path) !== path)
    throw new Error("Unsafe skill source");
  return readFileSync(path);
}

const bytes = skillBytes();
const archive = zipStoredDeflated([{ name: entryName, data: bytes }]);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, archive);
const sha256 = createHash("sha256").update(archive).digest("hex");
console.log(
  `Skill zip: ${archive.length} bytes · ${entryName} · SHA256 ${sha256}`,
);
