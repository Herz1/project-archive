export const siteBase = process.env.NEXT_PUBLIC_BASE_PATH || "/project-archive";
export const sitePath = (path: string) => siteBase + "/" + path.replace(/^\//, "");
