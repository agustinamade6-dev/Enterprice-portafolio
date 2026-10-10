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
      // El retraso de cada tarjeta hace que llegue un poco después que las anteriores
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
      // Primero se miden todos y después se escriben todos: mezclar medir y escribir obliga al
      // navegador a recalcular la página una vez por bloque en cada cuadro (en el celular se notaba)
      const rects = items.map((it) => it.el.getBoundingClientRect());
      items.forEach((it, i) => {
        const r = rects[i];
        const enter = clamp((vh * 0.98 - r.top) / (vh * 0.25));
        // Se va recién cuando su borde de arriba pasa por debajo del menú, así los títulos quietos se ven enteros
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
    };
  }, [pathname]);

  return null;
}
