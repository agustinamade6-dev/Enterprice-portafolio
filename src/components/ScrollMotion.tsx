"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// Mueve los bloques marcados con data-reveal:
// - En PC (mouse): calcula --enter y --exit en cada cuadro según la posición respecto al escenario.
// - En Móvil (!mouse): revelado progresivo suave con IntersectionObserver que permanece siempre visible.
export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const isMobile =
      window.innerWidth <= 1024 ||
      window.matchMedia("(max-width: 1024px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("reveal-on");
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.classList.add("m-revealed");
      });
      return;
    }

    // =========================================================================
    // THEME SHIFT: Detección ambiental según la sección protagónica
    // =========================================================================
    const themeSections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme-section]"));
    let themeFrame = 0;
    const updateTheme = () => {
      themeFrame = 0;
      const vh = window.innerHeight;
      const topZone = vh * 0.35;
      const bottomZone = vh * 0.65;
      const band = bottomZone - topZone; // 30% del alto de pantalla

      const currentTheme = document.body.getAttribute("data-theme") || "light";
      let maxOverlap = 0;
      let candidateTheme = currentTheme;

      for (const el of themeSections) {
        const r = el.getBoundingClientRect();
        const scene = el.closest<HTMLElement>("[data-stage] > *") ?? el;
        const op = scene.style.opacity === "" ? 1 : Number(scene.style.opacity);
        if (op < 0.3) continue;

        const overlap = Math.max(0, Math.min(r.bottom, bottomZone) - Math.max(r.top, topZone));
        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          candidateTheme = el.dataset.themeSection || "light";
        }
      }

      // Histéresis: Solo conmuta de tema si la nueva sección domina claramente (> 50% de la zona focal)
      if (candidateTheme !== currentTheme && maxOverlap >= band * 0.5) {
        document.body.setAttribute("data-theme", candidateTheme);
      }
    };

    const onScrollTheme = () => {
      if (!themeFrame) themeFrame = requestAnimationFrame(updateTheme);
    };

    window.addEventListener("scroll", onScrollTheme, { passive: true });
    window.addEventListener("stage", onScrollTheme);
    window.addEventListener("resize", onScrollTheme);
    updateTheme();

    const cleanupTheme = () => {
      cancelAnimationFrame(themeFrame);
      window.removeEventListener("scroll", onScrollTheme);
      window.removeEventListener("stage", onScrollTheme);
      window.removeEventListener("resize", onScrollTheme);
    };

    // =========================================================================
    // MÓVIL: Revelado suave orgánico con IntersectionObserver
    // =========================================================================
    if (isMobile) {
      root.classList.remove("reveal-on");
      const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (!items.length) {
        return cleanupTheme;
      }

      const vh = window.innerHeight;
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.95 && rect.bottom > 0) {
          el.classList.add("m-revealed");
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.classList.add("m-revealed");
              // Una vez revelado, no se vuelve a apagar para no dejar huecos vacíos
              observer.unobserve(target);
            }
          });
        },
        {
          rootMargin: "0px 0px -30px 0px",
          threshold: 0.05,
        }
      );

      items.forEach((el) => {
        if (!el.classList.contains("m-revealed")) {
          observer.observe(el);
        }
      });

      return () => {
        observer.disconnect();
        cleanupTheme();
      };
    }

    // =========================================================================
    // PC (MOUSE): Lógica original intacta con el escenario
    // =========================================================================
    root.classList.add("reveal-on");

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).map((el) => ({
      el,
      scene: el.closest<HTMLElement>("[data-stage] > *"),
      delay: (parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0) / 1000,
      enter: 0,
      exit: 0,
    }));

    let frame = 0;
    const shown = items.map(() => ["", ""]);
    const tick = () => {
      frame = 0;
      const vh = window.innerHeight;
      let moving = false;
      const awake = items.map((it) => !it.scene || it.scene.style.visibility !== "hidden");
      const rects = items.map((it, i) => (awake[i] ? it.el.getBoundingClientRect() : null));
      items.forEach((it, i) => {
        const r = rects[i];
        if (!r) return;
        const enter = clamp((vh * 0.98 - r.top) / (vh * 0.25));
        const exit = clamp((vh * 0.1 - r.top) / Math.max(vh * 0.35, r.height * 0.8));
        it.enter += (enter - it.enter) * (0.18 / (1 + it.delay * 6));
        it.exit += (exit - it.exit) * 0.18;
        if (Math.abs(enter - it.enter) > 0.001 || Math.abs(exit - it.exit) > 0.001) moving = true;
        else {
          it.enter = enter;
          it.exit = exit;
        }
      });
      items.forEach((it, i) => {
        if (!awake[i]) return;
        const e = it.enter.toFixed(3);
        const x = it.exit.toFixed(3);
        if (shown[i][0] !== e) it.el.style.setProperty("--enter", e);
        if (shown[i][1] !== x) it.el.style.setProperty("--exit", x);
        shown[i] = [e, x];
      });
      if (moving) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("stage", onScroll);
    tick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("stage", onScroll);
      cancelAnimationFrame(frame);
      cleanupTheme();
    };
  }, [pathname]);

  return null;
}
