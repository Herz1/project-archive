// Pure adapter: repository identity survives API order changes and filtering.
export function projectData(snapshot,curated,config){
  if(!snapshot.repositories?.length)throw Error("Refusing an empty project snapshot");
  const ids=new Set(),archiveIds=new Set();
  const projects=snapshot.repositories.map(r=>{
    if(!Number.isSafeInteger(r.id)||ids.has(r.id))throw Error("Invalid or duplicate repository id");
    ids.add(r.id);
    if(r.private||r.fullName?.split("/")[0].toLowerCase()!==config.owner.toLowerCase())throw Error("Only owner's public repositories are allowed");
    const c=curated[r.name]||{},archiveId=c.archiveId||"P-"+r.id;
    if(!/^P-\d+$/.test(archiveId)||archiveIds.has(archiveId))throw Error("Invalid or duplicate archive id");
    archiveIds.add(archiveId);
    const empty=r.empty??c.empty??false;
    const category=c.category||"开源与工具";
    if(!config.categories.includes(category))throw Error("Unknown project category");
    const source=new URL(r.url);
    if(source.protocol!=="https:"||source.hostname!=="github.com")throw Error("Invalid repository URL");
    if(c.demo&&new URL(c.demo).protocol!=="https:")throw Error("Demo must use HTTPS");
    return {...r,empty,archiveId,displayName:c.name||r.name,category,color:c.color||"#a7bacb",
      summary:c.summary||r.description||"尚未填写仓库简介。",tags:c.tags||r.topics||[],
      highlights:c.highlights||["源代码与项目说明以公开仓库为准。"],
      status:r.archived?"已归档":empty?"空仓库":c.status||(r.fork?"Fork":"公开项目"),
      featured:Boolean(c.featured),demo:c.demo||null,
      detailUrl:config.basePath+"/archive/?project="+r.id+"&scene=archive",
    };
  }).sort((a,b)=>Number(a.archiveId.slice(2))-Number(b.archiveId.slice(2)));
  const categories=config.categories.filter(c=>projects.some(p=>p.category===c));
  return {...config,syncedAt:snapshot.syncedAt,categories,projects,counts:{
    total:projects.length,forks:projects.filter(p=>p.fork).length,empty:projects.filter(p=>p.empty).length,
    archived:projects.filter(p=>p.archived).length,languages:new Set(projects.map(p=>p.language).filter(Boolean)).size,
  }};
}
