import type { MetadataRoute } from "next";
import { projects, site, team } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    ...projects.flatMap((p) => (p.href ? [p.href] : [])),
    ...team.map((m) => `/equipo/${m.slug}/`),
  ];
  return pages.map((path) => ({ url: `${site.url}${path}` }));
}
