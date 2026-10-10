"use client";

import { useEffect, useRef, useState } from "react";

// Bit, la mascota de ZainSoft: mitad backend (lado negro, recto, llave inglesa) y mitad frontend
// (lado naranja, redondeado, pincel). Acompaña al visitante abajo a la izquierda: respira, parpadea,
// sigue el mouse con los ojos, cambia de pose según la sección y festeja cuando alguien nos escribe.
// Las secciones eligen su pose y su frase con data-bit="pose|frase".

export type BitPose = "saludando" | "principal" | "programando" | "pensando" | "festejando";

// Avisa a Bit desde cualquier componente, por ejemplo al enviar el formulario
export function bitFestejar(frase = "¡Listo! Ya te respondemos 🎉") {
  window.dispatchEvent(new CustomEvent("bit:festejar", { detail: frase }));
}

const INK = "#0f1115";
const OR = "#f05a28";
const ORD = "#c2410c";
const CREAM = "#faf8f5";
const AMB = "#f5a524";

// Giro de cada brazo (en grados) respecto de la pose principal
const ARMS: Record<BitPose, [number, number]> = {
  principal: [0, 0],
  saludando: [-95, -40],
  pensando: [-95, -26],
  programando: [-155, 153],
  festejando: [28, -30],
};

const CLICK = [
  "Lo bueno por dentro, lo lindo por fuera 🧡",
  "Mi lado negro hace que todo funcione",
  "Mi lado naranja hace que se vea bien",
  "¿Armamos algo juntos?",
  "¡Eso me hizo cosquillas!",
];

