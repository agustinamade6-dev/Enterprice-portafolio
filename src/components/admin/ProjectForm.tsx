"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/content/schemas";
import { ArrowLeft, Save, Upload, X, Plus } from "lucide-react";
import Link from "next/link";

export function ProjectForm({ project, isNew = false }: { project?: Project; isNew?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Project>(
    project || {
      slug: "",
      title: "",
      sector: "",
      kind: "real",
      summary: "",
      result: "",
      tags: [],
      accent: "from-brand to-brand-dark",
      href: "",
      image: "",
      modules: [],
      chat: [],
      by: [],
    }
  );

  const [tagInput, setTagInput] = useState("");
  const [moduleInput, setModuleInput] = useState("");
  const [byInput, setByInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent, type: "tags" | "modules" | "by") => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    e.preventDefault();
    
    let inputVal = "";
    if (type === "tags") { inputVal = tagInput; setTagInput(""); }
    else if (type === "modules") { inputVal = moduleInput; setModuleInput(""); }
    else if (type === "by") { inputVal = byInput; setByInput(""); }

    const trimmed = inputVal.trim();
    if (trimmed && !formData[type]?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), trimmed],
      }));
    }
  };

  const handleRemoveTag = (type: "tags" | "modules" | "by", index: number) => {
    setFormData((prev) => {
      const arr = [...(prev[type] || [])];
      arr.splice(index, 1);
      return { ...prev, [type]: arr };
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
        setFormData((prev) => ({ ...prev, image: result.url }));
      } else {
        alert("Error subiendo imagen");
      }
    } catch (err) {
      alert("Error subiendo imagen");
    }
  };

  const addChatMessage = () => {
    setFormData((prev) => ({
      ...prev,
      chat: [...(prev.chat || []), { from: "bot", text: "" }],
    }));
  };

  const updateChatMessage = (index: number, field: "from" | "text", value: string) => {
    setFormData((prev) => {
      const chat = [...(prev.chat || [])];
      chat[index] = { ...chat[index], [field]: value } as any;
      return { ...prev, chat };
    });
  };

  const removeChatMessage = (index: number) => {
    setFormData((prev) => {
      const chat = [...(prev.chat || [])];
      chat.splice(index, 1);
      return { ...prev, chat };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/content/projects" : `/api/content/projects/${project?.slug}`;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar el proyecto");
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
          <Link href="/admin/projects" className="rounded-full p-2 hover:bg-black/5">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">{isNew ? "Nuevo Proyecto" : `Editar Proyecto`}</h1>
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
            <h2 className="font-bold text-lg text-white">Información General</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Título</label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Sector (ej. Cafetería)</label>
                <input
                  required
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-paper/70">Tipo</label>
                <select
                  name="kind"
                  value={formData.kind}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="real">Real</option>
                  <option value="desarrollo">En Desarrollo</option>
                  <option value="facultad">Facultad</option>
                  <option value="concepto">Concepto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Resumen corto</label>
              <textarea
                required
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Resultado / Logro</label>
              <input
                required
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Enlace (opcional)</label>
              <input
                name="href"
                value={formData.href || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-white">Arrays de Datos</h2>
            
            {/* Tags */}
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Tecnologías (Tags)</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => handleAddTag(e, "tags")}
                  placeholder="Escribe y presiona Enter"
                  className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button type="button" onClick={(e) => handleAddTag(e, "tags")} className="rounded-xl bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/20">Agregar</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags?.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-sm text-brand font-medium">
                    {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag("tags", i)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div className="pt-4">
              <label className="mb-1 block text-sm font-medium text-paper/70">Módulos (opcional)</label>
              <div className="flex gap-2">
                <input
                  value={moduleInput}
                  onChange={(e) => setModuleInput(e.target.value)}
                  onKeyDown={(e) => handleAddTag(e, "modules")}
                  className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button type="button" onClick={(e) => handleAddTag(e, "modules")} className="rounded-xl bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/20">Agregar</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.modules?.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                    {tag} <X className="h-3 w-3 cursor-pointer text-paper/50 hover:text-white" onClick={() => handleRemoveTag("modules", i)} />
                  </span>
                ))}
              </div>
            </div>

            {/* By */}
            <div className="pt-4">
              <label className="mb-1 block text-sm font-medium text-paper/70">Hecho por (Equipo)</label>
              <div className="flex gap-2">
                <input
                  value={byInput}
                  onChange={(e) => setByInput(e.target.value)}
                  onKeyDown={(e) => handleAddTag(e, "by")}
                  className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button type="button" onClick={(e) => handleAddTag(e, "by")} className="rounded-xl bg-white/10 px-4 py-2 font-bold text-white hover:bg-white/20">Agregar</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.by?.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                    {tag} <X className="h-3 w-3 cursor-pointer text-paper/50 hover:text-white" onClick={() => handleRemoveTag("by", i)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-white">Conversación del Chatbot</h2>
              <button type="button" onClick={addChatMessage} className="flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-dark">
                <Plus className="h-4 w-4" /> Mensaje
              </button>
            </div>
            {formData.chat && formData.chat.length > 0 ? (
              <div className="space-y-3">
                {formData.chat.map((msg, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                    <select
                      value={msg.from}
                      onChange={(e) => updateChatMessage(i, "from", e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm text-white"
                    >
                      <option value="bot">Bot</option>
                      <option value="user">User</option>
                    </select>
                    <input
                      value={msg.text}
                      onChange={(e) => updateChatMessage(i, "text", e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-1 text-sm text-white focus:border-brand focus:outline-none"
                    />
                    <button type="button" onClick={() => removeChatMessage(i)} className="text-red-400 hover:text-red-300 p-1 rounded-lg">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-paper/50 italic">No hay mensajes configurados.</p>
            )}
          </div>
        </div>

        {/* Columna Derecha: Media y Apariencia */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-white">Apariencia</h2>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Clases de gradiente (Accent)</label>
              <input
                required
                name="accent"
                value={formData.accent}
                onChange={handleChange}
                placeholder="from-brand to-brand-dark"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <div className={`mt-3 h-12 w-full rounded-xl bg-gradient-to-br ${formData.accent}`} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-white">Imagen / Portada</h2>
            
            <div className="space-y-4">
              {formData.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.image} alt="Preview" className="w-full rounded-xl border border-white/10 object-cover" />
              )}
              
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 py-4 font-bold text-paper/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Upload className="h-5 w-5" />
                Subir Imagen
              </button>
              
              <div className="flex items-center gap-2">
                <input
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  placeholder="O pega una URL..."
                  className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
