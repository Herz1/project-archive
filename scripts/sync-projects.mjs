import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(repo, "website/content/repositories.generated.json");
const owner = "Herz1";
const all = [];
const fromIndex = process.argv.indexOf("--from-file");
const fromFile = fromIndex >= 0 ? resolve(process.argv[fromIndex + 1]) : null;
const localRows = fromFile ? JSON.parse(await readFile(fromFile, "utf8").then(s => s.replace(/^\uFEFF/, ""))) : null;
for (let page = 1; ; page++) {
  let rows;
  if (localRows) rows = localRows;
  else {
  const response = await fetch("https://api.github.com/users/" + owner + "/repos?type=owner&sort=full_name&per_page=100&page=" + page, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "Herz1-Project-Archive", ...(process.env.GITHUB_TOKEN ? { Authorization: "Bearer " + process.env.GITHUB_TOKEN } : {}) },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("GitHub returned " + response.status + "; existing snapshot retained.");
  rows = await response.json();
  }
  if (!Array.isArray(rows)) throw new Error("Invalid repository response; existing snapshot retained.");
  for (const r of rows) if (!r.private && (typeof r.owner === "string" ? r.owner : r.owner?.login)?.toLowerCase() === owner.toLowerCase()) all.push({
    id:r.id, nodeId:r.node_id, name:r.name, fullName:r.full_name, description:r.description,
    url:r.html_url, homepage:r.homepage || null, fork:r.fork, archived:r.archived,
    language:r.language, topics:r.topics || [], stars:r.stargazers_count, forks:r.forks_count,
    size:r.size, defaultBranch:r.default_branch, createdAt:r.created_at, pushedAt:r.pushed_at,
    updatedAt:r.updated_at, license:(typeof r.license === "string" ? r.license : r.license?.spdx_id) || null,
  });
  if (localRows || rows.length < 100) break;
  if (page >= 100) throw new Error("Pagination limit exceeded; existing snapshot retained.");
}
if (!all.length) throw new Error("Empty repository response; existing snapshot retained.");
// Repository size is rounded KiB, not an empty-repository flag (a README can be 0).
// GitHub's commits endpoint returns 409 only for a truly empty Git repository.
for (const r of all) {
  if (r.size > 0) { r.empty = false; continue; }
  if (fromFile) continue; // the editorial layer carries the already verified state
  const response = await fetch(`https://api.github.com/repos/${owner}/${encodeURIComponent(r.name)}/commits?per_page=1`, {
    headers:{Accept:"application/vnd.github+json", "User-Agent":"Herz1-Project-Archive", ...(process.env.GITHUB_TOKEN ? {Authorization:"Bearer "+process.env.GITHUB_TOKEN}: {})},
    signal:AbortSignal.timeout(30000),
  });
  if (response.status === 409) r.empty=true;
  else if (response.ok) r.empty=false;
  else throw Error(`Cannot verify repository state for ${r.name}: ${response.status}; existing snapshot retained.`);
}
await writeFile(output, JSON.stringify({ owner, syncedAt:fromFile ? (await stat(fromFile)).mtime.toISOString() : new Date().toISOString(), source:"GitHub REST /users/Herz1/repos (public, owner)", repositories:all }, null, 2) + "\n");
console.log("Synced " + all.length + " public repositories; private data excluded.");
