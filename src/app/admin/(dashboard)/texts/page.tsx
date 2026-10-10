"use client";

import { useEffect, useState } from "react";
import { PageTexts } from "@/lib/content/schemas";
import { Save, Plus, Trash2 } from "lucide-react";

// Qué campos tiene cada apartado y cómo se llaman en español. "long" usa un cuadro de texto grande.
type Field = { key: string; label: string; long?: boolean };
const HEAD: Field[] = [
  { key: "eyebrow", label: "Etiqueta chica (arriba del título)" },
  { key: "title", label: "Título" },
  { key: "text", label: "Texto debajo del título", long: true },
];
const SECTIONS: { key: Exclude<keyof PageTexts, "bit">; title: string; fields: Field[] }[] = [
  {
    key: "hero",
    title: "Inicio (lo primero que se ve)",
    fields: [
      { key: "badge", label: "Cartelito verde" },
      { key: "titleStart", label: "Título: comienzo" },
      { key: "titleHighlight", label: "Título: parte en naranja" },
      { key: "titleEnd", label: "Título: final" },
      { key: "subtitleExtra", label: "Frase después del slogan", long: true },
      { key: "buttonProjects", label: "Botón 1 (proyectos)" },
      { key: "buttonWhatsapp", label: "Botón 2 (WhatsApp)" },
      { key: "whatsappMessage", label: "Mensaje que se escribe solo en WhatsApp" },
      { key: "cardLabel", label: "Tarjeta flotante: etiqueta" },
      { key: "cardTitle", label: "Tarjeta flotante: texto" },
    ],
  },
  { key: "projects", title: "Proyectos", fields: HEAD },
  { key: "services", title: "Servicios / presupuesto", fields: [...HEAD, { key: "note", label: "Nota al pie (mantenimiento)", long: true }] },
  {
    key: "process",
    title: "Cómo trabajamos",
    fields: [...HEAD, { key: "sprintTitle", label: "Título del recuadro de sprints" }, { key: "sprintRepeat", label: "Frase final del recuadro" }],
  },
  { key: "team", title: "Nosotros", fields: HEAD },
  { key: "faqs", title: "Preguntas frecuentes", fields: HEAD },
  {
    key: "contact",
    title: "Contacto",
    fields: [...HEAD, { key: "whatsappLabel", label: "Texto del enlace de WhatsApp" }, { key: "whatsappMessage", label: "Mensaje que se escribe solo en WhatsApp" }],
  },
  { key: "footer", title: "Pie de página", fields: [{ key: "note", label: "Frase después del ©" }] },
  { key: "seo", title: "Google y redes (SEO)", fields: [{ key: "titleSuffix", label: "Título de la pestaña, después del nombre" }] },
];
const BIT_SECTIONS: { key: Exclude<keyof PageTexts["bit"], "click">; label: string }[] = [
  { key: "hero", label: "Inicio" },
  { key: "projects", label: "Proyectos" },
  { key: "services", label: "Servicios" },
  { key: "process", label: "Cómo trabajamos" },
  { key: "team", label: "Nosotros" },
  { key: "faqs", label: "Preguntas" },
  { key: "contact", label: "Contacto" },
];
const POSES = ["saludando", "principal", "programando", "pensando", "festejando"] as const;

const input = "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const card = "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm space-y-4 backdrop-blur-xl";

export default function TextsPage() {
  const [data, setData] = useState<PageTexts | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/content/texts")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const setField = (section: string, key: string, value: string) =>
    setData((prev) => (prev ? { ...prev, [section]: { ...(prev as Record<string, object>)[section], [key]: value } } : prev));
  const setBit = (key: string, field: "pose" | "text", value: string) =>
    setData((prev) => (prev ? { ...prev, bit: { ...prev.bit, [key]: { ...prev.bit[key as keyof PageTexts["bit"]], [field]: value } } } : prev));
  const setClicks = (click: string[]) => setData((prev) => (prev ? { ...prev, bit: { ...prev.bit, click } } : prev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/content/texts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      setMessage(
        res.ok
          ? { type: "success", text: "Textos guardados. Recarga la página para verlos." }
          : { type: "error", text: result.details?.join(" · ") || result.error || "Error al guardar." }
      );
    } catch {
      setMessage({ type: "error", text: "Error de conexión." });
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="p-8 text-center text-paper/50">Cargando...</div>;
  const values = data as unknown as Record<string, Record<string, string>>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-4 bg-neutral-950/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Textos de la página</h1>
          <p className="text-sm text-paper/60">
            Títulos, botones y frases de Bit. Escribe <code className="text-brand">{"{nombre}"}</code> para poner el nombre del sitio.
          </p>
        </div>
        <button type="submit" disabled={saving} className="flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2 font-bold text-white hover:bg-brand-dark disabled:opacity-50">
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {message && (
        <div className={`rounded-xl p-4 ${message.type === "success" ? "border border-green-500/20 bg-green-500/10 text-green-400" : "border border-red-500/20 bg-red-500/10 text-red-400"}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {SECTIONS.map((section) => (
          <div key={section.key} className={card}>
            <h2 className="text-lg font-bold text-brand">{section.title}</h2>
            {section.fields.map((f) => {
              const value = values[section.key]?.[f.key] ?? "";
              return (
                <div key={f.key}>
                  <label className="mb-1 block text-sm font-medium text-paper/70">{f.label}</label>
                  {f.long ? (
                    <textarea rows={value.length > 200 ? 6 : 3} value={value} onChange={(e) => setField(section.key, f.key, e.target.value)} className={input} />
                  ) : (
                    <input value={value} onChange={(e) => setField(section.key, f.key, e.target.value)} className={input} />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div className={card}>
          <h2 className="text-lg font-bold text-brand">Bit en cada apartado</h2>
          <p className="text-sm text-paper/60">La pose y la frase que muestra Bit cuando llegas a cada parte de la página.</p>
          {BIT_SECTIONS.map((b) => (
            <div key={b.key} className="grid gap-2 sm:grid-cols-[8rem_9rem_1fr] sm:items-center">
              <span className="text-sm font-medium text-paper/70">{b.label}</span>
              <select value={data.bit[b.key].pose} onChange={(e) => setBit(b.key, "pose", e.target.value)} className={input}>
                {POSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input value={data.bit[b.key].text} onChange={(e) => setBit(b.key, "text", e.target.value)} className={input} />
            </div>
          ))}
        </div>

        <div className={card}>
          <h2 className="text-lg font-bold text-brand">Frases de Bit al tocarlo</h2>
          <p className="text-sm text-paper/60">Cada vez que alguien hace clic en Bit, dice la siguiente de la lista.</p>
          {data.bit.click.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input value={c} onChange={(e) => setClicks(data.bit.click.map((x, j) => (j === i ? e.target.value : x)))} className={input} />
              <button
                type="button"
                disabled={data.bit.click.length === 1}
                onClick={() => setClicks(data.bit.click.filter((_, j) => j !== i))}
                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                aria-label="Quitar frase"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setClicks([...data.bit.click, "Nueva frase"])} className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20">
            <Plus className="h-4 w-4" /> Agregar frase
          </button>
        </div>
      </div>
    </form>
  );
}
