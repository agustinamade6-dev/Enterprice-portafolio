"use client";

import { useEffect, useRef } from "react";

// Listón a cada costado que acompaña todo el recorrido: baja con el scroll, ondula y de a ratos
// hace un rulo. Es un solo trazo SVG por lado que se desplaza con transform (no se redibuja al bajar).
// La curva es una trocoide: cuando el radio supera al paso, la línea se cruza y forma la vuelta.
function ribbonPoints(width: number, height: number, phase: number) {
  const cx = width / 2;
  const k = Math.max(10, width * 0.42); // cuánto baja por vuelta
  const steps = Math.ceil(height / k / (Math.PI / 24));
  const pts = new Float32Array((steps + 1) * 2);
  for (let i = 0; i <= steps; i++) {
    const t = (i * Math.PI) / 24;
    // El radio crece y se achica despacio: tramos ondulados y tramos con rulos
    const loop = 0.5 + 0.5 * Math.sin(t * 0.17 + phase);
    const r = k * (0.55 + 0.95 * loop * loop);
    pts[i * 2] = cx + Math.min(r, width * 0.42) * Math.cos(t + phase);
    pts[i * 2 + 1] = k * t - r * Math.sin(t + phase);
  }
  return pts;
}

// El trazo es una línea quebrada, así que su largo y hasta dónde llega se calculan con cuentas
// (antes se medía con getPointAtLength, que en el celular tardaba casi medio segundo al abrir la página)
function measure(pts: Float32Array, samples: number) {
  const n = pts.length / 2;
  const acc = new Float32Array(n);
  for (let i = 1; i < n; i++) {
    acc[i] = acc[i - 1] + Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1]);
  }
  const L = acc[n - 1];
  const ys = new Float32Array(samples + 1);
  let top = -Infinity;
  let seg = 1;
  for (let s = 0; s <= samples; s++) {
    const at = (L * s) / samples;
    while (seg < n - 1 && acc[seg] < at) {
      top = Math.max(top, pts[seg * 2 + 1]);
      seg++;
    }
    const f = (at - acc[seg - 1]) / Math.max(1e-6, acc[seg] - acc[seg - 1]);
    const y = pts[seg * 2 - 1] + (pts[seg * 2 + 1] - pts[seg * 2 - 1]) * Math.min(1, Math.max(0, f));
    top = Math.max(top, pts[1], y);
    ys[s] = top;
  }
  return { L, ys };
}

function toPath(pts: Float32Array) {
  let d = "";
  for (let i = 0; i < pts.length; i += 2) d += `${i ? "L" : "M"}${pts[i].toFixed(1)} ${pts[i + 1].toFixed(1)}`;
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
      travel = height - vh;
      sides.forEach((side, n) => {
        const svg = side.querySelector("svg")!;
        side.style.width = `${width}px`;
        svg.setAttribute("width", String(width));
        svg.setAttribute("height", String(height));
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        const pts = ribbonPoints(width, height, n ? 2.4 : 0.3);
        const d = toPath(pts);
        svg.querySelectorAll("path").forEach((p, j) => {
          p.setAttribute("d", d);
          p.setAttribute("stroke-width", String(j ? Math.max(1, stroke * 0.3) : stroke));
        });
        const grad = svg.querySelector("linearGradient")!;
        grad.setAttribute("y2", String(height));
        // Se mide una sola vez: después, dibujar más o menos es solo cambiar un número
        const { L, ys } = measure(pts, SAMPLES);
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
        const y = -(p * travel);
        side.firstElementChild!.setAttribute("style", `transform: translate3d(0, ${y.toFixed(1)}px, 0)`);
        // El lienzo empieza y termina con la página: arriba de todo no hay nada dibujado, y al llegar
        // al final está completo. La punta va de arriba (inicio) a abajo de la pantalla (final).
        const ys = reach[n];
        if (!ys) return;
        const tip = p * vh - y;
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
    // En el celular la barra del navegador aparece y desaparece al bajar y cambia el alto de la
    // pantalla: solo se rearma el listón si cambia el ancho o el alto cambia de verdad (girar el celu)
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === lastW && Math.abs(h - lastH) < 160) return;
      lastW = w;
      lastH = h;
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
                  {/* Colores de la marca: naranja de la marca, ámbar y coral */}
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
