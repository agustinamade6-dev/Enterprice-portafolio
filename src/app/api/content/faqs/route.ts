import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { FaqSchema } from "@/lib/content/schemas";
import { z } from "zod";

export async function GET() {
  try {
    const faqs = await contentRepo.getFaqs();
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching faqs" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = z.array(FaqSchema).parse(body);
    
    await contentRepo.updateFaqs(validated);
    return NextResponse.json({ success: true, faqs: validated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
