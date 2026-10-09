import type { MetadataRoute } from "next";
import { contentRepo } from "@/lib/content";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await contentRepo.getSiteData();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
