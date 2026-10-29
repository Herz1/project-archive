// Coverage input for the adapted project landing, keeping the upstream contract.
import { copy } from "@/i18n";
import projects from "@/data/projects.json";
function strings(node: unknown): string[] {
  if(typeof node === "string")return [node];
  if(typeof node === "function")return strings((node as (...args:string[])=>unknown)("","",""));
  if(node && typeof node === "object")return Object.values(node).flatMap(strings);
  return [];
}
const unique=(parts:string[])=>[...new Set(parts.join("").replace(/\s/g,""))].sort().join("");
export const landingText=()=>unique([...strings(copy.app),...strings(copy.landing),...strings(projects),"全部项目进入档案GitHub↗0123456789"]);
// Shippori keeps Latin display lettering; new CJK names use Noto Serif SC fallback.
export const japaneseText=()=>unique(["Herz10123456789"]);
export const act0Text=()=>unique([copy.app.name,copy.app.description,copy.landing.disclaimer,"全部项目进入档案GitHub↗0123456789"]);
