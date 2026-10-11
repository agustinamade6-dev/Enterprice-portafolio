// Va aparte de Intro.tsx porque layout.tsx (del servidor) no puede leer valores de un archivo "use client".
export const INTRO_KEY = "zs-intro-vista";

// Se corre antes del primer pintado (en layout.tsx): si la intro ya se vio en esta visita,
// se oculta desde el principio para que no parpadee. Con ?intro en la dirección se ve siempre (para probarla).
export const INTRO_SCRIPT = `try{if(!/[?&]intro/.test(location.search)&&sessionStorage.getItem("${INTRO_KEY}"))document.documentElement.classList.add("intro-skip")}catch(e){}`;
