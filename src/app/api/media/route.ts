import { NextResponse } from "next/server";
import { mediaRepo } from "@/lib/content/media";

export async function GET() {
  try {
    const images = await mediaRepo.listImages();
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
