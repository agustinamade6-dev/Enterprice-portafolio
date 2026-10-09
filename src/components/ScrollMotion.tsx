"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// Mueve los bloques marcados con data-reveal según dónde estén en la pantalla:
// "--enter" (0 a 1) mientras suben desde abajo y "--exit" (0 a 1) mientras se van por arriba.
// Los valores se acercan de a poco al objetivo para que el movimiento sea suave.
export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-on");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).map((el) => ({
      el,
      // El retraso de cada tarjeta se traduce en que empieza a entrar un poco más tarde
      delay: (parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0) / 1000,
      enter: 0,
      exit: 0,
    }));

    let frame = 0;
    const tick = () => {
      frame = 0;
      const vh = window.innerHeight;
      let moving = false;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        const center = r.top + Math.min(r.height, vh) / 2;
        const enter = clamp((vh - r.top) / (vh * 0.3) - it.delay * 2);
        const exit = clamp((vh * 0.3 - center) / (vh * 0.45));
        it.enter += (enter - it.enter) * 0.18;
        it.exit += (exit - it.exit) * 0.18;
        if (Math.abs(enter - it.enter) > 0.001 || Math.abs(exit - it.exit) > 0.001) moving = true;
        else {
          it.enter = enter;
          it.exit = exit;
        }
        it.el.style.setProperty("--enter", it.enter.toFixed(3));
        it.el.style.setProperty("--exit", it.exit.toFixed(3));
      }
      if (moving) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
