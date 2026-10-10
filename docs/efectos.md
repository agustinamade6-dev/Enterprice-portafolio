# Efectos y animaciones

## Escenario de scroll (en `main` desde el 2026-10-09)

Se probó en la rama `efectos` y Agustin decidió pasarlo a la página publicada el 2026-10-09.

La idea viene de un video del sitio de GTA VI que pasó Agustin: que al hacer scroll **parezca que no estás bajando**, sino que la pantalla queda quieta y el contenido cambia en el lugar.

### Cómo funciona hoy

**`ScrollStage.tsx` (escenario fijo).** Las secciones de la página de inicio quedan fijas una encima de la otra y el body recibe un alto artificial para que exista scroll. El scroll solo marca el avance:

- Cada sección tiene un tramo propio. Si es más alta que la pantalla, durante ese tramo se recorre por dentro.
- Entre una sección y la siguiente hay un tramo de cambio: 30 % del alto de pantalla con mouse y 50 % con el dedo (se acortó el 2026-10-10 para que sea más rápido). Las dos se cruzan con la misma curva: mientras la que se va se achica un 12 % y se desvanece, la nueva aparece acercándose (empieza un 6 % más grande). Entre las dos siempre suman opacidad completa, así que la pantalla nunca queda en blanco.
- Cada escena ocupa al menos toda la pantalla y centra su contenido, para que no queden franjas en blanco.
- El avance se suaviza: en cada cuadro recorre el 20 % de lo que falta con mouse y el 12 % con el dedo. Por eso no salta con cada giro de la ruedita.
- Los enlaces a secciones (`#proyectos`, `/#servicios`…) se interceptan y saltan al tramo de esa sección. Por eso cada sección tiene antes un marcador `<div id="…" className="scroll-anchor" />`.
- El pie de página va dentro del bloque de Contacto para que aparezca al final.

**`ScrollMotion.tsx` (bloques).** Cada elemento con `data-reveal` entra desde abajo (`--enter`) y se aleja y desvanece cuando su borde pasa debajo del menú (`--exit`). Las tarjetas de una misma fila llegan una después de otra. En el inicio el texto sube y la imagen baja y gira un poco al salir (`--leave`, que pone ScrollStage).

**`TeamShowcase.tsx` (Nosotros, 2026-10-09).** Inspirado en un video de referencia de QCLAY que pasó Agustin (segundos 13 a 18). Muestra un integrante a la vez: la foto se achica hasta ser una franja mientras la del siguiente crece a su lado y queda del otro costado, y el texto entra palabra por palabra (de borroso a nítido). La sección tiene `data-hold={integrantes - 1}`: ScrollStage la deja quieta durante 60 % de pantalla por cambio con mouse (85 % con el dedo) y le pasa el avance en `--hold`. Si la sección es más alta que la pantalla, primero se recorre y después se queda quieta. Los puntos de abajo llevan al integrante elegido. Sin escenario (reducir movimiento) los puntos animan el cambio.

**Cómo trabajamos (2026-10-09).** Como en la presentación del equipo, la pantalla se queda quieta y las cinco tarjetas aparecen una por una a medida que se baja (subiendo, con un leve desenfoque que se aclara). La sección tiene `data-hold={4}` (cada tarjeta lleva unos 4 o 5 giros de ruedita, para que se note que aparecen de a una) y `data-hold-fit`: solo se queda quieta si casi entra en la pantalla (sobra como mucho un 25 %); en celular, donde las tarjetas van una debajo de otra, se recorre normal. Cada tarjeta tiene `data-step` con `--i` (orden) y `--n` (total), y el CSS calcula su aparición con `--hold`.

