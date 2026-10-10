// Límite de intentos de login, en memoria (el panel corre en un solo servidor: la PC de cada uno).
// Después de MAX intentos fallidos en la ventana, se bloquea esa clave por BLOCK_MS.
const MAX = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

type Entry = { fails: number; first: number; blockedUntil: number };
const store = new Map<string, Entry>();

export function isBlocked(key: string) {
  const e = store.get(key);
  if (!e) return 0;
  const now = Date.now();
  if (e.blockedUntil > now) return e.blockedUntil - now;
  if (now - e.first > WINDOW_MS) store.delete(key);
  return 0;
}

export function registerFail(key: string) {
  const now = Date.now();
  const e = store.get(key);
  if (!e || now - e.first > WINDOW_MS) {
    store.set(key, { fails: 1, first: now, blockedUntil: 0 });
    return;
  }
  e.fails += 1;
  if (e.fails >= MAX) e.blockedUntil = now + BLOCK_MS;
}

export function clearFails(key: string) {
  store.delete(key);
}
