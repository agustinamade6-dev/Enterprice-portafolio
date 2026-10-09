"use client";

import { useEffect, useState } from "react";
import { BudgetType } from "@/lib/content/schemas";
import { Save, Plus, X, Trash2 } from "lucide-react";

type ServicesData = {
  types: BudgetType[];
  extras: string[];
  sectors: string[];
  times: string[];
};

export default function ServicesPage() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Inputs para los arreglos simples
  const [extraInput, setExtraInput] = useState("");
  const [sectorInput, setSectorInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  useEffect(() => {
    fetch("/api/content/services")
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
      const res = await fetch("/api/content/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Servicios guardados." });
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

  // Funciones para arreglos simples
  const addSimpleItem = (e: React.KeyboardEvent | React.MouseEvent, type: "extras" | "sectors" | "times", inputVal: string, setInput: (v: string) => void) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") return;
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (trimmed && data && !data[type].includes(trimmed)) {
      setData({ ...data, [type]: [...data[type], trimmed] });
      setInput("");
    }
  };

  const removeSimpleItem = (type: "extras" | "sectors" | "times", index: number) => {
    if (!data) return;
    const arr = [...data[type]];
    arr.splice(index, 1);
    setData({ ...data, [type]: arr });
  };

  // Funciones para BudgetTypes
  const addType = () => {
    if (!data) return;
    setData({
      ...data,
      types: [...data.types, { id: `tipo-${Date.now()}`, name: "Nuevo Tipo", forWho: "", options: [] }]
    });
  };

  const updateType = (index: number, field: string, value: string) => {
    if (!data) return;
    const types = [...data.types];
    types[index] = { ...types[index], [field]: value } as any;
    setData({ ...data, types });
  };

  const removeType = (index: number) => {
    if (!data) return;
    const types = [...data.types];
    types.splice(index, 1);
    setData({ ...data, types });
  };

  const addTypeOption = (typeIndex: number, option: string) => {
    if (!data || !option.trim()) return;
    const types = [...data.types];
    if (!types[typeIndex].options.includes(option.trim())) {
      types[typeIndex].options.push(option.trim());
      setData({ ...data, types });
    }
  };

  const removeTypeOption = (typeIndex: number, optionIndex: number) => {
    if (!data) return;
    const types = [...data.types];
    types[typeIndex].options.splice(optionIndex, 1);
    setData({ ...data, types });
  };

  if (loading || !data) return <div className="p-8 text-center text-ink/50">Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Servicios y Presupuesto</h1>
          <p className="text-sm text-paper/60">Configura el cotizador interactivo.</p>
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

      {/* Tipos de Presupuesto */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-white">Tipos de Proyectos Base</h2>
          <button type="button" onClick={addType} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/20">
            <Plus className="h-4 w-4" /> Añadir Tipo
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {data.types.map((type, tIndex) => (
            <div key={tIndex} className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm">
              <button type="button" onClick={() => removeType(tIndex)} className="absolute right-4 top-4 text-red-400 hover:text-red-300">
                <Trash2 className="h-5 w-5" />
              </button>
              
              <div className="grid gap-4 pr-8">
                <div>
                  <label className="mb-1 block text-sm font-medium text-paper/70">ID (interno)</label>
                  <input required value={type.id} onChange={(e) => updateType(tIndex, "id", e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-paper/70">Nombre del Servicio</label>
                  <input required value={type.name} onChange={(e) => updateType(tIndex, "name", e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-paper/70">Para quién es (Descripción)</label>
                  <input required value={type.forWho} onChange={(e) => updateType(tIndex, "forWho", e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none" />
                </div>
                
                <div className="pt-2 border-t border-white/10 mt-2">
                  <label className="mb-2 block text-sm font-bold text-paper/80">Opciones Seleccionables</label>
                  <div className="space-y-2">
                    {type.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-sm text-white border border-white/10">
                        <span>{opt}</span>
                        <button type="button" onClick={() => removeTypeOption(tIndex, oIndex)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        id={`opt-input-${tIndex}`}
                        placeholder="Nueva opción..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTypeOption(tIndex, e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                      />
                      <button type="button" onClick={() => {
                        const input = document.getElementById(`opt-input-${tIndex}`) as HTMLInputElement;
                        addTypeOption(tIndex, input.value);
                        input.value = "";
                      }} className="rounded-lg bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">Agregar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Arreglos Simples (Extras, Sectores, Tiempos) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Extras */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-brand">Servicios Extra</h2>
          <div className="space-y-2 mb-4">
            {data.extras.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white">
                {item} <button type="button" onClick={() => removeSimpleItem("extras", i)}><X className="h-4 w-4 text-red-400 hover:text-red-300" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={extraInput} onChange={e => setExtraInput(e.target.value)} onKeyDown={(e) => addSimpleItem(e, "extras", extraInput, setExtraInput)} className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-1 text-sm text-white focus:border-brand focus:outline-none" placeholder="Agregar..." />
            <button type="button" onClick={(e) => addSimpleItem(e, "extras", extraInput, setExtraInput)} className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white font-medium hover:bg-white/20">Add</button>
          </div>
        </div>

        {/* Sectores */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-brand">Sectores (Rubro)</h2>
          <div className="space-y-2 mb-4">
            {data.sectors.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white">
                {item} <button type="button" onClick={() => removeSimpleItem("sectors", i)}><X className="h-4 w-4 text-red-400 hover:text-red-300" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={sectorInput} onChange={e => setSectorInput(e.target.value)} onKeyDown={(e) => addSimpleItem(e, "sectors", sectorInput, setSectorInput)} className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-1 text-sm text-white focus:border-brand focus:outline-none" placeholder="Agregar..." />
            <button type="button" onClick={(e) => addSimpleItem(e, "sectors", sectorInput, setSectorInput)} className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white font-medium hover:bg-white/20">Add</button>
          </div>
        </div>

        {/* Tiempos */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-brand">Plazos / Urgencia</h2>
          <div className="space-y-2 mb-4">
            {data.times.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-sm text-white">
                {item} <button type="button" onClick={() => removeSimpleItem("times", i)}><X className="h-4 w-4 text-red-400 hover:text-red-300" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={timeInput} onChange={e => setTimeInput(e.target.value)} onKeyDown={(e) => addSimpleItem(e, "times", timeInput, setTimeInput)} className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-1 text-sm text-white focus:border-brand focus:outline-none" placeholder="Agregar..." />
            <button type="button" onClick={(e) => addSimpleItem(e, "times", timeInput, setTimeInput)} className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white font-medium hover:bg-white/20">Add</button>
          </div>
        </div>
      </div>
    </form>
  );
}
