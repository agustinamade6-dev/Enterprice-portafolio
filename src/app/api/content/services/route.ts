import { NextResponse } from "next/server";
import { contentRepo } from "@/lib/content";
import { BudgetTypeSchema } from "@/lib/content/schemas";
import { z } from "zod";

const ServicesPayloadSchema = z.object({
  types: z.array(BudgetTypeSchema),
  extras: z.array(z.string()),
  sectors: z.array(z.string()),
  times: z.array(z.string()),
});

export async function GET() {
  try {
    const [types, extras, sectors, times] = await Promise.all([
      contentRepo.getBudgetTypes(),
      contentRepo.getBudgetExtras(),
      contentRepo.getBudgetSectors(),
      contentRepo.getBudgetTimes(),
    ]);
    return NextResponse.json({ types, extras, sectors, times });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching services" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = ServicesPayloadSchema.parse(body);
    
    await Promise.all([
      contentRepo.updateBudgetTypes(validated.types),
      contentRepo.updateBudgetExtras(validated.extras),
      contentRepo.updateBudgetSectors(validated.sectors),
      contentRepo.updateBudgetTimes(validated.times),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
