import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { SiteDataSchema } from "@/lib/content/schemas";
import { z } from "zod";

export async function GET() {
  try {
    const siteData = await contentRepo.getSiteData();
    return NextResponse.json(siteData);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching site data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = SiteDataSchema.parse(body);
    await contentRepo.updateSiteData(validatedData);
    return NextResponse.json({ success: true, siteData: validatedData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
