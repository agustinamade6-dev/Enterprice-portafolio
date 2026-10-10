"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#proceso", label: "Cómo trabajamos" },
  { href: "/#nosotros", label: "Nosotros" },
];

export function Header({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* En compu el logo va pegado al borde izquierdo de la pantalla; el menú sigue alineado con el contenido */}
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-90 md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2"
          aria-label={siteName}
        >
          <Image
            src="/logo.png"
            alt={siteName}
            width={130}
            height={36}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:ml-auto md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink/70 transition hover:text-ink">
              {l.label}
            </Link>
          ))}
          <Link
            href="/#servicios"
            className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-brand"
          >
            Pedir presupuesto
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-ink transition ${open ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-ink transition ${open ? "top-1.5 -rotate-45" : "top-3"}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-paper px-4 py-4 md:hidden">
          {[...links, { href: "/#servicios", label: "Pedir presupuesto" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 font-medium hover:bg-black/5"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
