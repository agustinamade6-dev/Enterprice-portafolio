// Genera las líneas para .env.local con el usuario del panel de admin.
// Uso: npm run crear-admin   (pide correo y contraseña; no guarda nada por su cuenta)
import { randomBytes } from "node:crypto";
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
console.log("\nCopia estas líneas en el archivo .env.local (en la raíz del proyecto) y reinicia npm run dev:\n");
console.log(`ADMIN_EMAIL=${email}`);
console.log(`ADMIN_PASSWORD_HASH_B64=${Buffer.from(hash).toString("base64")}`);
if (name) console.log(`ADMIN_NAME=${name}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("hex")}`);
console.log("\nNo subas .env.local a git (ya está ignorado) ni lo compartas.");
