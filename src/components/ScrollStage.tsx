"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const ease = (t: number) => t * t * (3 - 2 * t);

// Escenario fijo: la pantalla no se desplaza. El scroll solo marca el avance y cada sección
// cambia en el lugar: la que se va se aleja y se desvanece, la siguiente aparece acercándose.
// Si una sección es más alta que la pantalla, se recorre por dentro antes de cambiar.
export function ScrollStage() {
  const pathname = usePathname();

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>("[data-stage]");
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scenes = Array.from(stage.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.classList.contains("scroll-anchor"),
    );
    const root = document.documentElement;
    root.classList.add("stage-on");

    let vh = window.innerHeight;
    let starts: number[] = [];
    let inner: number[] = [];
    let gap = 0;
    let current = window.scrollY;
    let frame = 0;

    const layout = () => {
      vh = window.innerHeight;
      gap = vh * 0.9; // cuánto scroll dura cada cambio de sección
      inner = scenes.map((el) => Math.max(0, el.offsetHeight - vh));
      starts = [];
      let y = 0;
      scenes.forEach((_, i) => {
        starts.push(y);
        y += inner[i] + gap;
      });
      const total = starts[starts.length - 1] + inner[inner.length - 1];
      document.body.style.height = `${total + vh}px`;
    };

    const render = (y: number) => {
      scenes.forEach((el, i) => {
        const local = y - starts[i];
        const end = inner[i];
        let opacity = 1;
        let shift = -clamp(local, 0, end);
        let scale = 1;
        let leave = 0;

        if (local < 0) {
          // Entrando: aparece en el lugar, acercándose un poco
          const p = ease(clamp(((local + gap) / gap - 0.45) / 0.55));
          opacity = p;
          scale = 1.06 - 0.06 * p;
          shift = (1 - p) * vh * 0.04;
          if (local <= -gap) shift = vh * 1.1;
        } else if (local > end) {
          // Saliendo: se aleja y se desvanece sin moverse de lugar
          const q = ease(clamp((local - end) / gap / 0.5));
          leave = q;
          opacity = 1 - q;
          scale = 1 - 0.12 * q;
          shift = -end - q * vh * 0.05;
          if (local >= end + gap) shift = -end - vh * 1.1;
        }

        const hidden = opacity <= 0.001;
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.visibility = hidden ? "hidden" : "visible";
        el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        el.style.setProperty("--leave", leave.toFixed(3));
      });
    };

    const tick = () => {
      frame = 0;
      const target = window.scrollY;
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.5) current = target;
      render(current);
      // Avisa a ScrollMotion para que las tarjetas se muevan con el escenario
      window.dispatchEvent(new Event("stage"));
      if (current !== target) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Los enlaces a secciones (#proyectos, /#servicios...) saltan al momento de esa sección
    const goTo = (id: string) => {
      const marker = document.getElementById(id);
      const scene = marker?.classList.contains("scroll-anchor") ? marker.nextElementSibling : null;
      const i = scenes.indexOf(scene as HTMLElement);
      if (i < 0) return false;
      window.scrollTo({ top: starts[i], behavior: "instant" });
      return true;
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.pathname !== window.location.pathname) return;
      if (goTo(a.hash.slice(1))) {
        e.preventDefault();
        history.replaceState(null, "", a.hash);
      }
    };

    const resize = new ResizeObserver(() => {
      layout();
      onScroll();
    });
    scenes.forEach((el) => resize.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("click", onClick, true);
    layout();
    if (window.location.hash) goTo(window.location.hash.slice(1));
    current = window.scrollY;
    render(current);

    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frame);
      root.classList.remove("stage-on");
      document.body.style.height = "";
      for (const el of scenes) el.removeAttribute("style");
    };
  }, [pathname]);

  return null;
}
