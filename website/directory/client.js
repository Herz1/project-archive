// Enhance server-rendered project records. Source links work without JavaScript.
const projects=JSON.parse(document.querySelector("#project-data").textContent);
const records=document.querySelector("#records");
const elements=new Map([...records.children].map(el=>[Number(el.dataset.repo),el]));
const form=document.querySelector("form"), search=document.querySelector("#search"), language=document.querySelector("#language"), sort=document.querySelector("#sort");
const params=new URLSearchParams(location.search);
let category=params.get("category")||"";
if(!projects.some(p=>p.category===category)) category="";
search.value=params.get("q")||"";
language.value=params.get("language")||"";
sort.value=params.get("sort")||"archive";
if(!sort.value) sort.value="archive";
document.querySelectorAll("[data-enhance]").forEach(el=>el.hidden=false);
function render(){
  const query=search.value.trim().toLocaleLowerCase();
  let count=0;
  const sorted=[...projects].sort((a,b)=>sort.value==="updated"?b.pushedAt.localeCompare(a.pushedAt):sort.value==="stars"?b.stars-a.stars:sort.value==="name"?a.name.localeCompare(b.name):Number(a.archiveId.slice(2))-Number(b.archiveId.slice(2)));
  for(const p of sorted){
    const el=elements.get(p.id);
    const matches=(!category||p.category===category)&&(!language.value||p.language===language.value)&&(!query||[p.archiveId,p.name,p.displayName,p.summary,p.category,p.language,...p.tags].join(" ").toLocaleLowerCase().includes(query));
    el.hidden=!matches;
    if(matches)count++;
    records.append(el);
  }
  document.querySelector("#result-count").textContent=`${count} / ${projects.length} 个项目`;
  document.querySelector("#no-results").hidden=count!==0;
  document.querySelectorAll("[data-category]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.category===category)));
  const url=new URL(location.href);
  for(const [key,value] of Object.entries({q:search.value.trim(),category,language:language.value,sort:sort.value==="archive"?"":sort.value})) if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);
  history.replaceState(null,"",url);
}
function reset(){category="";search.value="";language.value="";sort.value="archive";render();}
form.addEventListener("submit",e=>e.preventDefault());
form.addEventListener("input",render);
form.addEventListener("change",render);
form.addEventListener("reset",e=>{e.preventDefault();reset();});
document.querySelector("#reset-empty").addEventListener("click",reset);
document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.category;render();}));
document.addEventListener("keydown",e=>{if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();search.focus();}if(e.key==="Escape"&&document.activeElement===search){search.value="";render();}});
render();
