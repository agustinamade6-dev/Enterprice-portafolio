# Seguridad de la página

## Por qué la página ya es bastante segura

La página publicada es **estática**: Cloudflare solo entrega archivos ya armados (HTML, CSS, JS e imágenes). No hay servidor que ejecute código, ni base de datos, ni login. Lo que no existe no se puede atacar.

- El panel `/admin`, las rutas `/api` y el `middleware` **no se publican**: `npm run build:export` los aparta antes de armar la página. El admin solo funciona en la PC de cada uno con `npm run dev`.
- Las credenciales del admin viven solo en `.env.local`, que está ignorado por git y nunca se sube.
- Cloudflare da HTTPS (el candado) y protección contra ataques de tráfico masivo por defecto.
- `npm audit --omit=dev` revisa si alguna dependencia tiene vulnerabilidades conocidas (al 2026-10-10: 0).

## Encabezados de seguridad (`public/_headers`)

Cuando el navegador pide una página, el servidor le contesta con el archivo y con unos **encabezados**: instrucciones que el navegador lee pero el usuario no ve. Los encabezados de seguridad le dicen al navegador qué cosas no permitir.

Cloudflare lee el archivo `public/_headers` (que termina en `out/_headers` al armar la página) y agrega esos encabezados a cada respuesta. `/*` significa "todas las páginas".

| Encabezado | Qué hace | De qué protege |
| --- | --- | --- |
| `Strict-Transport-Security` | Le dice al navegador: "durante un año, entra siempre por https". | Que alguien en un wifi público fuerce la versión sin candado (http) y lea o cambie lo que viaja. |
| `X-Content-Type-Options: nosniff` | El navegador usa cada archivo como lo que dice ser (una imagen es imagen, no código). | Que un archivo disfrazado se ejecute como script. |
| `X-Frame-Options: SAMEORIGIN` y `frame-ancestors 'self'` | Solo nuestra propia página puede mostrarse dentro de un recuadro (iframe). | *Clickjacking*: otra web pone nuestra página invisible encima de la suya para que hagas clic sin darte cuenta. |
| `Referrer-Policy` | Al ir a otra web (WhatsApp, Instagram), solo se manda el dominio, no la dirección completa. | Filtrar información de la URL a otros sitios. |
| `Permissions-Policy` | Apaga cámara, micrófono, ubicación, pagos y USB. | Que algún script se aproveche de esos permisos; la página no los usa. |
| `Cross-Origin-Opener-Policy` | Aísla nuestra pestaña de las ventanas de otros sitios. | Que una ventana ajena controle o lea la nuestra. |
| `Content-Security-Policy` (`base-uri`, `object-src`, `form-action`) | Bloquea plugins viejos (Flash y similares), que cambien la dirección base de los enlaces y que un formulario envíe datos a un sitio que no sea el nuestro o WhatsApp. | Inyección de contenido malicioso. |
| `Cache-Control` en `/_next/static/*` | Esos archivos tienen un nombre único por versión, así que el navegador los guarda un año. | No es seguridad: hace que la página cargue más rápido. |

### Cómo comprobarlo

- En el navegador: F12 → pestaña **Red / Network** → recargar → clic en la primera fila (el documento) → **Encabezados de respuesta**.
- Online: https://securityheaders.com con la dirección de la página da una nota de la A a la F.

### Si algo deja de funcionar

Si en el futuro se agrega algo nuevo (un mapa de Google, un video de YouTube embebido, un formulario que envía a otro servicio), puede que haya que sumar ese sitio al `Content-Security-Policy`. El síntoma es que eso no aparece y en la consola (F12) sale un error que menciona "Content Security Policy".
