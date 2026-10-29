import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep, dirname } from "node:path";
import { renderDirectory } from "./render-directory.mjs";
const root=fileURLToPath(new URL("../",import.meta.url)), website=resolve(root,"website"), output=resolve(website,"dist");
function run(args,cwd=root){
  const result=spawnSync(process.execPath,args,{cwd,stdio:"inherit",env:process.env});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
run(["scripts/derive-projects.mjs"]);
if(!process.argv.includes("--assemble-only")){
  // npm_execpath is provided by `npm run build:website`; no shell interpolation.
  const npm=process.env.npm_execpath;
  if(!npm)throw Error("Run npm run build:website (or pass --assemble-only after building both apps).");
  for(const app of ["intro","archive"])run([npm,"run","build"],resolve(website,app));
}
// Resolve and check the one disposable output directory before replacing it.
if(!output.startsWith(website+sep)||dirname(output)!==website||!output.endsWith(sep+"dist"))throw Error("Unsafe build output");
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(resolve(website,"intro/out"),output,{recursive:true});
await cp(resolve(website,"archive/dist"),resolve(output,"archive"),{recursive:true});
const data=JSON.parse(await readFile(resolve(website,"content/projects.generated.json"),"utf8"));
await mkdir(resolve(output,"projects"),{recursive:true});
await writeFile(resolve(output,"projects/index.html"),renderDirectory(data));
await cp(resolve(website,"directory/style.css"),resolve(output,"projects/directory.css"));
await cp(resolve(website,"directory/client.js"),resolve(output,"projects/directory.js"));
const fonts=await readFile(resolve(website,"archive/src/fonts.css"),"utf8");
await writeFile(resolve(output,"archive/assets/directory-fonts.css"),fonts.replaceAll('url("/fonts/',`url("${data.basePath}/archive/fonts/`));
await writeFile(resolve(output,"projects.json"),JSON.stringify(data,null,2)+"\n");
await writeFile(resolve(output,".nojekyll"),"");
await writeFile(resolve(output,"robots.txt"),`User-agent: *\nAllow: /\nSitemap: ${data.origin}${data.basePath}/sitemap.xml\n`);
await writeFile(resolve(output,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["","projects/","about/","archive/"].map(p=>`<url><loc>${data.origin}${data.basePath}/${p}</loc></url>`).join("")}</urlset>`);
console.log(`Static website assembled: ${data.counts.total} projects → website/dist (${data.basePath}/)`);
