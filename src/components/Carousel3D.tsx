"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import type { Project } from "@/lib/content/schemas";
import { ProjectCard } from "./ProjectCard";

const SWIPE_THRESHOLD = 40;
const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";

// La tarjeta no cambia al girar el cilindro: memorizada, React no la vuelve a dibujar en cada cambio
const Card = memo(function Card({ project }: { project: Project }) {
  return <ProjectCard project={project} large compact />;
});

// Silueta de las tarjetas del fondo: el color del proyecto y unas barras, sin texto ni imágenes.
// Se ve que hay más trabajos atrás y cuesta casi nada dibujarla.
const Ghost = memo(function Ghost({ accent, narrow }: { accent: string; narrow: boolean }) {
  return (
    <div className={`flex h-full w-full overflow-hidden rounded-[16px] bg-white ${narrow ? "flex-col" : ""}`}>
      <div className={`bg-gradient-to-br ${accent} ${narrow ? "h-44" : "w-1/2"}`} />
      <div className={`flex flex-col gap-4 ${narrow ? "p-5" : "w-1/2 p-8"}`}>
        <div className="h-5 w-1/3 rounded-full bg-black/10" />
        <div className="h-8 w-3/4 rounded-lg bg-black/15" />
        <div className="h-3 w-full rounded-full bg-black/10" />
        <div className="h-3 w-5/6 rounded-full bg-black/10" />
        <div className="h-3 w-2/3 rounded-full bg-black/10" />
      </div>
    </div>
  );
});

