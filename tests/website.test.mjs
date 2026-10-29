import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { projectData } from "../scripts/project-data.mjs";
import { renderDirectory } from "../scripts/render-directory.mjs";
import { validateContent } from "../website/archive/scripts/archive-content.mjs";
import { fileAtCell, selectionCell } from "../website/archive/src/archive-loop.ts";
import { records, archiveColumns, columnFiles, fileLocation } from "../website/archive/src/data.ts";
const read=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),"utf8"));
const snapshot=await read("../website/content/repositories.generated.json");
const curated=await read("../website/content/projects.curated.json");
const config=await read("../website/site.config.json");
const data=projectData(snapshot,curated,config);

test("every public repository is represented exactly once with stable deep links",()=>{
  assert.equal(data.projects.length,snapshot.repositories.length);
  const reversed=projectData({...snapshot,repositories:[...snapshot.repositories].reverse()},curated,config);
  assert.deepEqual(data,reversed);
  for(const p of data.projects){
    assert.ok(p.url.startsWith(`https://github.com/${config.owner}/`));
    assert.equal(new URL(p.detailUrl,"https://example.test").searchParams.get("project"),String(p.id));
  }
});
test("new repositories are included and empty categories disappear without padding",()=>{
  const seed={...snapshot.repositories[0],id:999000001,name:"new-project",fullName:"Herz1/new-project",url:"https://github.com/Herz1/new-project"};
  const next=projectData({...snapshot,repositories:[seed]},curated,config);
  assert.equal(next.projects.length,1);
  assert.equal(next.projects[0].archiveId,"P-999000001");
  assert.deepEqual(next.categories,["开源与工具"]);
});
test("private and foreign repositories, duplicate IDs and empty responses are rejected",()=>{
  const first=snapshot.repositories[0];
  assert.throws(()=>projectData({...snapshot,repositories:[{...first,private:true}]},curated,config),/public/);
  assert.throws(()=>projectData({...snapshot,repositories:[{...first,fullName:"someone/other"}]},curated,config),/public/);
  assert.throws(()=>projectData({...snapshot,repositories:[first,first]},curated,config),/duplicate/);
  assert.throws(()=>projectData({...snapshot,repositories:[]},curated,config),/empty/);
});
test("a rounded zero-KiB README repository is not falsely labelled empty",()=>{
  const p=data.projects.find(p=>p.name==="tihu-artist");
  if(p){assert.equal(p.empty,false);assert.notEqual(p.status,"空仓库");}
  const fork=data.projects.find(p=>p.name==="hexo-theme-sungod");
  if(fork){assert.equal(fork.fork,true);assert.equal(fork.demo,null);}
});
test("archive content accepts real unequal categories and refuses duplicate identities",async()=>{
  const content=await read("../website/archive/content/archives.json");
  assert.equal(validateContent(content),content);
  const short={...content,categories:[content.records[0].category],columns:[content.records[0].category],records:[content.records[0]]};
  assert.equal(validateContent(short).records.length,1);
  assert.throws(()=>validateContent({...short,records:[short.records[0],short.records[0]]}),/duplicate/);
});
test("unbounded glass navigation keeps each selected project across unequal-length categories",()=>{
  for(let lane=0;lane<archiveColumns.length;lane++){
    const files=columnFiles(lane);
    for(let row=-45;row<80;row++){
      const expected=files[((row-12)%files.length+files.length)%files.length];
      assert.equal(fileAtCell({lane:lane+archiveColumns.length*20,row}),expected);
    }
    for(const index of files){
      const cell=selectionCell(index,{lane:lane+100*archiveColumns.length,row:500});
      assert.equal(fileAtCell(cell),index);
      assert.equal(fileAtCell(fileLocation(index)),index);
    }
  }
});
test("lightweight directory contains every standard source link and escapes editorial text",()=>{
  const html=renderDirectory(data);
  for(const p of data.projects){assert.ok(html.includes(`id="repo-${p.id}"`));assert.ok(html.includes(`href="${p.url}"`));}
  assert.equal((html.match(/class="record"/g)||[]).length,data.projects.length);
  const injection=renderDirectory({...data,projects:[{...data.projects[0],displayName:'<script>alert("x")</script>'}]});
  assert.ok(injection.includes("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"));
  assert.ok(!injection.includes('<script>alert("x")</script>'));
});
test("built HTML asset URLs remain inside the GitHub Pages project base",async()=>{
  // Run after build; includes Next's hashed assets and the independent Vite app.
  for(const route of ["index.html","about/index.html","projects/index.html","archive/index.html"]){
    const html=await readFile(new URL("../website/dist/"+route,import.meta.url),"utf8");
    for(const [,asset]of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]+)/g)){
      assert.ok(asset.startsWith(config.basePath+"/"),`${route} leaks root path ${asset}`);
      const relative=decodeURIComponent(asset.slice(config.basePath.length+1));
      if(relative.endsWith("/"))await access(new URL("../website/dist/"+relative+"index.html",import.meta.url));
      else await access(new URL("../website/dist/"+relative,import.meta.url));
    }
  }
  await access(new URL("../website/dist/.nojekyll",import.meta.url));
});
