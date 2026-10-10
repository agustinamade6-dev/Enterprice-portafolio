"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type ShowcaseMember = {
  slug: string;
  name: string;
  fullName: string;
  role: string;
  photo?: string;
  href?: string;
  network?: string;
  bio: string;
  skills: string[];
};

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// "Programador: frontend, backend y diseño" -> ["Programador", "Frontend, backend y diseño"]
const splitRole = (role: string) => {
  const [title, rest] = role.split(":");
  if (!rest) return ["", role];
  const r = rest.trim();
  return [title.trim(), r.charAt(0).toUpperCase() + r.slice(1)];
};

// Presentación del equipo: un integrante a la vez. Al avanzar, la foto se achica hasta ser una franja
// mientras la del siguiente crece a su lado y pasa al otro costado; el texto aparece palabra por palabra.
// Con el escenario (rama efectos) avanza con el scroll; sin él, con los puntos de abajo.
export function TeamShowcase({ team }: { team: ShowcaseMember[] }) {
  const root = useRef<HTMLDivElement>(null);
  const total = team.length;

  useEffect(() => {
    const box = root.current;
    if (!box) return;
    const scene = box.closest<HTMLElement>("[data-hold]");
    const photos = Array.from(box.querySelectorAll<HTMLElement>("[data-photo]"));
    const texts = Array.from(box.querySelectorAll<HTMLElement>("[data-text]"));
    const dots = Array.from(box.querySelectorAll<HTMLElement>("[data-dot]"));
    const counter = box.querySelector<HTMLElement>("[data-counter]");
    const fill = box.querySelector<HTMLElement>("[data-fill]");
    const marquee = box.querySelector<HTMLElement>("[data-marquee]");
    const imgs = photos.map((el) => el.querySelector<HTMLElement>("img"));
    const words = texts.map((t) => Array.from(t.querySelectorAll<HTMLElement>("[data-word]")));
    const groups = texts.map((t) => Array.from(t.querySelectorAll<HTMLElement>("[data-group]")));

    let progress = 0;
    let shown = -1;
    let tween = 0;

    const apply = (p: number) => {
      progress = p;
      const C = box.clientWidth;
      const H = box.clientHeight;
      const wide = C >= 768;
      // Foto de retrato, más chica que el texto: el protagonista es el nombre
      const W = wide ? Math.min(C * 0.3, 340) : Math.min(C * 0.58, 240);
      const PH = wide ? Math.min(H * 0.9, W * 1.25) : Math.min(H * 0.4, W * 1.2);
      const PT = wide ? (H - PH) / 2 : 0;
      const gap = 14;
      const t = p * Math.max(0, total - 1);
      const i = Math.min(Math.floor(t), Math.max(0, total - 2));
      const e = total > 1 ? ease(clamp((t - i - 0.15) / 0.7)) : 0;
      const current = e < 0.5 ? i : i + 1;

      photos.forEach((el, k) => {
        let left = 0;
        let width = 0;
        const fromLeft = i % 2 === 0;
        if (k === i || k === i + 1) {
          // Recorrido pensado de izquierda a derecha; si la actual está a la derecha, se espeja
          const oldLeft = lerp(0, C - W, e);
          const oldW = W * (1 - e);
          const newLeft = oldLeft + oldW + gap * Math.sin(Math.PI * e);
          const newW = W * e;
          left = k === i ? oldLeft : newLeft;
          width = k === i ? oldW : newW;
          if (!fromLeft) left = C - left - width;
        } else if (total === 1 && k === 0) {
          width = W;
        }
        const visible = width > 0.5;
        // "inherit" y no "visible": si la sección entera está oculta (otra escena en pantalla), esto también
        el.style.visibility = visible ? "inherit" : "hidden";
        if (!visible) return;
        // La foto mantiene su tamaño y se recorta: se ve una franja de la imagen, no la imagen aplastada
        const x = left + width / 2 - W / 2;
        const cut = (W - width) / 2;
        el.style.width = `${W}px`;
        el.style.height = `${PH}px`;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${PT.toFixed(1)}px,0)`;
        el.style.clipPath = `inset(0 ${cut.toFixed(1)}px round 1.75rem)`;
        // Leve movimiento de la imagen dentro del marco mientras se hace scroll (paralaje)
        const img = imgs[k];
        if (img) img.style.transform = `translate3d(${((k === i ? -e : 1 - e) * 24).toFixed(1)}px,${((t - k) * -14).toFixed(1)}px,0) scale(1.15)`;
      });

      texts.forEach((el, k) => {
        // El texto que se va termina de desaparecer antes de que entre el siguiente: no se pisan
        const v = k === i ? clamp(1 - 2 * e) : k === i + 1 ? clamp(2 * e - 1) : total === 1 ? 1 : 0;
        // Nunca "visible"/"auto": le ganarían a la sección oculta y sus enlaces quedarían clickeables
        // encima de otras secciones (pasó con "Siguiente" del carrusel, que abría LinkedIn)
        el.style.visibility = v > 0.001 ? "inherit" : "hidden";
        el.style.pointerEvents = v > 0.5 ? "" : "none";
        // Lado del texto: el opuesto a la foto de ese integrante
        const photoLeft = k % 2 === 0;
        if (wide) {
          const tw = Math.min(C - W - 72, 560);
          el.style.width = `${tw}px`;
          el.style.left = photoLeft ? `${W + 72}px` : `${C - W - 72 - tw}px`;
          el.style.top = "0px";
          el.style.height = `${H}px`;
        } else {
          el.style.width = `${C}px`;
          el.style.left = "0px";
          el.style.top = `${PH + 16}px`;
          el.style.height = `${H - PH - 16}px`;
        }
        const list = words[k];
        list.forEach((w, j) => {
          const s = 0.55;
          const wp = clamp((v - (s * j) / Math.max(1, list.length)) / (1 - s));
          w.style.opacity = wp.toFixed(3);
          w.style.transform = `translate3d(0,${((1 - wp) * 0.35).toFixed(3)}em,0)`;
          w.style.filter = wp > 0.99 ? "none" : `blur(${((1 - wp) * 6).toFixed(1)}px)`;
        });
        groups[k].forEach((g) => {
          const gp = clamp((v - 0.45) / 0.55);
          g.style.opacity = gp.toFixed(3);
          g.style.transform = `translate3d(0,${((1 - gp) * 12).toFixed(1)}px,0)`;
        });
      });

      // Lo que acompaña todo el recorrido: la barra se llena y los nombres de fondo se deslizan
      if (fill) fill.style.transform = `scaleX(${p.toFixed(4)})`;
      if (marquee) marquee.style.transform = `translate3d(${(-p * Math.max(0, marquee.scrollWidth - C)).toFixed(1)}px,-50%,0)`;

      if (current !== shown) {
        shown = current;
        dots.forEach((d, k) => d.setAttribute("aria-current", k === current ? "true" : "false"));
        if (counter) counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      }
    };

    const fromStage = () => {
      if (!scene || !document.documentElement.classList.contains("stage-on")) return false;
      const v = parseFloat(scene.style.getPropertyValue("--hold"));
      if (Number.isNaN(v)) return false;
      apply(v);
      return true;
    };
    const onStage = () => fromStage();

    // Sin escenario: los puntos animan hasta el integrante elegido
    const animateTo = (target: number) => {
      cancelAnimationFrame(tween);
      const start = progress;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = clamp((now - t0) / 900);
        apply(lerp(start, target, ease(k)));
        if (k < 1) tween = requestAnimationFrame(step);
      };
      tween = requestAnimationFrame(step);
    };

    const onDot = (k: number) => {
      const target = total > 1 ? k / (total - 1) : 0;
      const holdStart = Number(scene?.dataset.holdStart);
      const holdPx = Number(scene?.dataset.holdPx);
      if (document.documentElement.classList.contains("stage-on") && holdPx > 0) {
        window.scrollTo({ top: holdStart + holdPx * target, behavior: "smooth" });
      } else {
        animateTo(target);
      }
    };
    const handlers = dots.map((d, k) => {
      const h = () => onDot(k);
      d.addEventListener("click", h);
      return h;
    });

    const resize = new ResizeObserver(() => apply(progress));
    resize.observe(box);
    window.addEventListener("stage", onStage);
    if (!fromStage()) apply(0);

    return () => {
      resize.disconnect();
      window.removeEventListener("stage", onStage);
      cancelAnimationFrame(tween);
      dots.forEach((d, k) => d.removeEventListener("click", handlers[k]));
    };
  }, [total]);

  return (
    <div ref={root} className="relative mt-8 h-[min(74vh,600px)] md:h-[min(52vh,500px)] [@media(max-height:820px)]:mt-6" style={{ contain: "layout" }}>
      {/* Nombres gigantes de fondo que se deslizan con el scroll */}
      <div
        aria-hidden
        data-marquee
        className="pointer-events-none absolute left-0 top-1/2 select-none whitespace-nowrap text-[28vw] font-extrabold leading-none tracking-tighter text-transparent will-change-transform md:text-[14rem]"
        style={{ WebkitTextStroke: "1.5px rgba(17,17,17,0.07)" }}
      >
        {team.map((m) => m.name).join(" · ")}
      </div>
      {team.map((m, k) => (
        <div
          key={m.slug}
          data-photo
          className="invisible absolute left-0 top-0 z-10 overflow-hidden bg-ink shadow-2xl shadow-black/20 will-change-transform"
        >
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/85 px-2.5 py-1 font-mono text-[11px] font-bold text-ink backdrop-blur">
            {String(k + 1).padStart(2, "0")}
          </span>
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photo} alt={`Foto de ${m.fullName}`} className="h-full w-full object-cover object-top will-change-transform" />
          ) : (
            <span className="grid h-full w-full place-items-center text-6xl font-extrabold text-paper">
              {m.fullName.charAt(0)}
              {m.fullName.split(" ").at(-1)?.charAt(0)}
            </span>
          )}
        </div>
      ))}

      {team.map((m) => {
        const [title, sentence] = splitRole(m.role);
        return (
          <div key={m.slug} data-text className="invisible absolute flex flex-col justify-center">
            {title && (
              <p data-group className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">
                {title}
              </p>
            )}
            <h3 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">
              {m.name.split(" ").map((w, j) => (
                <span key={j} data-word className="inline-block whitespace-pre">
                  {w}{" "}
                </span>
              ))}
            </h3>
            <p className="mt-1 text-xl font-semibold leading-snug text-ink/60 md:mt-2 md:text-3xl">
              {sentence.split(" ").map((w, j) => (
                <span key={j} data-word className="inline-block whitespace-pre">
                  {w}{" "}
                </span>
              ))}
            </p>
            <p data-group className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/40">
              {m.fullName}
            </p>
            <p data-group className="mt-3 max-w-md text-sm text-ink/70 md:mt-4 md:text-base">
              {m.bio}
            </p>
            <div data-group className="mt-3 hidden flex-wrap gap-1.5 sm:flex md:mt-4">
              {m.skills.map((t) => (
                <span key={t} className="rounded-full border border-black/10 bg-paper px-2.5 py-0.5 text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
            <div data-group className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold md:mt-6">
              <Link href={`/equipo/${m.slug}/`} className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-brand">
                Leer su historia
              </Link>
              {m.href && (
                <a href={m.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                  Ver {m.network ?? "Instagram"} →
                </a>
              )}
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <div className="absolute -bottom-14 left-0 right-0 md:-bottom-12">
          <div className="flex items-end justify-between gap-3">
            <div className="flex gap-4 overflow-hidden md:gap-8">
              {team.map((m, k) => (
                <button
                  key={m.slug}
                  type="button"
                  data-dot
                  aria-label={`Ver a ${m.name}`}
                  className="group flex items-baseline gap-1.5 text-sm font-bold text-ink/30 transition-colors aria-[current=true]:text-ink"
                >
                  <span className="font-mono text-[10px]">{String(k + 1).padStart(2, "0")}</span>
                  <span className="hidden sm:inline">{m.name}</span>
                </button>
              ))}
            </div>
            <span data-counter className="font-mono text-xs font-bold tabular-nums text-ink/50">
              01 / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-ink/10">
            <div data-fill className="h-full origin-left rounded-full bg-gradient-to-r from-brand to-amber-400" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      )}
    </div>
  );
}
