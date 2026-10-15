import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contentRepo } from "@/lib/content";

function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const metadata: Metadata = {
  title: "Sistema de Reparaciones de Motos - Registro y Seguimiento en Depósito",
  description:
    "Caso de estudio: aplicación web completa para el registro, trazabilidad y seguimiento de motos en reparación en depósito de distribución. Construida con JavaScript vanilla, Supabase y Netlify.",
};

const facts = [
  { label: "Rubro", value: "Distribución y talleres de motos" },
  { label: "Tipo", value: "Aplicación Web (CRUD + Reportes PDF)" },
  { label: "Desarrollo", value: "Fabrizio Nicolás Andrada Simeon" },
  { label: "Arquitectura", value: "Vanilla JS + Supabase (Serverless)" },
];

const areas = [
  {
    title: "1. Módulo de Registro y Carga de Ficha",
    badge: "Ingreso ágil",
    items: [
      "Ficha técnica por moto: registro inmediato de marca, modelo, color, fecha y hora exacta del arreglo.",
      "Identificación unívoca: campos dedicados para número de chasis y número de motor para trazabilidad precisa de la unidad.",
      "Detalle de trabajo realizado: descripción exhaustiva de la reparación, repuestos ajustados y retoques efectuados.",
      "Soporte fotográfico integrado: guardado de imágenes codificadas en base64 sin dependencia de buckets ni servidores externos.",
    ],
  },
  {
    title: "2. Historial de Reparaciones y Métricas",
    badge: "Control operativo",
    items: [
      "Tablero de métricas en cabecera: contador en vivo de motos registradas en el depósito, reparadas en el día y volumen de marcas atendidas.",
      "Filtros dinámicos multicriterio: búsqueda instantánea en tiempo real por texto (chasis, motor, modelo) y filtro desplegable por marca.",
      "Filtrado cronológico: segmentación por período de tiempo para auditorías y control de rendimiento del taller.",
      "Acciones rápidas por unidad: impresión de ficha individual o eliminación de registros con sincronización directa a base de datos.",
    ],
  },
  {
    title: "3. Generación y Exportación de Reportes",
    badge: "Documentación",
    items: [
      "Impresión de reportes individuales: genera el comprobante técnico listo para imprimir con todos los datos y fotos del arreglo.",
      "Reportes consolidados en bloque: botón de 'Imprimir listado' para exportar informes completos directamente desde el navegador a PDF.",
      "Diseño optimizado para papel: estilos CSS específicos para salida de impresión limpia y legible.",
    ],
  },
];

const features = [
  "Autenticación segura de operarios por usuario y contraseña sin requerir servidor backend tradicional",
  "CRUD completo y reactivo: alta, consulta, filtrado y baja de registros de reparaciones",
  "Filtros dinámicos en tiempo real por texto libre, marca y rango de fechas",
  "Generación e impresión de reportes y fichas en PDF directamente desde el navegador",
  "Sincronización de datos en tiempo real entre múltiples dispositivos y terminales vía Supabase",
  "Imágenes técnicas embebidas en base64 para máxima portabilidad sin storage externo",
  "Tema visual oscuro 'Dark Sleek' con CSS Variables y tipografía moderna Syne + DM Mono",
  "Diseño 100% responsivo para operar cómodamente desde computadoras de depósito o celulares",
];

const stack = [
  {
    name: "HTML5, CSS3 y JavaScript Vanilla",
    why: "Construida íntegramente sin frameworks pesados, demostrando dominio pleno del lenguaje base, velocidad extrema y cero dependencias.",
  },
  {
    name: "CSS Variables + Syne & DM Mono",
    why: "Sistema de diseño centralizado con variables nativas de CSS y tipografías de Google Fonts para una estética moderna y funcional.",
  },
  {
    name: "Supabase (PostgreSQL en la Nube)",
    why: "Base de datos relacional serverless con API REST automática, autenticación integrada y Row Level Security (RLS) para proteger los datos.",
  },
  {
    name: "Netlify (CDN Global)",
    why: "Deploy continuo y estático con entrega de contenido ultra rápida, HTTPS automático y alta disponibilidad sin mantenimiento de servidores.",
  },
];

const screenshots = [
  {
    title: "Historial de reparaciones y buscador con métricas",
    desc: "Vista principal del historial con métricas en tiempo real (motos registradas, arregladas hoy, marcas), filtros dinámicos e impresión de listados.",
    src: "/images/projects/registro-reparaciones-historial.jpg",
  },
  {
    title: "Formulario de nueva reparación",
    desc: "Carga estructurada de datos de la moto, identificación técnica (chasis y motor) y descripción del trabajo realizado.",
    src: "/images/projects/registro-reparaciones-form.jpg",
  },
  {
    title: "Pantalla de acceso seguro",
    desc: "Login de operarios con autenticación integrada a Supabase y diseño estético temático.",
    src: "/images/projects/registro-reparaciones-login.jpg",
  },
];

