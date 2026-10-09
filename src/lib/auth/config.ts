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

// Mock users for local development. In a real scenario, these come from a DB or env vars.
// The password for both is 'admin123'
// Generated with: require('bcryptjs').hashSync('admin123', 10)
export const USERS: User[] = [
  {
    id: "1",
    email: "admin@enterprice.com",
    passwordHash: "$2b$10$zw3//LjvhANF/Lewv9WVgeu27.m68558.m/Hv5jmdv/YQj0JuqGXe", 
    role: "superadmin",
    name: "Admin Principal",
  }
];

export async function getUser(email: string): Promise<User | undefined> {
  return USERS.find((u) => u.email === email);
}
