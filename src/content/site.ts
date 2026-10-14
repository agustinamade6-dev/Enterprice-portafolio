import type { PageTexts } from "@/lib/content/schemas";

// Todo el texto del sitio vive aquí: para cambiar precios, datos de contacto o
// proyectos no hace falta tocar los componentes.

export const site = {
  name: "ZainSoft",
  owner: "Agustin",
  tagline:
    "Páginas web y sistemas a medida para restaurantes, comercios y profesionales.",
  description:
    "Somos un equipo de programadores que diseña y desarrolla páginas web y sistemas a medida para tu negocio.",
  // WhatsApp en formato internacional, sin + ni espacios (en Argentina va 549 + característica + número).
  whatsapp: "5493815100710",
  email: "zainsoftdev@gmail.com",
  instagram: "https://www.instagram.com/zainsoft_/",
  facebook: "https://www.facebook.com/profile.php?id=61595416858440",
  photo: "/foto-perfil.png",
  github: "https://github.com/agustinamade6-dev",
  // TODO: cambiar por la dirección definitiva cuando el sitio esté publicado (o un dominio propio).
  url: "https://zainsoft.sofdev.workers.dev",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Project = {
  slug: string;
  title: string;
  sector: string;
  kind: "real" | "prototipo" | "desarrollo" | "facultad" | "concepto";
  summary: string;
  result: string;
  tags: string[];
  href?: string;
  liveUrl?: string; // dirección pública donde funciona en vivo (https)
  accent: string; // color de la tarjeta
  image?: string; // captura real del proyecto
  coverUrl?: string; // alias o URL alternativa de captura
  modules?: string[]; // módulos que se muestran en la ilustración de los sistemas de gestión
  chat?: { from: "bot" | "user"; text: string }[]; // conversación de ejemplo para los chatbots
  by?: string[]; // quiénes del equipo lo hicieron
};

export const projects: Project[] = [
  {
    slug: "lv-racing",
    title: "LV Racing",
    sector: "Motos",
    kind: "real",
    summary:
      "Plataforma web para taller de motos: Kanban de órdenes con evidencias fotográficas, portal 'Mi Garage' con seguimiento en vivo y CMS.",
    result: "Taller organizado, evidencia técnica fotográfica y seguimiento transparente para clientes.",
    tags: ["FastAPI", "Python", "Neon PostgreSQL", "Cloudinary", "Tailwind CSS"],
    image: "/images/projects/lv-racing.png",
    coverUrl: "/images/projects/lv-racing.png",
    href: "/proyectos/lv-racing/",
    accent: "from-red-600 to-zinc-950",
    by: ["Nicolás"],
  },
  {
    slug: "todo-suela",
    title: "Todo Suela",
    sector: "Gestión deportiva",
    kind: "real",
    summary:
      "Plataforma integral para la gestión de equipos de fútbol amateur. Incluye portal público para hinchas, seguimiento de fixtures, tablas de posiciones en tiempo real, estadísticas de plantel y panel de administración táctica.",
    result: "Portal público y panel táctico en tiempo real.",
    tags: ["Web App", "FastAPI", "Gestión Deportiva", "Fullstack"],
    image: "/images/projects/todo-suela.png",
    coverUrl: "/images/projects/todo-suela.png",
    href: "/proyectos/todo-suela/",
    accent: "from-emerald-600 to-zinc-950",
    by: ["Nicolás"],
  },
  {
    slug: "akros-cafe",
    title: "AKROS Café",
    sector: "Cafetería",
    kind: "real",
    summary:
      "Sistema de punto de venta para escritorio: pedidos por mesa, cobro y cierre de caja.",
    result: "En uso todos los días en el local.",
    tags: ["Next.js", "Electron", "Prisma", "SQLite"],
    href: "/proyectos/akros-cafe/",
    by: ["Agustin", "José"],
    accent: "from-amber-500 to-orange-600",
  },
  // TODO: sumar el nombre y capturas reales de la casa de pastas cuando estén.
  {
    slug: "casa-de-pastas",
    title: "Sistema de gestión para casa de pastas",
    sector: "Casa de pastas",
    kind: "real",
    summary:
      "Ventas, stock, insumos, proveedores y gastos de una fábrica de pastas en un solo programa.",
    result: "Control de lo que se produce, se compra y se vende.",
    tags: ["Python", "Gestión", "Stock"],
    by: ["Agustin"],
    accent: "from-yellow-400 to-orange-500",
    modules: ["Ventas", "Stock", "Insumos", "Proveedores", "Gastos"],
  },
  {
    slug: "pierina-glow",
    title: "Pierina Glow",
    sector: "Indumentaria femenina",
    kind: "real",
    summary:
      "Sistema de gestión para una tienda de ropa: inventario por talle y color, ventas, clientes, proveedores y reportes.",
    result: "Saber qué se vende, qué talles quedan y cuánto se gana.",
    tags: ["Python", "Escritorio", "Gestión"],
    href: "/proyectos/pierina-glow/",
    by: ["Agustin"],
    accent: "from-[#eab3a6] to-[#c96f5d]",
    image: "/pierina/inicio.png",
  },
  // La tienda online de la misma marca: publicada y funcionando, todavía con productos de ejemplo (2026-10-14)
  {
    slug: "pierina-glow-tienda",
    title: "Pierina Glow · Tienda online",
    sector: "Indumentaria femenina",
    kind: "prototipo",
    summary:
      "Tienda online con catálogo por categorías, página para cada prenda, carrito con pedido por WhatsApp y un panel para que la dueña cargue prendas, fotos y textos desde el celular.",
    result: "Publicada y funcionando: se puede recorrer y probar en vivo.",
    tags: ["HTML", "CSS", "JavaScript", "GSAP", "Netlify"],
    href: "/proyectos/pierina-glow-tienda/",
    liveUrl: "https://bypierina.netlify.app/",
    by: ["Agustin"],
    accent: "from-[#f3e3da] to-[#c96f5d]",
    image: "/images/projects/pierina-glow-tienda.jpg",
  },
  // Antes figuraba como "Yuhmak" (proyecto real), pero fue un programa de práctica que nunca se presentó a esa
  // empresa (Agustin, 2026-10-12): queda como concepto, sin el nombre ni las capturas con su marca.
  {
    slug: "registro-reparaciones",
    title: "Registro de reparaciones para talleres",
    sector: "Talleres de motos",
    kind: "concepto",
    summary:
      "Sistema web para registrar y seguir las motos arregladas en el taller: marca, modelo, chasis, motor y el trabajo realizado, con buscador e impresión.",
    result: "Cada moto reparada, registrada y fácil de encontrar.",
    tags: ["HTML", "Web", "Gestión"],
    by: ["Fabrizio"],
    accent: "from-green-600 to-emerald-900",
  },
  // TODO: confirmar si se puede nombrar al cliente y quién hizo cada parte.
  {
    slug: "chatbot-crm",
    title: "Chatbot con IA y CRM omnicanal",
    sector: "Servicios técnicos",
    kind: "desarrollo",
    summary:
      "Asistente con inteligencia artificial que atiende a los clientes por Telegram, entiende audios e imágenes, toma los datos del pedido y pasa la charla a una persona cuando hace falta.",
    result: "Pensado para responder a los clientes a cualquier hora.",
    tags: ["Python", "FastAPI", "IA (Gemini)", "React", "Telegram"],
    by: ["Agustin", "Nicolás"],
    accent: "from-cyan-500 to-blue-700",
  },
  {
    slug: "chatbot-pedidos-mayoristas",
    title: "Chatbot de pedidos mayoristas",
    sector: "Venta mayorista",
    kind: "desarrollo",
    summary:
      "Bot de Telegram con IA que toma pedidos mayoristas: distingue clientes de proveedores, valida los datos, calcula totales por kilo y lo vuelca todo en Google Sheets.",
    result: "Pedidos ordenados y aprobados por el equipo, sin cargarlos a mano.",
    tags: ["C#", ".NET 8", "IA (Gemini)", "Telegram", "Google Sheets"],
    by: ["José"],
    accent: "from-violet-500 to-indigo-700",
    chat: [
      { from: "user", text: "Hola, quiero hacer un pedido" },
      { from: "bot", text: "¡Hola! ¿Qué producto y cuántos kilos?" },
      { from: "user", text: "20 kg del producto A" },
      { from: "bot", text: "Subtotal: 20 kg. Lo paso al equipo para aprobarlo ✅" },
    ],
  },
  {
    slug: "apiarios",
    title: "Optimización de apiarios",
    sector: "Producción de miel",
    kind: "facultad",
    summary:
      "Trabajo de Investigación Operativa con una finca real, La Dulce: cómo distribuir apiarios y colmenas para producir más miel con programación lineal y pronósticos.",
    result: "Menos pérdidas por traslados y mejor uso del espacio.",
    tags: ["Programación lineal", "Pronósticos", "Investigación Operativa"],
    by: ["José"],
    accent: "from-amber-400 to-yellow-600",
  },
  {
    slug: "menu-digital",
    title: "Menú digital con QR",
    sector: "Restaurantes",
    kind: "concepto",
    summary:
      "El cliente escanea el QR, arma su pedido y lo envía por WhatsApp. Sin apps ni comisiones.",
    result: "Menos tiempo de espera y menú siempre actualizado.",
    tags: ["Web", "Celular", "WhatsApp"],
    href: "/demos/menu-digital/",
    accent: "from-rose-500 to-red-600",
  },
  {
    slug: "tienda-online",
    title: "Tienda online",
    sector: "Comercios",
    kind: "concepto",
    summary:
      "Catálogo con fotos, carrito y pedido directo. Ideal para ropa, almacén o regalería.",
    result: "Vender las 24 horas sin pagar comisiones a plataformas.",
    tags: ["Web", "Catálogo", "Carrito"],
    accent: "from-emerald-500 to-teal-600",
  },
  {
    slug: "turnos",
    title: "Turnos online",
    sector: "Profesionales",
    kind: "concepto",
    summary:
      "Agenda web para consultorios, peluquerías y centros de estética, con recordatorios.",
    result: "Menos llamadas y menos turnos perdidos.",
    tags: ["Web", "Agenda", "Recordatorios"],
    accent: "from-sky-500 to-indigo-600",
  },
  {
    slug: "panel-stock",
    title: "Panel de stock y ventas",
    sector: "Comercios",
    kind: "concepto",
    summary:
      "Control de inventario, alertas de faltantes y reportes de ventas en gráficos simples.",
    result: "Saber qué se vende y qué reponer de un vistazo.",
    tags: ["Sistema", "Reportes", "Inventario"],
    accent: "from-slate-600 to-slate-900",
  },
];

// Armador de presupuesto: no mostramos precios fijos. El cliente elige qué necesita
// y nos llega por WhatsApp para cotizarlo a medida.
export type BudgetType = {
  id: string;
  name: string;
  forWho: string;
  options: string[]; // lo que puede incluir; el cliente marca lo que quiere
};

export const budgetTypes: BudgetType[] = [
  {
    id: "web",
    name: "Página web",
    forWho: "Para que te encuentren en internet y te escriban",
    options: [
      "Una sola sección",
      "Varias páginas",
      "Botón de WhatsApp",
      "Mapa de Google",
      "Galería de fotos",
      "Formulario de contacto",
      "Que aparezca en Google",
      "Dominio propio (.com o .com.ar)",
    ],
  },
  {
    id: "venta",
    name: "Menú o tienda online",
    forWho: "Para vender o tomar pedidos por internet",
    options: [
      "Menú digital con QR",
      "Catálogo de productos",
      "Carrito de compras",
      "Pedidos por WhatsApp",
      "Poder editar precios y productos",
      "Pagos con Mercado Pago",
      "Envíos o retiro en el local",
    ],
  },
  {
    id: "sistema",
    name: "Sistema a medida",
    forWho: "Para ordenar la gestión de tu negocio",
    options: [
      "Punto de venta y caja",
      "Stock e inventario",
      "Proveedores",
      "Clientes",
      "Gastos",
      "Turnos o reservas",
      "Reportes y estadísticas",
      "Programa de escritorio",
      "Versión web",
      "Varios usuarios con permisos",
    ],
  },
  {
    id: "chatbot",
    name: "Chatbot con IA",
    forWho: "Para atender a tus clientes las 24 horas",
    options: [
      "WhatsApp",
      "Telegram",
      "Instagram",
      "Responder preguntas frecuentes",
      "Tomar pedidos o reservas",
      "Entender audios e imágenes",
      "Pasar la charla a una persona",
      "Guardar los contactos",
    ],
  },
];

export const budgetExtras = ["Capacitación para usarlo", "Mantenimiento mensual", "Diseño de logo o marca"];

export const budgetSectors = ["Restaurante o cafetería", "Comercio", "Profesional", "Emprendimiento", "Empresa", "Otro"];

export const budgetTimes = ["Lo antes posible", "En el próximo mes", "Sin apuro"];

export const process = [
  {
    title: "Charlamos",
    text: "Nos cuentas cómo funciona tu negocio y qué necesitas. Sin compromiso.",
    details: ["Entendemos cómo trabajas hoy", "Vemos qué problema quieres resolver", "Te sugerimos por dónde empezar"],
  },
  {
    title: "Propuesta a medida",
    text: "Te enviamos por escrito qué incluye, el presupuesto según lo que pediste y los plazos.",
    details: ["Lo dividimos en etapas cortas (sprints)", "Sabes qué vas a recibir en cada una", "Sin costos sorpresa"],
  },
  {
    title: "Sprints y prototipos",
    text: "Trabajamos en sprints cortos. Al final de cada uno te entregamos un prototipo que puedes probar.",
    details: [
      "Pruebas el prototipo como si ya fuera tuyo",
      "Nos dices qué funciones sumar o cambiar",
      "Eliges cómo quieres que se vea cada apartado",
    ],
  },
  {
    title: "Entrega y soporte",
    text: "Lo publicamos o lo instalamos, te enseñamos a usarlo y quedamos disponibles para cambios.",
    details: ["Capacitación para tu equipo", "Copias de seguridad", "Ajustes cuando el negocio crece"],
  },
  {
    title: "Te seguimos asesorando",
    text: "Después de la entrega seguimos cerca: te asesoramos e implementamos las nuevas herramientas que vamos creando.",
    details: ["Ideas para mejorar tu sistema", "Nuevas herramientas, como chatbots con IA", "Las sumamos cuando te sirvan"],
  },
];

// Lo que pasa en cada sprint, de la etapa 3.
export const sprintLoop = ["Construimos una parte", "Te entregamos el prototipo", "Lo pruebas y opinas", "Sumamos funciones y ajustamos el diseño"];

export const faqs = [
  {
    q: "¿Cómo se paga?",
    a: "50% al empezar y 50% al entregar. Puedes pagar como te quede más cómodo: efectivo, transferencia, Mercado Pago, tarjeta Naranja y otros medios. Lo acordamos juntos antes de empezar.",
  },
  {
    q: "¿El precio incluye el dominio?",
    a: "El dominio (.com o .com.ar) se paga aparte una vez por año y queda a tu nombre. Te ayudamos a registrarlo.",
  },
  {
    q: "¿Puedo cambiar cosas después?",
    a: "Sí. Los textos, precios y fotos más comunes los puedes editar tú. Para cambios mayores hay un plan mensual de mantenimiento.",
  },
  {
    q: "¿Trabajan solo con negocios de mi ciudad?",
    a: "No, trabajamos a distancia con negocios de todo el país. Las reuniones son por videollamada o WhatsApp.",
  },
];

// Integrantes del equipo. Cada uno tiene su propio apartado en "Nosotros" y su página
// con su historia en /equipo/<slug>/.
export type Chapter = {
  label: string; // etapa: "Primer trabajo", "Hoy", etc.
  title: string;
  text: string;
  href?: string; // página del proyecto, si tiene
};

export type Member = {
  slug: string;
  name: string; // como nos dicen
  fullName: string;
  role: string;
  photo?: string;
  href?: string;
  network?: "Instagram" | "LinkedIn"; // red del enlace; por defecto Instagram
  bio: string;
  skills: string[];
  story: {
    intro: string;
    chapters: Chapter[];
    pending?: string; // qué falta que cuente esta persona, en tercera persona
  };
};

// TODO: que cada integrante revise y ajuste su presentación y su historia.
export const team: Member[] = [
  {
    slug: "agustin",
    name: site.owner,
    fullName: "Leandro Agustin Amade",
    role: "Programador: frontend, backend y diseño",
    photo: site.photo,
    href: "https://www.linkedin.com/in/leandro-agustin-amade-a33a0239a/",
    network: "LinkedIn",
    bio: "Me gusta que cada sistema se vea bien y sea fácil de usar desde el primer día. Trabajé en el punto de venta de AKROS Café e hice el sistema de gestión de Pierina Glow de punta a punta.",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Electron", "Python", "Diseño de interfaces"],
    story: {
      intro:
        "Estudio Ingeniería en Sistemas en la Universidad Tecnológica Nacional, Facultad Regional Tucumán. Empecé a programar en el colegio, y mis primeros trabajos fueron programas de gestión: no eran proyectos enormes, pero fueron mis primeros pasos como programador.",
      chapters: [
        {
          label: "En el colegio",
          title: "Mis primeros programas, con Arduino",
          text: "Empecé a programar en el colegio con Arduino. Ahí me di cuenta de que me gustaba y quise seguir por ese camino.",
        },
        {
          label: "En la facultad",
          title: "Ingeniería en Sistemas",
          text: "Con la carrera fui aprendiendo a programar. Por curiosidad, y por querer ayudar a mi mamá a gestionar su emprendimiento de ropa, también aprendí por mi cuenta con inteligencia artificial: le preguntaba cómo programar y hacía mini cursos que armaba para mí.",
        },
        {
          label: "2025 · Mi primer trabajo",
          title: "Pierina Glow, el emprendimiento de mi mamá",
          text: "Lo que empezó como una forma de ayudar a mi mamá terminó siendo mi primer sistema de gestión, hecho solo y de punta a punta para su tienda de ropa femenina: inventario por talle y color, ventas, clientes, proveedores, reportes y copias de seguridad.",
          href: "/proyectos/pierina-glow/",
        },
        {
          label: "Segundo trabajo",
          title: "Una casa de pastas",
          text: "Otro sistema en Python, esta vez para una fábrica de pastas: ventas, stock, insumos, proveedores y gastos en un solo programa.",
        },
        {
          label: "Primer trabajo en equipo",
          title: "AKROS Café, junto a José",
          text: "El primer proyecto que hicimos de a dos. Me encargué del frontend y de parte del backend de un punto de venta para Windows hecho con Next.js y Electron.",
          href: "/proyectos/akros-cafe/",
        },
        {
          label: "2026",
          title: "La tienda online de Pierina Glow",
          text: "Después del sistema de gestión, le armé a mi mamá su tienda online: catálogo por categorías, carrito con pedido por WhatsApp, cumplimiento de las leyes de defensa del consumidor y un panel con contraseña para que ella misma cargue las prendas desde el celular. Ya está publicada y funcionando.",
          href: "/proyectos/pierina-glow-tienda/",
        },
        {
          label: "Hoy",
          title: "Hacer crecer ZainSoft",
          text: "Quiero que ZainSoft sea una empresa de programación que ayude a emprendimientos y empresas locales a gestionarse mejor. Mientras tanto, sigo estudiando y desarrollo con Nicolás un chatbot con inteligencia artificial.",
        },
      ],
    },
  },
  {
    slug: "jose",
    name: "José",
    fullName: "José Augusto Matias",
    role: "Programador: backend, pruebas y auditoría",
    photo: "/equipo/jose-matias.jpg",
    href: "https://www.linkedin.com/in/jose-matias-64194520b/",
    network: "LinkedIn",
    bio: "Me ocupo de que todo funcione por detrás: la lógica, los datos y que no falle cuando el negocio más lo necesita. En AKROS Café estuve a cargo del backend, las pruebas y la auditoría.",
    skills: ["Backend", "Bases de datos", "Pruebas", "Auditoría de código"],
    story: {
      intro: "Me ocupo de la parte que no se ve: que los datos estén bien guardados y que el sistema no falle.",
      chapters: [
        {
          label: "En la facultad",
          title: "Ingeniería en Sistemas",
          text: "Estudio Ingeniería en Sistemas en la Universidad Tecnológica Nacional, Facultad Regional Tucumán, junto al resto del equipo.",
        },
        {
          label: "2026 · Un chatbot con .NET e IA",
          title: "Automatización de pedidos mayoristas",
          text: "Hice un chatbot de Telegram en C# y .NET 8 que reemplaza la gestión manual de pedidos mayoristas. Usa Google Gemini para distinguir si quien escribe es cliente o proveedor, valida los datos antes de tomar el pedido, calcula subtotales y totales por kilo, atiende en español, inglés y portugués, y vuelca todo en Google Sheets en tiempo real. Antes de confirmar, avisa al equipo para que apruebe o rechace cada pedido. Lo publiqué en LinkedIn para pedir feedback.",
        },
        {
          label: "2026 · Investigación Operativa",
          title: "Optimizar apiarios para producir más miel",
          text: "En la facultad, con un equipo de seis, hicimos un trabajo de Investigación Operativa sobre cómo distribuir apiarios y colmenas para aumentar la producción de miel. Usamos programación lineal y modelos de pronóstico para reducir las pérdidas por traslados y aprovechar mejor el espacio. Lo trabajamos con una finca real, La Dulce, y el trabajo quedó aprobado.",
        },
        {
          label: "Primer trabajo en equipo",
          title: "AKROS Café, junto a Agustin",
          text: "Estuve a cargo del backend del punto de venta, hice las pruebas y lo audité.",
          href: "/proyectos/akros-cafe/",
        },
        {
          label: "Backend de AKROS Café",
          title: "Un backend que no falla con la plata",
          text: "El sistema nació como el POS de un restaurante (Next.js, Prisma y SQLite) y me tocó dejar el backend sólido. Los cobros pasaron a ser atómicos e idempotentes, para que no haya ventas duplicadas aunque dos personas cobren a la vez. Los precios y totales los calcula el servidor y no la pantalla. El dinero se guarda en centavos enteros, con migración automática de la base al arrancar. Sumé sesión firmada, PIN con hash y límite de intentos, permisos por rol en toda la API, protección CSRF, validación de toda la entrada, estados de pedido con transiciones explícitas, y recetas con descuento de stock al cobrar y reintegro al anular.",
        },
        {
          label: "Auditoría de AKROS Café",
          title: "Investigar para auditar",
          text: "Antes de tocar el código investigué cómo se audita un backend: arquitectura, reglas de negocio, concurrencia, seguridad y bases de datos. Con eso revisé el sistema y documenté 39 hallazgos, desde una sesión que se podía forjar hasta una mesa que quedaba libre antes del cobro. Cada cambio quedó en su propio documento, con el problema, el impacto y la prueba que lo cubre. Varios errores los encontraron las propias pruebas: una carrera de cobros simultáneos contra SQLite real, una prueba que fallaba a veces en el CI, y violaciones de accesibilidad detectadas con axe. Lo que fui aprendiendo lo ordené en una base de conocimiento de lecciones y reglas para los proyectos que vienen.",
        },
        {
          label: "Pruebas de AKROS Café",
          title: "Probar contra el motor real",
          text: "Armé la batería de pruebas: más de 700 tests, pruebas de concurrencia y de migraciones contra SQLite real, pruebas de propiedades para el dinero, pruebas de punta a punta con Playwright en escritorio y móvil, accesibilidad con axe, cobertura del 95 % y pruebas de mutación para comprobar que los tests de verdad detectan errores. Todo corre en el CI en cada cambio.",
        },
        {
          label: "Hoy",
          title: "ZainSoft",
          text: "Junto al resto del equipo armamos ZainSoft para tomar más proyectos juntos.",
        },
      ],
      pending: "cómo empezó, cómo aprendió a programar y cuáles fueron sus primeros proyectos",
    },
  },
  {
    slug: "nicolas",
    name: "Nicolás",
    fullName: "Nicolás Raúl Bazán",
    role: "Programador: frontend y backend",
    photo: "/equipo/nicolas-bazan.jpg",
    href: "https://www.linkedin.com/in/nicolas-baz%C3%A1n-9315653b3/",
    network: "LinkedIn",
    bio: "Trabajo tanto en el frontend como en el backend, de la pantalla que ve el cliente hasta el servidor. Hoy estamos desarrollando juntos un chatbot con inteligencia artificial.",
    skills: ["Frontend", "Backend", "Inteligencia artificial", "Chatbots"],
    story: {
      intro: "Me gusta trabajar en las dos puntas: lo que ve el cliente y lo que pasa en el servidor.",
      chapters: [
        {
          label: "En la facultad",
          title: "Ingeniería en Sistemas",
          text: "Estudio Ingeniería en Sistemas en la Universidad Tecnológica Nacional, Facultad Regional Tucumán, junto al resto del equipo.",
        },
        {
          label: "Hoy",
          title: "Un chatbot con IA, junto a Agustin",
          text: "Estamos desarrollando un asistente con inteligencia artificial que atiende clientes por Telegram, entiende audios e imágenes y pasa la charla a una persona cuando hace falta.",
        },
      ],
      pending: "cómo empezó, cómo aprendió a programar y cuáles fueron sus primeros proyectos",
    },
  },
  {
    slug: "fabrizio",
    name: "Fabrizio",
    fullName: "Fabrizio Nicolás Andrada",
    role: "Programador: frontend, backend, diseño y desarrollo web",
    photo: "/equipo/fabrizio-andrada.jpg",
    href: "https://www.linkedin.com/in/fabrizio-andrada-0b70532a1",
    network: "LinkedIn",
    bio: "Trabajo de manera integral en el frontend y el backend, cuidando además el diseño y la experiencia de usuario. Hice, como práctica, un sistema para registrar las reparaciones de un taller de motos.",
    skills: ["Frontend", "Backend", "HTML", "Diseño web", "Experiencia de usuario"],
    story: {
      intro: "Trabajo de manera integral: desarrollo el frontend y el backend, y me aseguro de que todo tenga un buen diseño y sea fácil de usar.",
      chapters: [
        {
          label: "En la facultad",
          title: "Ingeniería en Sistemas",
          text: "Estudio Ingeniería en Sistemas en la Universidad Tecnológica Nacional, Facultad Regional Tucumán, junto al resto del equipo.",
        },
        {
          label: "Sistema de gestión",
          title: "Registro de reparaciones",
          text: "Como práctica, desarrollé un sistema de gestión para un taller de motos que registra, carga y administra el seguimiento de todas las motos arregladas.",
        },
        {
          label: "Hoy",
          title: "ZainSoft",
          text: "Me sumé a ZainSoft para seguir haciendo sistemas y páginas junto al resto del equipo.",
        },
      ],
      pending: "cómo empezó, cómo aprendió a programar y cuáles fueron sus primeros proyectos",
    },
  },
];

// Textos fijos de la página de inicio. Desde el admin se editan en "Textos de la página".
// {nombre} se reemplaza por el nombre del sitio.
export const pageTexts: PageTexts = {
  hero: {
    badge: "Disponible para nuevos proyectos",
    titleStart: "Tu negocio,",
    titleHighlight: "vendiendo más",
    titleEnd: "con una web o un sistema a medida.",
    subtitleExtra: "Diseño simple, rápido y pensado para tus clientes.",
    buttonProjects: "Ver proyectos",
    buttonWhatsapp: "Escribirnos por WhatsApp",
    whatsappMessage: "Hola, quiero consultar por un proyecto.",
    cardLabel: "Proyecto real",
    cardTitle: "AKROS Café · punto de venta",
  },
  projects: {
    eyebrow: "Proyectos",
    title: "Trabajos y prototipos",
    text: "Sistemas reales en uso, lo que cada uno del equipo va construyendo y conceptos pensados para cada tipo de negocio.",
  },
  services: {
    eyebrow: "Servicios",
    title: "Arma tu presupuesto",
    text: "Cada negocio es distinto, por eso no tenemos precios fijos. Elige lo que necesitas y te pasamos un presupuesto a medida, por escrito y antes de empezar.",
    note: "¿Ya tienes una web? También ofrecemos un plan mensual de mantenimiento con cambios, copias de seguridad y soporte.",
  },
  process: {
    eyebrow: "Cómo trabajamos",
    title: "Paso a paso, y siempre con tu opinión",
    text: "No desaparecemos hasta la entrega: vas viendo prototipos, los pruebas y decides cómo sigue.",
    sprintTitle: "En cada sprint",
    sprintRepeat: "↻ Y se repite hasta que quede como lo imaginaste.",
  },
  team: {
    eyebrow: "Nosotros",
    title: "Somos {nombre}",
    text: "Somos cuatro estudiantes de Ingeniería en Sistemas de la Universidad Tecnológica Nacional, Facultad Regional Tucumán, que empezamos de cero y vamos por el cien. Nuestro nombre une Zain y Soft: software de calidad, con un backend sólido que funciona y un diseño cuidado y fácil de usar. Cada uno aporta lo suyo, y juntos convertimos las ideas de cada negocio en sistemas y páginas que funcionan.",
  },
  faqs: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que suelen preguntarnos",
    text: "",
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Hablamos de tu proyecto?",
    text: "Cuéntanos qué necesitas y te respondemos en el día con una propuesta. La primera charla no tiene costo.",
    whatsappLabel: "WhatsApp",
    whatsappMessage: "Hola, quiero consultar por un proyecto.",
  },
  footer: { note: "" },
  seo: { titleSuffix: "Páginas web y sistemas a medida" },
  bit: {
    hero: { pose: "saludando", text: "¡Hola! Soy Bit 👋" },
    projects: { pose: "programando", text: "Mira lo que hicimos 👀" },
    services: { pose: "pensando", text: "Elige lo que necesitas y armamos tu presupuesto 💡" },
    process: { pose: "programando", text: "Así trabajamos, paso a paso" },
    team: { pose: "saludando", text: "Ellos me programaron 🧡" },
    faqs: { pose: "pensando", text: "¿Dudas? Acá están las respuestas" },
    contact: { pose: "saludando", text: "¡Escríbenos! Respondemos en el día" },
    click: [
      "Lo bueno por dentro, lo lindo por fuera 🧡",
      "Mi lado negro hace que todo funcione",
      "Mi lado naranja hace que se vea bien",
      "¿Armamos algo juntos?",
      "¡Eso me hizo cosquillas!",
    ],
  },
};
