import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { skillRoot, verifyUpstream } from "./verify-upstream.mjs";

export async function materialize(name, destination, root = skillRoot) {
  if (!["rhine", "eidolon"].includes(name)) throw new Error("Choose rhine or eidolon.");
  if (!destination) throw new Error("An explicit empty destination is required.");
  const target = resolve(destination);
  const inside = relative(resolve(root), target);
  const withinSkill = inside === "" || (!isAbsolute(inside) && inside !== ".." && !inside.startsWith(".." + sep));
  if (withinSkill) throw new Error("Destination must be outside the skill.");
  try {
    if ((await readdir(target)).length) throw new Error("Destination is not empty; no files were changed.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const verified = await verifyUpstream(root);
  await mkdir(target, { recursive: true });
  const source = join(root, "assets/upstream", name, ...(name === "eidolon" ? ["frontend"] : []));
  await cp(source, target, {
    recursive: true,
    filter: (path) => {
      if (name !== "eidolon") return true;
      const rel = relative(source, path).replaceAll("\\", "/");
      return rel !== "src/app/(app)" && rel !== "src/proxy.ts";
    },
  });
  const applied = [];
  if (name === "eidolon") {
    const adapter = join(root, "assets/adapters/eidolon");
    async function copy(from, to) {
      await mkdir(dirname(join(target, to)), { recursive: true });
      await cp(join(adapter, from), join(target, to));
      applied.push({ adapter: from, output: to });
    }
    await copy("page.tsx", "src/app/(landing)/page.tsx");
    await copy("page.tsx", "src/app/(landing)/about/page.tsx");
    await copy("landing.fixture.json", "src/fixtures/landing.json");
    await copy("providers-route.ts", "src/app/(landing)/api/auth/providers/route.ts");
    await copy("legal-page.tsx", "src/app/(landing)/privacy/page.tsx");
    await copy("legal-page.tsx", "src/app/(landing)/terms/page.tsx");
  }
  const provenance = {
    reference: name, commit: verified.sources.find(s => s.source === name).commit,
    immutableSourceVerified: true, visualComponentsRewritten: 0, applied,
    previewOnly: true,
    excludedRuntimePaths: name === "eidolon" ? ["src/app/(app)", "src/proxy.ts"] : [],
  };
  await writeFile(join(target, "reference-kit.json"), JSON.stringify(provenance, null, 2) + "\n");
  return { destination: target, ...provenance };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const name = process.argv[2], flag = process.argv.indexOf("--destination");
  try {
    if (flag < 0) throw new Error("Usage: materialize-reference.mjs rhine|eidolon --destination <empty-directory>");
    console.log(JSON.stringify(await materialize(name, process.argv[flag + 1]), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
