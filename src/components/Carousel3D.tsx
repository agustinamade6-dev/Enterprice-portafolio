"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import type { Project } from "@/lib/content/schemas";
import { ProjectCard } from "./ProjectCard";

const SWIPE_THRESHOLD = 40;

export function Carousel3D({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = projects.length;

  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

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

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    dragCurrentX.current = e.clientX;
    setDragOffset(e.clientX - dragStartX.current);
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
    setDragOffset(0);
  };

  // 3D Cylinder Math
  const cardWidth = 680; // 680px for monumental look
  const cardHeight = 420; // 420px
  const theta = total > 0 ? 360 / total : 0;
  // Calculate radius so cards form a perfect polygon, add some padding (offset)
  const radius = useMemo(() => {
    if (total <= 1) return 0;
    // Offset reducido a 40 para mantener coherencia en un cilindro más grande
    return Math.round((cardWidth / 2) / Math.tan(Math.PI / total)) + 40;
  }, [total, cardWidth]);

  // Cylinder rotation
  let currentAngle = currentIndex * -theta;
  if (dragStartX.current !== null) {
    // Add manual rotation based on drag distance
    currentAngle += (dragOffset / window.innerWidth) * 120;
  }

  // To prevent cards from being unclickable if they are technically "behind" but visible,
  // we manage pointerEvents in CSS.
  // We determine the active absolute index via modulo
  const activeIndex = ((currentIndex % total) + total) % total;

  return (
    <div className="relative w-full overflow-visible select-none py-24">
      {/* 1. Contenedor de la escena (Perspective) - Full Width */}
      <div 
        className="relative mx-auto flex h-[500px] w-full items-center justify-center touch-none"
        style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* 2. Contenedor del cilindro (Rotator) */}
        {/* Agregamos rotateX(-3deg) para envolver visualmente al usuario y translateZ(-radius) */}
        <div
          className="absolute"
          style={{
            height: `${cardHeight}px`,
            width: `${cardWidth}px`,
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateX(-3deg) rotateY(${currentAngle}deg)`,
            transition: dragStartX.current !== null ? "none" : "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
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
            const blur = isFront ? 0 : (isBack ? 3 : 1.5); // Más blur atrás para tapar el texto invertido
            const brightness = isFront ? 1 : (isBack ? 0.6 : 0.8);

            return (
              <div
                key={p.slug}
                className="absolute left-1/2 top-1/2 origin-center"
                style={{
                  height: `${cardHeight}px`,
                  width: `${cardWidth}px`,
                  transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale})`,
                  backfaceVisibility: "visible", // Hacemos visible el reverso
                  opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                  transition: "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                  pointerEvents: isFront ? "auto" : "none", 
                  zIndex: isFront ? 50 : (isBack ? 0 : 10),
                }}
              >
                {/* Fondo sólido opaco obligatorio */}
                <div 
                  className="h-full w-full rounded-[16px] overflow-hidden bg-white"
                  style={{
                    boxShadow: isFront ? "0 25px 50px -12px rgba(0,0,0,0.25)" : "0 4px 10px -2px rgba(0,0,0,0.3)",
                    transition: "box-shadow 0.8s",
                  }}
                >
                  <ProjectCard project={p} large compact />
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
