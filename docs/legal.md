# Legal, privacidad y accesibilidad

Revisión hecha el 2026-10-12, a pedido de Agustin. **No es asesoramiento legal:** conviene que un abogado o un contador revise los textos antes de usarlos con clientes.

## Qué junta la página (para que las políticas digan la verdad)

- No hay registro, base de datos ni servidor que guarde lo que escribe la gente. Los formularios (contacto y "Arma tu presupuesto") solo arman un mensaje y abren WhatsApp: nos llega solo si la persona lo envía.
- No hay analíticas (Google Analytics, Meta Pixel, Clarity, etc.), ni widgets ni scripts de otros sitios. Las fuentes se sirven desde el mismo sitio (next/font).
- No hay cookies propias. Cloudflare podría poner una cookie técnica de seguridad. Por eso **no hace falta cartel de cookies**. Si algún día se suman analíticas o publicidad, hay que pedir permiso antes de activarlas y actualizar `/legal/cookies`.
- El panel `/admin` usa una cookie de sesión, pero no está en la página publicada (solo en la compu de cada uno).

## Páginas

| Ruta | Qué dice |
| --- | --- |
| `/legal/privacidad` | Ley 25.326: responsables, datos, finalidad, terceros (WhatsApp, Gmail, Cloudflare), plazos, derechos y el texto obligatorio de la AAIP |
| `/legal/terminos` | Presupuesto, sprints, pagos 50/50, arrepentimiento (10 días, art. 34 Ley 24.240), cancelación y reembolsos, garantía, propiedad del trabajo, ley aplicable |
| `/legal/cookies` | Que no hay cookies de seguimiento y por qué no hay cartel |
| `/arrepentimiento` | Botón de arrepentimiento (Res. 424/2020): sin registro, por WhatsApp o correo; respuesta con un código en 24 h por el mismo medio |

El pie tiene los enlaces, el botón de arrepentimiento destacado y los datos del negocio (nombre, Tucumán, correo). Los textos legales están en los `page.tsx` de cada ruta (no se editan desde el admin) y la fecha en `LEGAL_UPDATED` (`src/components/LegalPage.tsx`).

## Pendiente de decidir (no se inventó)

- CUIT o datos fiscales: si se inscriben como monotributistas, agregar el CUIT al pie y a la política de privacidad.
- Registro de la base de datos en la AAIP: si guardan datos de clientes en una base, consultar si corresponde inscribirla.
- Período de garantía: los términos dicen "el que figure en el presupuesto"; ponerlo en cada presupuesto.
- Yuhmak: se muestra con nombre y capturas, y todavía falta confirmar que autoriza.

## Accesibilidad

- Todas las imágenes tienen texto alternativo, todos los botones y enlaces tienen nombre y todos los campos tienen etiqueta (revisado con un script en inicio, proyectos, equipo, demo y páginas legales).
- Contraste (WCAG AA): el naranja de la marca (#f05a28) no llega a 4,5:1 en textos chicos sobre fondo claro ni con texto blanco encima. Ahí se usa #c2410c (textos) y #c8431a (botones); sobre fondo oscuro sigue el naranja original. Los botones verdes de WhatsApp con texto pasaron de #25d366 (2:1) a #15803d (5:1). Las reglas están al final de `globals.css`.
