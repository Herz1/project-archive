import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export async function verifyUpstream(root = skillRoot) {
  const manifest = JSON.parse(await readFile(join(root, "assets/upstream-manifest.json"), "utf8"));
  const expected = new Set();
  const results = [];
  for (const source of manifest.sources) {
    let files = 0, bytes = 0;
    for (const entry of manifest.files.filter(f => f.source === source.id)) {
      const key = source.id + "/" + entry.path;
      if (entry.path.split("/").includes("..") || entry.path.startsWith("/") || entry.path.includes("\\")) throw new Error("Unsafe manifest path: " + key);
      const data = await readFile(join(root, "assets/upstream", source.id, entry.path));
      const sha256 = createHash("sha256").update(data).digest("hex");
      const blob = createHash("sha1").update("blob " + data.length + "\0").update(data).digest("hex");
      if (data.length !== entry.bytes || sha256 !== entry.sha256 || blob !== entry.gitBlob) throw new Error("Modified upstream file: " + key);
      expected.add(key); files++; bytes += data.length;
    }
    if (files !== source.files || bytes !== source.bytes) throw new Error("Source summary mismatch: " + source.id);
    results.push({ source: source.id, commit: source.commit, files, bytes, unchanged: true });
  }
  async function walk(folder, prefix = "") {
    for (const item of await readdir(folder, { withFileTypes: true })) {
      const key = prefix + item.name;
      if (item.isDirectory()) await walk(join(folder, item.name), key + "/");
      else if (!item.isFile() || !expected.has(key)) throw new Error("Unexpected upstream entry: " + key);
    }
  }
  await walk(join(root, "assets/upstream"));
  return { status: "passed", sources: results, totalFiles: expected.size };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await verifyUpstream(), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
