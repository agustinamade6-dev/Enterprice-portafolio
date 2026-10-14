import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático: `npm run build` genera la carpeta `out/` lista para Cloudflare Pages.
  output: process.env.IS_STATIC_BUILD === "true" ? "export" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  // Encabezados de seguridad cuando la página corre con servidor (npm run dev / npm start).
  // La página publicada en Cloudflare usa public/_headers. El panel, además, no se indexa en Google.
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    ];
    const panel = [
      ...base,
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Cache-Control", value: "no-store" },
    ];
    return [
      { source: "/:path*", headers: [...base, { key: "X-Frame-Options", value: "SAMEORIGIN" }] },
      { source: "/admin/:path*", headers: panel },
      { source: "/admin", headers: panel },
      { source: "/api/:path*", headers: panel },
      // Lo que se sube desde el panel se sirve siempre como imagen descargable, nunca como página
      { source: "/uploads/:path*", headers: [...base, { key: "Content-Security-Policy", value: "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox" }] },
    ];
  },
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
