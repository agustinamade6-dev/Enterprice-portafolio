# Cómo está hecho el sitio

## Tecnología

- **Next.js 16** con exportación estática (`output: "export"`): `npm run build` genera HTML listo en `out/`.
- **Tailwind CSS 4** con colores propios definidos en `src/app/globals.css` (`ink`, `paper`, `brand` naranja `#f05a28`, `brand-dark`).
- **TypeScript** y la fuente Plus Jakarta Sans.
- No hay base de datos ni servidor: los formularios arman un mensaje y abren WhatsApp.

## Dónde está cada cosa

```
src/
  content/site.ts        ← TODOS los textos y datos del sitio
  app/
    page.tsx             ← página de inicio (todas las secciones)
    layout.tsx           ← estructura común, metadatos y vista previa al compartir
    globals.css          ← colores, fuente y animaciones
    equipo/[slug]/       ← página de historia de cada integrante
    proyectos/<nombre>/  ← páginas de caso (akros-cafe, pierina-glow, yuhmak)
    demos/menu-digital/  ← demo navegable de un menú digital
    sitemap.ts, robots.ts, not-found.tsx, icon.svg
  components/
    Header, Footer, WhatsAppButton
    ProjectDeck          ← carrusel de proyectos tipo mazo de cartas
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
2. **Proyectos**: el mazo, ordenado real → en desarrollo → facultad → conceptos.
3. **Arma tu presupuesto** (`#servicios`): el armador de presupuesto.
4. **Cómo trabajamos** (`#proceso`): 5 pasos en 3 columnas desde tablet, con el ciclo de cada sprint.
5. **Nosotros**: un bloque por integrante con enlace a su historia y su red.
6. **Preguntas frecuentes** y **Contacto**.

## Recetas

**Sumar un proyecto:** agregar un objeto en `projects` de `site.ts` con `kind` (`"real"`, `"desarrollo"`, `"facultad"` o `"concepto"`) y `by: ["Nombre"]`, que muestra "Hecho por …". Opcionales: `image` (captura en `public/`), `href` (página de caso), `modules` (para la ilustración de sistemas) o `chat` (conversación de ejemplo para chatbots). Sumarlo también como capítulo en la historia de quien lo hizo.

**Sumar un integrante:** agregar un objeto en `team` con `slug`, `name`, `fullName`, `role`, `photo`, `href`, `network`, `bio`, `skills` y `story`. La foto va en `public/equipo/` recortada cuadrada. Después actualizar el texto de "Nosotros" (cantidad de integrantes) y regenerar `public/og.png`.

**Cambiar un texto:** casi siempre está en `site.ts`; los componentes solo lo muestran.

**Cambiar el WhatsApp:** `site.whatsapp`, en formato `549…` sin `+` ni espacios.
