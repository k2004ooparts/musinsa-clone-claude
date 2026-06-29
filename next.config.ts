import type { NextConfig } from "next";

// GitHub Pages는 https://<user>.github.io/<repo>/ 하위 경로로 서빙되므로
// 배포 빌드(GHPAGES=1)에서만 basePath를 붙인다.
const isGhPages = process.env.GHPAGES === "1";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGhPages ? "/musinsa-clone-claude" : "",
};

export default nextConfig;
