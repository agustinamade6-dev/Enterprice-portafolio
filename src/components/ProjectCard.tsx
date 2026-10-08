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
        ) : (
          <ConceptScreen title={project.title} />
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${large ? "md:justify-center md:p-10" : ""}`}>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-black/5 px-2.5 py-1">{project.sector}</span>
          {project.kind === "real" ? (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
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
            Ver caso completo
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
