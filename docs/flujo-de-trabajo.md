# Flujo de trabajo

## Ramas

| Rama | Para qué |
| --- | --- |
| `main` | El sitio que se publica. Todo lo que llega acá sale en la web |
| `efectos` | Para probar efectos nuevos antes de pasarlos a `main` (los de scroll ya pasaron el 2026-10-09) |
| `admin` | La rama de Nicolás con el carrusel 3D y el panel de admin (unida a `main` el 2026-10-09) |

**Efectos pasados a `main` (2026-10-09):** se unió `efectos` a `main` dejando todo como estaba en `efectos` (`git merge -s ours` + `git read-tree -u --reset efectos`), porque `main` tenía un commit que deshacía los efectos y un merge común los habría vuelto a borrar. Desde ahí las dos ramas son iguales: se trabaja en `main`, y `efectos` queda para probar efectos nuevos antes de pasarlos.

El repositorio es https://github.com/agustinamade6-dev/Enterprice-portafolio. José también sube cambios directo, así que antes de empezar siempre hay que traer lo último (`git pull`).

## Correrlo en la compu

```bash
npm install
npm run dev            # http://localhost:3000 (sitio y panel de admin en /admin)
npm run build:export   # genera el sitio estático en out/ para publicar
npm run build          # build con servidor (sitio + panel de admin + API)
npm run lint           # revisa el código
```

**Entrar al panel de admin (cada uno en su compu):** el usuario no está en el código, porque el repositorio es público. Se corre `npm run crear-admin`, que pide correo y contraseña (mínimo 12 caracteres) y guarda solo cuatro variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH_B64`, `ADMIN_NAME`, `SESSION_SECRET`) en el archivo `.env.local` de la raíz del proyecto, que git ignora (si el archivo ya existe, conserva las demás variables). Después se reinicia `npm run dev` (Ctrl+C y de nuevo). Para cambiar la contraseña se vuelve a correr el mismo comando. Sin ese archivo nadie puede entrar. El usuario de ejemplo `admin@enterprice.com` ya no existe.

`C:\dev\portafolio` es una copia sin git que se va actualizando con cada cambio; tiene la versión de `main`. Para subir cambios a GitHub hay que hacerlo desde un clon con git.

## Antes de subir un cambio

1. `npm run build:export` sin errores (y `npm run build` si se tocó el panel). `npm run lint` sin errores nuevos.
2. Revisar en compu y en celular.
3. Actualizar el documento que corresponda en `docs/`.
4. Commit con un mensaje en español que diga qué cambia ("Sumar a Fabrizio al equipo…").

## Publicar (Cloudflare Pages)

1. Crear un proyecto en Cloudflare Pages conectado al repositorio.
2. Comando de build `npm run build:export`, carpeta de salida `out`, variable `NODE_VERSION=22`. El panel de admin no se publica: el build estático lo deja afuera.
3. Cada cambio en `main` se publica solo.

Todavía no está confirmado que esté publicado. Cuando lo esté, cambiar `site.url` en `src/content/site.ts` por la dirección real.