export function Bit() {
  const [pose, setPose] = useState<BitPose>("saludando");
  const [bubble, setBubble] = useState<string | null>(null);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [jump, setJump] = useState(0);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const party = useRef<number>(0);
  const bubbleTimer = useRef<number>(0);
  const sectionPose = useRef<BitPose>("saludando");
  const clicks = useRef(0);

  const say = (text: string, ms = 4200) => {
    setBubble(text);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  };

  const celebrate = (text: string) => {
    setPose("festejando");
    setJump((j) => j + 1);
    say(text, 3600);
    window.clearTimeout(party.current);
    party.current = window.setTimeout(() => {
      party.current = 0;
      setPose(sectionPose.current);
    }, 3600);
  };

  // Aparece un momento después de cargar y saluda
  useEffect(() => {
    const t = window.setTimeout(() => {
      setShown(true);
      say("¡Hola! Soy Bit, la mascota de ZainSoft 👋", 5000);
    }, 900);
    return () => window.clearTimeout(t);
  }, []);

  // Los ojos siguen al mouse
  useEffect(() => {
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.45);
        const d = Math.max(1, Math.hypot(dx, dy));
        const k = Math.min(1, d / 260);
        setEye({ x: (dx / d) * 4 * k, y: (dy / d) * 4 * k });
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Cambia de pose según la sección que se está viendo
  useEffect(() => {
    let last: HTMLElement | null = null;
    let frame = 0;
    const check = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let bestScore = 0;
      document.querySelectorAll<HTMLElement>("[data-bit]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > mid || r.bottom < mid) return;
        const scene = el.closest<HTMLElement>("[data-stage] > *") ?? el;
        const op = Number(getComputedStyle(scene).opacity || 1);
        if (op > bestScore) {
          bestScore = op;
          best = el;
        }
      });
      if (!best || best === last || bestScore < 0.5) return;
      const first = last === null;
      last = best;
      const [p, frase] = ((best as HTMLElement).dataset.bit ?? "").split("|");
      sectionPose.current = (p as BitPose) || "principal";
      if (!party.current || first) setPose(sectionPose.current);
      if (frase && !first) say(frase);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = window.setTimeout(check, 300);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Festeja cuando otro componente se lo pide (formulario o presupuesto enviados)
  useEffect(() => {
    const on = (e: Event) => celebrate((e as CustomEvent<string>).detail);
    window.addEventListener("bit:festejar", on);
    return () => window.removeEventListener("bit:festejar", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = () => {
    celebrate(CLICK[clicks.current++ % CLICK.length]);
  };

  const [la, ra] = ARMS[pose];
  const happy = pose === "festejando";
  const tools = pose !== "programando";
  const mouth = pose === "pensando" ? "o" : pose === "saludando" || happy ? "abierta" : "sonrisa";
  const look = pose === "programando" ? { x: -1, y: 4 } : pose === "pensando" ? { x: 3, y: -4 } : eye;

  return (
    <div
      className={`bit-wrap fixed bottom-3 left-3 z-40 transition-all duration-700 sm:bottom-5 sm:left-5 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div
        role="status"
        aria-live="polite"
        className={`bit-bubble absolute bottom-full left-2 mb-1 w-max max-w-[220px] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-lg shadow-black/15 ring-1 ring-black/5 transition-all duration-300 sm:max-w-[260px] ${
          bubble ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
      >
        {bubble}
      </div>
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label="Bit, la mascota de ZainSoft"
        className="block h-20 w-20 cursor-pointer outline-none sm:h-28 sm:w-28"
      >
        <svg viewBox="0 0 300 300" className="bit h-full w-full overflow-visible" data-pose={pose}>
          <ellipse className="bit-shadow" cx="150" cy="288" rx="92" ry="8" fill={INK} opacity=".12" />
          <g key={jump} className={jump ? "bit-jump" : undefined}>
            <g className="bit-float">
              {/* Brazo izquierdo con la llave inglesa (backend) */}
              <g className="bit-arm" style={{ transform: `rotate(${la}deg)`, transformOrigin: "72px 172px" }}>
                <line x1="72" y1="172" x2="44" y2="150" stroke={INK} strokeWidth="11" strokeLinecap="round" />
                <circle cx="44" cy="150" r="8" fill={INK} />
                <g style={{ opacity: tools ? 1 : 0 }} className="transition-opacity duration-300">
                  <g transform="translate(44 150) rotate(-20)">
                    <line x1="0" y1="0" x2="0" y2="-30" stroke="#9ca3af" strokeWidth="8" strokeLinecap="round" />
                    <path d="M-7,-50 A11,11 0 1 0 7,-50" stroke="#9ca3af" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </g>
                </g>
              </g>
              {/* Brazo derecho con el pincel (frontend) */}
              <g className="bit-arm" style={{ transform: `rotate(${ra}deg)`, transformOrigin: "228px 172px" }}>
                <g className={pose === "saludando" ? "bit-wave" : undefined} style={{ transformOrigin: "228px 172px" }}>
                  <line x1="228" y1="172" x2="258" y2="150" stroke={OR} strokeWidth="11" strokeLinecap="round" />
                  <circle cx="258" cy="150" r="8" fill={OR} />
                  <g style={{ opacity: tools ? 1 : 0 }} className="transition-opacity duration-300">
                    <g transform="translate(258 150) rotate(18)">
                      <line x1="0" y1="0" x2="0" y2="-30" stroke="#8b5a2b" strokeWidth="7" strokeLinecap="round" />
                      <rect x="-6" y="-38" width="12" height="9" rx="2" fill="#cbd5e1" />
                      <path d="M-6,-38 Q-7,-54 0,-60 Q7,-54 6,-38 Z" fill={AMB} />
                    </g>
                  </g>
                </g>
              </g>

              {/* Piernas */}
              <rect x="98" y="248" width="18" height="30" fill={INK} />
              <rect x="184" y="248" width="18" height="30" rx="6" fill={ORD} />
              <rect x="90" y="274" width="30" height="11" fill={INK} />
              <rect x="180" y="274" width="30" height="11" rx="5.5" fill={ORD} />

              {/* Antena: la chispa es la idea del cliente */}
              <line x1="150" y1="90" x2="150" y2="56" stroke={INK} strokeWidth="5" />
              <circle className="bit-spark" cx="150" cy="48" r="11" fill={OR} />
              <circle cx="150" cy="48" r="4.5" fill={CREAM} />

              {/* Cuerpo: mitad recta y mitad redondeada */}
              <path d="M72,90 L150,90 L150,252 L72,252 Z" fill={INK} />
              <path d="M150,90 L198,90 Q228,90 228,120 L228,222 Q228,252 198,252 L150,252 Z" fill={OR} />
              <path d="M206,98 Q220,100 221,116" stroke="#ff8a65" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".8" />
              <path d="M86,214 L106,214 L116,228 L140,228 M86,236 L128,236" stroke={OR} strokeWidth="3" fill="none" opacity=".7" />
              <circle cx="140" cy="228" r="4" fill={OR} />
              <circle cx="128" cy="236" r="4" fill={OR} />
              <path d="M84,116 L84,104 L96,104" stroke={OR} strokeWidth="3" fill="none" opacity=".7" />

              {/* Ojos */}
              {happy ? (
                <g>
                  <path d="M96,148 L109,134 L122,148" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M176,148 Q190,128 204,148" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
                </g>
              ) : (
                <g className="bit-eyes">
                  <rect x="96" y="128" width="26" height="26" rx="3" fill="#fff" />
                  <rect x={103 + look.x} y={135 + look.y} width="12" height="12" fill={INK} className="bit-pupil" />
                  <circle cx="190" cy="141" r="14" fill="#fff" />
                  <circle cx={190 + look.x} cy={141 + look.y} r="6.5" fill={INK} className="bit-pupil" />
                  <circle cx={192 + look.x} cy={138 + look.y} r="2" fill="#fff" className="bit-pupil" />
                </g>
              )}

              {/* Boca */}
              {mouth === "abierta" ? (
                <g>
                  <path d="M120,182 Q150,218 180,182 Z" fill="#fff" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M136,200 Q150,192 164,200 Q150,210 136,200 Z" fill="#ff8a65" />
                </g>
              ) : mouth === "o" ? (
                <ellipse cx="150" cy="192" rx="9" ry="10" fill="#fff" />
              ) : (
                <path d="M122,186 Q150,210 178,186" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
              )}

              {/* Extras de cada pose */}
              {pose === "programando" && (
                <g className="bit-pop">
                  <path d="M74,222 L226,222 L240,262 L60,262 Z" fill="#2a2e36" />
                  <rect x="60" y="258" width="180" height="8" rx="4" fill="#1b1e24" />
                  <path d="M86,170 L214,170 L222,224 L78,224 Z" fill="#2a2e36" />
                  <path d="M92,176 L208,176 L214,218 L86,218 Z" fill="#1e2a3a" />
                  <text x="150" y="205" textAnchor="middle" fontWeight="800" fontSize="22" fill={OR} fontFamily="monospace" className="bit-type">
                    &lt;/&gt;
                  </text>
                </g>
              )}
            </g>
          </g>
          {pose === "pensando" && (
            <g className="bit-pop bit-idea" transform="translate(206 20)">
              <circle cx="0" cy="0" r="20" fill={AMB} />
              <rect x="-8" y="18" width="16" height="12" rx="3" fill="#9ca3af" />
              <path d="M-28,-4 L-38,-8 M28,-4 L38,-8 M0,-28 L0,-38 M-20,-22 L-27,-29 M20,-22 L27,-29" stroke={AMB} strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
          {happy && (
            <g key={`c${jump}`} className="bit-confetti">
              {[
                [30, 40, OR],
                [270, 50, AMB],
                [60, 70, AMB],
                [240, 20, INK],
                [110, 10, "#ff8a65"],
                [200, 30, OR],
                [10, 160, "#ff8a65"],
                [290, 170, AMB],
              ].map(([x, y, c], i) => (
                <rect
                  key={i}
                  x={x as number}
                  y={y as number}
                  width="9"
                  height="14"
                  rx="2"
                  fill={c as string}
                  style={{ animationDelay: `${i * 60}ms`, transformOrigin: `${x}px ${y}px`, rotate: `${i * 37}deg` }}
                />
              ))}
            </g>
          )}
        </svg>
      </button>
    </div>
  );
}
