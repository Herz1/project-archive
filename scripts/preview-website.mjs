import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root=fileURLToPath(new URL("../website/dist/",import.meta.url));
const {basePath}=JSON.parse(await readFile(new URL("../website/site.config.json",import.meta.url),"utf8"));
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".txt":"text/plain; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".woff2":"font/woff2",".gltf":"model/gltf+json",".glb":"model/gltf-binary",".ogg":"audio/ogg",".mp3":"audio/mpeg",".xml":"application/xml",".pdf":"application/pdf",".webmanifest":"application/manifest+json"};
createServer(async(req,res)=>{
  try{
    const path=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    if(path==="/"||path===basePath){res.writeHead(302,{Location:basePath+"/"}).end();return;}
    if(!path.startsWith(basePath+"/")){res.writeHead(404).end("Not found");return;}
    let target=resolve(root,path.slice(basePath.length+1)||"index.html");
    if(!target.startsWith(resolve(root)+sep)){res.writeHead(403).end();return;}
    if((await stat(target)).isDirectory())target=resolve(target,"index.html");
    const body=await readFile(target);
    res.writeHead(200,{"Content-Type":mime[extname(target)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(req.method==="HEAD"?undefined:body);
  }catch{res.writeHead(404).end("Not found");}
}).listen(Number(process.env.PORT||4173),"127.0.0.1",()=>console.log(`Portfolio preview http://127.0.0.1:${process.env.PORT||4173}${basePath}/`));
