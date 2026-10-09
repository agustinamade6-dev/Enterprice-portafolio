import type { MetadataRoute } from "next";
import { contentRepo } from "@/lib/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await contentRepo.getSiteData();
  const projects = await contentRepo.getProjects();
  const team = await contentRepo.getTeam();

  const pages = [
    "/",
    ...projects.flatMap((p) => (p.href ? [p.href] : [])),
    ...team.map((m) => `/equipo/${m.slug}/`),
  ];
  return pages.map((path) => ({ url: `${site.url}${path}` }));
}
