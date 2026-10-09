import { z } from "zod";

export const RoleSchema = z.enum(["superadmin", "admin", "editor"]);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  role: RoleSchema,
  name: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// El usuario del panel NO va en el código (el repositorio es público): sale de variables de entorno
// que cada uno pone en su archivo .env.local, que git ignora. Para generarlas: `npm run crear-admin`.
//   ADMIN_EMAIL              correo para entrar
//   ADMIN_PASSWORD_HASH_B64  la contraseña cifrada con bcrypt, en base64 (el "$" del hash rompe el .env)
//   ADMIN_NAME               nombre que se muestra (opcional)
// Si faltan, nadie puede entrar al panel.
function loadUsers(): User[] {
  const email = process.env.ADMIN_EMAIL?.trim();
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64?.trim();
  if (!email || !b64) return [];
  const passwordHash = Buffer.from(b64, "base64").toString("utf8");
  if (!passwordHash.startsWith("$2")) return [];
  return [{ id: "1", email, passwordHash, role: "superadmin", name: process.env.ADMIN_NAME?.trim() || "Admin" }];
}

export const USERS: User[] = loadUsers();

export async function getUser(email: string): Promise<User | undefined> {
  return USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}
