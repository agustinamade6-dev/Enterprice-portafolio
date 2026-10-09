"use client";

import { useState } from "react";

// Helper internal
function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// Sin servidor: arma el mensaje y abre WhatsApp con el texto listo para enviar.
export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [need, setNeed] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = `Hola, soy ${name}${business ? ` de ${business}` : ""}. ${need}`;
    window.open(makeWhatsappLink(whatsapp, message), "_blank", "noopener,noreferrer");
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/40 outline-none transition focus:border-brand";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-paper/70">Tu nombre</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Ana" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-paper/70">Tu negocio</span>
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className={field}
            placeholder="Panadería La Esquina"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-paper/70">¿Qué necesitas?</span>
        <textarea
          required
          rows={4}
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          className={field}
          placeholder="Quiero una página con el menú y pedidos por WhatsApp."
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark sm:w-auto"
      >
        Enviar por WhatsApp
      </button>
    </form>
  );
}
