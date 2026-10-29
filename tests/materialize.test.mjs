import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { materialize } from "../.agents/skills/rhine-eidolon-preserve/scripts/materialize-reference.mjs";
import { verifyUpstream, skillRoot } from "../.agents/skills/rhine-eidolon-preserve/scripts/verify-upstream.mjs";
import { mkdir } from "node:fs/promises";

const repo = resolve(fileURLToPath(new URL("..", import.meta.url)));
await mkdir(join(repo, "work/tests"), { recursive: true });
test("materializes the real landing while retaining immutable shaders and offline data", async () => {
  const destination = await mkdtemp(join(repo, "work/tests/eidolon-"));
  const result = await materialize("eidolon", destination);
  assert.equal(result.visualComponentsRewritten, 0);
  const raw = await readFile(join(skillRoot, "assets/upstream/eidolon/frontend/src/app/(landing)/light.ts"));
  assert.deepEqual(await readFile(join(destination, "src/app/(landing)/light.ts")), raw);
  const fixture = JSON.parse(await readFile(join(destination, "src/fixtures/landing.json"), "utf8"));
  assert.equal(fixture.characters.length, 29);
  assert.ok(fixture.characters.every(c => c.stand === null && c.voxels_url === null && c.greeting?.audio_url == null));
  assert.ok((await readFile(join(destination, "src/app/(landing)/page.tsx"), "utf8")).includes("@/fixtures/landing.json"));
  assert.equal((await verifyUpstream()).totalFiles, 1506);
});
test("rejects populated destinations and the source tree without overwriting files", async () => {
  const destination = await mkdtemp(join(repo, "work/tests/occupied-"));
  await writeFile(join(destination, "existing.txt"), "keep me");
  await assert.rejects(materialize("rhine", destination), /not empty/);
  assert.equal(await readFile(join(destination, "existing.txt"), "utf8"), "keep me");
  await assert.rejects(materialize("rhine", join(skillRoot, "assets/new")), /outside the skill/);
});
