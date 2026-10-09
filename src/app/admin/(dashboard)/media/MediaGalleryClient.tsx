"use client";

import { useState } from "react";

export function MediaGalleryClient({ images }: { images: string[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center text-paper/50">
        No hay imágenes subidas todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((url) => (
        <div key={url} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="aspect-square w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={url} className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-50" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => handleCopy(url)}
              className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-brand-dark"
            >
              {copied === url ? "¡Copiado!" : "Copiar URL"}
            </button>
          </div>
          <div className="absolute bottom-0 w-full truncate bg-black/60 px-3 py-2 text-xs text-paper/70">
            {url.split("/").pop()}
          </div>
        </div>
      ))}
    </div>
  );
}
