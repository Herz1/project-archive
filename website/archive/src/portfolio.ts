import data from "../content/projects.json";
export const portfolio = data;
export const portfolioRoot = import.meta.env.BASE_URL.replace(/archive\/$/, "");
export const directoryUrl = portfolioRoot + "projects/";
export const initialProject = new URLSearchParams(location.search).get("project");
export function syncProjectAddress(repoId: number | null) {
  const url = new URL(location.href);
  if (repoId) url.searchParams.set("project", String(repoId));
  else url.searchParams.delete("project");
  history.replaceState(null, "", url);
}
export const dateLabel = (value: string) => new Intl.DateTimeFormat("zh-CN", { timeZone:"Asia/Singapore",year:"numeric",month:"2-digit",day:"2-digit" }).format(new Date(value));