export default async function RegistroReparacionesCase() {
  const site = await contentRepo.getSiteData();

  const developer = {
    name: "Fabrizio",
    fullName: "Fabrizio Nicolás Andrada Simeon",
    role: "Programador: frontend, backend, diseño y desarrollo web",
    photo: "/equipo/fabrizio-andrada.jpg",
    href: "https://www.linkedin.com/in/fabrizio-andrada-0b70532a1",
  };

  const whatsappMsg =
    "Hola, vi el Sistema de Registro de Reparaciones de Motos y me gustaría consultar por un desarrollo similar.";

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Motos & Depósito</span>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-blue-800">Sistema Web</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">100% Vanilla JS</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Sistema de Reparaciones: registro y trazabilidad de motos en depósito
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Aplicación web completa para el registro, control de inventario y seguimiento técnico de motocicletas
            en el depósito de distribución de una empresa del rubro.
          </p>

          {/* Hero mockup del proyecto */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 p-4 sm:p-8 shadow-2xl">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              {/* Barra de ventana simulada */}
              <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5 text-xs text-white/70">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-zinc-400">deposito-motos.app · Panel de Gestión</span>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                  Supabase Realtime
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/registro-reparaciones-historial.jpg"
                alt="Panel de historial del sistema de registro de reparaciones de motos"
                className="w-full object-cover object-top"
              />
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row">
              <p className="text-sm text-zinc-400">
                Seguimiento integral accesible desde cualquier dispositivo, navegador o celular sin instalaciones.
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300">
                ⚡ Desarrollado con JavaScript nativo
              </span>
            </div>
          </div>

          {/* Ficha técnica */}
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl border border-black/5 bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{f.label}</dt>
                <dd className="mt-1 font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>

          {/* Problema y Solución */}
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <section>
              <h2 className="text-2xl font-extrabold">El problema</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                En depósitos y centros de distribución de motos con alto volumen de unidades, las reparaciones, ajustes
                de pre-entrega y detalles mecánicos se anotaban habitualmente en planillas físicas o mensajes informales.
                Esto provocaba pérdida de historial, dificultad para encontrar cuándo y qué arreglo se le hizo a un chasis
                específico, y una notable lentitud a la hora de generar informes para auditorías o entregas a concesionarios.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                Se implementó una aplicación web ágil y liviana construida en JavaScript vanilla conectada a Supabase.
                Los mecánicos y encargados de depósito registran en segundos cada moto ingresando marca, modelo, chasis,
                motor y trabajo realizado. Toda la información queda sincronizada al instante en la nube, con potentes
                filtros de búsqueda e impresión directa de comprobantes y listados en PDF sin requerir servidores intermedios.
              </p>
            </section>
          </div>

          {/* Galería de vistas del sistema */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Galería de la aplicación</h2>
            <p className="mt-2 text-ink/70">
              Capturas del sistema en funcionamiento: interfaz limpia, contrastada y adaptada a la operatoria de taller.
            </p>
            <div className="mt-6 space-y-8">
              {screenshots.map((s, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 p-4 sm:p-6 shadow-xl"
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.title} className="w-full object-cover object-top" />
                  </div>
                  <div className="mt-4 px-2">
                    <h3 className="text-lg font-bold text-white">{s.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Estructura de la plataforma */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Estructura del sistema</h2>
            <div className="mt-6 space-y-6">
              {areas.map((area) => (
                <div key={area.title} className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-bold">{area.title}</h3>
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                      {area.badge}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {area.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink/80">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Funcionalidades destacadas */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Funcionalidades implementadas</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quién lo hizo (Fabrizio) */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Quién lo desarrolló</h2>
            <p className="mt-3 max-w-3xl text-ink/70">
              Fabrizio diseñó y desarrolló la aplicación completa de punta a punta: diagramó la experiencia de usuario y
              diseño visual responsivo con CSS Variables y fuentes Syne/DM Mono, programó la lógica de interacción en
              JavaScript vanilla sin frameworks, integró la base de datos PostgreSQL y autenticación en Supabase con
              políticas RLS, y configuró el despliegue optimizado en Netlify.
            </p>
            <div className="mt-6 max-w-md">
              <a
                href={developer.href}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="strict-origin-when-cross-origin"
                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 transition hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={developer.photo}
                  alt={`Foto de ${developer.fullName}`}
                  className="h-16 w-16 shrink-0 rounded-full object-cover object-top"
                />
                <div>
                  <p className="font-bold">{developer.name}</p>
                  <p className="text-xs text-ink/50">{developer.fullName}</p>
                  <p className="text-sm text-ink/60">{developer.role}</p>
                </div>
              </a>
            </div>
          </section>

          {/* Tecnologías y Arquitectura */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Tecnologías y Arquitectura</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stack.map((s) => (
                <div key={s.name} className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-5">
                  <p className="font-bold">{s.name}</p>
                  <p className="mt-2 text-sm text-ink/60">{s.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Llamado a la acción */}
          <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold">¿Necesitas digitalizar los procesos de tu depósito o taller?</h2>
              <p className="mt-2 text-paper/70">
                Desarrollamos soluciones a medida, rápidas y fáciles de usar desde cualquier celular o computadora.
              </p>
            </div>
            <a
              href={makeWhatsappLink(site.whatsapp, whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Escríbenos <ArrowIcon className="h-4 w-4" />
            </a>
          </section>
        </article>
      </main>
      <Footer />
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, whatsappMsg)} />
    </>
  );
}
