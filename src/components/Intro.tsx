"use client";

import { useEffect, useState } from "react";
import { INTRO_KEY as KEY } from "./introScript";

// Intro de la página: aparece el logo de ZainSoft, se arma y la pantalla se abre en dos.
// Toda la animación es CSS (globals.css, "intro-*"), así que aunque el JavaScript tarde en cargar
// se ve igual y al final desaparece sola. Este componente solo la saltea si ya se vio en esta visita,
// deja saltarla con un clic o una tecla y la saca de la página cuando termina.
const DURATION_MS = 2600;

export function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("intro-skip")) {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      // Navegación privada sin almacenamiento: la intro se vuelve a ver, no pasa nada
    }
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
