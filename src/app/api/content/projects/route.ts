import { requireAdmin } from "@/lib/auth/guard";
import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { ProjectSchema } from "@/lib/content/schemas";
import { z } from "zod";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const projects = await contentRepo.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
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
      return NextResponse.json({ error: "Validation failed", details: error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Cambiar el orden: recibe { order: ["slug-1", "slug-2", ...] }
export async function PATCH(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { order } = z.object({ order: z.array(z.string().max(60)).max(200) }).parse(await request.json());
    await contentRepo.reorderProjects(order);
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof z.ZodError ? "Orden inválido" : error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
