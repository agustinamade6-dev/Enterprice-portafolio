# El panel de administración

El admin (`/admin`) sirve para cambiar el contenido de la página sin tocar código. Hoy funciona **solo en la PC** de cada uno con `npm run dev`: la página publicada es estática y `npm run build:export` aparta el admin, las rutas `/api` y el `middleware`.

## Cómo entrar

1. `npm run crear-admin`: pide correo y contraseña (12 caracteres o más) y escribe `.env.local` solo. Ese archivo nunca se sube.
2. Reiniciar `npm run dev` y entrar a http://localhost:3000/admin.

Para cerrar todas las sesiones abiertas, volver a correr `npm run crear-admin`: genera una clave de sesión nueva y las sesiones viejas dejan de valer.

## Qué se puede cambiar

| Sección del admin | Qué cambia en la página |
| --- | --- |
| Datos del Sitio | Nombre, slogan, descripción, WhatsApp, correo, Instagram, GitHub, dirección de la página |
| **Textos de la página** | El inicio (cartel, título con su parte naranja, botones, tarjeta flotante), el título y texto de cada sección, la nota de mantenimiento, el recuadro de sprints, el pie de página, el título de la pestaña para Google, y Bit: la pose y frase de cada sección y las frases al tocarlo. `{nombre}` se reemplaza por el nombre del sitio |
| Proyectos | Las tarjetas del carrusel. Con las flechas se cambia el orden (en la página se agrupan por tipo y dentro de cada tipo van en este orden) |
| Equipo | Los integrantes y su historia. Con las flechas se cambia el orden |
| Servicios | Lo que se elige en "Arma tu presupuesto" |
| Proceso | Los pasos de "Cómo trabajamos" y lo que pasa en cada sprint |
| FAQs | Preguntas y respuestas, con orden |
| Media | Las fotos subidas |

Lo que se guarda va a `src/content/data/*.json`. Si un archivo no existe, se usa lo que está en `src/content/site.ts`. En "Textos de la página", si más adelante se suma un texto nuevo a `site.ts`, aparece solo aunque ya haya un archivo guardado.

Todavía no se editan desde el admin: las páginas de cada proyecto (`src/app/proyectos/...`), los textos del menú, del formulario de contacto y del armador de presupuesto, la vista previa antes de guardar y deshacer desde el panel (las copias existen, ver abajo).

## Seguridad

| Qué | Cómo |
| --- | --- |
| Subir fotos | Solo imágenes de verdad (se revisa el contenido, no el nombre): JPG, PNG, WebP o GIF, hasta 5 MB. El nombre lo pone el servidor. SVG y HTML se rechazan porque pueden llevar código |
| Login | 5 intentos fallidos y se bloquea 15 minutos (por IP y por correo). Tarda lo mismo exista o no el correo, para no dejar adivinarlo |
| Sesión | Dura 8 horas y se renueva mientras se usa. Cookie `httpOnly` y `SameSite=strict` |
| Cada ruta | Además del `middleware`, cada ruta que lee o guarda vuelve a comprobar la sesión (`src/lib/auth/guard.ts`) |
| Pedidos desde otra página (CSRF) | Las rutas que guardan rechazan lo que no viene del propio admin |
| Después del login | Solo vuelve a direcciones dentro de `/admin` |
| Lo que se guarda | Todo se valida (`src/lib/content/schemas.ts`): largos máximos, enlaces solo `https://`, `/`, `mailto:` o `tel:` (nunca `javascript:`), WhatsApp solo números, slugs con letras, números y guiones |
| Guardado | Se escribe en un archivo aparte y se renombra, así nunca queda roto. Antes de cada cambio se guarda una copia en `src/content/data/respaldos/` (las últimas 20 de cada archivo, ignoradas por git) |
| Encabezados | El admin y las `/api` no se pueden meter dentro de otra página, Google no los indexa y el navegador no los guarda en caché |

Probado el 2026-10-10: sin sesión las rutas devuelven 401; desde otra página, 403; el sexto intento fallido, 429; un `.png` que en realidad es HTML y un `.svg` se rechazan; un WhatsApp con letras se rechaza.

## Para cuando se integre a la página publicada

La idea es un botón **"Publicar"** en el admin que suba los cambios a GitHub; Cloudflare actualiza la página sola. En ese paso hay que resolver dos cosas: las fotos subidas hoy quedan solo en la PC (`public/uploads` está ignorado por git), y el admin tiene que vivir en un lugar con servidor (la página publicada es estática).
