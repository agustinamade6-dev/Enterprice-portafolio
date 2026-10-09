import Link from "next/link";
import type { Project } from "@/content/site";
import { ArrowIcon } from "./icons";
import { PosMockup } from "./PosMockup";

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const body = (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 ${large ? "md:flex-row" : ""}`}
    >
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br ${project.accent} p-6 ${large ? "md:w-3/5" : "aspect-[16/10]"}`}
      >
        {project.slug === "akros-cafe" ? (
          <PosMockup className="w-full max-w-md" />
        ) : project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`Captura del sistema de ${project.title}`}
            className={`w-full rounded-lg shadow-xl shadow-black/25 ${large ? "max-w-md" : "max-w-sm"}`}
          />
        ) : project.slug === "chatbot-crm" ? (
          <ChatScreen />
        ) : project.modules ? (
          <GestionScreen title={project.sector} modules={project.modules} />
        ) : (
          <ConceptScreen title={project.title} />
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${large ? "md:justify-center md:p-10" : ""}`}>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-black/5 px-2.5 py-1">{project.sector}</span>
          {project.kind === "real" ? (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
          ) : project.kind === "desarrollo" ? (
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-800">En desarrollo</span>
          ) : (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">Concepto</span>
          )}
        </div>
        <h3 className={`font-extrabold tracking-tight ${large ? "text-3xl" : "text-xl"}`}>{project.title}</h3>
        <p className="mt-2 text-ink/70">{project.summary}</p>
        <p className="mt-3 text-sm font-semibold text-brand-dark">{project.result}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.tags.map((t) => (
            <span key={t} className="rounded-md border border-black/10 px-2 py-0.5 text-xs text-ink/60">
              {t}
            </span>
          ))}
        </div>
        {project.href && (
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold">
            {project.kind === "concepto" ? "Probar la demo" : "Ver caso completo"}
            <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </article>
  );

  return project.href ? (
    <Link href={project.href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
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
function ChatScreen() {
  const msgs = [
    { from: "bot", text: "¡Hola! ¿En qué servicio estás interesado?" },
    { from: "user", text: "Aire acondicionado, no enfría 🥵" },
    { from: "bot", text: "Entiendo. ¿En qué zona te encuentras?" },
    { from: "user", text: "🎤 Audio 0:08" },
    { from: "bot", text: "¡Listo! Un técnico te escribe en breve." },
  ];
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
