"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
// Curva suave para PC: arranca y frena sin tirones
const ease = (t: number) => t * t * t * (t * (6 * t - 15) + 10);

export function ScrollStage() {
  const pathname = usePathname();

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>("[data-stage]");
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile =
      window.innerWidth <= 1024 ||
      window.matchMedia("(max-width: 1024px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const root = document.documentElement;

    // =========================================================================
    // MÓVIL (PANTALLA TÁCTIL / <= 1024px / CELULAR):
    // Scroll 100% nativo, continuo y sin bloqueo ni fijación de pantalla
    // =========================================================================
    if (isMobile) {
      root.classList.remove("stage-on", "stage-touch");

      const bar = document.createElement("div");
      bar.className = "stage-progress";
      const hint = document.createElement("div");
      hint.className = "stage-hint";
      hint.innerHTML = '<i aria-hidden="true"></i><span>Desliza para ver más</span>';
      document.body.append(bar, hint);

      let frame = 0;
      const onScrollMobile = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight;
          const winHeight = window.innerHeight;
          const maxScroll = Math.max(1, docHeight - winHeight);
          const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
          bar.style.transform = `scaleX(${progress.toFixed(4)})`;

          const hintOpacity = Math.max(0, 1 - scrollY / 120);
          hint.style.opacity = hintOpacity.toFixed(3);
          hint.style.visibility = hintOpacity <= 0.005 ? "hidden" : "visible";
        });
      };

      const onClickMobile = (e: MouseEvent) => {
        const a = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
        if (!a || a.pathname !== window.location.pathname) return;
        const hash = a.hash.slice(1);
        if (!hash) return;
        const target = document.getElementById(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, "", a.hash);
        }
      };

      window.addEventListener("scroll", onScrollMobile, { passive: true });
      window.addEventListener("resize", onScrollMobile);
      document.addEventListener("click", onClickMobile, true);
      onScrollMobile();

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScrollMobile);
        window.removeEventListener("resize", onScrollMobile);
        document.removeEventListener("click", onClickMobile, true);
        bar.remove();
        hint.remove();
      };
    }

    // =========================================================================
    // PC (COMPU CON MOUSE):
    // Escenario virtual interactivo original intacto
    // =========================================================================
    const scenes = Array.from(stage.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.classList.contains("scroll-anchor"),
    );
    root.classList.add("stage-on");
    root.classList.remove("stage-touch");

    const smooth = 0.13;

    const bar = document.createElement("div");
    bar.className = "stage-progress";
    const hint = document.createElement("div");
    hint.className = "stage-hint";
    hint.innerHTML = '<i aria-hidden="true"></i><span>Desliza para ver más</span>';
    document.body.append(bar, hint);

    let vh = window.innerHeight;
    let starts: number[] = [];
    let inner: number[] = [];
    let over: number[] = [];
    let hold: number[] = [];
    let gap = 0;
    let current = window.scrollY;
    let frame = 0;
    let last = 0;
    let total = 1;

    const layout = () => {
      vh = window.innerHeight;
      gap = vh * 0.3;
      over = scenes.map((el) => Math.max(0, el.offsetHeight - vh));
      hold = scenes.map((el, i) => {
        if (el.dataset.holdFit !== undefined && over[i] > vh * 0.25) return 0;
        return Number(el.dataset.hold ?? 0) * vh * 0.6;
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
      total = starts[starts.length - 1] + inner[inner.length - 1];
      document.body.style.height = `${total + vh}px`;
    };

    const asleep = scenes.map(() => false);
    const written = scenes.map(() => new Map<string, string>());
    const put = (i: number, prop: string, value: string) => {
      if (written[i].get(prop) === value) return;
      written[i].set(prop, value);
      scenes[i].style.setProperty(prop, value);
    };
    let barShown = "";
    let hintShown = "";

    const render = (y: number) => {
      const barNow = `scaleX(${clamp(y / total).toFixed(4)})`;
      if (barNow !== barShown) bar.style.transform = barShown = barNow;
      const hintNow = clamp(1 - y / (vh * 0.35)).toFixed(3);
      if (hintNow !== hintShown) {
        hintShown = hintNow;
        hint.style.opacity = hintNow;
        hint.style.visibility = hintNow === "0.000" ? "hidden" : "visible";
      }
      scenes.forEach((el, i) => {
        const local = y - starts[i];
        const end = inner[i];
        let opacity = 1;
        let shift = -clamp(local, 0, over[i]);
        let scale = 1;
        let leave = 0;

        if (local < 0) {
          const p = ease(clamp(((local + gap) / gap - 0.1) / 0.7));
          opacity = p;
          scale = 1.06 - 0.06 * p;
          shift = (1 - p) * vh * 0.04;
        } else if (local > end) {
          const q = ease(clamp(((local - end) / gap - 0.1) / 0.7));
          leave = q;
          opacity = 1 - q;
          scale = 1 - 0.12 * q;
          shift = -over[i] - q * vh * 0.05;
        }

        const hidden = opacity <= 0.001;
        if (hidden && asleep[i]) return;
        asleep[i] = hidden;
        put(i, "will-change", hidden ? "auto" : "transform, opacity");
        put(i, "opacity", opacity.toFixed(3));
        put(i, "transform", `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`);
        put(i, "visibility", hidden ? "hidden" : "visible");
        put(i, "pointer-events", opacity > 0.5 ? "auto" : "none");
        put(i, "--leave", leave.toFixed(3));
        if (hold[i]) put(i, "--hold", clamp((local - over[i]) / hold[i]).toFixed(4));
      });
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const target = window.scrollY;
      current += (target - current) * (1 - Math.pow(1 - smooth, dt / 16.7));
      if (Math.abs(target - current) < 0.4) current = target;
      render(current);
      window.dispatchEvent(new Event("stage"));
      if (current !== target) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

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
    // Las imágenes de las escenas siguientes (carrusel, equipo) se bajaban y decodificaban recién
    // al aparecer, justo en medio de la transición, y la trababan. Con la página ya cargada y el
    // navegador libre, se piden todas y se dejan decodificadas para que el cambio de escena sea liso.
    const warm = () => {
      document.querySelectorAll<HTMLImageElement>("[data-stage] img").forEach((img) => {
        img.loading = "eager";
        img.decode?.().catch(() => {});
      });
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const warmId = idle(warm);
    if (window.location.hash) goTo(window.location.hash.slice(1));
    current = window.scrollY;
    render(current);
    window.dispatchEvent(new Event("stage"));

    return () => {
      (window.cancelIdleCallback ?? window.clearTimeout)(warmId);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frame);
      bar.remove();
      hint.remove();
      root.classList.remove("stage-on", "stage-touch");
      document.body.style.height = "";
      written.forEach((w) => w.clear());
      for (const el of scenes) {
        el.removeAttribute("style");
        el.removeAttribute("data-holding");
        el.removeAttribute("data-in");
      }
    };
  }, [pathname]);

  return null;
}
