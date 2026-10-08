# Enterprice

Portafolio profesional: páginas web y sistemas a medida para restaurantes, comercios y profesionales.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera el sitio estático en out/
```

## Dónde cambiar cosas

- Textos, precios, proyectos, preguntas frecuentes y datos de contacto: `src/content/site.ts`
- Número de WhatsApp: `site.whatsapp` en ese mismo archivo (formato `549...`, sin `+`)

## Publicar en Cloudflare Pages

1. En Cloudflare Pages, crear un proyecto conectado a este repositorio.
2. Comando de build: `npm run build`. Carpeta de salida: `out`.
3. Cada cambio que se sube a `main` se publica solo.

## Pendientes antes de publicar

- Número de WhatsApp, mail y redes reales en `src/content/site.ts`
- Capturas reales de AKROS Café (reemplazan la ilustración de `PosMockup`)
- Foto para la sección "Sobre mí"
- Demos navegables de los prototipos
