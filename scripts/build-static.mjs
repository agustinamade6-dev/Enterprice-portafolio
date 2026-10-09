// Genera el sitio estático (carpeta out/) para Cloudflare Pages.
// El panel de admin y la API necesitan un servidor, así que durante este build se apartan:
// las carpetas que empiezan con "_" quedan fuera de las rutas de Next. Al terminar se restauran siempre.
import { execSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";

const aside = [
  ["src/app/admin", "src/app/_admin"],
  ["src/app/api", "src/app/_api"],
  ["src/middleware.ts", "src/middleware.ts.off"],
];

// Los tipos que deja `npm run dev` nombran las rutas del panel; con el panel apartado rompen el chequeo
// de TypeScript. Se borran (dev los vuelve a generar solo).
rmSync(".next/dev/types", { recursive: true, force: true });

const moved = [];
try {
  for (const [from, to] of aside) {
    if (existsSync(from)) {
      renameSync(from, to);
      moved.push([from, to]);
    }
  }
  execSync("next build", { stdio: "inherit", env: { ...process.env, IS_STATIC_BUILD: "true" } });
} finally {
  for (const [from, to] of moved.reverse()) renameSync(to, from);
}
