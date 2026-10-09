import type { MetadataRoute } from "next";
import { projects, site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...projects.flatMap((p) => (p.href ? [p.href] : []))];
  return pages.map((path) => ({ url: `${site.url}${path}` }));
}
