import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Sin clave propia no hay sesiones: una clave por defecto escrita en el código (público) permitiría
// a cualquiera fabricarse una sesión de admin. Debe tener al menos 32 caracteres.
const secretKey = process.env.SESSION_SECRET ?? "";
const hasSecret = secretKey.length >= 32;
const encodedKey = new TextEncoder().encode(secretKey);

// La sesión dura 8 horas y se renueva sola mientras se usa el panel (ver renewSession).
// Para cerrar TODAS las sesiones abiertas (por ejemplo si alguien vio la contraseña):
// correr `npm run crear-admin` de nuevo, que cambia SESSION_SECRET.
const SESSION_MS = 8 * 60 * 60 * 1000;
const RENEW_AFTER_MS = 60 * 60 * 1000;

export async function createSession(userId: string, role: string) {
  if (!hasSecret) throw new Error("Falta SESSION_SECRET (mínimo 32 caracteres) en .env.local");
  const expiresAt = new Date(Date.now() + SESSION_MS);
  const session = await encrypt({ userId, role, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "strict",
    path: "/",
  });
}

// Si la sesión tiene más de una hora, se emite una nueva por otras 8 horas
export async function renewSession() {
  const s = await getSession();
  if (!s) return null;
  const iat = (s as SessionPayload & { iat?: number }).iat;
  const issued = typeof iat === "number" ? iat * 1000 : 0;
  if (Date.now() - issued > RENEW_AFTER_MS) await createSession(s.userId, s.role);
  return s;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

type SessionPayload = {
  userId: string;
  role: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (!hasSecret) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
