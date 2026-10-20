"use client";

import React, { useState, useRef, useEffect, memo, useMemo } from "react";
import type { Project } from "@/lib/content/schemas";
import { ProjectCard } from "./ProjectCard";

const SWIPE_THRESHOLD = 40;
const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";

// La tarjeta no cambia al girar el cilindro: memorizada, React no la vuelve a dibujar en cada cambio
const Card = memo(function Card({ project }: { project: Project }) {
  return <ProjectCard project={project} large compact />;
});

// Silueta de las tarjetas del fondo: simulación ligera de ventana de navegador
const Ghost = memo(function Ghost({ accent }: { accent: string; narrow?: boolean }) {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-[20px] bg-white shadow-xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="absolute top-0 inset-x-0 z-10 flex h-9 items-center justify-between bg-white/85 px-3.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        </div>
        <div className="h-3.5 w-24 rounded border border-black/5 bg-white shadow-2xs" />
        <div className="h-4 w-12 rounded-full bg-black/10" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
        <div className="mb-1.5 h-2 w-14 rounded bg-white/40" />
        <div className="mb-2 h-4 w-36 rounded bg-white/60" />
        <div className="flex gap-1.5">
          <div className="h-3.5 w-10 rounded-full bg-white/30" />
          <div className="h-3.5 w-14 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
});

const KIND_ORDER = ["real", "prototipo", "desarrollo", "facultad", "concepto"] as const;

const KIND_LABELS: Record<string, string> = {
  real: "Reales",
  prototipo: "Prototipos",
  desarrollo: "En desarrollo",
  facultad: "Facultad",
  concepto: "Conceptos",
};

