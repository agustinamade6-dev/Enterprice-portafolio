import Link from "next/link";

interface HeroProjectsShowcaseProps {
  className?: string;
  cardLabel?: string;
  cardTitle?: string;
}

export function HeroProjectsShowcase({
  className = "",
  cardLabel = "Proyectos destacados",
  cardTitle = "Plataformas reales y tiendas online",
}: HeroProjectsShowcaseProps) {
  return (
    <div
      className={`relative h-[530px] w-full max-w-[580px] mx-auto select-none [perspective:1200px] ${className}`}
      aria-label="Proyectos destacados: Todo Suela, Pierina Glow, JP Edits y LV Racing"
    >
      {/* 1. Todo Suela (Fondo / Superior derecha) */}
      <div className="absolute right-0 top-0 z-10 w-[74%] max-w-[370px] animate-hero-float-1 transition-all duration-300 ease-out hover:!animate-none hover:z-50 hover:scale-[1.04] hover:!rotate-0">
        {/* Resplandor ambiental de color verde */}
        <div style={{ background: "radial-gradient(closest-side, rgb(16 185 129 / .2), transparent)" }}
          className="absolute -inset-6 -z-10 rounded-3xl transition-opacity group-hover:opacity-100" />
        <Link
          href="/proyectos/todo-suela/"
          prefetch={false}
          className="group block overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl shadow-emerald-950/15 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:shadow-emerald-500/20"
        >
          {/* Barra superior de navegador */}
          <div className="flex items-center justify-between border-b border-black/5 bg-neutral-100/90 px-3 py-1.5 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-1.5 font-mono text-[10px] text-neutral-500">todo-suela.vercel.app</span>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
              Gestión deportiva
            </span>
          </div>
          {/* Captura real */}
          <div className="relative aspect-[2.13/1] w-full overflow-hidden bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/projects/todo-suela.webp"
              alt="Plataforma Todo Suela"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      </div>

      {/* 2. Pierina Glow · Tienda online (Medio-Alto / Izquierda) */}
      <div className="absolute left-0 top-[75px] z-20 w-[72%] max-w-[360px] animate-hero-float-2 transition-all duration-300 ease-out hover:!animate-none hover:z-50 hover:scale-[1.04] hover:!rotate-0">
        {/* Resplandor ambiental rosado cálido */}
        <div style={{ background: "radial-gradient(closest-side, rgb(201 111 93 / .2), transparent)" }}
          className="absolute -inset-6 -z-10 rounded-3xl transition-opacity" />
        <Link
          href="/proyectos/pierina-glow-tienda/"
          prefetch={false}
          className="group block overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl shadow-rose-950/15 backdrop-blur-md transition-all hover:border-[#c96f5d]/50 hover:shadow-[#c96f5d]/20"
        >
          {/* Barra superior de navegador */}
          <div className="flex items-center justify-between border-b border-black/5 bg-neutral-100/90 px-3 py-1.5 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-1.5 font-mono text-[10px] text-neutral-500">bypierina.netlify.app</span>
            </div>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-[#c96f5d]">
              Tienda online
            </span>
          </div>
          {/* Captura real */}
          <div className="relative aspect-[2.13/1] w-full overflow-hidden bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/projects/pierina-glow-tienda.webp"
              alt="Tienda online Pierina Glow"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      </div>

      {/* 3. JP Edits (Medio-Bajo / Derecha) */}
      <div className="absolute right-2 top-[175px] z-30 w-[76%] max-w-[380px] animate-hero-float-4 transition-all duration-300 ease-out hover:!animate-none hover:z-50 hover:scale-[1.04] hover:!rotate-0">
        {/* Resplandor ambiental azul / índigo característico de JP Edits */}
        <div style={{ background: "radial-gradient(closest-side, rgb(76 111 255 / .25), transparent)" }}
          className="absolute -inset-6 -z-10 rounded-3xl transition-opacity group-hover:opacity-100" />
        <Link
          href="/proyectos/jp-edits/"
          prefetch={false}
          className="group block overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl shadow-indigo-950/20 backdrop-blur-md transition-all hover:border-[#4c6fff]/50 hover:shadow-[#4c6fff]/25"
        >
          {/* Barra superior de navegador */}
          <div className="flex items-center justify-between border-b border-black/5 bg-neutral-100/90 px-3 py-1.5 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-1.5 font-mono text-[10px] text-neutral-500">jp-edits.vercel.app</span>
            </div>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-[#4c6fff]">
              Edición de video
            </span>
          </div>
          {/* Captura real */}
          <div className="relative aspect-[2.13/1] w-full overflow-hidden bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/projects/jp-edits.webp"
              alt="Plataforma web JP Edits"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      </div>

      {/* 4. LV Racing (Primer plano / Centro-Izquierda) */}
      <div className="absolute bottom-2 left-3 z-40 w-[80%] max-w-[400px] animate-hero-float-3 transition-all duration-300 ease-out hover:!animate-none hover:z-50 hover:scale-[1.04] hover:!rotate-0">
        {/* Resplandor ambiental rojo/negro */}
        <div style={{ background: "radial-gradient(closest-side, rgb(220 38 38 / .2), transparent)" }}
          className="absolute -inset-6 -z-10 rounded-3xl transition-opacity" />
        <Link
          href="/proyectos/lv-racing/"
          prefetch={false}
          className="group block overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-md transition-all hover:border-red-500/50 hover:shadow-red-500/20"
        >
          {/* Barra superior de navegador */}
          <div className="flex items-center justify-between border-b border-black/5 bg-neutral-100/90 px-3 py-1.5 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="ml-1.5 font-mono text-[10px] text-neutral-500">lv-racing-web.vercel.app</span>
            </div>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
              Taller de motos
            </span>
          </div>
          {/* Captura real */}
          <div className="relative aspect-[2.14/1] w-full overflow-hidden bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/projects/lv-racing.webp"
              alt="Plataforma LV Racing"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      </div>

      {/* Tarjeta flotante de resumen en esquina inferior */}
      <div className="absolute -bottom-5 right-2 z-50 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-md">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-brand">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {cardLabel}
        </p>
        <p className="text-sm font-bold text-ink">{cardTitle}</p>
      </div>
    </div>
  );
}
