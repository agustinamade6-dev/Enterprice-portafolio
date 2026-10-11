// Va aparte de Intro.tsx porque layout.tsx (del servidor) no puede leer valores de un archivo "use client".
export const INTRO_KEY = "zs-intro-vista";

// Se corre antes del primer pintado (en layout.tsx): si la intro ya se vio en esta visita,
// o la persona pidió menos movimiento, se oculta desde el principio para que no parpadee.
export const INTRO_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-skip")}catch(e){}`;
