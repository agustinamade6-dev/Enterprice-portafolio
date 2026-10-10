# Cómo está hecho Bit

Bit no es una imagen ni un video: es **código**. Está dibujado con SVG dentro de un componente de React (`src/components/Bit.tsx`), y las animaciones son CSS (al final de `src/app/globals.css`). Por eso pesa casi nada, se ve nítido en cualquier pantalla y cada parte se puede mover por separado.

## 1. El dibujo: SVG

SVG es un formato de dibujo hecho con texto. En vez de píxeles, describes figuras sobre un lienzo de coordenadas. Bit usa un lienzo de 300 × 300 (`viewBox="0 0 300 300"`), donde x crece hacia la derecha e y hacia abajo.

```tsx
{/* Mitad negra, recta (backend): un rectángulo con esquinas en punta */}
<path d="M72,90 L150,90 L150,252 L72,252 Z" fill="#0f1115" />
{/* Mitad naranja, redondeada (frontend): Q dibuja las curvas de las esquinas */}
<path d="M150,90 L198,90 Q228,90 228,120 L228,222 Q228,252 198,252 L150,252 Z" fill="#f05a28" />
```

- `M` = mover el lápiz a un punto, `L` = línea recta hasta otro punto, `Q` = curva, `Z` = cerrar la figura.
- Los ojos son un `rect` (cuadrado, lado backend) y un `circle` (redondo, lado frontend). Los brazos son `line` con punta redondeada.

Lo que se dibuja después queda encima, como capas de papel. Por eso el orden de las líneas importa.

## 2. Las partes que se mueven: grupos

Cada parte que se anima está dentro de un grupo `<g>`. Al mover el grupo, se mueve todo lo que tiene adentro:

```tsx
<g className="bit-arm" style={{ transform: `rotate(${la}deg)`, transformOrigin: "72px 172px" }}>
  {/* brazo + mano + llave inglesa */}
</g>
```

`transformOrigin` es el hombro: el brazo gira alrededor de ese punto, como un brazo de verdad.

## 3. Las poses: estado de React

Bit no tiene un dibujo distinto por pose. Tiene **un solo cuerpo**, y la pose cambia unos pocos números y detalles:

```tsx
const ARMS = {
  principal:   [0, 0],       // brazos como en el dibujo base
  saludando:   [-95, -40],   // izquierdo abajo, derecho arriba (y saluda)
  programando: [-155, 153],  // los dos hacia la computadora
  festejando:  [28, -30],    // los dos arriba
};
```

La pose actual se guarda en un **estado** (`const [pose, setPose] = useState("saludando")`). Cuando cambia el estado, React vuelve a dibujar a Bit con los nuevos ángulos. Como `.bit-arm` tiene `transition`, el brazo no salta: se mueve suave hasta la posición nueva, con un pequeño rebote.

Según la pose también cambian los ojos (normales o felices `^ ^`), la boca y los extras (la compu, la lamparita o el confeti).

## 4. Que parezca vivo: animaciones CSS

Las animaciones que se repiten solas son `@keyframes` de CSS: le dices cómo está la figura en algunos momentos y el navegador hace el resto.

```css
/* Respira: sube 6 píxeles y baja, cada 3,2 segundos, para siempre */
@keyframes bit-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }

/* Parpadea: los ojos se aplastan (scaleY .1) un instante cada 4,6 segundos */
@keyframes bit-blink { 0%, 92%, 100% { transform: scaleY(1) } 95% { transform: scaleY(.1) } }
```

Con el mismo truco: la antena late (`bit-spark`), la mano saluda (`bit-wave`), salta al festejar (`bit-jump`) y cae el confeti (`bit-confetti`).

## 5. Los ojos siguen al mouse: JavaScript

Un `useEffect` escucha cada movimiento del mouse (`pointermove`). Calcula hacia dónde está el puntero respecto de Bit y mueve las pupilas hasta 4 píxeles en esa dirección:

```tsx
const dx = e.clientX - centroDeBitX;
const dy = e.clientY - centroDeBitY;
const d = Math.hypot(dx, dy);                 // distancia (Pitágoras)
setEye({ x: (dx / d) * 4, y: (dy / d) * 4 });  // 4 píxeles hacia el mouse
```

`requestAnimationFrame` hace que el cálculo se haga como mucho una vez por cuadro de pantalla, para que no gaste de más.

## 6. Cambia según la sección: data-bit

Cada sección de `page.tsx` le dice a Bit qué hacer con un atributo:

```tsx
<section data-bit="pensando|Elige lo que necesitas y armamos tu presupuesto 💡" ...>
```

Mientras haces scroll, Bit busca qué sección está en el centro de la pantalla. Lee su `data-bit`, separa la pose y la frase por el `|`, cambia de pose y muestra la frase en el globito unos segundos. Para cambiar lo que dice o hace en una sección, solo se edita ese texto: no hace falta tocar a Bit.

## 7. Festeja cuando le avisan: eventos

Otros componentes le avisan a Bit sin conocerlo, mandando un **evento** a la ventana:

```tsx
// En el formulario de contacto, al enviar:
bitFestejar("¡Mensaje listo! Te respondemos en el día 🎉");
```

Bit está escuchando ese evento (`bit:festejar`): pasa a la pose de festejo, salta, tira confeti y, a los 3,6 segundos, vuelve a la pose de la sección. Hacerle clic dispara lo mismo, con una frase distinta cada vez.

## 8. Detalles de cuidado

- **Reducir movimiento:** si alguien tiene activado "reducir movimiento" en su sistema (por mareos, por ejemplo), `@media (prefers-reduced-motion: reduce)` apaga todas las animaciones. Bit solo cambia de pose.
- **Borde claro:** un `drop-shadow` color crema alrededor hace que el lado negro no se pierda en la sección oscura de Contacto.
- **Accesibilidad:** Bit es un `<button>` con `aria-label`, y el globito tiene `aria-live`, para que un lector de pantalla lea lo que dice.
- **Aparece a los 0,9 segundos** de cargar la página, deslizándose desde abajo, y saluda.

## Para practicar

1. Cambia una frase: busca `data-bit="programando|Mira lo que hicimos 👀"` en `page.tsx`.
2. Cambia la velocidad con la que respira: en `globals.css`, `.bit-float { animation: bit-float 3.2s ...}`; prueba con `1.5s`.
3. Inventa una pose: suma una línea a `ARMS` en `Bit.tsx` con otros ángulos y úsala en un `data-bit`.
