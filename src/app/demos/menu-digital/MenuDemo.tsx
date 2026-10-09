"use client";

import { useState } from "react";

// Local y platos de ejemplo: no es un cliente real.
const categories = [
  {
    name: "Entradas",
    items: [
      { id: "empanadas", name: "Empanadas de carne (x3)", desc: "Cortadas a cuchillo, al horno.", price: 4500, emoji: "🥟" },
      { id: "provoleta", name: "Provoleta", desc: "Con orégano y aceite de oliva.", price: 6800, emoji: "🧀" },
    ],
  },
  {
    name: "Principales",
    items: [
      { id: "milanesa", name: "Milanesa napolitana", desc: "Con papas fritas.", price: 12500, emoji: "🍽️" },
      { id: "ravioles", name: "Ravioles caseros", desc: "Con salsa bolognesa o fileto.", price: 10900, emoji: "🍝" },
      { id: "hamburguesa", name: "Hamburguesa completa", desc: "Doble carne, cheddar y panceta.", price: 11800, emoji: "🍔" },
    ],
  },
  {
    name: "Bebidas",
    items: [
      { id: "gaseosa", name: "Gaseosa 500 ml", desc: "Línea Coca-Cola.", price: 2800, emoji: "🥤" },
      { id: "limonada", name: "Limonada con menta", desc: "Jarra de 1 litro.", price: 5200, emoji: "🍋" },
    ],
  },
  {
    name: "Postres",
    items: [{ id: "flan", name: "Flan casero", desc: "Con dulce de leche o crema.", price: 4200, emoji: "🍮" }],
  },
];

const allItems = categories.flatMap((c) => c.items);
const money = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function MenuDemo() {
  const [active, setActive] = useState(categories[0].name);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [sent, setSent] = useState(false);

  const change = (id: string, delta: number) => {
    setSent(false);
    setCart((c) => {
      const qty = Math.max(0, (c[id] ?? 0) + delta);
      const next = { ...c, [id]: qty };
      if (qty === 0) delete next[id];
      return next;
    });
  };

  const lines = allItems.filter((i) => cart[i.id]);
  const count = lines.reduce((n, i) => n + cart[i.id], 0);
  const total = lines.reduce((n, i) => n + cart[i.id] * i.price, 0);
  const shown = categories.find((c) => c.name === active)!;

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-ink bg-white shadow-2xl shadow-black/20">
        <div className="bg-gradient-to-br from-rose-500 to-red-600 px-5 pb-5 pt-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Mesa 4</p>
          <p className="text-2xl font-extrabold">Bodegón La Esquina</p>
          <p className="text-sm text-white/80">Local de ejemplo para la demo</p>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-black/5 px-4 py-3" role="tablist">
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              role="tab"
              aria-selected={active === c.name}
              onClick={() => setActive(c.name)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition ${active === c.name ? "bg-ink text-white" : "bg-black/5 text-ink/70 hover:bg-black/10"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <ul className="h-80 space-y-3 overflow-y-auto p-4">
          {shown.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 rounded-2xl border border-black/5 p-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rose-50 text-2xl" aria-hidden="true">
                {i.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight">{i.name}</p>
                <p className="text-xs text-ink/60">{i.desc}</p>
                <p className="mt-0.5 text-sm font-bold text-red-600">{money(i.price)}</p>
              </div>
              {cart[i.id] ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => change(i.id, -1)}
                    aria-label={`Quitar un ${i.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full bg-black/5 font-bold"
                  >
                    −
                  </button>
                  <span className="w-4 text-center font-bold">{cart[i.id]}</span>
                  <button
                    type="button"
                    onClick={() => change(i.id, 1)}
                    aria-label={`Agregar otro ${i.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full bg-ink font-bold text-white"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => change(i.id, 1)}
                  className="rounded-full bg-ink px-3 py-1.5 text-sm font-bold text-white"
                >
                  Agregar
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="border-t border-black/5 p-4">
          <button
            type="button"
            disabled={count === 0}
            onClick={() => setSent(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-[#25d366] px-4 py-3.5 font-bold text-white transition disabled:bg-neutral-300"
          >
            <span>{count === 0 ? "Elige algo del menú" : `Enviar pedido (${count})`}</span>
            <span>{money(total)}</span>
          </button>
        </div>
      </div>

      {sent && (
        <div className="mt-6 rounded-2xl bg-[#e7ffdb] p-4 text-sm shadow-lg shadow-black/5" aria-live="polite">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-800">Así le llega al local por WhatsApp</p>
          <div className="whitespace-pre-line rounded-xl bg-white p-3 font-mono text-[13px] leading-relaxed text-ink">
            {`🧾 Pedido · Mesa 4\n${lines.map((i) => `${cart[i.id]} x ${i.name}: ${money(cart[i.id] * i.price)}`).join("\n")}\nTotal: ${money(total)}`}
          </div>
          <p className="mt-2 text-xs text-ink/60">En la demo no se envía nada: es solo para que veas cómo funciona.</p>
        </div>
      )}
    </div>
  );
}
