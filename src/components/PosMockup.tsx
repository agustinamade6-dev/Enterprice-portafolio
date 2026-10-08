// Ilustración de la pantalla del punto de venta de AKROS Café.
// Reemplazar por capturas reales en /public/akros cuando estén disponibles.

const items = [
  { name: "Café con leche", price: "3.200", qty: 2 },
  { name: "Medialuna", price: "1.100", qty: 3 },
  { name: "Tostado J&Q", price: "5.400", qty: 1 },
];

const products = ["Espresso", "Latte", "Cappuccino", "Medialuna", "Tostado", "Jugo", "Brownie", "Té"];

export function PosMockup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl shadow-black/15 ${className}`}
      role="img"
      aria-label="Pantalla del sistema de punto de venta de AKROS Café"
    >
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-neutral-100 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[10px] font-semibold text-neutral-500">AKROS Café · Caja 1</span>
      </div>
      <div className="grid grid-cols-5 gap-3 p-3 text-[10px] sm:text-xs">
        <div className="col-span-3">
          <div className="mb-2 flex gap-1.5">
            {["Cafés", "Panadería", "Salado"].map((c, i) => (
              <span
                key={c}
                className={`rounded-full px-2 py-1 font-semibold ${i === 0 ? "bg-amber-600 text-white" : "bg-neutral-100 text-neutral-600"}`}
              >
                {c}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {products.map((p) => (
              <div key={p} className="truncate rounded-lg bg-amber-50 px-1 py-2 text-center text-[8px] font-medium text-amber-900 sm:text-[11px]">
                <div className="mx-auto mb-1 h-5 w-5 rounded-full bg-amber-200" />
                {p}
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 flex flex-col rounded-lg bg-neutral-50 p-2">
          <div className="mb-1 font-bold">Mesa 4</div>
          {items.map((it) => (
            <div key={it.name} className="flex justify-between border-b border-black/5 py-1">
              <span>
                {it.qty}× {it.name}
              </span>
              <span className="font-semibold">${it.price}</span>
            </div>
            ))}
          <div className="mt-auto flex justify-between pt-2 font-extrabold">
            <span>Total</span>
            <span>$15.100</span>
          </div>
          <div className="mt-2 rounded-md bg-ink py-1.5 text-center font-bold text-white">Cobrar</div>
        </div>
      </div>
    </div>
  );
}
