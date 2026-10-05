import type { NextConfig } from "next";

// STATIC_EXPORT=1 npm run build produces a fully static site in ./out
// (used for previews and static hosting). The default build keeps Next's
// image optimisation and the redirects from the original .html URLs.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStaticExport
  ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
  : {
      // Lets phones and tablets on the same Wi-Fi load the dev server.
      allowedDevOrigins: ["10.0.0.116", "Owens-MacBook-Pro.local", "*.local"],
      async redirects() {
        return [
          { source: "/tests/:slug.html", destination: "/tests/:slug", permanent: true },
          { source: "/index.html", destination: "/", permanent: true },
        ];
      },
    };

export default nextConfig;
