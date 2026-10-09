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

    // Con mouse (compu) cada giro de la ruedita avanza poco, así que el cambio es más corto y más ágil;
    // con el dedo (celular) se mantiene más largo porque un deslizamiento recorre mucho
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const smooth = mouse ? 0.2 : 0.12;

    let vh = window.innerHeight;
    let starts: number[] = [];
    let inner: number[] = [];
    let over: number[] = [];
    let hold: number[] = [];
    let gap = 0;
    let current = window.scrollY;
    let frame = 0;

    const layout = () => {
      vh = window.innerHeight;
      gap = vh * (mouse ? 0.4 : 0.7); // cuánto scroll dura cada cambio de sección
      over = scenes.map((el) => Math.max(0, el.offsetHeight - vh));
      // data-hold: la sección se queda quieta mientras el scroll avanza su animación interna
      // (por ejemplo, el equipo pasando de un integrante al otro)
      hold = scenes.map((el, i) => {
        // data-hold-fit: solo se queda quieta si la sección casi entra en la pantalla (en celular, donde
        // las tarjetas van una debajo de otra, se recorre normal)
        if (el.dataset.holdFit !== undefined && over[i] > vh * 0.25) return 0;
        return Number(el.dataset.hold ?? 0) * vh * (mouse ? 0.6 : 0.85);
      });
      scenes.forEach((el, i) => el.toggleAttribute("data-holding", hold[i] > 0));
      inner = scenes.map((_, i) => over[i] + hold[i]);
      starts = [];
      let y = 0;
      scenes.forEach((el, i) => {
        starts.push(y);
        if (hold[i]) {
          el.dataset.holdStart = String(y + over[i]);
          el.dataset.holdPx = String(hold[i]);
        }
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
        let shift = -clamp(local, 0, over[i]);
        let scale = 1;
        let leave = 0;

        if (local < 0) {
          // Entrando: aparece en el lugar, acercándose un poco
          // Empieza a aparecer antes de que la anterior termine de irse: nunca queda la pantalla vacía
          const p = ease(clamp(((local + gap) / gap - 0.1) / 0.7));
          opacity = p;
          scale = 1.06 - 0.06 * p;
          shift = (1 - p) * vh * 0.04;
        } else if (local > end) {
          // Saliendo: se aleja y se desvanece sin moverse de lugar
          // Misma curva que la que entra, invertida: entre las dos siempre suman la pantalla completa
          const q = ease(clamp(((local - end) / gap - 0.1) / 0.7));
          leave = q;
          opacity = 1 - q;
          scale = 1 - 0.12 * q;
          shift = -over[i] - q * vh * 0.05;
        }

        const hidden = opacity <= 0.001;
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.visibility = hidden ? "hidden" : "visible";
        el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        el.style.setProperty("--leave", leave.toFixed(3));
        if (hold[i]) el.style.setProperty("--hold", clamp((local - over[i]) / hold[i]).toFixed(4));
      });
    };

    const tick = () => {
      frame = 0;
      const target = window.scrollY;
      current += (target - current) * smooth;
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
    window.dispatchEvent(new Event("stage"));

    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frame);
      root.classList.remove("stage-on");
      document.body.style.height = "";
      for (const el of scenes) {
        el.removeAttribute("style");
        el.removeAttribute("data-holding");
      }
    };
  }, [pathname]);

  return null;
}
