# Flujo de trabajo

## Ramas

| Rama | Para qué |
| --- | --- |
| `main` | El sitio que se publica. Todo lo que llega acá sale en la web |
| `efectos` | Los efectos de scroll en prueba. Se pasan a `main` con un merge cuando estén aprobados |
| `admin` | La rama de Nicolás con el carrusel 3D y el panel de admin (unida a `main` el 2026-10-09) |

**Ojo al pasar `efectos` a `main`:** en `main` los efectos se sacaron con un commit que los deshace ("Pasar las animaciones de scroll a la rama efectos"). Por eso un merge directo da conflictos en `globals.css`, `layout.tsx` y `page.tsx`. Al resolverlos hay que quedarse con la versión de `efectos`. Y no hay que mergear `main` dentro de `efectos`, porque borraría los efectos: para traer cambios de `main` se usa `git cherry-pick`.

El repositorio es https://github.com/agustinamade6-dev/Enterprice-portafolio. José también sube cambios directo, así que antes de empezar siempre hay que traer lo último (`git pull`).

## Correrlo en la compu

```bash
npm install
npm run dev            # http://localhost:3000 (sitio y panel de admin en /admin)
npm run build:export   # genera el sitio estático en out/ para publicar
npm run build          # build con servidor (sitio + panel de admin + API)
npm run lint           # revisa el código
```

**Entrar al panel de admin (cada uno en su compu):** el usuario no está en el código, porque el repositorio es público. Se corre `npm run crear-admin`, que pide correo y contraseña (mínimo 12 caracteres) e imprime cuatro líneas (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH_B64`, `ADMIN_NAME`, `SESSION_SECRET`). Esas líneas van en un archivo `.env.local` en la raíz del proyecto, que git ignora; después se reinicia `npm run dev`. Sin ese archivo nadie puede entrar. El usuario de ejemplo `admin@enterprice.com` ya no existe.

`C:\dev\portafolio` es una copia sin git que se va actualizando con cada cambio; mientras se prueban los efectos tiene la versión de la rama `efectos`. Para subir cambios a GitHub hay que hacerlo desde un clon con git.

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
