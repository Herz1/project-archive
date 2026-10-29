import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectData } from "./project-data.mjs";
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const content = join(repo, "website/content");
const snapshot = JSON.parse(await readFile(join(content, "repositories.generated.json"), "utf8"));
const curated = JSON.parse(await readFile(join(content, "projects.curated.json"), "utf8"));
const config = JSON.parse(await readFile(join(repo, "website/site.config.json"), "utf8"));
const data = projectData(snapshot,curated,config);
const { projects, categories } = data;
const records = projects.map(p => ({
  id:p.archiveId, repoId:p.id, title:p.displayName, en:p.name, department:p.language || "未指定语言",
  category:p.category, date:p.pushedAt.slice(0,10), lead:p.fullName,
  clearance:p.status, abstract:p.summary, findings:p.highlights, source:p.url,
  url:p.url, demo:p.demo, tags:p.tags, stars:p.stars, fork:p.fork, archived:p.archived,
  empty:p.empty, license:p.license, createdAt:p.createdAt, syncedAt:data.syncedAt,
}));
for (const [path,value] of [
  ["website/intro/src/data/projects.json",data],["website/archive/content/archives.json",{categories,columns:categories,records}],
  ["website/archive/content/projects.json",data],["website/content/projects.generated.json",data],
]) {
  const target=join(repo,path);await mkdir(dirname(target),{recursive:true});await writeFile(target,JSON.stringify(value,null,2)+"\n");
}
console.log("Derived " + projects.length + " projects in " + categories.length + " real categories.");
