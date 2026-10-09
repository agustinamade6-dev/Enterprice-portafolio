# Lecciones aprendidas

Cosas que salieron mal (o casi) y la regla que nos dejan, para no repetirlas. Al cerrar cada trabajo, si hubo que corregir algo a mano, se agrega una fila.

## Portafolio Enterprice

| # | Qué pasó | Cómo se resolvió | Regla |
| --- | --- | --- | --- |
| 1 | Los efectos de scroll se rehicieron cuatro veces hasta llegar al que se buscaba. | Agustin pasó un video de referencia y recién ahí quedó claro el objetivo. | Para animaciones y diseño, pedir una referencia (video, sitio o captura) antes de construir. |
| 2 | Las secciones apiladas "como cartas" se veían como bloques o diapositivas. | Se cambiaron por un escenario fijo con fundidos en el lugar. | Un efecto fluido no debe mostrar bordes de bloque: nada de esquinas, sombras ni franjas que corten la pantalla. |
| 3 | En celular el escenario se veía perfecto y en compu se sentía lento y con mucho blanco. | Con mouse el cambio es más corto y responde más rápido; cada escena ocupa toda la pantalla. | El scroll con ruedita (pasos cortos) y con el dedo (deslizamientos largos) se ajustan por separado. Probar siempre en las dos. |
| 4 | Con la pantalla quieta, los títulos que estaban cerca del menú quedaban medio transparentes. | Los bloques se desvanecen recién cuando su borde pasa debajo del menú. | Un efecto pensado para contenido que se mueve hay que revisarlo con el contenido quieto. |
| 5 | Las tarjetas con retraso escalonado quedaban a medio aparecer si estaban al final de la pantalla. | El escalonado pasó a ser de tiempo y no de posición. | Todo lo que se ve en pantalla tiene que poder llegar a verse completo. |
| 6 | Al sacar `relative` de una sección, un adorno de fondo se escapó y la página se corría de costado en celular. | Se volvió a poner `relative`. | Después de tocar el posicionamiento, revisar que no haya scroll horizontal. |
| 7 | Las pruebas mostraban la versión vieja de la página después de compilar. | Se reinició el servidor de vista previa. | Si una vista previa no refleja el cambio, reiniciar el servidor antes de seguir buscando el error. |
| 8 | Mergear `main` dentro de `efectos` habría borrado los efectos, porque `main` tiene el commit que los saca. | Se trajeron los cambios con `git cherry-pick`. | Ver "Ojo al pasar `efectos` a `main`" en [flujo-de-trabajo.md](flujo-de-trabajo.md). |
| 9 | Correr el formateador sobre un archivo entero cambió 180 líneas que no tenían nada que ver. | Se deshizo y se editaron solo las líneas necesarias. | El repositorio no tiene configuración de formato: no reformatear archivos enteros dentro de un cambio. |
| 10 | Se colaron formas con voseo ("te encontrás", "Deslizá"). | Se pasaron a "tú" ("te encuentras", "Desliza"). | Todos los textos del sitio van con "tú". |
| 11 | Al escribir la documentación se anotaron mal las redes del equipo. | Se revisó contra `src/content/site.ts`. | Antes de documentar un dato, leerlo de su fuente. |
| 12 | `C:\dev\portafolio` no tiene git y desde afuera no se pueden borrar archivos ahí. | Se avisa qué archivos borrar a mano. | Cuando un cambio elimina archivos, decir cuáles hay que borrar en la copia local. |
| 13 | Una foto del equipo no era cuadrada y se deformaba en la tarjeta. | Se recortó a 600x600. | Las fotos del equipo van cuadradas, 600x600, y al sumar a alguien se regenera `public/og.png`. |
| 14 | En la página de cada integrante, `params` se usaba sin esperar y fallaba la compilación. | `const { slug } = await params`. | En Next 16 los `params` de las páginas son una promesa. |

## Sistema de la cafetería (AKROS Café)

El punto de venta de AKROS Café nació como el sistema del restaurante San Andrés. Agustin hizo el frontend y José el backend, las pruebas y la auditoría. Las lecciones completas, con el commit donde se resolvió cada una, están en el repositorio del sistema: [docs/lecciones-aprendidas.md](https://github.com/agustinamade6-dev/restaurante-san-andres/blob/HEAD/docs/lecciones-aprendidas.md) (36 casos). La base general de José, con las reglas para próximos proyectos, está en [Base-Conocimiento](https://github.com/joseMatias5/Base-Conocimiento).

Resumen de las reglas que más pesan:

**Dinero**
- La plata se guarda en centavos enteros, nunca en decimales: con decimales aparecían diferencias de centavos y hubo que migrar la base entera.
- Precios y totales los calcula el servidor desde los productos, no la pantalla.
- "Hoy" en la caja es desde las 00:00 de hoy; un error de rango sumaba las ventas de ayer.

**Estados y stock**
- Un pedido cobrado es un estado final: se corrige anulando con un movimiento inverso, no reabriéndolo.
- Cada descuento de stock se registra como movimiento, para poder devolverlo al anular.

**Cobros simultáneos**
- Dos personas cobrando a la vez registraban dos ventas. Se resolvió con escritura condicional dentro de la transacción y escrituras en fila.
- Esto solo apareció probando contra SQLite real: una base simulada no muestra problemas de concurrencia.

**Seguridad**
- Sesión firmada y `httpOnly`, nunca un JSON que se pueda editar desde el navegador.
- La sesión se revalida contra la base: un usuario desactivado no puede seguir operando.
- El límite de intentos del PIN no confía en encabezados que el navegador puede inventar.
- Ningún secreto fijo en el código. Protección CSRF revisando el origen de cada pedido.

**Datos y versiones**
- La app instalada aplica las migraciones sola al arrancar; si no, nunca recibe los cambios de esquema.
- Cambiar la marca (a AKROS Café) no alcanza con cambiar los valores por defecto: la configuración ya creada conserva el nombre viejo.
- `npm audit fix` puede "arreglar" bajando versiones y rompiendo dependencias: revisar lo que propone antes de aceptarlo.

**Pruebas**
- Probar con los datos exactos que manda el formulario: una validación nueva rechazó el emoji que el formulario ponía por defecto.
- Las pruebas de mutación encontraron límites que los tests no cubrían, aunque todos pasaban.
- Las pruebas intermitentes se arreglan buscando la causa (animaciones a mitad de camino, conexiones compartidas, relojes simulados), no subiendo tiempos de espera.
- Si la documentación dice que algo pasa, hay que haberlo probado.

**Trabajo en equipo y herramientas**
- El código se divide por carpetas: frontend para Agus y backend para José. Cambiar lo que una ruta recibe o devuelve se avisa antes.
- Una sola sesión de asistente edita una carpeta a la vez. Antes de actuar sobre un mensaje viejo, revisar con `git fetch` y `git log` cómo está el repositorio de verdad.
- Los reemplazos automáticos por script se aplicaban a medias: después de cada uno, compilar y correr las pruebas antes de seguir.
- No mezclar un reformateo de archivo entero con un cambio funcional (pasó con `prisma format`, y acá con el formateador de `page.tsx`).
