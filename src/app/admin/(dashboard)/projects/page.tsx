"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/content/schemas";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/content/projects");
      const data = await res.json();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`¿Eliminar proyecto "${title}"?`)) return;
    
    await fetch(`/api/content/projects/${slug}`, { method: "DELETE" });
    fetchProjects();
  };

  if (loading) return <div className="p-8 text-center text-ink/50">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Proyectos</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Nuevo Proyecto
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-sm">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/20">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-paper/50">Título</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-paper/50">Sector</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-paper/50">Tipo</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-paper/50">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-transparent">
            {projects.map((project) => (
              <tr key={project.slug} className="transition-colors hover:bg-white/5">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-bold text-white">{project.title}</div>
                  <div className="text-sm text-paper/50">{project.slug}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-paper/70">
                  {project.sector}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                    ${project.kind === 'real' ? 'bg-green-100 text-green-800' : ''}
                    ${project.kind === 'desarrollo' ? 'bg-blue-100 text-blue-800' : ''}
                    ${project.kind === 'concepto' ? 'bg-purple-100 text-purple-800' : ''}
                    ${project.kind === 'facultad' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {project.kind}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="text-brand hover:text-brand-dark"
                    >
                      <Pencil className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.slug, project.title)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-paper/50">
                  No hay proyectos creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
