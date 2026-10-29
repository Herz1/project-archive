import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export", basePath: "/project-archive", trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: "/project-archive" },
};
export default nextConfig;
