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
      const W = wide ? Math.min(C * 0.3, 340) : Math.min(C * 0.44, 160);
      const PH = wide ? Math.min(H * 0.9, W * 1.25) : Math.min(W * 1.05, 168);
      const PT = wide ? (H - PH) / 2 : 0;
      const t = p * Math.max(0, total - 1);
      const i = Math.min(Math.floor(t), Math.max(0, total - 2));
      const e = total > 1 ? ease(clamp((t - i - 0.15) / 0.7)) : 0;
      const current = e < 0.5 ? i : i + 1;

      if (wide) {
        const gap = 14;
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
          el.style.visibility = visible ? "inherit" : "hidden";
          if (!visible) return;
          const x = left + width / 2 - W / 2;
          const cut = (W - width) / 2;
          el.style.width = `${W}px`;
          el.style.height = `${PH}px`;
          el.style.transform = `translate3d(${x.toFixed(1)}px,${PT.toFixed(1)}px,0)`;
          el.style.clipPath = `inset(0 ${cut.toFixed(1)}px round 1.75rem)`;
          const img = imgs[k];
          if (img) img.style.transform = `translate3d(${((k === i ? -e : 1 - e) * 24).toFixed(1)}px,${((t - k) * -14).toFixed(1)}px,0) scale(1.15)`;
        });
      } else {
        // En móvil: Foto centrada horizontalmente, rotación suave tipo cortina sin desfasar a los márgenes
        const centerX = (C - W) / 2;
        photos.forEach((el, k) => {
          let width = 0;
          if (k === i) {
            width = W * (1 - e);
          } else if (k === i + 1) {
            width = W * e;
          } else if (total === 1 && k === 0) {
            width = W;
          }
          const visible = width > 0.5;
          el.style.visibility = visible ? "inherit" : "hidden";
          if (!visible) return;
          const cut = (W - width) / 2;
          el.style.width = `${W}px`;
          el.style.height = `${PH}px`;
          el.style.transform = `translate3d(${centerX.toFixed(1)}px,0px,0)`;
          el.style.clipPath = `inset(0 ${cut.toFixed(1)}px round 1.25rem)`;
          const img = imgs[k];
          if (img) img.style.transform = `translate3d(${((k === i ? -e : 1 - e) * 14).toFixed(1)}px,${((t - k) * -8).toFixed(1)}px,0) scale(1.1)`;
        });
      }

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
          el.style.top = `${PH + 10}px`;
          el.style.height = "auto";
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

    let lastHold = NaN;
    const fromStage = () => {
      if (!scene || !document.documentElement.classList.contains("stage-on")) return false;
      const v = parseFloat(scene.style.getPropertyValue("--hold"));
      if (Number.isNaN(v)) return false;
      // Mientras la sección está oculta o el valor no cambió, no se toca nada (antes se reescribían
      // tamaños y posiciones de todas las fotos en cada cuadro del scroll, aunque no se vieran)
      if (scene.style.visibility === "hidden" || v === lastHold) return true;
      lastHold = v;
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

    // Soporte táctil de swipe horizontal para celulares
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0 && shown < total - 1) {
          onDot(shown + 1);
        } else if (dx > 0 && shown > 0) {
          onDot(shown - 1);
        }
      }
    };
    box.addEventListener("touchstart", onTouchStart, { passive: true });
    box.addEventListener("touchend", onTouchEnd, { passive: true });

    // Sincronización con el scroll en móvil cuando la sección está en modo track sticky (sin stage-on)
    const track = box.closest<HTMLElement>(".seccion-nosotros-track");
    let trackFrame = 0;
    const onScrollTrack = () => {
      if (document.documentElement.classList.contains("stage-on")) return;
      if (!track) return;
      if (trackFrame) return;
      trackFrame = requestAnimationFrame(() => {
        trackFrame = 0;
        const rect = track.getBoundingClientRect();
        // Anclado en 68px (top del sticky bajo el header de 64px)
        const topOffset = 68;
        const scrolled = topOffset - rect.top;
        const scrollDistance = track.offsetHeight - window.innerHeight;
        if (scrollDistance <= 0) return;
        const p = clamp(scrolled / scrollDistance);
        apply(p);
      });
    };

    if (track) {
      window.addEventListener("scroll", onScrollTrack, { passive: true });
      window.addEventListener("resize", onScrollTrack);
      onScrollTrack();
    }

    const resize = new ResizeObserver(() => {
      lastHold = NaN;
      apply(progress);
    });
    resize.observe(box);
    window.addEventListener("stage", onStage);
    if (!fromStage()) apply(0);

    return () => {
      resize.disconnect();
      window.removeEventListener("stage", onStage);
      cancelAnimationFrame(tween);
      cancelAnimationFrame(trackFrame);
      dots.forEach((d, k) => d.removeEventListener("click", handlers[k]));
      box.removeEventListener("touchstart", onTouchStart);
      box.removeEventListener("touchend", onTouchEnd);
      if (track) {
        window.removeEventListener("scroll", onScrollTrack);
        window.removeEventListener("resize", onScrollTrack);
      }
    };
  }, [total]);

  return (
    <div
      ref={root}
      className="relative mt-0 h-[min(68vh,520px)] sm:mt-6 sm:h-[min(74vh,600px)] md:h-[min(52vh,500px)] [@media(max-height:820px)]:mt-2"
      style={{ contain: "layout" }}
    >
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
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-white/85 px-2 py-0.5 font-mono text-[10px] font-bold text-ink backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {String(k + 1).padStart(2, "0")}
          </span>
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={m.photo}
              alt={`Foto de ${m.fullName}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top will-change-transform"
            />
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
          <div key={m.slug} data-text className="invisible absolute flex flex-col items-center text-center sm:items-start sm:text-left justify-start sm:justify-center">
            {title && (
              <p data-group className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark sm:text-xs">
                {title}
              </p>
            )}
            <h3 className="mt-0.5 text-2xl font-extrabold tracking-tight sm:mt-2 sm:text-4xl md:text-6xl">
              {m.name.split(" ").map((w, j) => (
                <span key={j} data-word className="inline-block whitespace-pre">
                  {w}{" "}
                </span>
              ))}
            </h3>
            <p className="mt-0.5 text-sm font-semibold leading-snug text-ink/60 sm:mt-1 sm:text-xl md:mt-2 md:text-3xl">
              {sentence.split(" ").map((w, j) => (
                <span key={j} data-word className="inline-block whitespace-pre">
                  {w}{" "}
                </span>
              ))}
            </p>
            <p data-group className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-ink/40 sm:text-xs">
              {m.fullName}
            </p>
            <p data-group className="mt-1 max-w-sm line-clamp-2 text-xs leading-relaxed text-ink/70 sm:mt-3 sm:max-w-md sm:line-clamp-none sm:text-sm md:mt-4 md:text-base">
              {m.bio}
            </p>
            <div data-group className="mt-3 hidden flex-wrap gap-1.5 sm:flex md:mt-4">
              {m.skills.map((t) => (
                <span key={t} className="rounded-full border border-black/10 bg-paper px-2.5 py-0.5 text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
            <div data-group className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-bold sm:mt-4 sm:justify-start sm:gap-x-5 sm:text-sm md:mt-6">
              <Link href={`/equipo/${m.slug}/`} prefetch={false} className="rounded-full bg-ink px-3.5 py-1.5 text-xs text-paper transition hover:bg-brand sm:px-4 sm:py-2 sm:text-sm">
                Leer su historia
              </Link>
              {m.href && (
                <a href={m.href} target="_blank" rel="noopener noreferrer" referrerPolicy="strict-origin-when-cross-origin" className="text-xs text-ink/70 underline underline-offset-4 transition hover:text-brand sm:text-sm sm:no-underline">
                  Ver {m.network ?? "LinkedIn"} →
                </a>
              )}
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 sm:-bottom-12 md:-bottom-12">
          <div className="flex items-end justify-between gap-3">
            <div className="flex gap-3 overflow-hidden sm:gap-6 md:gap-8">
              {team.map((m, k) => (
                <button
                  key={m.slug}
                  type="button"
                  data-dot
                  aria-label={`Ver a ${m.name}`}
                  className="group flex items-baseline gap-1 text-xs font-bold text-ink/30 transition-colors aria-[current=true]:text-ink sm:gap-1.5 sm:text-sm"
                >
                  <span className="font-mono text-[9px] sm:text-[10px]">{String(k + 1).padStart(2, "0")}</span>
                  <span className="hidden sm:inline">{m.name}</span>
                </button>
              ))}
            </div>
            <span data-counter className="font-mono text-[11px] font-bold tabular-nums text-ink/50 sm:text-xs">
              01 / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-ink/10 sm:mt-3">
            <div data-fill className="h-full origin-left rounded-full bg-gradient-to-r from-brand to-amber-400" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      )}
    </div>
  );
}
