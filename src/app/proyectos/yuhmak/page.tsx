import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Yuhmak, registro de reparaciones",
  description: "Caso de estudio: sistema web para registrar y seguir las reparaciones de motos de Yuhmak.",
};

const facts = [
  { label: "Cliente", value: "Yuhmak" },
  { label: "Rubro", value: "Distribución de motos" },
  { label: "Tipo", value: "Sistema web" },
  { label: "Equipo", value: "Fabrizio" },
  { label: "Registros", value: "Más de 340 motos" },
];

const features = [
  "Ingreso con usuario y contraseña para cada persona del taller",
  "Carga de cada moto: marca, modelo, color, chasis y motor",
  "Fecha, hora y descripción de cada arreglo",
  "Historial con buscador por marca, modelo, chasis o motor",
  "Filtros por marca y por período, y totales del día",
  "Impresión de cada registro o del listado completo",
  "Datos sincronizados en todos los dispositivos",
];

const screens = [
  { src: "/yuhmak/nueva-reparacion.jpg", title: "Nueva reparación", text: "Los datos de la moto, su identificación y el trabajo realizado en un solo formulario." },
  { src: "/yuhmak/historial.jpg", title: "Historial", text: "Todas las reparaciones con buscador, filtros, contadores e impresión." },
];

export default function YuhmakCase() {
  return (
    <>
      <Header />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Centro de distribución de motos</span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Yuhmak: cada moto reparada, registrada y fácil de encontrar
          </h1>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-900 p-4 sm:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/yuhmak/login.jpg"
              alt="Pantalla de ingreso del sistema de reparaciones de Yuhmak"
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
                Un taller que arregla muchas motos por día necesita saber qué se le hizo a cada una. Anotarlo a mano hace difícil
                encontrar un arreglo por su chasis o su motor, o saber cuántas motos se repararon.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 text-ink/70">
                Un sistema web donde el personal carga cada reparación en segundos y después la encuentra con un buscador, desde
                cualquier dispositivo.
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
              <Link href="/equipo/fabrizio/" className="font-semibold text-ink underline decoration-brand underline-offset-2 hover:text-brand">
                Fabrizio
              </Link>{" "}
              hizo el sistema de gestión completo: el frontend, el backend y el diseño de cada pantalla, pensado para usarse
              rápido en el taller.
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
                      alt={`Pantalla de ${s.title} del sistema de Yuhmak`}
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
              href={whatsappLink("Hola, vi el sistema de Yuhmak y quiero algo parecido para mi negocio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Escríbenos <ArrowIcon className="h-4 w-4" />
            </a>
          </section>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
