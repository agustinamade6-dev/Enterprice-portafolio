import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUser } from "@/lib/auth/config";
import { createSession } from "@/lib/auth/session";
import { sameOrigin } from "@/lib/auth/guard";
import { clearFails, isBlocked, registerFail } from "@/lib/auth/rateLimit";

// Hash de una contraseña que no existe: si el correo no está, igual se compara contra esto,
// así la respuesta tarda lo mismo y no deja adivinar qué correos son válidos.
let dummyHash = "";
const getDummyHash = () => (dummyHash ||= bcrypt.hashSync(crypto.randomUUID(), 12));

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Pedido rechazado" }, { status: 403 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  let email = "";
  let password = "";
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
    password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }
  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
  }

  // Bloqueo por IP y por correo: frena a quien prueba contraseñas sin parar
  const keys = [`ip:${ip}`, `mail:${email}`];
  const wait = Math.max(...keys.map(isBlocked));
  if (wait > 0) {
    const min = Math.ceil(wait / 60000);
    return NextResponse.json(
      { error: `Demasiados intentos. Prueba de nuevo en ${min} minuto${min === 1 ? "" : "s"}.` },
      { status: 429, headers: { "Retry-After": String(Math.ceil(wait / 1000)) } },
    );
  }

  try {
    const user = await getUser(email);
    const ok = await bcrypt.compare(password, user?.passwordHash ?? getDummyHash());
    if (!user || !ok) {
      keys.forEach(registerFail);
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }
    keys.forEach(clearFails);
    await createSession(user.id, user.role);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login del panel:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
