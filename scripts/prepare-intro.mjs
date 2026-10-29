import { cp, mkdir, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(repo, ".agents/skills/rhine-eidolon-preserve/assets/upstream/eidolon/frontend");
const target = join(repo, "website/intro");
try {
  if ((await readdir(target)).length) throw new Error("website/intro already contains files.");
} catch (error) { if (error.code !== "ENOENT") throw error; }
await mkdir(target, { recursive: true });
await cp(source, target, {
  recursive: true,
  filter(path) {
    const rel = relative(source, path).replaceAll("\\", "/");
    if (rel === "src/proxy.ts") return false;
    if (rel.startsWith("src/app/")) {
      const child = rel.slice("src/app/".length).split("/")[0];
      if (!["(landing)", "globals.css"].includes(child)) return false;
    }
    if (rel.startsWith("src/app/(landing)/opengraph-image")) return false;
    return true;
  },
});
console.log("Prepared original Eidolon frontend for the static project introduction.");
