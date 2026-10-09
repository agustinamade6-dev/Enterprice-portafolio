"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Anima los elementos con `data-reveal` al entrar en pantalla, tanto al bajar como al subir.
// Si el elemento salió por arriba, vuelve a entrar desde arriba; si salió por abajo, desde abajo.
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-on");
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.classList.add("is-visible");
          } else {
            el.classList.remove("is-visible");
            el.dataset.revealFrom = e.boundingClientRect.top < 0 ? "top" : "bottom";
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
