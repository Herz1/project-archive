import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const upstream=resolve(root,".agents/skills/rhine-eidolon-preserve/assets/upstream");
const decoder=new TextDecoder("utf-8",{fatal:true});
const report={method:"Compare each selected original file with the same path in the website working copy. same-text-eol normalizes CRLF/LF only; adapted may include content-only edits. Not a line-percentage claim. Immutable original snapshot verification is separate.",sources:[]};
for(const [name,from,to] of [["Rhine", "rhine", "website/archive"],["Eidolon frontend","eidolon/frontend","website/intro"]]){
  const source=resolve(upstream,from),target=resolve(root,to),files=[];
  for(const path of await readdir(source,{recursive:true,withFileTypes:true})){
    if(!path.isFile())continue;
    const original=resolve(path.parentPath,path.name),rel=relative(source,original).replaceAll("\\","/");
    const a=await readFile(original);let status="not-copied";
    try{
      const b=await readFile(resolve(target,rel));
      if(a.equals(b))status="same-bytes";
      else{
        try{status=decoder.decode(a).replaceAll("\r\n","\n")===decoder.decode(b).replaceAll("\r\n","\n")?"same-text-eol":"adapted";}catch{status="adapted";}
      }
    }catch(error){if(error.code!=="ENOENT")throw error;}
    files.push({path:rel,status});
  }
  files.sort((a,b)=>a.path.localeCompare(b.path,"en"));
  const counts=Object.fromEntries(["same-bytes","same-text-eol","adapted","not-copied"].map(status=>[status,files.filter(f=>f.status===status).length]));
  report.sources.push({name,from,to,total:files.length,counts,files});
}
const output=resolve(root,"website/docs/preservation-report.json");
await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report.sources.map(({name,total,counts})=>({name,total,counts})),null,2));
