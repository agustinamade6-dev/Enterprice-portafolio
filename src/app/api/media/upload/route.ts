import { NextResponse } from "next/server";
import { MAX_UPLOAD_BYTES, UploadError, mediaRepo } from "@/lib/content/media";
import { requireAdmin } from "@/lib/auth/guard";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  // Corta antes de leer todo si el pedido ya dice que es demasiado grande
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "La imagen pesa más de 5 MB" }, { status: 413 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No se envió ninguna imagen" }, { status: 400 });

    const url = await mediaRepo.uploadImage(file);
    return NextResponse.json({ success: true, url }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Subida de imagen:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 });
  }
}
