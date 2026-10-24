import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProjectLiveButton } from "@/components/ProjectLiveButton";
import { contentRepo } from "@/lib/content";

function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const metadata: Metadata = {
  title: "LV Racing, plataforma web para taller de motos y portal de clientes",
  description:
    "Caso de estudio: plataforma integral para taller mecánico de motos de alto rendimiento con panel Kanban, portal Mi Garage y evidencias fotográficas.",
};

const facts = [
  { label: "Cliente", value: "LV Racing Tucumán" },
  { label: "Rubro", value: "Motos y competición" },
  { label: "Tipo", value: "Plataforma web + Portal de clientes + CMS" },
  { label: "Desarrollo", value: "Nicolás Raúl Bazán" },
];

const areas = [
  {
    title: "1. Panel de Administración y Taller (/admin)",
    badge: "Control interno",
    items: [
      "Tablero Kanban de Órdenes: permite visualizar y mover las motos según su etapa (Recibida, En Diagnóstico, Esperando Repuestos, Reparación, Lista).",
      "Gestión de Órdenes y Diagnósticos: edición de tareas a realizar, fechas de ingreso, kilometraje/horas de motor y datos del cliente.",
      "Carga de Evidencias Fotográficas: botón de cámara directo para sacar fotos con el celular en el taller y adjuntarlas como respaldo técnico a cada orden.",
      "Gestión de Contenido (CMS): administración de banners, testimonios, marcas/sponsors y fotos de la web sin necesidad de tocar código.",
    ],
  },
  {
    title: "2. Portal del Cliente: 'Mi Garage' (/garage)",
    badge: "Transparencia al cliente",
    items: [
      "Seguimiento en Vivo: el cliente ingresa con su patente o teléfono y consulta en tiempo real la barra de progreso de su moto.",
      "Galería de Evidencias: visualización de fotos reales tomadas por el mecánico sobre las piezas sustituidas, roturas o mantenimiento realizado.",
      "Historial Clínico: registro histórico ordenado de todos los servicios técnicos y afinaciones anteriores realizadas en el vehículo.",
    ],
  },
  {
    title: "3. Landing Page Pública (/)",
    badge: "Captación comercial",
    items: [
      "Catálogo de Servicios: mecánica de competición, inyección electrónica, suspensión y preparación off-road/enduro.",
      "Credenciales Oficiales: certificaciones técnicas, marcas asociadas y portfolio fotográfico de trabajos realizados.",
      "Llamados a la Acción: reserva ágil de turnos y contacto directo por WhatsApp con el taller.",
    ],
  },
];

const features = [
  "Tablero Kanban para organizar el flujo de motos en el taller en tiempo real",
  "Carga de fotos de evidencia técnica directa desde el celular de los mecánicos",
  "Portal 'Mi Garage' con seguimiento de estado por patente o teléfono",
  "Historial clínico completo de mantenimientos para cada vehículo",
  "Panel CMS para actualizar la web principal sin tocar código",
  "Diseño 100% responsivo pensado para uso rudo en taller y consulta cómoda en móviles",
];

const stack = [
  {
    name: "FastAPI y Python",
    why: "API REST moderna desplegada en Vercel para una respuesta ultrarrápida del sistema",
  },
  {
    name: "Neon (PostgreSQL Serverless)",
    why: "Base de datos relacional para órdenes, clientes y motos de forma ligera y escalable",
  },
  {
    name: "Cloudinary",
    why: "Alojamiento, optimización y compresión de evidencias fotográficas en la nube",
  },
  {
    name: "Tailwind CSS y JS",
    why: "Interfaz fluida, moderna y reactiva con modo oscuro y diseño de alto rendimiento",
  },
];

export default async function LvRacingCase() {
  const site = await contentRepo.getSiteData();

  const developer = {
    name: "Nicolás",
    fullName: "Nicolás Raúl Bazán",
    role: "Programador: arquitectura, backend en FastAPI y frontend",
    photo: "/equipo/nicolas-bazan.jpg",
    href: "https://www.linkedin.com/in/nicolas-baz%C3%A1n-9315653b3/",
  };

  const whatsappMsg =
    "Hola, vi la plataforma de LV Racing y me interesa desarrollar un sistema similar para mi negocio o taller.";

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" prefetch={false} className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Motos</span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            LV Racing: gestión integral de taller de motos y portal de clientes
          </h1>

          {/* Hero mockup del proyecto con enlace a la web en vivo */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 p-4 sm:p-8 shadow-2xl">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              {/* Barra de ventana simulada */}
              <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5 text-xs text-white/70">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-zinc-400">lv-racing-web.vercel.app</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Online
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/lv-racing.png"
                alt="Captura de la plataforma web de LV Racing"
                className="w-full object-cover object-top"
              />
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row">
              <p className="text-sm text-zinc-400">
                Plataforma web en producción utilizada para la gestión diaria y atención al público.
              </p>
              <ProjectLiveButton
                url="https://lv-racing-web.vercel.app/"
                label="Visitar sitio oficial ↗"
              />
            </div>
          </div>

          {/* Métricas / Ficha técnica */}
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
                Un taller mecánico enfocado en motos de alta cilindrada y competición maneja múltiples reparaciones simultáneas,
                piezas de alto valor y mantenimientos complejos. La comunicación tradicional por mensajes generaba desorden en el estado
                de los trabajos, dudas sobre repuestos cambiados y consultas reiteradas de clientes sobre cuándo estaría lista su moto.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                Se construyó un ecosistema web centralizado de tres partes: un panel Kanban para que los mecánicos organicen las motos
                y carguen fotos de evidencias técnicas directo desde su teléfono; el portal del cliente &quot;Mi Garage&quot; con seguimiento
                por patente en tiempo real; y una landing comercial que refleja la imagen profesional y potencia la captación.
              </p>
            </section>
          </div>

          {/* Las 3 Áreas de la plataforma */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Estructura de la plataforma</h2>
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

          {/* Qué hace / Características */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Funcionalidades destacadas</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quién lo hizo (Nicolás) */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Quién lo hizo</h2>
            <p className="mt-3 max-w-3xl text-ink/70">
              Nicolás fue el único desarrollador a cargo de la plataforma completa de LV Racing: diseñó la arquitectura de microservicios
              con FastAPI en Python, configuró la base de datos PostgreSQL Serverless en Neon, implementó la subida y compresión
              de evidencias fotográficas en Cloudinary, y programó toda la interfaz de usuario con Tailwind CSS y JavaScript.
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

          {/* Tecnologías */}
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
              <h2 className="text-2xl font-extrabold">¿Quieres un sistema a medida para tu taller o empresa?</h2>
              <p className="mt-2 text-paper/70">
                Creamos plataformas de gestión, paneles Kanban y portales de clientes adaptados a tu forma de trabajo.
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
