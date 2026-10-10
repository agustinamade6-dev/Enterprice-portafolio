import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/session";
import { sameOrigin } from "@/lib/auth/guard";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Pedido rechazado" }, { status: 403 });
  await deleteSession();
  return NextResponse.json({ success: true });
}
