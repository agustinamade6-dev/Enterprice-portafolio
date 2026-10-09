"use client";

import { useRef, useState } from "react";
import type { Project } from "@/content/site";
import { ProjectCard } from "./ProjectCard";

const FLY_MS = 380; // lo que tarda la carta del frente en salir del mazo
const SWIPE_PX = 50;
const MAX_SLOT = 3; // cartas visibles detrás de la del frente

// Posición de cada carta según su profundidad en el mazo (0 = frente).
function slotStyle(depth: number, leaving: boolean, entering: boolean): React.CSSProperties {
  if (leaving) {
    return { transform: "translateX(55%) rotate(7deg)", opacity: 0, zIndex: 100 };
  }
  if (entering) {
    // Al ir hacia atrás, la última carta sale por la izquierda antes de volver al frente
    return { transform: "translateX(-55%) rotate(-7deg)", opacity: 0, zIndex: 100 };
  }
  const slot = Math.min(depth, MAX_SLOT);
  const tilt = slot === 0 ? 0 : slot % 2 ? -1.4 : 1.2;
  return {
    transform: `translateY(${slot * 16}px) scale(${1 - slot * 0.045}) rotate(${tilt}deg)`,
    opacity: depth > MAX_SLOT ? 0 : 1,
    zIndex: 50 - depth,
    filter: slot === 0 ? undefined : `brightness(${1 - slot * 0.03})`,
  };
}

export function ProjectDeck({ projects }: { projects: Project[] }) {
  const [order, setOrder] = useState(() => projects.map((_, i) => i));
  const [leaving, setLeaving] = useState<number | null>(null);
  const [entering, setEntering] = useState<number | null>(null);
  const drag = useRef<number | null>(null);
  const swiped = useRef(false);
  const total = projects.length;
  const front = order[0];

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const busy = leaving !== null || entering !== null;

  function next() {
    if (busy || total < 2) return;
    if (reduceMotion()) {
      setOrder((o) => [...o.slice(1), o[0]]);
      return;
    }
    setLeaving(order[0]);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(null);
    }, FLY_MS);
  }

  function prev() {
    if (busy || total < 2) return;
    if (reduceMotion()) {
      setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
      return;
    }
    setEntering(order[order.length - 1]);
    window.setTimeout(() => {
      setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
      setEntering(null);
    }, FLY_MS / 2);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  }

  return (
    <div
      role="group"
      aria-roledescription="carrusel"
      aria-label="Proyectos"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="mx-auto max-w-4xl rounded-3xl outline-offset-8 focus-visible:outline-2 focus-visible:outline-brand"
    >
      <div
        className="touch-pan-y overflow-x-clip pb-14"
        onPointerDown={(e) => {
          drag.current = e.clientX;
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          const x0 = drag.current;
          drag.current = null;
          if (x0 === null) return;
          const dx = e.clientX - x0;
          if (Math.abs(dx) > SWIPE_PX) {
            swiped.current = true;
            if (dx < 0) next();
            else prev();
          }
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        // Si fue un arrastre, no abrir el enlace de la carta
        onClickCapture={(e) => {
          if (swiped.current) {
            swiped.current = false;
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div className="grid" aria-live="polite">
          {projects.map((p, i) => {
            const depth = order.indexOf(i);
            const isFront = depth === 0 && leaving !== i && entering !== i;
            return (
              <div
                key={p.slug}
                inert={!isFront}
                aria-hidden={!isFront}
                className={`col-start-1 row-start-1 origin-bottom transition-[transform,opacity,filter] duration-[380ms] ease-[cubic-bezier(.22,.8,.3,1)] motion-reduce:transition-none ${isFront ? "deck-front" : ""}`}
                style={slotStyle(depth, leaving === i, entering === i)}
              >
                <ProjectCard project={p} large compact />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Carta anterior"
          className="grid h-12 w-12 place-items-center rounded-full border border-black/15 bg-white text-xl font-bold transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          ←
        </button>
        <p key={front} className="deck-caption text-center text-sm text-ink/70">
          <span className="font-bold text-ink">
            {front + 1} de {total}
          </span>
          <span className="block">{projects[front].title}</span>
          <span className="mt-0.5 block text-xs text-ink/50 md:hidden">Desliza para ver más</span>
        </p>
        <button
          type="button"
          onClick={next}
          aria-label="Carta siguiente"
          className="grid h-12 w-12 place-items-center rounded-full bg-ink text-xl font-bold text-paper transition hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          →
        </button>
      </div>
    </div>
  );
}
