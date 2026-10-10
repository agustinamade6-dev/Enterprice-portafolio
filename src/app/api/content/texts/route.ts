import { requireAdmin } from "@/lib/auth/guard";
import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { PageTextsSchema } from "@/lib/content/schemas";
import { z } from "zod";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json(await contentRepo.getPageTexts());
  } catch {
    return NextResponse.json({ error: "No se pudieron leer los textos" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const validated = PageTextsSchema.parse(await request.json());
    await contentRepo.updatePageTexts(validated);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