export function Carousel3D({ projects }: { projects: Project[] }) {
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [selectedKind, setSelectedKind] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = projects.length;

  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number | null>(null);
  const rotator = useRef<HTMLDivElement>(null);
  const dragFrame = useRef(0);
  const scene = useRef<HTMLDivElement>(null);
  // Ancho disponible: en celular la tarjeta se achica para entrar en la pantalla
  const [space, setSpace] = useState(0);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const measure = () => setSpace(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewMode]);

  const next = () => setCurrentIndex((prev) => prev + 1);
  const prev = () => setCurrentIndex((prev) => prev - 1);

  // Navegación por teclado (activa solo en modo 3D)
  useEffect(() => {
    if (viewMode !== "3d") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, viewMode]);

  // Lista de tipos de proyectos disponibles y sus conteos
  const availableKinds = useMemo(() => {
    const set = new Set(projects.map((p) => p.kind));
    return KIND_ORDER.filter((k) => set.has(k as any));
  }, [projects]);

  const countsByKind = useMemo(() => {
    const counts: Record<string, number> = { todos: projects.length };
    for (const p of projects) {
      counts[p.kind] = (counts[p.kind] || 0) + 1;
    }
    return counts;
  }, [projects]);

  // Proyectos filtrados para la vista de grilla
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedKind !== "todos" && p.kind !== selectedKind) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.by && p.by.some((b) => b.toLowerCase().includes(q)))
      );
    });
  }, [projects, selectedKind, search]);

  const handleFocusIn3D = (index: number) => {
    setCurrentIndex(index);
    setViewMode("3d");
    if (typeof window !== "undefined") {
      document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSwitchToGrid = () => {
    setViewMode("grid");
    if (typeof window !== "undefined") {
      document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSwitchTo3D = () => {
    setViewMode("3d");
    if (typeof window !== "undefined") {
      document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3D Cylinder Math
  const narrow = space > 0 && space < 768;
  const cardWidth = narrow ? Math.min(360, space - 24) : 700;
  const cardHeight = narrow ? 310 : 390;
  const theta = total > 0 ? 360 / total : 0;
  const radius = total <= 1 ? 0 : Math.round(cardWidth / 2 / Math.tan(Math.PI / total)) + 40;
  const lift = -Math.round(radius * Math.sin((3 * Math.PI) / 180));
  const currentAngle = currentIndex * -theta;
  const activeIndex = ((currentIndex % total) + total) % total;

  // Mientras se arrastra, el giro se aplica directo al cilindro (un cambio por cuadro, sin redibujar con React)
  const applyDrag = () => {
    dragFrame.current = 0;
    const el = rotator.current;
    if (!el || dragStartX.current === null || dragCurrentX.current === null) return;
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
    if (rotator.current) {
      rotator.current.style.transition = `transform 0.8s ${EASE}`;
      rotator.current.style.transform = `translateY(${lift}px) translateZ(-${radius}px) rotateX(-3deg) rotateY(${currentAngle}deg)`;
    }
  };

  return (
    <div className="relative w-full overflow-visible select-none py-4 md:py-6">
      {/* 1. Selector de Vista Superior (Carrusel 3D vs Ver todos) */}
      <div className="mx-auto mb-8 flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.04] p-1.5 backdrop-blur-md shadow-2xs">
          <button
            type="button"
            onClick={handleSwitchTo3D}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
              viewMode === "3d"
                ? "bg-white text-ink shadow-sm"
                : "text-ink/60 hover:bg-black/5 hover:text-ink"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-brand">
              <circle cx="12" cy="12" r="9" />
              <path d="m10 15 5-3-5-3v6Z" fill="currentColor" />
            </svg>
            <span>Carrusel 3D</span>
          </button>
          <button
            type="button"
            onClick={handleSwitchToGrid}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-white text-ink shadow-sm"
                : "text-ink/60 hover:bg-black/5 hover:text-ink"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-brand">
              <rect width="7" height="7" x="3" y="3" rx="1.5" />
              <rect width="7" height="7" x="14" y="3" rx="1.5" />
              <rect width="7" height="7" x="14" y="14" rx="1.5" />
              <rect width="7" height="7" x="3" y="14" rx="1.5" />
            </svg>
            <span>Ver todos ({total})</span>
          </button>
        </div>

        <div className="text-center sm:text-right">
          {viewMode === "3d" ? (
            <p className="text-xs text-ink/70">
              <span className="font-bold text-ink">Proyecto {activeIndex + 1} de {total}</span> · Arrastra o usa las flechas
            </p>
          ) : (
            <p className="text-xs text-ink/70">
              Catálogo completo · <span className="font-bold text-ink">{filteredProjects.length}</span> {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
            </p>
          )}
        </div>
      </div>

      {/* 2. VISTA CARRUSEL 3D */}
      {viewMode === "3d" && (
        <div className="w-full">
          {/* Contenedor de la escena (Perspective) - Full Width */}
          <div
            ref={scene}
            className="relative mx-auto flex w-full items-center justify-center touch-pan-y"
            style={{ height: cardHeight + 40, perspective: "1200px", contain: "layout" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Contenedor del cilindro (Rotator) */}
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
                const opacity = isFront ? 1 : Math.max(0.35, 1 - dist / 140);
                const scale = isFront ? 1.05 : 0.85;
                const shade = isFront ? 0 : isBack ? 0.4 : 0.2;
                const ghost = dist > 100;

                return (
                  <div
                    key={p.slug}
                    className="absolute left-1/2 top-1/2 origin-center"
                    style={{
                      height: `${cardHeight}px`,
                      width: `${cardWidth}px`,
                      transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale})`,
                      backfaceVisibility: ghost ? "visible" : "hidden",
                      opacity: ghost ? 0.35 : opacity,
                      transition: `opacity 0.8s ${EASE}, transform 0.8s ${EASE}`,
                      pointerEvents: isFront ? "auto" : "none",
                      zIndex: isFront ? 50 : isBack ? 0 : 10,
                    }}
                  >
                    <div
                      className="relative h-full w-full rounded-[20px] overflow-hidden bg-white"
                      style={{ boxShadow: ghost ? "none" : "0 18px 40px -16px rgba(0,0,0,0.15)" }}
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

          {/* Controles de Navegación 3D */}
          <div className="mt-8 mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
            <div className="flex items-center gap-1 rounded-2xl border border-black/10 bg-black/5 p-1.5 backdrop-blur-md">
              <button
                type="button"
                onClick={prev}
                aria-label="Proyecto anterior"
                className="rounded-xl px-5 py-2 text-sm font-bold text-ink transition hover:bg-black/5"
              >
                ← Anterior
              </button>
              <div className="h-5 w-[1px] bg-black/10" />
              <span className="px-3 text-xs font-semibold text-ink/70">
                {activeIndex + 1} de {total}
              </span>
              <div className="h-5 w-[1px] bg-black/10" />
              <button
                type="button"
                onClick={next}
                aria-label="Proyecto siguiente"
                className="rounded-xl px-5 py-2 text-sm font-bold text-ink transition hover:bg-black/5"
              >
                Siguiente →
              </button>
            </div>

            <button
              type="button"
              onClick={handleSwitchToGrid}
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/90 px-5 py-2.5 text-sm font-bold text-ink shadow-xs backdrop-blur-md transition hover:border-ink hover:bg-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-brand">
                <rect width="7" height="7" x="3" y="3" rx="1.5" />
                <rect width="7" height="7" x="14" y="3" rx="1.5" />
                <rect width="7" height="7" x="14" y="14" rx="1.5" />
                <rect width="7" height="7" x="3" y="14" rx="1.5" />
              </svg>
              <span>Ver todos los proyectos ({total})</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. VISTA GRILLA COMPLETA (Ver todos los proyectos) */}
      {viewMode === "grid" && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-300">
          {/* Barra de Filtros por Categoría y Buscador */}
          <div className="mb-8 flex flex-col gap-4">
            {/* Buscador rápido */}
            <div className="relative mx-auto w-full max-w-md">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink/40">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <circle cx="9" cy="9" r="6" />
                  <path d="m14 14 4 4" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, tecnología o rubro..."
                className="w-full rounded-2xl border border-black/10 bg-white py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/40 hover:text-ink"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Pastillas de filtro por tipo */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedKind("todos")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedKind === "todos"
                    ? "bg-ink text-paper shadow-sm"
                    : "border border-black/10 bg-white/80 text-ink/70 hover:bg-white hover:text-ink"
                }`}
              >
                <span>Todos</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    selectedKind === "todos" ? "bg-white/20 text-white" : "bg-black/5 text-ink/70"
                  }`}
                >
                  {countsByKind.todos}
                </span>
              </button>

              {availableKinds.map((kind) => {
                const isSelected = selectedKind === kind;
                const count = countsByKind[kind] || 0;
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setSelectedKind(kind)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-brand text-white shadow-sm"
                        : "border border-black/10 bg-white/80 text-ink/70 hover:bg-white hover:text-ink"
                    }`}
                  >
                    <span>{KIND_LABELS[kind] || kind}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-black/5 text-ink/70"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grilla de Proyectos */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p) => {
                const originalIndex = projects.findIndex((orig) => orig.slug === p.slug);
                return (
                  <div
                    key={p.slug}
                    className="group/grid flex flex-col overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl"
                  >
                    <div className="relative h-[360px] sm:h-[380px] w-full overflow-hidden">
                      <ProjectCard project={p} large compact />
                    </div>
                    <div className="flex items-center justify-between border-t border-black/5 bg-[#faf9f7] px-4 py-2.5 text-xs text-ink/75">
                      <span className="truncate max-w-[170px] font-medium text-ink/60">
                        {p.sector} {p.by?.length ? `· Por ${p.by.join(", ")}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleFocusIn3D(originalIndex !== -1 ? originalIndex : 0)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink shadow-2xs transition hover:border-brand hover:text-brand"
                        title={`Ver "${p.title}" en el carrusel 3D`}
                      >
                        <span className="text-xs">🎡</span>
                        <span>Ver en 3D</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="my-12 rounded-3xl border border-dashed border-black/15 bg-white/60 p-12 text-center">
              <p className="text-3xl">🔍</p>
              <h3 className="mt-3 text-lg font-bold text-ink">No encontramos proyectos con ese criterio</h3>
              <p className="mt-1 text-sm text-ink/60">
                Prueba buscando con otro término o seleccionando otra categoría.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedKind("todos");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper transition hover:bg-brand"
              >
                Restablecer filtros
              </button>
            </div>
          )}

          {/* Pie de la grilla con botón para volver al carrusel 3D */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 pt-8">
            <p className="text-xs text-ink/60">
              Mostrando <span className="font-bold text-ink">{filteredProjects.length}</span> de{" "}
              <span className="font-bold text-ink">{total}</span> proyectos disponibles
            </p>
            <button
              type="button"
              onClick={handleSwitchTo3D}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-bold text-ink shadow-xs transition hover:border-ink hover:bg-paper"
            >
              <span>← Volver a vista de Carrusel 3D</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
