# Flujo de trabajo

## Ramas

| Rama | Para qué |
| --- | --- |
| `main` | El sitio que se publica. Todo lo que llega acá sale en la web |
| `efectos` | Los efectos de scroll en prueba. Se pasan a `main` con un merge cuando estén aprobados |

**Ojo al pasar `efectos` a `main`:** en `main` los efectos se sacaron con un commit que los deshace ("Pasar las animaciones de scroll a la rama efectos"). Por eso un merge directo da conflictos en `globals.css`, `layout.tsx` y `page.tsx`. Al resolverlos hay que quedarse con la versión de `efectos`. Y no hay que mergear `main` dentro de `efectos`, porque borraría los efectos: para traer cambios de `main` se usa `git cherry-pick`.

El repositorio es https://github.com/agustinamade6-dev/Enterprice-portafolio. José también sube cambios directo, así que antes de empezar siempre hay que traer lo último (`git pull`).

## Correrlo en la compu

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera el sitio estático en out/
npm run lint     # revisa el código
```

`C:\dev\portafolio` es una copia sin git que se va actualizando con cada cambio; mientras se prueban los efectos tiene la versión de la rama `efectos`. Para subir cambios a GitHub hay que hacerlo desde un clon con git.

## Antes de subir un cambio

1. `npm run build` y `npm run lint` sin errores.
2. Revisar en compu y en celular.
3. Actualizar el documento que corresponda en `docs/`.
4. Commit con un mensaje en español que diga qué cambia ("Sumar a Fabrizio al equipo…").

## Publicar (Cloudflare Pages)

1. Crear un proyecto en Cloudflare Pages conectado al repositorio.
2. Comando de build `npm run build`, carpeta de salida `out`, variable `NODE_VERSION=22`.
3. Cada cambio en `main` se publica solo.

Todavía no está confirmado que esté publicado. Cuando lo esté, cambiar `site.url` en `src/content/site.ts` por la dirección real.
