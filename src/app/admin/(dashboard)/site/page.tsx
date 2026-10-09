"use client";

import { useEffect, useState } from "react";
import { SiteData } from "@/lib/content/schemas";
import { Save, Upload } from "lucide-react";

export default function SitePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/content/site")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (res.ok) {
        setData((prev) => prev ? { ...prev, photo: result.url } : null);
      }
    } catch (err) {
      alert("Error subiendo imagen");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/content/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Datos guardados correctamente." });
      } else {
        setMessage({ type: "error", text: "Error al guardar." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de conexión." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-ink/50">Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Datos del Sitio</h1>
          <p className="text-sm text-paper/60">Configuración global del portafolio.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-bold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {message && (
        <div className={`rounded-xl p-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-xl">
            <h2 className="font-bold text-lg text-brand">Identidad</h2>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Nombre del Sitio</label>
              <input required name="name" value={data.name} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Dueño / Representante</label>
              <input required name="owner" value={data.owner} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Slogan / Tagline (Hero)</label>
              <textarea required name="tagline" value={data.tagline} onChange={handleChange} rows={2} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Descripción (SEO / Subtítulo)</label>
              <textarea required name="description" value={data.description} onChange={handleChange} rows={3} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-xl">
            <h2 className="font-bold text-lg text-brand">Imagen Principal (OG / Perfil)</h2>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                {data.photo && <img src={data.photo} alt="Foto" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 space-y-2">
                <input type="file" id="site-photo" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <label htmlFor="site-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-paper/70 hover:bg-white/10 hover:text-white transition-colors">
                  <Upload className="h-4 w-4" /> Cambiar Imagen
                </label>
                <input name="photo" value={data.photo || ""} onChange={handleChange} placeholder="O URL de la imagen" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-sm text-white focus:border-brand focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-xl">
            <h2 className="font-bold text-lg text-brand">Contacto Directo</h2>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">WhatsApp (Formato intl. sin + ni espacios)</label>
              <input required name="whatsapp" value={data.whatsapp} onChange={handleChange} placeholder="Ej: 5493815100710" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Correo Electrónico</label>
              <input required type="email" name="email" value={data.email} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-xl">
            <h2 className="font-bold text-lg text-brand">Redes y Enlaces</h2>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">Instagram (URL completa)</label>
              <input required name="instagram" value={data.instagram} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">GitHub (URL completa)</label>
              <input required name="github" value={data.github} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-paper/70">URL de Producción (Sitio web)</label>
              <input required name="url" value={data.url} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
