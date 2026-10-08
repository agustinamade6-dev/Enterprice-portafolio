import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { PosMockup } from "@/components/PosMockup";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: "AKROS Café, sistema de punto de venta",
  description: "Caso de estudio: sistema de punto de venta de escritorio para la cafetería AKROS Café.",
};

const facts = [
  { label: "Cliente", value: "AKROS Café" },
  { label: "Rubro", value: "Cafetería" },
  { label: "Tipo", value: "Programa de escritorio para Windows" },
  { label: "Mi rol", value: "Programador: frontend y parte del backend" },
];

const team = [
  {
    name: site.owner,
    role: "Programador: frontend y parte del backend",
    photo: site.photo,
    href: site.instagram,
  },
  {
    name: "José Augusto Matias",
    role: "Backend, pruebas y auditoría",
    photo: "/equipo/jose-matias.jpg",
    href: "https://www.instagram.com/josematias._/",
  },
];

const features = [
  "Pedidos por mesa o para llevar en pocos toques",
  "Productos organizados por categoría, con fotos y precios",
  "Cobro y cierre de caja al final del día",
  "Funciona sin internet: los datos quedan guardados en la computadora del local",
];

const stack = [
  { name: "Next.js y React", why: "La interfaz del sistema" },
  { name: "Electron", why: "Empaquetarlo como programa de Windows" },
  { name: "Prisma y SQLite", why: "Guardar productos, ventas y caja en el equipo" },
];

export default function AkrosCase() {
  return (
    <>
      <Header />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Cafetería</span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            AKROS Café: un punto de venta pensado para atender rápido
          </h1>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 sm:p-12">
            <PosMockup className="mx-auto max-w-2xl" />
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl border border-black/5 bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{f.label}</dt>
                <dd className="mt-1 font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <section>
              <h2 className="text-2xl font-extrabold">El problema</h2>
              <p className="mt-3 text-ink/70">
                {/* TODO: confirmar con el cliente cómo trabajaban antes */}
                La cafetería necesitaba tomar pedidos y cobrar más rápido en los horarios de mayor movimiento, y tener el control
                de la caja en un solo lugar.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 text-ink/70">
                Un programa de escritorio para la computadora del mostrador, con una pantalla clara donde se arma el pedido, se
                cobra y se cierra la caja al final del día.
              </p>
            </section>
          </div>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Qué hace</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Mi rol</h2>
            <p className="mt-3 max-w-3xl text-ink/70">
              Fui programador del proyecto, a cargo del frontend y de parte del backend. Programé todas las pantallas que usa el
              personal del local, la navegación y la experiencia al tomar pedidos. <a
                href="https://www.instagram.com/josematias._/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink underline decoration-brand underline-offset-2 hover:text-brand"
              >
                José Augusto Matias
              </a>{" "}
              estuvo a cargo del backend, hizo las pruebas y lo auditó, y trabajamos
              juntos en cómo se comunican las dos partes.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {team.map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 transition hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photo} alt={`Foto de ${m.name}`} className="h-16 w-16 shrink-0 rounded-full object-cover object-top" />
                  <div>
                    <p className="font-bold">{m.name}</p>
                    <p className="text-sm text-ink/60">{m.role}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Tecnologías</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {stack.map((s) => (
                <div key={s.name} className="rounded-2xl border border-black/5 bg-white p-4">
                  <p className="font-bold">{s.name}</p>
                  <p className="mt-1 text-sm text-ink/60">{s.why}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold">¿Quieres algo así para tu negocio?</h2>
              <p className="mt-2 text-paper/70">Cuéntame cómo trabajas y te propongo una solución a medida.</p>
            </div>
            <a
              href={whatsappLink("Hola, vi el sistema de AKROS Café y quiero algo parecido para mi negocio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Escríbeme <ArrowIcon className="h-4 w-4" />
            </a>
          </section>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
