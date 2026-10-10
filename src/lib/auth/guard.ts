import { NextResponse } from "next/server";
import { getSession } from "./session";

// Segunda barrera, además del middleware: cada ruta del panel vuelve a comprobar la sesión.
// Si un día el middleware falla o se saltea, las rutas que guardan o borran siguen cerradas.
// En las que cambian datos, además se rechazan pedidos que vienen de otra página (CSRF).
export async function requireAdmin(request?: Request) {
  if (request && request.method !== "GET" && request.method !== "HEAD" && !sameOrigin(request)) {
    return NextResponse.json({ error: "Pedido rechazado" }, { status: 403 });
  }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return null;
}

export function sameOrigin(request: Request) {
  // Los navegadores modernos mandan Sec-Fetch-Site; si no está, se compara Origin con Host
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
