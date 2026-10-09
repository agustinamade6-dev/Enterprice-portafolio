"use client";

import { useEffect, useRef } from "react";

// Listón a cada costado que acompaña todo el recorrido: baja con el scroll, ondula y de a ratos
// hace un rulo. Es un solo trazo SVG por lado que se desplaza con transform (no se redibuja al bajar).
// La curva es una trocoide: cuando el radio supera al paso, la línea se cruza y forma la vuelta.
function ribbonPath(width: number, height: number, phase: number) {
  const cx = width / 2;
  const k = Math.max(10, width * 0.42); // cuánto baja por vuelta
  const steps = Math.ceil(height / k / (Math.PI / 24));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i * Math.PI) / 24;
    // El radio crece y se achica despacio: tramos ondulados y tramos con rulos
    const loop = 0.5 + 0.5 * Math.sin(t * 0.17 + phase);
    const r = k * (0.55 + 0.95 * loop * loop);
    const x = cx + Math.min(r, width * 0.42) * Math.cos(t + phase);
    const y = -k * 2 + k * t - r * Math.sin(t + phase);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function RibbonSides() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = root.current;
    if (!box) return;
    const sides = Array.from(box.querySelectorAll<HTMLElement>("[data-side]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let travel = 0;
    let vh = window.innerHeight;
    // Por lado: largo total del trazo y, cada tantos píxeles de largo, hasta qué altura llega
    const lengths: number[] = [];
    const reach: Float32Array[] = [];
    const SAMPLES = 600;
    let current = 0;
    let frame = 0;

    const build = () => {
      const vw = window.innerWidth;
      vh = window.innerHeight;
      // En compu ocupa el margen libre al costado del contenido; en celular es una cinta finita en el borde
      const free = (vw - 1152) / 2;
      const width = vw < 768 ? 18 : Math.round(Math.max(44, Math.min(130, free - 12)));
      const stroke = vw < 768 ? 3 : Math.max(5, Math.round(width / 11));
      const height = vh * 4;
      travel = height - vh * 1.4;
      sides.forEach((side, n) => {
        const svg = side.querySelector("svg")!;
        side.style.width = `${width}px`;
        svg.setAttribute("width", String(width));
        svg.setAttribute("height", String(height));
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        const d = ribbonPath(width, height, n ? 2.4 : 0.3);
        svg.querySelectorAll("path").forEach((p, j) => {
          p.setAttribute("d", d);
          p.setAttribute("stroke-width", String(j ? Math.max(1, stroke * 0.3) : stroke));
        });
        const grad = svg.querySelector("linearGradient")!;
        grad.setAttribute("y2", String(height));
        // Se mide una sola vez: después, dibujar más o menos es solo cambiar un número
        const path = svg.querySelector("path")!;
        const L = path.getTotalLength();
        const ys = new Float32Array(SAMPLES + 1);
        let top = -Infinity;
        for (let i = 0; i <= SAMPLES; i++) {
          top = Math.max(top, path.getPointAtLength((L * i) / SAMPLES).y);
          ys[i] = top;
        }
        lengths[n] = L;
        reach[n] = ys;
        svg.querySelectorAll("path").forEach((p) => p.setAttribute("stroke-dasharray", `${L} ${L}`));
      });
    };

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const apply = (p: number) => {
      sides.forEach((side, n) => {
        // El de la derecha va un poco desfasado para que no se vean como espejo
        const y = -(p * travel) - (n ? travel * 0.04 : 0);
        side.firstElementChild!.setAttribute("style", `transform: translate3d(0, ${y.toFixed(1)}px, 0)`);
        // Se va formando: llega hasta un poco más abajo de la mitad de la pantalla y crece al bajar
        const ys = reach[n];
        if (!ys) return;
        const tip = vh * 0.72 - y;
        let lo = 0;
        let hi = SAMPLES;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (ys[mid] < tip) lo = mid + 1;
          else hi = mid;
        }
        const offset = lengths[n] * (1 - lo / SAMPLES);
        side.querySelectorAll("path").forEach((el) => el.setAttribute("stroke-dashoffset", offset.toFixed(1)));
      });
    };

    const tick = () => {
      frame = 0;
      const target = progress();
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0002) current = target;
      apply(current);
      if (current !== target) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (reduce) return apply(progress());
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      build();
      apply(current);
    };

    build();
    current = progress();
    apply(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden print:hidden">
      {[0, 1].map((n) => (
        <div key={n} data-side className={`absolute top-0 h-full overflow-hidden ${n ? "right-0" : "left-0"}`}>
          <div className="will-change-transform">
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id={`liston-${n}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1">
                  {/* Colores de la marca: naranja Enterprice, ámbar y coral */}
                  <stop offset="0" stopColor="#f05a28" />
                  <stop offset="0.3" stopColor="#fbbf24" />
                  <stop offset="0.6" stopColor="#fb7185" />
                  <stop offset="1" stopColor="#c8431a" />
                </linearGradient>
              </defs>
              <path stroke={`url(#liston-${n})`} opacity="0.85" />
              {/* Brillo fino encima: le da aspecto de cinta y no de línea */}
              <path stroke="white" opacity="0.45" transform="translate(-1.5 -1.5)" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
