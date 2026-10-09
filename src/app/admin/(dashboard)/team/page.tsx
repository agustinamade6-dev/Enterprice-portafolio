"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Member } from "@/lib/content/schemas";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TeamPage() {
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/content/team");
      const data = await res.json();
      setTeam(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`¿Eliminar al miembro "${name}"?`)) return;
    
    await fetch(`/api/content/team/${slug}`, { method: "DELETE" });
    fetchTeam();
  };

  if (loading) return <div className="p-8 text-center text-ink/50">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Equipo</h1>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Nuevo Miembro
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div key={member.slug} className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-sm transition-shadow hover:shadow-md">
            <div className="flex-1 p-6 text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-brand/50 bg-black/50">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{member.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wider text-paper/50">{member.fullName}</p>
              <p className="mt-2 text-sm text-paper/70 line-clamp-2">{member.role}</p>
            </div>
            <div className="flex divide-x divide-white/10 border-t border-white/10 bg-black/20">
              <Link
                href={`/admin/team/${member.slug}`}
                className="flex flex-1 items-center justify-center gap-2 p-3 text-sm font-medium text-brand hover:bg-white/5 hover:text-brand-dark"
              >
                <Pencil className="h-4 w-4" /> Editar
              </Link>
              <button
                onClick={() => handleDelete(member.slug, member.name)}
                className="flex flex-1 items-center justify-center gap-2 p-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Eliminar
              </button>
            </div>
          </div>
        ))}
        {team.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-8 text-center text-paper/50">
            No hay miembros en el equipo.
          </div>
        )}
      </div>
    </div>
  );
}