export function Carousel3D({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = projects.length;

  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number | null>(null);
  const rotator = useRef<HTMLDivElement>(null);
  const dragFrame = useRef(0);
  const scene = useRef<HTMLDivElement>(null);
  // Se mide el contenedor de afuera: la escena del celular tiene el ancho de la tarjeta y medirla
  // achicaría la tarjeta en un bucle sin fin
  const wrap = useRef<HTMLDivElement>(null);
  // Ancho disponible: en celular la tarjeta se achica para entrar en la pantalla
  const [space, setSpace] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setSpace(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const next = () => setCurrentIndex((prev) => prev + 1);
  const prev = () => setCurrentIndex((prev) => prev - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total]);

  // Mientras se arrastra, el giro se aplica directo al cilindro (un cambio por cuadro, sin redibujar con React)
  const applyDrag = () => {
    dragFrame.current = 0;
    const el = rotator.current;
    if (!el || dragStartX.current === null || dragCurrentX.current === null) return;
    if (narrow) {
      // Celular: la fila de tarjetas sigue al dedo
      el.style.transition = "none";
      el.style.transform = `translate3d(${dragCurrentX.current - dragStartX.current}px,0,0)`;
      return;
    }
    const angle = currentIndex * -theta + ((dragCurrentX.current - dragStartX.current) / window.innerWidth) * 120;
    el.style.transition = "none";
    el.style.transform = `translateY(${lift}px) translateZ(-${radius}px) rotateX(-3deg) rotateY(${angle}deg)`;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    dragCurrentX.current = e.clientX;
    if (!dragFrame.current) dragFrame.current = requestAnimationFrame(applyDrag);
  };

  const onPointerUp = () => {
    if (dragStartX.current !== null && dragCurrentX.current !== null) {
      const diff = dragCurrentX.current - dragStartX.current;
      if (diff > SWIPE_THRESHOLD) {
        prev();
      } else if (diff < -SWIPE_THRESHOLD) {
        next();
      }
    }
    dragStartX.current = null;
    dragCurrentX.current = null;
    cancelAnimationFrame(dragFrame.current);
    dragFrame.current = 0;
    // Devuelve el control a React, que anima hasta la tarjeta elegida
    if (rotator.current && narrow) {
      rotator.current.style.transition = `transform 0.5s ${EASE}`;
      rotator.current.style.transform = "translate3d(0,0,0)";
    } else if (rotator.current) {
      rotator.current.style.transition = `transform 0.8s ${EASE}`;
      rotator.current.style.transform = `translateY(${lift}px) translateZ(-${radius}px) rotateX(-3deg) rotateY(${currentAngle}deg)`;
    }
  };

  // 3D Cylinder Math
  // En pantallas angostas la tarjeta pasa a vertical (imagen arriba, texto abajo) y ocupa casi todo el ancho
  const narrow = space > 0 && space < 768;
  const cardWidth = narrow ? Math.min(400, space - 40) : 680;
  const cardHeight = narrow ? 470 : 420;
  const theta = total > 0 ? 360 / total : 0;
  // Calculate radius so cards form a perfect polygon, add some padding (offset)
  // Offset de 40 para mantener coherencia en un cilindro más grande
  const radius = total <= 1 ? 0 : Math.round(cardWidth / 2 / Math.tan(Math.PI / total)) + 40;
  // La inclinación (rotateX) baja la tarjeta del frente en proporción al radio y deja un hueco arriba:
  // se compensa subiendo el cilindro lo mismo
  const lift = -Math.round(radius * Math.sin((3 * Math.PI) / 180));

  // Cylinder rotation
  const currentAngle = currentIndex * -theta;

  // To prevent cards from being unclickable if they are technically "behind" but visible,
  // we manage pointerEvents in CSS.
  // We determine the active absolute index via modulo
  const activeIndex = ((currentIndex % total) + total) % total;

  // En el celular no se usa el cilindro 3D: se ve una sola tarjeta por vez, así que se dibujan solo
  // la actual y sus dos vecinas, planas, y se deslizan de costado. El cilindro tenía todas las
  // tarjetas en capas 3D con sombra, y el celular las recalculaba en cada cuadro del scroll.
  if (narrow) {
    const step = cardWidth + 16;
    return (
      <div ref={wrap} className="relative w-full select-none overflow-hidden py-4">
        <div
          ref={scene}
          className="relative mx-auto touch-pan-y"
          style={{ height: cardHeight + 24, width: cardWidth, contain: "layout paint" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div ref={rotator} className="absolute inset-0" style={{ transform: "translate3d(0,0,0)" }}>
            {projects.map((p, i) => {
              // Distancia con signo a la tarjeta actual, dando la vuelta (la última es vecina de la primera)
              let rel = (((i - activeIndex) % total) + total) % total;
              if (rel > total / 2) rel -= total;
              if (Math.abs(rel) > 1) return null;
              return (
                <div
                  key={p.slug}
                  className="absolute left-0 top-0"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    transform: `translate3d(${rel * step}px,0,0) scale(${rel === 0 ? 1 : 0.92})`,
                    opacity: rel === 0 ? 1 : 0.5,
                    transition: `transform 0.5s ${EASE}, opacity 0.5s ${EASE}`,
                    pointerEvents: rel === 0 ? "auto" : "none",
                  }}
                >
                  <div className="h-full w-full overflow-hidden rounded-[16px] bg-white shadow-[0_12px_30px_-16px_rgba(0,0,0,0.3)]">
                    <Card project={p} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Controls prev={prev} next={next} />
      </div>
    );
  }

  return (
    <div ref={wrap} className="relative w-full overflow-visible select-none py-4 md:py-6">
      {/* 1. Contenedor de la escena (Perspective) - Full Width */}
      <div
        ref={scene}
        className="relative mx-auto flex w-full items-center justify-center touch-pan-y"
        // contain: el navegador no recalcula el resto de la página cuando el carrusel cambia
        style={{ height: cardHeight + 40, perspective: "1200px", contain: "layout" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* 2. Contenedor del cilindro (Rotator) */}
        {/* Agregamos rotateX(-3deg) para envolver visualmente al usuario y translateZ(-radius) */}
        <div
          ref={rotator}
          className="absolute"
          style={{
            height: `${cardHeight}px`,
            width: `${cardWidth}px`,
            transformStyle: "preserve-3d",
            transform: `translateY(${lift}px) translateZ(-${radius}px) rotateX(-3deg) rotateY(${currentAngle}deg)`,
            transition: `transform 0.8s ${EASE}`,
            willChange: "transform",
          }}
        >
          {projects.map((p, i) => {
            const cardAngle = i * theta;
            const isFront = i === activeIndex;

            // Distancia angular respecto al frente
            const angleDiff = Math.abs((((cardAngle + currentAngle) % 360) + 360) % 360);
            const dist = Math.min(angleDiff, 360 - angleDiff);
            
            // Cálculos visuales de profundidad ininterrumpida
            const isBack = dist > 90;
            const opacity = isFront ? 1 : Math.max(0.35, 1 - (dist / 140));
            const scale = isFront ? 1.05 : 0.85;
            // Oscurecer con una capa encima es mucho más liviano que filter: blur/brightness,
            // que obliga a redibujar cada tarjeta grande en cada cuadro de la animación
            const shade = isFront ? 0 : isBack ? 0.4 : 0.2;
            // La del frente y dos a cada lado se dibujan completas; las del fondo, como silueta
            const ghost = dist > 100;

            return (
              <div
                key={p.slug}
                className="absolute left-1/2 top-1/2 origin-center"
                style={{
                  height: `${cardHeight}px`,
                  width: `${cardWidth}px`,
                  transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale})`,
                  // Las completas no se dibujan de espaldas (no se ve el texto invertido); las siluetas sí
                  backfaceVisibility: ghost ? "visible" : "hidden",
                  opacity: ghost ? 0.35 : opacity,
                  transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
                  pointerEvents: isFront ? "auto" : "none",
                  zIndex: isFront ? 50 : (isBack ? 0 : 10),
                }}
              >
                {/* Fondo sólido opaco obligatorio */}
                <div
                  className="relative h-full w-full rounded-[16px] overflow-hidden bg-white"
                  style={{ boxShadow: ghost ? "none" : "0 18px 40px -16px rgba(0,0,0,0.3)" }}
                >
                  {ghost ? <Ghost accent={p.accent} narrow={narrow} /> : <Card project={p} />}
                  <div
                    className="pointer-events-none absolute inset-0 bg-black"
                    style={{ opacity: shade, transition: `opacity 0.8s ${EASE}` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Controls prev={prev} next={next} />
    </div>
  );
}

function Controls({ prev, next }: { prev: () => void; next: () => void }) {
  return (
  <div className="mt-6 md:mt-8 mx-auto flex w-max items-center gap-1 rounded-2xl border border-black/10 bg-black/5 p-1.5">
    <button
      type="button"
      onClick={prev}
      className="rounded-xl px-5 py-2 text-sm font-bold text-ink transition hover:bg-black/5"
    >
      ← Anterior
    </button>
    <div className="h-5 w-[1px] bg-black/10" />
    <button
      type="button"
      onClick={next}
      className="rounded-xl px-5 py-2 text-sm font-bold text-ink transition hover:bg-black/5"
    >
      Siguiente →
    </button>
  </div>
  );
}
