"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Mueve las secciones marcadas con data-scene según el scroll: cada una queda fija
// cuando se ve entera (o su final) y "--cover" (0 a 1) indica cuánto la tapó la siguiente.
export function ScrollScenes() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    if (!scenes.length) return;

    let frame = 0;
    const layout = () => {
      const vh = window.innerHeight;
      for (const el of scenes) el.style.setProperty("--scene-top", `${Math.min(0, vh - el.offsetHeight)}px`);
    };
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const covers = scenes.map((_, i) => {
        const next = scenes[i + 1];
        if (!next) return 0;
        const top = next.getBoundingClientRect().top;
        // Si la siguiente ya asoma al cargar (el inicio es más bajo que la pantalla),
        // se cuenta desde ahí para que todo arranque sin oscurecer.
        const marker = next.previousElementSibling as HTMLElement | null;
        const start = Math.min(vh, marker?.classList.contains("scroll-anchor") ? marker.offsetTop : vh);
        return Math.min(1, Math.max(0, 1 - top / start));
      });
      scenes.forEach((el, i) => el.style.setProperty("--cover", covers[i].toFixed(3)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const resize = new ResizeObserver(() => {
      layout();
      onScroll();
    });
    scenes.forEach((el) => resize.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    layout();
    update();

    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
