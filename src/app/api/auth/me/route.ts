import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { USERS } from "@/lib/auth/config";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = USERS.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Obmit passwordHash
  const { passwordHash, ...userWithoutPassword } = user;
  
  return NextResponse.json({ user: userWithoutPassword });
}
