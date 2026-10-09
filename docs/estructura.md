# Cómo está hecho el sitio

## Tecnología

- **Next.js 16** con exportación estática (`output: "export"`): `npm run build` genera HTML listo en `out/`.
- **Tailwind CSS 4** con colores propios definidos en `src/app/globals.css` (`ink`, `paper`, `brand` naranja `#f05a28`, `brand-dark`).
- **TypeScript** y la fuente Plus Jakarta Sans.
- El sitio público es estático: los formularios arman un mensaje y abren WhatsApp.
- **Panel de admin** (hecho por Nicolás, en `/admin`): permite editar datos del sitio, proyectos, equipo, servicios, proceso, preguntas y fotos sin tocar código. Necesita servidor, así que se usa en la compu con `npm run dev` y no se publica.

## Dónde está cada cosa

```
src/
  content/site.ts        ← textos y datos del sitio (valores de base)
  content/data/*.json    ← lo que se guarda desde el panel de admin; si existe, manda sobre site.ts
  lib/content/           ← repositorio de contenido: lee los JSON del panel o, si no hay, site.ts
  lib/auth/              ← usuario (desde .env.local) y sesión del panel de admin
  middleware.ts          ← protege /admin y la API con sesión
  app/
    page.tsx             ← página de inicio (todas las secciones)
    layout.tsx           ← estructura común, metadatos y vista previa al compartir
    globals.css          ← colores, fuente y animaciones
    equipo/[slug]/       ← página de historia de cada integrante
    proyectos/<nombre>/  ← páginas de caso (akros-cafe, pierina-glow, yuhmak)
    demos/menu-digital/  ← demo navegable de un menú digital
    admin/               ← panel de admin (login, proyectos, equipo, servicios, proceso, preguntas, fotos)
    api/                 ← API del panel (contenido, fotos y sesión)
    sitemap.ts, robots.ts, not-found.tsx, icon.svg
  components/
    Header, Footer, WhatsAppButton
    Carousel3D           ← carrusel 3D de proyectos en forma de cilindro (Nicolás)
    ProjectDeck          ← mazo de cartas anterior (ya no se usa en el inicio)
    admin/               ← formularios del panel (ProjectForm, TeamForm)
    ProjectCard          ← cada tarjeta de proyecto
    BudgetBuilder        ← "Arma tu presupuesto" en 3 pasos
    ContactForm          ← formulario que manda por WhatsApp
    PosMockup            ← ilustración del punto de venta
    ScrollStage, ScrollMotion ← efectos de scroll (solo en la rama efectos)
public/
  equipo/                ← fotos del equipo (cuadradas, 600x600)
  pierina/, yuhmak/      ← capturas de proyectos
  og.png                 ← imagen que se ve al compartir el link (1200x630)
```

## Secciones de la página de inicio

1. **Inicio**: título, botones y la ilustración de AKROS Café.
2. **Proyectos**: el carrusel 3D, ordenado real → en desarrollo → facultad → conceptos.
3. **Arma tu presupuesto** (`#servicios`): el armador de presupuesto.
4. **Cómo trabajamos** (`#proceso`): 5 pasos en 3 columnas desde tablet, con el ciclo de cada sprint.
5. **Nosotros**: un bloque por integrante con enlace a su historia y su red.
6. **Preguntas frecuentes** y **Contacto**.

## Recetas

**Sumar un proyecto:** agregar un objeto en `projects` de `site.ts` con `kind` (`"real"`, `"desarrollo"`, `"facultad"` o `"concepto"`) y `by: ["Nombre"]`, que muestra "Hecho por …". Opcionales: `image` (captura en `public/`), `href` (página de caso), `modules` (para la ilustración de sistemas) o `chat` (conversación de ejemplo para chatbots). Sumarlo también como capítulo en la historia de quien lo hizo.

**Sumar un integrante:** agregar un objeto en `team` con `slug`, `name`, `fullName`, `role`, `photo`, `href`, `network`, `bio`, `skills` y `story`. La foto va en `public/equipo/` recortada cuadrada. Después actualizar el texto de "Nosotros" (cantidad de integrantes) y regenerar `public/og.png`.

**Cambiar un texto:** desde el panel de admin (`/admin` con `npm run dev`) o en `site.ts`. Lo que se guarda en el panel queda en `src/content/data/` y hay que subirlo a git para que se publique.

**Cambiar el WhatsApp:** `site.whatsapp`, en formato `549…` sin `+` ni espacios.
