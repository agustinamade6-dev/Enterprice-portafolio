import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { MemberSchema } from "@/lib/content/schemas";
import { z } from "zod";

export async function GET() {
  try {
    const team = await contentRepo.getTeam();
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = MemberSchema.parse(body);

    // Ensure slug doesn't exist
    const existing = await contentRepo.getMember(validatedData.slug);
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await contentRepo.createMember(validatedData);
    return NextResponse.json({ success: true, member: validatedData }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
