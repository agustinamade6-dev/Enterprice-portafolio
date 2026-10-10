import { NextResponse } from "next/server";
import { mediaRepo } from "@/lib/content/media";
import { requireAdmin } from "@/lib/auth/guard";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const images = await mediaRepo.listImages();
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "No se pudieron leer las imágenes" }, { status: 500 });
  }
}
