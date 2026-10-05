import type { NextConfig } from "next";

// STATIC_EXPORT=1 npm run build produces a fully static site in ./out
// (used for previews and static hosting). The default build keeps Next's
// image optimisation and the redirects from the original .html URLs.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStaticExport
  ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
  : {
      async redirects() {
        return [
          { source: "/tests/:slug.html", destination: "/tests/:slug", permanent: true },
          { source: "/index.html", destination: "/", permanent: true },
        ];
      },
    };

export default nextConfig;
