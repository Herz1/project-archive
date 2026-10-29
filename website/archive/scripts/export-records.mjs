import fs from "node:fs/promises";
import { loadContent, archiveText } from "./archive-content.mjs";
const { records } = await loadContent();
const output = new URL("../public/archives/", import.meta.url);
await fs.mkdir(output, { recursive:true });
const wanted = new Set(records.map(r => `HERZ1-${r.id}.txt`));
// Only prune generated record text in this known output directory.
for (const name of await fs.readdir(output)) if (/^(RHINE-LAB-|HERZ1-).+\.txt$/.test(name) && !wanted.has(name)) await fs.unlink(new URL(name,output));
for (const record of records) await fs.writeFile(new URL(`HERZ1-${record.id}.txt`,output),archiveText(record),"utf8");
console.log(`Prepared ${records.length} real project downloads.`);
