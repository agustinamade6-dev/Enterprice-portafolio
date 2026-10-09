import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { ProjectSchema } from "@/lib/content/schemas";
import { z } from "zod";

export async function GET() {
  try {
    const projects = await contentRepo.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = ProjectSchema.parse(body);

    // Ensure slug doesn't exist
    const existing = await contentRepo.getProject(validatedData.slug);
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await contentRepo.createProject(validatedData);
    return NextResponse.json({ success: true, project: validatedData }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
