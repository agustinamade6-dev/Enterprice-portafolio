# Enterprice

Portafolio profesional: páginas web y sistemas a medida para restaurantes, comercios y profesionales.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera el sitio estático en out/
```

## Documentación

Toda la información del proyecto (equipo, decisiones, estructura, efectos y flujo de trabajo) está en [`docs/`](docs/README.md).

## Dónde cambiar cosas

- Textos, proyectos, presupuesto, preguntas frecuentes y datos de contacto: `src/content/site.ts`
- Número de WhatsApp: `site.whatsapp` en ese mismo archivo (formato `549...`, sin `+`)

## Publicar en Cloudflare Pages

1. En Cloudflare Pages, crear un proyecto conectado a este repositorio.
2. Comando de build: `npm run build`. Carpeta de salida: `out`. Variable `NODE_VERSION=22`.
3. Cada cambio que se sube a `main` se publica solo.