**`RibbonSides.tsx` (listón, 2026-10-09, en prueba en `efectos`).** Agustin pidió algo que acompañe por los costados durante toda la página y eligió un listón; después pidió que se vaya formando al bajar y con colores que combinen (naranja de la marca, ámbar y coral, en vez de verde). Se dibuja hasta un poco más abajo de la mitad de la pantalla (`stroke-dashoffset`, con el largo medido una sola vez) y crece a medida que se baja. Es una cinta SVG a cada lado (una trocoide: ondula y, donde el radio supera al paso, hace un rulo) que se desplaza hacia arriba con el avance del scroll, suavizado. Pasa por debajo del menú. En compu ocupa el margen libre al lado del contenido (entre 44 y 130 px); en celular es una cinta finita de 18 px en cada borde. No recibe clics.

**Accesibilidad:** con "reducir movimiento" activado en el sistema, todo queda como una página normal.

### Qué se puede ajustar

| Qué | Dónde |
| --- | --- |
| Cuánto dura cada cambio | `gap = vh * (mouse ? 0.3 : 0.5)`; la suavidad es `smooth = mouse ? 0.24 : 0.18` (más alto = sigue al dedo más rápido) en `ScrollStage.tsx` |
| Cuánto se achica la que sale | `scale = 1 - 0.12 * q` |
| Cuánto se acerca la que entra | `scale = 1.06 - 0.06 * p` |
| Suavidad | `smooth = mouse ? 0.2 : 0.12` (más alto, más rápido) |
| Movimiento de los bloques | `.reveal-on [data-reveal]` al final de `globals.css` |

### Limitaciones conocidas

- El resumen "Tu presupuesto" ya no queda pegado al costado en compu.
- Al moverse con Tab hacia algo fuera de pantalla, la página no lo acerca.
- Buscar texto con Ctrl+F no desplaza hasta el resultado.

### Lo que se probó y se descartó

1. **Aparición simple** (entra con fundido desde abajo al bajar y desde arriba al subir): quedó como base de `ScrollMotion`.
2. **Secciones apiladas** (cada sección se pegaba y la siguiente subía encima como una carta, oscureciendo la de atrás): descartado porque se veía "como un bloque o una diapositiva".
3. **Movimiento fluido por bloque** sin escenario fijo: le faltaba la sensación de "no estar bajando".
4. **Escenario fijo** (actual). En compu se sentía lento y con mucho blanco: se acortó el cambio con mouse y cada escena pasó a llenar la pantalla.

## Fondos por apartado

Cada apartado tiene su tono de la marca y un dibujo sutil que tiene que ver con su tema (clases `.fondo-*` en `src/app/globals.css`, dibujos en `public/fondos/`): cuadrícula de diseño en Inicio, símbolos de código en Proyectos, puntos en Servicios, camino de pasos en Cómo trabajamos, ondas en Nosotros, signos de pregunta y globos en Preguntas, y ondas de señal con puntos sobre fondo oscuro en Contacto. La capa de arriba de cada fondo es un degradé del color base que esfuma el dibujo hacia los bordes. Sin brillos ni manchas de color: Agustin los pidió sacar (2026-10-10). Agustin eligió "fondos con dibujo" (2026-10-10) frente a solo tonos o alternar claro y oscuro.

## Bit, la mascota (`src/components/Bit.tsx`)

Bit vive abajo a la izquierda (el botón de WhatsApp está a la derecha). Es mitad backend (negro, recto, llave inglesa) y mitad frontend (naranja, redondeado, pincel); la chispa de la antena es la idea del cliente. Agustin pidió que no tenga la estrella en el lado naranja.

- Respira (sube y baja), parpadea, la antena late y los ojos siguen al mouse.
- Cambia de pose según la sección: cada sección de `page.tsx` tiene `data-bit="pose|frase"`. Poses: `saludando`, `principal`, `programando`, `pensando`, `festejando`. Al entrar a una sección dice la frase en un globito.
- Al hacer clic salta, festeja y dice una frase.
- Festeja solo cuando alguien envía el formulario de contacto o pide el presupuesto: cualquier componente puede llamar a `bitFestejar("frase")`.
- Con "reducir movimiento" activado en el sistema, no hay animaciones (solo cambia de pose).
- Dibujos sueltos (SVG y PNG transparentes) para redes: carpeta del proyecto `mascota/bit/`.
