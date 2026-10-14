/**
 * Utilidades de seguridad para validación y sanitización de URLs y enlaces externos.
 * Previene vulnerabilidades comunes como Cross-Site Scripting (XSS) vía javascript:,
 * phishing mediante data:/vbscript:, Open Redirects y Reverse Tabnabbing.
 */

const DANGEROUS_PROTOCOLS = new Set([
  "javascript:",
  "data:",
  "vbscript:",
  "file:",
  "blob:",
]);

/**
 * Valida de forma estricta que una URL externa sea segura.
 * - Utiliza el constructor nativo `new URL()` para análisis canónico.
 * - Permite únicamente protocolo 'https:' (o 'http:' exclusivamente en entorno local o localhost).
 * - Bloquea de inmediato protocolos peligrosos (javascript:, data:, vbscript:, etc.).
 * - Requiere un hostname válido y no vacío.
 */
export function isValidExternalUrl(urlString: unknown): boolean {
  if (typeof urlString !== "string") return false;
  const trimmed = urlString.trim();
  if (!trimmed) return false;

  // Verificación previa de prefijos maliciosos
  const lower = trimmed.toLowerCase();
  for (const dangerous of DANGEROUS_PROTOCOLS) {
    if (lower.startsWith(dangerous)) {
      return false;
    }
  }

  // Prevenir trucos de evasión con caracteres de control antes del esquema
  if (/^[\s\u0000-\u001f]*(javascript|data|vbscript|file|blob):/i.test(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);

    // Bloqueo explícito de protocolos peligrosos parseados
    if (DANGEROUS_PROTOCOLS.has(parsed.protocol.toLowerCase())) {
      return false;
    }

    // Hostname obligatorio
    if (!parsed.hostname || parsed.hostname.trim() === "") {
      return false;
    }

    const isLocalHost =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "[::1]" ||
      parsed.hostname.endsWith(".localhost");

    const isDev = process.env.NODE_ENV !== "production";

    // Permitir https: siempre que sea válido
    if (parsed.protocol === "https:") {
      return true;
    }

    // Permitir http: solo en entorno local de desarrollo o dominios localhost
    if (parsed.protocol === "http:" && (isDev || isLocalHost)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Valida que una URL interna sea una ruta relativa segura (/ruta).
 * Rechaza URLs con doble barra inicial (//dominio.com) para evitar open redirects.
 */
export function isSafeInternalUrl(path: unknown): boolean {
  if (typeof path !== "string") return false;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return false;
  // Prevenir protocol-relative URLs como //attacker.com
  if (trimmed.startsWith("//")) return false;
  // Prevenir barras invertidas que puedan ser interpretadas como delimitadores en Windows/navegadores
  if (trimmed.includes("\\")) return false;
  return true;
}

/**
 * Valida si un enlace de proyecto es seguro (ruta interna segura o URL externa válida).
 */
export function isSafeProjectUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) {
    return isSafeInternalUrl(trimmed);
  }
  return isValidExternalUrl(trimmed);
}

/**
 * Atributos de seguridad recomendados para enlaces externos con target="_blank".
 * Previene Reverse Tabnabbing (rel="noopener noreferrer") y limita la fuga de Referer.
 */
export const EXTERNAL_LINK_SECURITY_PROPS = {
  target: "_blank" as const,
  rel: "noopener noreferrer",
  referrerPolicy: "strict-origin-when-cross-origin" as const,
};
