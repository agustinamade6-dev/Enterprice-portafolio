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
  title: "Todo Suela, plataforma web para gestión de fútbol amateur y portal de hinchas",
  description:
    "Caso de estudio: plataforma integral para el equipo de fútbol amateur Todo Suela con seguimiento de torneos, fixtures, estadísticas en tiempo real y panel de administración táctica.",
};

const facts = [
  { label: "Cliente / Equipo", value: "Todo Suela Fútbol Amateur" },
  { label: "Rubro", value: "Gestión deportiva y fútbol" },
  { label: "Tipo", value: "Portal de hinchas + Panel táctico + Fixture" },
  { label: "Desarrollo", value: "Nicolás Raúl Bazán" },
];

const areas = [
  {
    title: "1. Portal Público para Hinchas y Seguidores (/)",
    badge: "Acceso abierto",
    items: [
      "Próximos Partidos y Resultados: banner destacado del próximo encuentro, historial de partidos con incidencias (goles, asistencias, tarjetas) y porcentaje de rendimiento.",
      "Tablas de Posiciones y Fixture en Vivo: tablas por zona (A y B) con puestos de clasificación y fixture navegable fecha a fecha.",
      "Árbol Interactivo de Playoffs: cuadros de eliminación directa para Copa de Oro, Plata y Bronce con cálculo predictivo según la posición en la tabla.",
      "Fichas de Jugadores y Estadísticas: dorsales, posiciones, fotos y tablas con el top de goleadores, asistidores y presencias del plantel.",
    ],
  },
  {
    title: "2. Panel de Administración y Pizarra Táctica (/admin)",
    badge: "Control técnico",
    items: [
      "Gestión de Partidos y Pizarra: configuración de rivales, fechas, esquema táctico en cancha (ej. 2-3-1), titulares y suplentes.",
      "Carga de Incidencias en Vivo: registro en tiempo real de goles, asistencias, tarjetas y minutos de juego con modal ágil.",
      "Motor Automático de Torneo: al asentar resultados, recalcula de forma instantánea puntos, PJ, PG, PE, PP y diferencia de gol de todos los equipos de la zona.",
      "Sincronización Inteligente: el motor detecta automáticamente cuando juega Todo Suela y sincroniza el encuentro con la agenda principal del club.",
    ],
  },
  {
    title: "3. Identidad del Club y Gestión Multimedia",
    badge: "Marca y Sponsors",
    items: [
      "Gestión de Plantel y Cuerpo Técnico: altas, bajas y actualización de perfiles con fotos y datos del Director Técnico.",
      "Sponsors Oficiales: administración de auspiciantes del equipo con logos, enlaces web y orden de visualización.",
      "Galería Fotográfica en la Nube: almacenamiento y optimización persistente de fotos de partidos y celebraciones con Cloudinary.",
      "Seguridad y Protección: sesiones cifradas, autenticación blindada y limitación de intentos de login por IP con SlowAPI.",
    ],
  },
];

const features = [
  "Motor automático que recalcula las tablas de posiciones y diferencia de gol al instante",
  "Sincronización en caliente entre el fixture general del torneo y la agenda del club",
  "Pizarra táctica con esquemas de juego (ej. 2-3-1), titulares y suplentes para cada partido",
  "Carga de incidencias en vivo con cómputo automático de goleadores y asistidores",
  "Árbol de playoffs interactivo para copas de Oro, Plata y Bronce con lógica clasificatoria",
  "Almacenamiento y optimización de fotos de jugadores, galería y sponsors en Cloudinary",
];

const stack = [
  {
    name: "FastAPI y Python 3.11",
    why: "Backend de alto rendimiento con Uvicorn asíncrono y arquitectura modular en routers",
  },
  {
    name: "SQLAlchemy y PostgreSQL",
    why: "ORM con soporte dual para SQLite local y Supabase/PostgreSQL con auto-migraciones en caliente",
  },
  {
    name: "Cloudinary",
    why: "Almacenamiento persistente, compresión y optimización de fotos de jugadores, sponsors y galerías",
  },
  {
    name: "Tailwind CSS y Jinja2",
    why: "Renderizado ágil, tipografía Inter y diseño moderno responsivo adaptado a celulares y tablets",
  },
];

export default async function TodoSuelaCase() {
  const site = await contentRepo.getSiteData();

  const developer = {
    name: "Nicolás",
    fullName: "Nicolás Raúl Bazán",
    role: "Programador: arquitectura integral, backend en FastAPI y frontend",
    photo: "/equipo/nicolas-bazan.jpg",
    href: "https://www.linkedin.com/in/nicolas-baz%C3%A1n-9315653b3/",
  };

  const whatsappMsg =
    "Hola, vi la plataforma de Todo Suela y me interesa desarrollar un sistema deportivo o web similar para mi equipo o torneo.";

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Fútbol amateur</span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Todo Suela: plataforma integral de fútbol amateur y portal para hinchas
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
                <span className="font-mono text-zinc-400">todo-suela.vercel.app</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Online
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/todo-suela.png"
                alt="Captura de la plataforma web de Todo Suela"
                className="w-full object-cover object-top"
              />
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row">
              <p className="text-sm text-zinc-400">
                Plataforma web en producción utilizada para el seguimiento de partidos, torneos y administración táctica.
              </p>
              <ProjectLiveButton
                url="https://todo-suela.vercel.app/"
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
                La organización de equipos de fútbol amateur y el seguimiento de torneos suele fragmentarse en planillas manuales,
                grupos de mensajería y notas aisladas. Esto dificulta que los jugadores e hinchas conozcan las posiciones en tiempo real,
                consulten el fixture actualizado o sigan las estadísticas individuales y el historial del plantel sin confusiones.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                Se diseñó una plataforma web completa de alto rendimiento con FastAPI y PostgreSQL. Integra un portal público para que
                hinchas y jugadores consulten fixtures, tablas por zona con recálculo automático y cuadros de playoffs, junto a un panel
                táctico administrativo para planificar esquemas, asentar alineaciones y registrar incidencias minuto a minuto.
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
              Nicolás fue el único desarrollador a cargo de la plataforma completa de Todo Suela: diseñó la arquitectura
              integral con FastAPI en Python 3.11, implementó la base de datos con SQLAlchemy y auto-migraciones,
              programó el motor inteligente de recálculo de tablas y sincronización de partidos, integró el almacenamiento
              en Cloudinary y desarrolló toda la interfaz pública y el panel de administración con Tailwind CSS y Jinja2.
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
              <h2 className="text-2xl font-extrabold">¿Quieres una plataforma deportiva o sistema a medida para tu club?</h2>
              <p className="mt-2 text-paper/70">
                Creamos sistemas para torneos, estadísticas, fixtures y gestión táctica adaptados a tu disciplina y forma de trabajo.
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
