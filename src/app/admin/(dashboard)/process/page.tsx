"use client";

import { useEffect, useState } from "react";
import { ProcessStep } from "@/lib/content/schemas";
import { Save, Plus, X, Trash2 } from "lucide-react";

type ProcessData = {
  steps: ProcessStep[];
  sprintLoop: string[];
};

export default function ProcessPage() {
  const [data, setData] = useState<ProcessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [sprintInput, setSprintInput] = useState("");

  useEffect(() => {
    fetch("/api/content/process")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/content/process", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Proceso guardado correctamente." });
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

  // Steps handling
  const addStep = () => {
    if (!data) return;
    setData({
      ...data,
      steps: [...data.steps, { title: "Nuevo Paso", text: "", details: [] }]
    });
  };

  const updateStep = (index: number, field: keyof ProcessStep, value: string) => {
    if (!data) return;
    const steps = [...data.steps];
    steps[index] = { ...steps[index], [field]: value } as any;
    setData({ ...data, steps });
  };

  const removeStep = (index: number) => {
    if (!data) return;
    const steps = [...data.steps];
    steps.splice(index, 1);
    setData({ ...data, steps });
  };

  const addDetailToStep = (stepIndex: number, detail: string) => {
    if (!data || !detail.trim()) return;
    const steps = [...data.steps];
    steps[stepIndex].details.push(detail.trim());
    setData({ ...data, steps });
  };

  const removeDetailFromStep = (stepIndex: number, detailIndex: number) => {
    if (!data) return;
    const steps = [...data.steps];
    steps[stepIndex].details.splice(detailIndex, 1);
    setData({ ...data, steps });
  };

  // Sprint Loop handling
  const addSprintLoopItem = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    e.preventDefault();
    const trimmed = sprintInput.trim();
    if (trimmed && data) {
      setData({ ...data, sprintLoop: [...data.sprintLoop, trimmed] });
      setSprintInput("");
    }
  };

  const removeSprintLoopItem = (index: number) => {
    if (!data) return;
    const sprintLoop = [...data.sprintLoop];
    sprintLoop.splice(index, 1);
    setData({ ...data, sprintLoop });
  };

  if (loading || !data) return <div className="p-8 text-center text-ink/50">Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Proceso de Trabajo</h1>
          <p className="text-sm text-paper/60">Fases del ciclo de desarrollo.</p>
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Pasos principales */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-white">Etapas del Proyecto</h2>
            <button type="button" onClick={addStep} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/20">
              <Plus className="h-4 w-4" /> Añadir Etapa
            </button>
          </div>

          <div className="space-y-6">
            {data.steps.map((step, sIndex) => (
              <div key={sIndex} className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm">
                <button type="button" onClick={() => removeStep(sIndex)} className="absolute right-4 top-4 text-red-400 hover:text-red-300">
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="absolute left-6 top-6 grid h-8 w-8 place-items-center rounded-full bg-brand/10 font-bold text-brand border border-brand/20">
                  {sIndex + 1}
                </div>
                
                <div className="pl-12 grid gap-4 pr-8">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-paper/70">Título de la Etapa</label>
                    <input required value={step.title} onChange={(e) => updateStep(sIndex, "title", e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-bold text-white focus:border-brand focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-paper/70">Descripción General</label>
                    <textarea required value={step.text} onChange={(e) => updateStep(sIndex, "text", e.target.value)} rows={2} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none" />
                  </div>
                  
                  <div className="pt-2">
                    <label className="mb-2 block text-sm font-bold text-paper/80">Detalles / Entregables</label>
                    <div className="space-y-2">
                      {step.details.map((detail, dIndex) => (
                        <div key={dIndex} className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-sm text-white border border-white/10">
                          <span className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand" /> {detail}
                          </span>
                          <button type="button" onClick={() => removeDetailFromStep(sIndex, dIndex)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          id={`detail-input-${sIndex}`}
                          placeholder="Nuevo detalle..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addDetailToStep(sIndex, e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                        />
                        <button type="button" onClick={() => {
                          const input = document.getElementById(`detail-input-${sIndex}`) as HTMLInputElement;
                          addDetailToStep(sIndex, input.value);
                          input.value = "";
                        }} className="rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sprint Loop */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white shadow-sm">
            <h2 className="font-bold text-lg mb-2 text-brand">Ciclo de Sprints</h2>
            <p className="text-sm text-paper/70 mb-6">Se muestra destacado en el tercer paso del proceso (etapa iterativa).</p>
            
            <div className="space-y-3 mb-6">
              {data.sprintLoop.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-5 w-5 place-items-center rounded-full border border-white/20 text-xs font-bold">{i + 1}</span>
                    {item}
                  </div>
                  <button type="button" onClick={() => removeSprintLoopItem(i)}><X className="h-4 w-4 text-red-400 hover:text-red-300" /></button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input 
                value={sprintInput} 
                onChange={e => setSprintInput(e.target.value)} 
                onKeyDown={addSprintLoopItem} 
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-brand focus:outline-none" 
                placeholder="Nueva iteración..." 
              />
              <button type="button" onClick={addSprintLoopItem} className="rounded-lg bg-brand px-3 py-2 text-sm text-white font-bold hover:bg-brand-dark">Añadir</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
