import fs from "node:fs/promises";
const text = value => typeof value === "string" && value.trim().length > 0;
export function validateContent(content) {
  const errors = [];
  for (const key of ["categories", "columns"]) {
    if (!Array.isArray(content?.[key]) || !content[key].length || !content[key].every(text) || new Set(content[key]).size !== content[key].length) errors.push(`${key}: categories must be nonempty and unique`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  if (content.categories.length !== content.columns.length || content.categories.some(c => !content.columns.includes(c))) errors.push("categories and columns must match");
  const records = content.records;
  if (!Array.isArray(records) || !records.length) throw new Error("At least one real project is required");
  const ids = new Set(), repos = new Set();
  for (const r of records) {
    for (const k of ["id","title","en","department","category","date","lead","clearance","abstract","source"]) if (!text(r[k])) errors.push(`Missing ${r.id}.${k}`);
    if (!/^P-\d+$/.test(r.id) || ids.has(r.id)) errors.push(`Invalid/duplicate archive ID: ${r.id}`);
    ids.add(r.id);
    if (!Number.isSafeInteger(r.repoId) || repos.has(r.repoId)) errors.push(`Invalid/duplicate repository ID: ${r.repoId}`);
    repos.add(r.repoId);
    if (!content.categories.includes(r.category)) errors.push(`Unknown category: ${r.category}`);
    if (!Array.isArray(r.findings) || !r.findings.length || !r.findings.every(text)) errors.push(`Missing notes for ${r.id}`);
    try { const url = new URL(r.source); if (url.protocol !== "https:" || url.hostname !== "github.com") throw Error(); } catch { errors.push(`Invalid repository URL: ${r.id}`); }
    if (r.demo) { try { if (new URL(r.demo).protocol !== "https:") throw Error(); } catch { errors.push(`Invalid demo: ${r.id}`); } }
  }
  for (const category of content.columns) if (!records.some(r => r.category === category)) errors.push(`Empty category: ${category}`);
  if (errors.length) throw new Error(errors.join("\n"));
  return content;
}
export async function loadContent() { return validateContent(JSON.parse(await fs.readFile(new URL("../content/archives.json", import.meta.url), "utf8"))); }
export function archiveText(r) {
  return `\uFEFFHERZ1 · PUBLIC PROJECT ARCHIVE\n${r.id} / ${r.title}\n${r.en}\n\n语言：${r.department}\n最近推送：${r.date}\n仓库：${r.lead}\n状态：${r.clearance}${r.fork ? " · Fork" : ""}\n\n${r.abstract}\n\n项目说明\n${r.findings.map((f,i) => `${i+1}. ${f}`).join("\n")}\n\n源码：${r.source}\n${r.demo ? `在线演示：${r.demo}\n` : ""}\n公开数据同步：${r.syncedAt}\n`;
}
