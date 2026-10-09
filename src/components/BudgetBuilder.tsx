"use client";

import { useState } from "react";
import { budgetExtras, budgetSectors, budgetTimes, budgetTypes, whatsappLink } from "@/content/site";
import { CheckIcon, WhatsAppIcon } from "./icons";

// El cliente arma su pedido y nos lo envía por WhatsApp; el precio lo pasamos a medida.
export function BudgetBuilder() {
  const [types, setTypes] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [sector, setSector] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const chosen = budgetTypes.filter((t) => types.includes(t.id));
  const picked = (t: (typeof budgetTypes)[number]) => t.options.filter((o) => options.includes(o));
  const extras = budgetExtras.filter((e) => options.includes(e));
  const ready = chosen.length > 0;

  function message() {
    const lines = [`Hola, soy ${name.trim() || "[tu nombre]"} y quiero un presupuesto.`, ""];
    for (const t of chosen) {
      const p = picked(t);
      lines.push(`• ${t.name}${p.length ? `: ${p.join(", ")}` : ""}`);
    }
    if (extras.length) lines.push(`• Extras: ${extras.join(", ")}`);
    if (sector) lines.push(`Rubro: ${sector}`);
    if (time) lines.push(`Para cuándo: ${time}`);
    if (notes.trim()) lines.push("", notes.trim());
    return lines.join("\n");
  }

  const chip = (on: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
      on ? "border-ink bg-ink text-paper" : "border-black/10 bg-white hover:border-ink/40"
    }`;
  const stepTitle = "text-lg font-extrabold";
  const stepNum = "mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-sm font-extrabold text-brand";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-10">
        <fieldset>
          <legend className={stepTitle}>
            <span className={stepNum}>1</span>¿Qué necesitas? <span className="font-medium text-ink/50">Puedes elegir más de uno</span>
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {budgetTypes.map((t) => {
              const on = types.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(types, setTypes, t.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    on ? "border-ink bg-ink text-paper" : "border-black/10 bg-white hover:border-ink/40"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${on ? "border-brand bg-brand" : "border-black/20"}`}
                  >
                    {on && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                  </span>
                  <span>
                    <span className="block font-bold">{t.name}</span>
                    <span className={`block text-sm ${on ? "text-paper/70" : "text-ink/60"}`}>{t.forWho}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {ready && (
          <fieldset>
            <legend className={stepTitle}>
              <span className={stepNum}>2</span>¿Qué tiene que incluir?
            </legend>
            <div className="mt-4 space-y-5">
              {chosen.map((t) => (
                <div key={t.id}>
                  <p className="mb-2 text-sm font-semibold text-ink/60">{t.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.options.map((o) => (
                      <button key={o} type="button" aria-pressed={options.includes(o)} onClick={() => toggle(options, setOptions, o)} className={chip(options.includes(o))}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <p className="mb-2 text-sm font-semibold text-ink/60">Extras</p>
                <div className="flex flex-wrap gap-2">
                  {budgetExtras.map((o) => (
                    <button key={o} type="button" aria-pressed={options.includes(o)} onClick={() => toggle(options, setOptions, o)} className={chip(options.includes(o))}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {ready && (
          <fieldset className="grid gap-8 sm:grid-cols-2">
            <legend className={`${stepTitle} mb-4 sm:col-span-2`}>
              <span className={stepNum}>3</span>Cuéntanos un poco más
            </legend>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink/60">Rubro</p>
              <div className="flex flex-wrap gap-2">
                {budgetSectors.map((o) => (
                  <button key={o} type="button" aria-pressed={sector === o} onClick={() => setSector(sector === o ? "" : o)} className={chip(sector === o)}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink/60">¿Para cuándo lo necesitas?</p>
              <div className="flex flex-wrap gap-2">
                {budgetTimes.map((o) => (
                  <button key={o} type="button" aria-pressed={time === o} onClick={() => setTime(time === o ? "" : o)} className={chip(time === o)}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink/60">Tu nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ana"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-ink/60">¿Algo más que debamos saber? (opcional)</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Por ejemplo: tengo una panadería con dos sucursales y quiero controlar el stock de ambas."
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
              />
            </label>
          </fieldset>
        )}
      </div>

      <aside className="rounded-3xl bg-ink p-6 text-paper lg:sticky lg:top-24">
        <h3 className="text-xl font-extrabold">Tu presupuesto</h3>
        {ready ? (
          <ul className="mt-4 space-y-3 text-sm">
            {chosen.map((t) => (
              <li key={t.id}>
                <span className="font-bold">{t.name}</span>
                {picked(t).length > 0 && <span className="block text-paper/70">{picked(t).join(", ")}</span>}
              </li>
            ))}
            {extras.length > 0 && (
              <li>
                <span className="font-bold">Extras</span>
                <span className="block text-paper/70">{extras.join(", ")}</span>
              </li>
            )}
            {(sector || time) && <li className="text-paper/70">{[sector, time].filter(Boolean).join(" · ")}</li>}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-paper/70">Elige lo que necesitas y acá vas a ver el resumen de tu pedido.</p>
        )}
        <p className="mt-6 border-t border-white/10 pt-4 text-sm text-paper/70">
          No trabajamos con precios fijos: con lo que elijas te pasamos un presupuesto a medida, por escrito y sin compromiso.
        </p>
        <a
          href={ready ? whatsappLink(message()) : undefined}
          aria-disabled={!ready}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition ${
            ready ? "bg-[#25d366] text-white hover:brightness-95" : "pointer-events-none bg-white/10 text-paper/40"
          }`}
        >
          <WhatsAppIcon className="h-5 w-5" /> Pedir mi presupuesto
        </a>
      </aside>
    </div>
  );
}
