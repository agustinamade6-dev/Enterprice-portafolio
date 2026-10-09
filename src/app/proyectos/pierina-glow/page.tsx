import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contentRepo } from "@/lib/content";

function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const metadata: Metadata = {
  title: "Pierina Glow, sistema de gestión",
  description: "Caso de estudio: sistema de gestión de escritorio para la tienda de ropa femenina Pierina Glow.",
};

const facts = [
  { label: "Cliente", value: "Pierina Glow" },
  { label: "Rubro", value: "Indumentaria femenina" },
  { label: "Tipo", value: "Programa de escritorio para Windows" },
  { label: "Equipo", value: "Agustin" },
  { label: "Tecnología", value: "Python" },
];

const features = [
  "Inventario con código, talle, color, costo, precio de venta y proveedor",
  "Ventas con buscador de prendas, ticket y medio de pago",
  "Registro de clientes y proveedores",
  "Reportes de ventas del día y del mes, y las 5 prendas más vendidas",
  "Historial de ventas, con opción de anular una venta",
  "Copias de seguridad para no perder datos",
];

const screens = [
  { src: "/pierina/inventario.png", title: "Inventario", text: "Cada prenda con su talle, color, costo, precio y proveedor." },
  { src: "/pierina/ventas.png", title: "Ventas", text: "Buscar la prenda, armar el ticket, elegir cliente y medio de pago, y cobrar." },
  { src: "/pierina/reportes.png", title: "Reportes", text: "Ventas del día, del mes y el top 5 de prendas más vendidas." },
  { src: "/pierina/historial.png", title: "Historial", text: "Todas las ventas con fecha, cliente, total y forma de pago." },
];

export default async function PierinaCase() {
  const site = await contentRepo.getSiteData();

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Indumentaria femenina</span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Pierina Glow: toda la tienda de ropa en un solo programa
          </h1>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-[#eab3a6] to-[#c96f5d] p-4 sm:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pierina/inicio.png"
              alt="Pantalla de resumen general del sistema de Pierina Glow"
              className="mx-auto w-full max-w-3xl rounded-xl shadow-2xl shadow-black/25"
            />
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
                Una tienda de ropa maneja la misma prenda en varios talles y colores. Llevar eso a mano, junto con las ventas, los
                clientes y los proveedores, hace difícil saber qué queda en stock y cuánto se gana.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 text-ink/70">
                Un programa de escritorio con la estética de la marca, donde se carga cada prenda, se cobra en el mostrador y se
                consultan los reportes del negocio.
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
            <h2 className="text-2xl font-extrabold">Quién lo hizo</h2>
            <p className="mt-3 max-w-3xl text-ink/70">
              Agustin hizo el sistema completo de punta a punta: el diseño de las pantallas con los colores de la marca y toda la
              programación, desde el inventario hasta los reportes y las copias de seguridad.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Pantallas</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {screens.map((s) => (
                <figure key={s.src}>
                  <a href={s.src} target="_blank" rel="noopener noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt={`Pantalla de ${s.title} del sistema de Pierina Glow`}
                      className="w-full rounded-xl border border-black/10 shadow-lg shadow-black/5"
                    />
                  </a>
                  <figcaption className="mt-3 text-sm">
                    <span className="font-bold">{s.title}.</span> <span className="text-ink/70">{s.text}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold">¿Quieres algo así para tu negocio?</h2>
              <p className="mt-2 text-paper/70">Cuéntanos cómo trabajas y te proponemos una solución a medida.</p>
            </div>
            <a
              href={makeWhatsappLink(site.whatsapp, "Hola, vi el sistema de Pierina Glow y quiero algo parecido para mi negocio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Escríbenos <ArrowIcon className="h-4 w-4" />
            </a>
          </section>
        </article>
      </main>
      <Footer name={site.name} instagram={site.instagram} github={site.github} />
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, "Hola, vi el sistema de Pierina Glow y quiero algo parecido para mi negocio.")} />
    </>
  );
}
