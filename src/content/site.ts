// Todo el texto del sitio vive aquí: para cambiar precios, datos de contacto o
// proyectos no hace falta tocar los componentes.

export const site = {
  name: "Enterprice",
  owner: "Agustin",
  tagline:
    "Páginas web y sistemas a medida para restaurantes, comercios y profesionales.",
  description:
    "Somos un equipo de programadores que diseña y desarrolla páginas web y programas para que tu negocio venda más y atienda mejor.",
  // WhatsApp en formato internacional, sin + ni espacios (en Argentina va 549 + característica + número).
  whatsapp: "5493815100710",
  email: "agustinamade6@gmail.com",
  instagram: "https://www.instagram.com/lean__amade/",
  photo: "/foto-perfil.png",
  github: "https://github.com/agustinamade6-dev",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Project = {
  slug: string;
  title: string;
  sector: string;
  kind: "real" | "desarrollo" | "concepto";
  summary: string;
  result: string;
  tags: string[];
  href?: string;
  accent: string; // color de la tarjeta
  image?: string; // captura real del proyecto
  modules?: string[]; // módulos que se muestran en la ilustración de los sistemas de gestión
};

export const projects: Project[] = [
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
    accent: "from-[#eab3a6] to-[#c96f5d]",
    image: "/pierina/inicio.png",
  },
  // TODO: confirmar si se puede nombrar al cliente y quién hizo cada parte.
  {
    slug: "chatbot-crm",
    title: "Chatbot con IA y CRM omnicanal",
    sector: "Servicios técnicos",
    kind: "desarrollo",
    summary:
      "Asistente con inteligencia artificial que atiende a los clientes por Telegram, entiende audios e imágenes, toma los datos del pedido y pasa la charla a una persona cuando hace falta.",
    result: "Atención las 24 horas sin perder ningún contacto.",
    tags: ["Python", "FastAPI", "IA (Gemini)", "React", "Telegram"],
    accent: "from-cyan-500 to-blue-700",
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

export type Service = {
  name: string;
  forWho: string;
  price: string;
  timeline: string;
  features: string[];
  featured?: boolean;
};

export const services: Service[] = [
  {
    name: "Presencia online",
    forWho: "Profesionales y negocios que todavía no tienen web",
    price: "$400.000",
    timeline: "1 a 2 semanas",
    features: [
      "Página de una sección, adaptada a celular",
      "Botón de WhatsApp y mapa de Google",
      "Textos y diseño a tu medida",
      "Publicación en internet incluida",
    ],
  },
  {
    name: "Negocio online",
    forWho: "Restaurantes y comercios que quieren vender por internet",
    price: "$400.000",
    timeline: "3 a 4 semanas",
    features: [
      "Web de varias páginas",
      "Menú o catálogo que puedes editar",
      "Pedidos directos por WhatsApp",
      "Optimizada para aparecer en Google",
    ],
    featured: true,
  },
  {
    name: "Sistema a medida",
    forWho: "Negocios con procesos propios",
    price: "$350.000",
    timeline: "Según el alcance",
    features: [
      "Punto de venta, turnos, stock o panel de gestión",
      "Versión web o programa de escritorio",
      "Pensado para usar rápido en el mostrador",
      "Capacitación al equipo",
    ],
  },
];

export const process = [
  {
    title: "Charlamos",
    text: "Nos cuentas cómo funciona tu negocio y qué necesitas. Sin compromiso.",
  },
  {
    title: "Propuesta",
    text: "Te enviamos qué incluye, el precio final y los plazos, por escrito.",
  },
  {
    title: "Diseño y desarrollo",
    text: "Ves avances cada semana y pedimos ajustes sobre la marcha.",
  },
  {
    title: "Entrega y soporte",
    text: "Lo publicamos, te enseñamos a usarlo y quedamos disponibles para cambios.",
  },
];

export const faqs = [
  {
    q: "¿Cómo se paga?",
    a: "50% al empezar y 50% al entregar. Puedes pagar por transferencia o Mercado Pago.",
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

// Integrantes del equipo. Cada uno tiene su propio apartado en "Nosotros".
export const team = [
  {
    name: site.owner,
    fullName: "Leandro Agustin Amade",
    role: "Programador: frontend, backend y diseño",
    photo: site.photo as string | undefined,
    href: site.instagram as string | undefined,
    // TODO: que cada integrante revise y ajuste su presentación.
    bio: "Me gusta que cada sistema se vea bien y sea fácil de usar desde el primer día. Trabajé en el punto de venta de AKROS Café e hice el sistema de gestión de Pierina Glow de punta a punta.",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Electron", "Python", "Diseño de interfaces"],
  },
  {
    name: "José",
    fullName: "José Augusto Matias",
    role: "Programador: backend, pruebas y auditoría",
    photo: "/equipo/jose-matias.jpg",
    href: "https://www.instagram.com/josematias._/",
    bio: "Me ocupo de que todo funcione por detrás: la lógica, los datos y que no falle cuando el negocio más lo necesita. En AKROS Café estuve a cargo del backend, las pruebas y la auditoría.",
    skills: ["Backend", "Bases de datos", "Pruebas", "Auditoría de código"],
  },
  {
    name: "Nicolás",
    fullName: "Nicolás Raúl Bazán",
    role: "Programador: frontend y backend",
    photo: undefined as string | undefined, // TODO: foto
    href: undefined as string | undefined, // TODO: Instagram
    bio: "Trabajo tanto en el frontend como en el backend, de la pantalla que ve el cliente hasta el servidor. Hoy estamos desarrollando juntos un chatbot con inteligencia artificial.",
    skills: ["Frontend", "Backend", "Inteligencia artificial", "Chatbots"],
  },
];
