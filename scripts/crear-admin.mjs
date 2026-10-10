// Crea (o reemplaza) el usuario del panel de admin y lo guarda directo en .env.local.
// Uso: npm run crear-admin   (pide correo y contraseña; después hay que reiniciar npm run dev)
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const email = (await rl.question("Correo para entrar al panel: ")).trim();
const password = await rl.question("Contraseña (mínimo 12 caracteres): ");
const name = (await rl.question("Nombre a mostrar (opcional): ")).trim();
rl.close();

if (!email.includes("@")) throw new Error("Ese correo no parece válido");
if (password.length < 12) throw new Error("La contraseña tiene que tener al menos 12 caracteres");

const hash = bcrypt.hashSync(password, 12);
const values = {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH_B64: Buffer.from(hash).toString("base64"),
  ADMIN_NAME: name || "Admin",
  SESSION_SECRET: randomBytes(32).toString("hex"),
};

// Se conservan las otras variables que ya hubiera en el archivo; solo se reemplazan estas cuatro
const file = resolve(process.cwd(), ".env.local");
const kept = existsSync(file)
  ? readFileSync(file, "utf8")
      .replace(/^﻿/, "")
      .split(/\r?\n/)
      .filter((line) => line.trim() && !Object.keys(values).some((k) => line.trim().startsWith(`${k}=`)))
  : [];
const lines = [...kept, ...Object.entries(values).map(([k, v]) => `${k}=${v}`)];
writeFileSync(file, lines.join("\n") + "\n", "utf8");

console.log(`\nListo: el usuario quedó guardado en ${file}`);
console.log("Reinicia npm run dev (Ctrl+C y de nuevo npm run dev) y entra a /admin con ese correo y contraseña.");
console.log("No subas .env.local a git (ya está ignorado) ni lo compartas.");
