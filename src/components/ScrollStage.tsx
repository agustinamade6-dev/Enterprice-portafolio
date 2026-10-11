"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
// Curva más suave que la anterior: arranca y frena sin tirones (la misma idea que usa scroll-world)
const ease = (t: number) => t * t * t * (t * (6 * t - 15) + 10);

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
    // Cuánto se acerca el escenario al scroll real en cada cuadro (a 60 cuadros por segundo).
    // Más bajo = se desliza más, como si flotara. Se corrige según los cuadros por segundo de la
    // pantalla, así se siente igual en un monitor de 60 Hz, de 144 Hz o en un celular lento.
    const smooth = mouse ? 0.13 : 0.16;

    // Barra de avance arriba y aviso de "desliza" en el inicio (ideas de scroll-world)
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
      gap = vh * (mouse ? 0.3 : 0.5); // cuánto scroll dura cada cambio de sección
      over = scenes.map((el) => Math.max(0, el.offsetHeight - vh));
      // data-hold: la sección se queda quieta mientras el scroll avanza su animación interna
      // (por ejemplo, el equipo pasando de un integrante al otro)
      hold = scenes.map((el, i) => {
        // data-hold-fit: solo se queda quieta si la sección casi entra en la pantalla (en celular, donde
        // las tarjetas van una debajo de otra, se recorre normal)
        // En el celular Cómo trabajamos no se queda quieta: sus tarjetas se ven todas juntas
        if (!mouse && el.dataset.holdFit !== undefined) return 0;
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
      total = starts[starts.length - 1] + inner[inner.length - 1];
      document.body.style.height = `${total + vh}px`;
    };

    // Escenas que quedaron ocultas en el cuadro anterior: no se vuelven a tocar hasta que reaparezcan
    const asleep = scenes.map(() => false);
    // Último valor escrito de cada estilo: solo se escribe lo que cambió. Reescribir lo mismo en cada
    // cuadro (sobre todo las variables --leave y --hold, que heredan los hijos) obligaba al navegador
    // a recalcular los estilos de toda la sección
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
        // Oculto del todo cuando no se ve, así su animación deja de correr
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
          // Entrando: aparece en el lugar, acercándose un poco
          // Empieza a aparecer antes de que la anterior termine de irse: nunca queda la pantalla vacía
          const p = ease(clamp(((local + gap) / gap - 0.1) / 0.7));
          if (mouse) {
            opacity = p;
            scale = 1.06 - 0.06 * p;
            shift = (1 - p) * vh * 0.04;
          } else {
            // Celular: aparece de golpe en el lugar (sin fundido, que es lo que más pesa)
            opacity = p > 0.5 ? 1 : 0;
          }
        } else if (local > end) {
          // Saliendo: se aleja y se desvanece sin moverse de lugar
          // Misma curva que la que entra, invertida: entre las dos siempre suman la pantalla completa
          const q = ease(clamp(((local - end) / gap - 0.1) / 0.7));
          if (mouse) {
            leave = q;
            opacity = 1 - q;
            scale = 1 - 0.12 * q;
            shift = -over[i] - q * vh * 0.05;
          } else {
            // Celular: desaparece de golpe sin moverse de lugar
            opacity = q < 0.5 ? 1 : 0;
            shift = -over[i];
          }
        }

        const hidden = opacity <= 0.001;
        if (hidden && asleep[i]) return;
        asleep[i] = hidden;
        // Solo las escenas que se ven tienen su propia capa en la placa de video: tener todas a la vez
        // (algunas miden varias pantallas de alto) llenaba la memoria del celular y lo hacía ir lento
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
      // Avisa a ScrollMotion para que las tarjetas se muevan con el escenario
      window.dispatchEvent(new Event("stage"));
      if (current !== target) frame = requestAnimationFrame(tick);
      else last = 0;
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
      bar.remove();
      hint.remove();
      root.classList.remove("stage-on");
      document.body.style.height = "";
      written.forEach((w) => w.clear());
      for (const el of scenes) {
        el.removeAttribute("style");
        el.removeAttribute("data-holding");
      }
    };
  }, [pathname]);

  return null;
}
