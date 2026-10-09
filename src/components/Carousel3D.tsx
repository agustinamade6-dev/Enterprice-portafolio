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

export function Carousel3D({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = projects.length;

  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number | null>(null);
  const rotator = useRef<HTMLDivElement>(null);
  const dragFrame = useRef(0);

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
    const angle = currentIndex * -theta + ((dragCurrentX.current - dragStartX.current) / window.innerWidth) * 120;
    el.style.transition = "none";
    el.style.transform = `translateZ(-${radius}px) rotateX(-3deg) rotateY(${angle}deg)`;
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
    if (rotator.current) {
      rotator.current.style.transition = `transform 0.8s ${EASE}`;
      rotator.current.style.transform = `translateZ(-${radius}px) rotateX(-3deg) rotateY(${currentAngle}deg)`;
    }
  };

  // 3D Cylinder Math
  const cardWidth = 680; // 680px for monumental look
  const cardHeight = 420; // 420px
  const theta = total > 0 ? 360 / total : 0;
  // Calculate radius so cards form a perfect polygon, add some padding (offset)
  // Offset de 40 para mantener coherencia en un cilindro más grande
  const radius = total <= 1 ? 0 : Math.round(cardWidth / 2 / Math.tan(Math.PI / total)) + 40;

  // Cylinder rotation
  const currentAngle = currentIndex * -theta;

  // To prevent cards from being unclickable if they are technically "behind" but visible,
  // we manage pointerEvents in CSS.
  // We determine the active absolute index via modulo
  const activeIndex = ((currentIndex % total) + total) % total;

  return (
    <div className="relative w-full overflow-visible select-none py-24">
      {/* 1. Contenedor de la escena (Perspective) - Full Width */}
      <div
        className="relative mx-auto flex h-[500px] w-full items-center justify-center touch-none"
        // contain: el navegador no recalcula el resto de la página cuando el carrusel cambia
        style={{ perspective: "1200px", contain: "layout" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
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
            transform: `translateZ(-${radius}px) rotateX(-3deg) rotateY(${currentAngle}deg)`,
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
            // Solo se dibujan la del frente y dos a cada lado: el resto queda de canto o de espaldas
            const hidden = dist > 100;

            return (
              <div
                key={p.slug}
                className="absolute left-1/2 top-1/2 origin-center"
                style={{
                  height: `${cardHeight}px`,
                  width: `${cardWidth}px`,
                  transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale})`,
                  // Las de atrás no se dibujan: así no se ve el texto invertido y hay menos para pintar
                  backfaceVisibility: "hidden",
                  opacity,
                  transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
                  pointerEvents: isFront ? "auto" : "none",
                  visibility: hidden ? "hidden" : "visible",
                  zIndex: isFront ? 50 : (isBack ? 0 : 10),
                }}
              >
                {/* Fondo sólido opaco obligatorio */}
                <div
                  className="relative h-full w-full rounded-[16px] overflow-hidden bg-white"
                  style={{ boxShadow: "0 18px 40px -16px rgba(0,0,0,0.3)" }}
                >
                  <Card project={p} />
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

      {/* Controles de Navegación */}
      <div className="mt-16 mx-auto flex w-max items-center gap-1 rounded-2xl border border-black/10 bg-black/5 p-1.5 backdrop-blur-md">
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
    </div>
  );
}
