import { NextResponse } from "next/server";
import { renewSession } from "@/lib/auth/session";
import { USERS } from "@/lib/auth/config";

export async function GET() {
  const session = await renewSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  const user = USERS.find((u) => u.id === session.userId);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  // Nunca se devuelve el hash de la contraseña
  return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });
}
