import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático: `npm run build` genera la carpeta `out/` lista para Cloudflare Pages.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
