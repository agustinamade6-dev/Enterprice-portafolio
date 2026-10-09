# Efectos y animaciones

## En `main`

**Mazo de proyectos** (`ProjectDeck.tsx` + `globals.css`): al pasar de tarjeta, la de adelante sale volando y la nueva acomoda su imagen y su texto de a poco. Hacia atrás, la última vuelve entrando por la izquierda. Se puede deslizar con el dedo.

## En la rama `efectos`

La idea viene de un video del sitio de GTA VI que pasó Agustin: que al hacer scroll **parezca que no estás bajando**, sino que la pantalla queda quieta y el contenido cambia en el lugar.

### Cómo funciona hoy

**`ScrollStage.tsx` (escenario fijo).** Las secciones de la página de inicio quedan fijas una encima de la otra y el body recibe un alto artificial para que exista scroll. El scroll solo marca el avance:

- Cada sección tiene un tramo propio. Si es más alta que la pantalla, durante ese tramo se recorre por dentro.
- Entre una sección y la siguiente hay un tramo de cambio: 55 % del alto de pantalla con mouse y 90 % con el dedo. En la primera mitad la que se va se achica un 12 % y se desvanece; en la segunda la nueva aparece acercándose (empieza un 6 % más grande).
- Cada escena ocupa al menos toda la pantalla y centra su contenido, para que no queden franjas en blanco.
- El avance se suaviza: en cada cuadro recorre el 20 % de lo que falta con mouse y el 12 % con el dedo. Por eso no salta con cada giro de la ruedita.
- Los enlaces a secciones (`#proyectos`, `/#servicios`…) se interceptan y saltan al tramo de esa sección. Por eso cada sección tiene antes un marcador `<div id="…" className="scroll-anchor" />`.
- El pie de página va dentro del bloque de Contacto para que aparezca al final.

**`ScrollMotion.tsx` (bloques).** Cada elemento con `data-reveal` entra desde abajo (`--enter`) y se aleja y desvanece cuando su borde pasa debajo del menú (`--exit`). Las tarjetas de una misma fila llegan una después de otra. En el inicio el texto sube y la imagen baja y gira un poco al salir (`--leave`, que pone ScrollStage).

**Accesibilidad:** con "reducir movimiento" activado en el sistema, todo queda como una página normal.

### Qué se puede ajustar

| Qué | Dónde |
| --- | --- |
| Cuánto dura cada cambio | `gap = vh * (mouse ? 0.55 : 0.9)` en `ScrollStage.tsx` |
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
