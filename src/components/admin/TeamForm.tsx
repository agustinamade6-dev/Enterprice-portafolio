"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Member } from "@/lib/content/schemas";
import { ArrowLeft, Save, Upload, X, Plus } from "lucide-react";
import Link from "next/link";

export function TeamForm({ member, isNew = false }: { member?: Member; isNew?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Member>(
    member || {
      slug: "",
      name: "",
      fullName: "",
      role: "",
      bio: "",
      skills: [],
      story: {
        intro: "",
        chapters: [],
      },
    }
  );

  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      story: { ...prev.story, [name]: value },
    }));
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    e.preventDefault();
    
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), trimmed],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => {
      const arr = [...(prev.skills || [])];
      arr.splice(index, 1);
      return { ...prev, skills: arr };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, photo: result.url }));
      } else {
        alert("Error subiendo foto");
      }
    } catch (err) {
      alert("Error subiendo foto");
    }
  };

  const addChapter = () => {
    setFormData((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        chapters: [...(prev.story.chapters || []), { label: "", title: "", text: "" }],
      },
    }));
  };

  const updateChapter = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const chapters = [...(prev.story.chapters || [])];
      chapters[index] = { ...chapters[index], [field]: value } as any;
      return { ...prev, story: { ...prev.story, chapters } };
    });
  };

  const removeChapter = (index: number) => {
    setFormData((prev) => {
      const chapters = [...(prev.story.chapters || [])];
      chapters.splice(index, 1);
      return { ...prev, story: { ...prev.story, chapters } };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/content/team" : `/api/content/team/${member?.slug}`;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/team");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/team" className="rounded-full p-2 hover:bg-black/5">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">{isNew ? "Nuevo Miembro" : `Editar Miembro`}</h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-bold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {error && <div className="rounded-xl bg-red-500/10 p-4 text-red-600">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Columna Izquierda: Datos Principales */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-white">Información Personal</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Nombre (Como te dicen)</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Nombre Completo</label>
                <input
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Slug (URL)</label>
                <input
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Rol / Puesto</label>
                <input
                  required
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Biografía Corta (Card)</label>
              <textarea
                required
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Enlace Red Social (Opcional)</label>
                <input
                  name="href"
                  value={formData.href || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Tipo de Red Social</label>
                <select
                  name="network"
                  value={formData.network || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Ninguna</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="pt-4">
              <label className="mb-1 block text-sm font-medium text-paper/70">Habilidades / Tecnologías</label>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="Ej: Next.js, Backend, Diseño..."
                />
                <button type="button" onClick={handleAddSkill} className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 font-bold text-white">Agregar</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills?.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-sm text-brand font-medium">
                    {skill} <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSkill(i)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-white">Historia Completa</h2>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Introducción (Intro)</label>
              <textarea
                required
                name="intro"
                value={formData.story.intro}
                onChange={handleStoryChange}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Pendiente de contar (Tercera persona)</label>
              <input
                name="pending"
                value={formData.story.pending || ""}
                onChange={handleStoryChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Capítulos de la Historia</h3>
                <button type="button" onClick={addChapter} className="flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-dark">
                  <Plus className="h-4 w-4" /> Agregar
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.story.chapters?.map((chapter, i) => (
                  <div key={i} className="relative rounded-xl border border-white/10 bg-black/20 p-4">
                    <button type="button" onClick={() => removeChapter(i)} className="absolute right-3 top-3 text-red-400 hover:text-red-300 p-1 rounded-lg">
                      <X className="h-4 w-4" />
                    </button>
                    <div className="grid gap-3 pr-8">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-paper/70">Etiqueta / Año</label>
                          <input
                            required
                            value={chapter.label}
                            onChange={(e) => updateChapter(i, "label", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                            placeholder="Ej: 2025 · Hoy"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-paper/70">Título del hito</label>
                          <input
                            required
                            value={chapter.title}
                            onChange={(e) => updateChapter(i, "title", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-paper/70">Texto</label>
                        <textarea
                          required
                          value={chapter.text}
                          onChange={(e) => updateChapter(i, "text", e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-paper/70">Enlace a proyecto (Opcional)</label>
                        <input
                          value={chapter.href || ""}
                          onChange={(e) => updateChapter(i, "href", e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                          placeholder="/proyectos/akros-cafe/"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Foto de perfil */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-white">Foto de Perfil</h2>
            
            <div className="space-y-4 text-center">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-brand/20 bg-black/20">
                {formData.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.photo} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-3xl font-bold text-white/50">
                    {formData.name.charAt(0) || "?"}
                  </span>
                )}
              </div>
              
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 py-3 font-bold text-paper/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Upload className="h-5 w-5" />
                Subir Foto
              </button>
              
              <input
                name="photo"
                value={formData.photo || ""}
                onChange={handleChange}
                placeholder="O pega una URL..."
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
