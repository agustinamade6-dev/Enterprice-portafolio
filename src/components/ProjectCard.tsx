import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content/schemas";
import { ArrowIcon } from "./icons";
import { PosMockup } from "./PosMockup";

export function ProjectCard({
  project,
}: {
  project: Project;
  large?: boolean;
  compact?: boolean;
}) {
  const imageSrc = project.image || project.coverUrl;

  const visual = imageSrc ? (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900">
      <Image
        src={imageSrc}
        alt={`Captura del proyecto ${project.title}`}
        fill
        sizes="(max-width: 768px) 100vw, 750px"
        className="object-cover object-top transition duration-700 ease-out group-hover:scale-105"
        priority={project.slug === "lv-racing"}
      />
    </div>
  ) : project.slug === "akros-cafe" ? (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 p-6 pb-20">
      <div className="w-full max-w-sm transition duration-500 group-hover:scale-105">
        <PosMockup className="w-full" />
      </div>
    </div>
  ) : project.chat ? (
    <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${project.accent} p-6 pb-20`}>
      <div className="w-full max-w-xs transition duration-500 group-hover:scale-105">
        <ChatScreen msgs={project.chat} />
      </div>
    </div>
  ) : project.slug === "chatbot-crm" ? (
    <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${project.accent} p-6 pb-20`}>
      <div className="w-full max-w-xs transition duration-500 group-hover:scale-105">
        <ChatScreen />
      </div>
    </div>
  ) : project.modules ? (
    <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${project.accent} p-6 pb-20`}>
      <div className="w-full max-w-xs transition duration-500 group-hover:scale-105">
        <GestionScreen title={project.sector} modules={project.modules} />
      </div>
    </div>
  ) : (
    <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${project.accent} p-6 pb-20`}>
      <ConceptScreen title={project.title} />
    </div>
  );

  const kindBadge =
    project.kind === "real" ? (
      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-800 shadow-2xs">
        Proyecto real
      </span>
    ) : project.kind === "desarrollo" ? (
      <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800 shadow-2xs">
        En desarrollo
      </span>
    ) : project.kind === "facultad" ? (
      <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-800 shadow-2xs">
        Facultad
      </span>
    ) : (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
        Concepto
      </span>
    );

  // Obtener dominio limpio para la barra del navegador
  const displayUrl =
    project.slug === "lv-racing"
      ? "lv-racing-web.vercel.app"
      : project.href?.startsWith("http")
      ? project.href.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
      : `${project.slug}.zainsoft.dev`;

  const body = (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-white text-ink shadow-xl transition-all duration-300">
      {/* 1. Barra superior de ventana limpia (color claro uniforme) */}
      <div className="z-20 flex h-8 sm:h-9 shrink-0 items-center justify-between bg-[#f4f4f6] px-2.5 sm:px-3.5 select-none">
        {/* Controles de semáforo */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#27c93f]" />
        </div>

        {/* Dirección de URL simulada */}
        <div className="mx-1.5 sm:mx-2 flex max-w-[140px] sm:max-w-[280px] flex-1 items-center justify-center gap-1 sm:gap-1.5 truncate rounded-md bg-white px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-zinc-600 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">{displayUrl}</span>
        </div>

        {/* Badge del tipo de proyecto */}
        <div className="shrink-0">{kindBadge}</div>
      </div>

      {/* 2. Pantalla completa del proyecto (la imagen llena el viewport de la ventana de forma continua) */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {visual}

        {/* 3. Textos y botones FLOTANTES sobre la parte inferior (degradado protector para máxima legibilidad) */}
        <div className="z-20 absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-4 pb-3.5 pt-24 sm:px-6 sm:pb-6 text-white flex flex-col gap-1 sm:gap-1.5">
          {/* Fila principal: Sector, Título y Botón flotante */}
          <div className="flex items-end justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand drop-shadow-sm">
                {project.sector}
              </span>
              <h3 className="truncate text-lg sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
                {project.title}
              </h3>
            </div>

            {/* Botón flotante de acción */}
            <div className="shrink-0">
              {project.href ? (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-brand px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand/40 transition-all duration-300 group-hover:bg-brand-dark group-hover:scale-105">
                  {project.kind === "concepto" ? "Demo" : "Ver proyecto"}
                  <ArrowIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-white/90 backdrop-blur-md">
                  {project.result}
                </span>
              )}
            </div>
          </div>

          {/* Subtítulo / Descripción flotante */}
          <p className="line-clamp-1 sm:line-clamp-2 max-w-xl text-xs sm:text-sm leading-relaxed text-white/90 drop-shadow-sm">
            {project.summary}
          </p>

          {/* Tags y Categorías flotantes */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/20 bg-white/15 px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[10px] sm:text-[11px] font-medium text-white shadow-2xs backdrop-blur-md"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );

  if (!project.href) return body;

  return project.href.startsWith("http") ? (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full cursor-pointer"
    >
      {body}
    </a>
  ) : (
    <Link href={project.href} className="block h-full cursor-pointer">
      {body}
    </Link>
  );
}

// Pantalla genérica para los prototipos que todavía no tienen demo.
function ConceptScreen({ title }: { title: string }) {
  return (
    <div className="w-40 rounded-[1.5rem] border-4 border-white/90 bg-white p-2.5 shadow-xl shadow-black/20">
      <div className="mb-2 h-2 w-12 rounded-full bg-neutral-200" />
      <div className="mb-2 text-[10px] font-extrabold leading-tight text-ink">{title}</div>
      <div className="mb-2 h-14 rounded-lg bg-neutral-100" />
      <div className="space-y-1.5">
        <div className="h-2 rounded bg-neutral-200" />
        <div className="h-2 w-4/5 rounded bg-neutral-200" />
        <div className="h-2 w-3/5 rounded bg-neutral-200" />
      </div>
      <div className="mt-3 h-5 rounded-md bg-ink" />
    </div>
  );
}

// Ilustración de un sistema de gestión de escritorio con sus módulos.
function GestionScreen({ title, modules }: { title: string; modules: string[] }) {
  return (
    <div
      className="w-full max-w-xs overflow-hidden rounded-xl border border-white/80 bg-white text-[9px] shadow-xl shadow-black/20"
      role="img"
      aria-label={`Pantalla del sistema de gestión: ${modules.join(", ")}`}
    >
      <div className="flex items-center gap-1 border-b border-black/5 bg-neutral-100 px-2 py-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 font-semibold text-neutral-500">{title}</span>
      </div>
      <div className="flex">
        <ul className="w-24 shrink-0 space-y-0.5 bg-ink p-1.5 text-paper/70">
          {modules.map((m, i) => (
            <li key={m} className={`truncate rounded px-1.5 py-1 ${i === 1 ? "bg-white/15 font-bold text-white" : ""}`}>
              {m}
            </li>
          ))}
        </ul>
        <div className="flex-1 p-2">
          <div className="mb-1.5 font-bold text-ink">{modules[1]}</div>
          {[80, 55, 30, 70].map((w, i) => (
            <div key={i} className="flex items-center gap-1.5 border-b border-black/5 py-1">
              <span className="h-1.5 flex-1 rounded bg-neutral-200" />
              <span className="h-1.5 w-6 overflow-hidden rounded bg-neutral-100">
                <span className={`block h-full rounded ${w < 40 ? "bg-red-400" : "bg-green-400"}`} style={{ width: `${w}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ilustración de una conversación con el asistente.
const defaultChat: { from: "bot" | "user"; text: string }[] = [
  { from: "bot", text: "¡Hola! ¿En qué servicio estás interesado?" },
  { from: "user", text: "Aire acondicionado, no enfría 🥵" },
  { from: "bot", text: "Entiendo. ¿En qué zona te encuentras?" },
  { from: "user", text: "🎤 Audio 0:08" },
  { from: "bot", text: "¡Listo! Un técnico te escribe en breve." },
];

function ChatScreen({ msgs = defaultChat }: { msgs?: { from: "bot" | "user"; text: string }[] }) {
  return (
    <div
      className="w-full max-w-xs overflow-hidden rounded-2xl border border-white/80 bg-white text-[10px] shadow-xl shadow-black/20"
      role="img"
      aria-label="Conversación de ejemplo con el asistente de IA"
    >
      <div className="flex items-center gap-2 bg-ink px-3 py-2 text-white">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-cyan-500 font-bold">IA</span>
        <span className="font-semibold">Asistente · en línea</span>
      </div>
      <div className="space-y-1.5 bg-sky-50 p-2.5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : ""}`}>
            <span
              className={`max-w-[80%] rounded-xl px-2 py-1 ${m.from === "user" ? "rounded-br-sm bg-cyan-600 text-white" : "rounded-bl-sm bg-white text-ink shadow-sm"}`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
