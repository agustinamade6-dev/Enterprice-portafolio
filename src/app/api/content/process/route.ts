import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { ProcessStepSchema } from "@/lib/content/schemas";
import { z } from "zod";

const ProcessPayloadSchema = z.object({
  steps: z.array(ProcessStepSchema),
  sprintLoop: z.array(z.string()),
});

export async function GET() {
  try {
    const [steps, sprintLoop] = await Promise.all([
      contentRepo.getProcessSteps(),
      contentRepo.getSprintLoop(),
    ]);
    return NextResponse.json({ steps, sprintLoop });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching process" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = ProcessPayloadSchema.parse(body);
    
    await Promise.all([
      contentRepo.updateProcessSteps(validated.steps),
      contentRepo.updateSprintLoop(validated.sprintLoop),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
