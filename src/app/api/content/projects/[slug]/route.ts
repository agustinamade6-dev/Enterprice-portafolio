import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { ProjectSchema } from "@/lib/content/schemas";
import { z } from "zod";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = ProjectSchema.parse(body);

    // If slug changed, ensure new slug is available
    if (validatedData.slug !== resolvedParams.slug) {
      const existing = await contentRepo.getProject(validatedData.slug);
      if (existing) {
        return NextResponse.json({ error: "New slug already exists" }, { status: 400 });
      }
    }

    await contentRepo.updateProject(resolvedParams.slug, validatedData);
    return NextResponse.json({ success: true, project: validatedData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    await contentRepo.deleteProject(resolvedParams.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
