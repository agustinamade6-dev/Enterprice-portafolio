# Efectos y animaciones

## Escenario de scroll (en `main` desde el 2026-10-09)

Se probó en la rama `efectos` y Agustin decidió pasarlo a la página publicada el 2026-10-09.

La idea viene de un video del sitio de GTA VI que pasó Agustin: que al hacer scroll **parezca que no estás bajando**, sino que la pantalla queda quieta y el contenido cambia en el lugar.

### Cómo funciona hoy

**`ScrollStage.tsx` (escenario fijo).** Las secciones de la página de inicio quedan fijas una encima de la otra y el body recibe un alto artificial para que exista scroll. El scroll solo marca el avance:

- Cada sección tiene un tramo propio. Si es más alta que la pantalla, durante ese tramo se recorre por dentro.
- Entre una sección y la siguiente hay un tramo de cambio: 40 % del alto de pantalla con mouse y 70 % con el dedo. Las dos se cruzan con la misma curva: mientras la que se va se achica un 12 % y se desvanece, la nueva aparece acercándose (empieza un 6 % más grande). Entre las dos siempre suman opacidad completa, así que la pantalla nunca queda en blanco.
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
| Cuánto dura cada cambio | `gap = vh * (mouse ? 0.4 : 0.7)` en `ScrollStage.tsx` |
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
