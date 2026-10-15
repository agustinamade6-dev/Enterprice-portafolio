"use client";

import { useEffect, useState } from "react";

// Intro de la página: aparece el logo de ZainSoft, se arma y la pantalla se abre en dos.
// Toda la animación es CSS (globals.css, "intro-*"), así que aunque el JavaScript tarde en cargar
// se ve igual y al final desaparece sola. Sale cada vez que se abre o se recarga la página.
// No se repite al volver al inicio desde otra página del sitio sin recargar (la marca vive en memoria
// y se borra al recargar). Se puede saltar con un clic o una tecla.
const DURATION_MS = 2600;

declare global {
  interface Window {
    __zsIntroVista?: boolean;
  }
}

export function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.__zsIntroVista) {
      setDone(true);
      return;
    }
    if (done) return;
    window.__zsIntroVista = true;
    const root = document.documentElement;
    root.classList.add("intro-playing");
    const finish = () => {
      root.classList.remove("intro-playing");
      setDone(true);
    };
    const skip = () => {
      root.classList.add("intro-skip");
      finish();
    };
    const timer = window.setTimeout(finish, DURATION_MS);
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      root.classList.remove("intro-playing");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div
      className="intro"
      aria-hidden="true"
      onClick={() => {
        document.documentElement.classList.add("intro-skip");
        document.documentElement.classList.remove("intro-playing");
        setDone(true);
      }}
    >
      <div className="intro-panel intro-panel-left" />
      <div className="intro-panel intro-panel-right" />
      <div className="intro-logo">
        <div className="intro-mark">
          <span className="intro-z">Z</span>
          <span className="intro-s">S</span>
        </div>
        <div className="intro-word">
          <span className="text-paper">Zain</span>
          <span className="text-brand">Soft</span>
        </div>
      </div>
      <div className="intro-line" />
    </div>
  );
}
