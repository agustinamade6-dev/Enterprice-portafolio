"use client";

import { useEffect, useState } from "react";
import { Faq } from "@/lib/content/schemas";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/content/faqs")
      .then((res) => res.json())
      .then((d) => {
        setFaqs(d);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/content/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqs),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Preguntas frecuentes actualizadas." });
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

  const addFaq = () => {
    setFaqs([{ q: "Nueva Pregunta", a: "Respuesta..." }, ...faqs]);
  };

  const updateFaq = (index: number, field: keyof Faq, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const removeFaq = (index: number) => {
    if (!confirm("¿Eliminar esta pregunta?")) return;
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
  };

  const moveFaq = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= faqs.length) return;
    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[index + direction];
    newFaqs[index + direction] = temp;
    setFaqs(newFaqs);
  };

  if (loading) return <div className="p-8 text-center text-ink/50">Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Preguntas Frecuentes</h1>
          <p className="text-sm text-paper/60">Edita las respuestas rápidas para tus clientes.</p>
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

      <div className="flex justify-end">
        <button type="button" onClick={addFaq} className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20">
          <Plus className="h-4 w-4" /> Nueva Pregunta
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-sm">
            {/* Reorder Controls */}
            <div className="flex flex-col items-center justify-center gap-1 border-r border-white/10 pr-4 text-paper/40">
              <button type="button" onClick={() => moveFaq(i, -1)} disabled={i === 0} className="hover:text-brand disabled:opacity-30">
                <ArrowUp className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => moveFaq(i, 1)} disabled={i === faqs.length - 1} className="hover:text-brand disabled:opacity-30">
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="mb-1 text-xs font-bold uppercase tracking-wider text-brand">Pregunta</label>
                <input required value={faq.q} onChange={(e) => updateFaq(i, "q", e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-bold text-white focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 text-xs font-bold uppercase tracking-wider text-brand">Respuesta</label>
                <textarea required value={faq.a} onChange={(e) => updateFaq(i, "a", e.target.value)} rows={3} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-start pl-2">
              <button type="button" onClick={() => removeFaq(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-paper/50">
            No hay preguntas frecuentes. Añade una para empezar.
          </div>
        )}
      </div>
    </form>
  );
}
