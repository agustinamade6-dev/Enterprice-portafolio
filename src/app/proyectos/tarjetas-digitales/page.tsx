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
  title: "Tarjetas digitales para casamientos, cumpleaños y baby showers",
  description:
    "Invitaciones web con confirmación de asistencia por WhatsApp, cuenta regresiva, mapa, música, fotos y datos para regalos. Mira tres tarjetas de muestra funcionando.",
};

// Las tarjetas son páginas estáticas en public/tarjetas/: se pueden abrir y probar tal cual las ve un invitado.
const samples = [
  {
    href: "/tarjetas/casamiento/",
    preview: "/tarjetas/previews/casamiento.png",
    title: "Casamiento",
    names: "Sofía & Tomás",
    text: "Elegante y botánica: ceremonia y fiesta, dress code, galería, datos para regalos y confirmación con menú especial.",
  },
  {
    href: "/tarjetas/quince/",
    preview: "/tarjetas/previews/quince.png",
    title: "15 años / Cumpleaños",
    names: "Martina",
    text: "Noche de fiesta con destellos. Al confirmar, cada invitado pide la canción que no puede faltar.",
  },
  {
    href: "/tarjetas/baby-shower/",
    preview: "/tarjetas/previews/baby-shower.png",
    title: "Baby shower / Nacimiento",
    names: "Emma",
    text: "Suave y tierna, con nubes. Lista de regalos sugeridos y alias para transferir.",
  },
];

const features = [
  { title: "Confirmación de asistencia", text: "Cada invitado confirma cuántos van y te llega el mensaje a tu WhatsApp, listo para anotar." },
  { title: "Cuenta regresiva y agenda", text: "Los días que faltan y un botón para guardar el evento en el calendario del celular." },
  { title: "Mapa y cómo llegar", text: "La ubicación con Google Maps y un botón que abre el recorrido." },
  { title: "Música", text: "Suena al abrir el sobre de la invitación. Puede ser la canción que elijas." },
  { title: "Galería de fotos", text: "Tus fotos favoritas, que se agrandan con un toque." },
  { title: "Regalos", text: "Alias o CBU con botón para copiar, o una lista de regalos sugeridos." },
];

const occasions = ["Casamientos", "Cumpleaños", "15 años", "Baby showers", "Nacimientos", "Bautismos y comuniones", "Egresos", "Aniversarios"];

const steps = [
  { title: "Nos cuentas tu evento", text: "Qué festejas, la fecha, el lugar y cómo te lo imaginas." },
  { title: "Diseñamos tu tarjeta", text: "Con tus colores, textos, fotos y música. Te la mostramos para que la ajustes." },
  { title: "Compartes el link", text: "La publicamos y la mandas por WhatsApp o la subes a tus redes." },
];

export default async function TarjetasDigitales() {
  const site = await contentRepo.getSiteData();
  const whatsappMsg = "Hola, vi las tarjetas digitales y quiero una para mi evento.";

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Eventos y celebraciones</span>
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-brand">Servicio nuevo</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Tarjetas digitales para tu evento
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-ink/70">
            Invitaciones web para casamientos, cumpleaños, baby showers, nacimientos y todo lo que quieras celebrar. Se
            comparten con un link y tus invitados confirman por WhatsApp.
          </p>

          {/* Las tres muestras */}
          <section className="mt-10 rounded-3xl bg-gradient-to-br from-[#ffe9dc] to-[#e98d6b] p-6 sm:p-10">
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
              {samples.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener" className="group flex flex-col items-center text-center">
                  <span className="block w-full max-w-[220px] overflow-hidden rounded-[2rem] border-[7px] border-ink bg-ink shadow-2xl shadow-black/25 transition duration-300 group-hover:-translate-y-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.preview}
                      alt={`Portada de la tarjeta de muestra: ${s.title}, ${s.names}`}
                      loading="lazy"
                      className="aspect-[1/2] w-full object-cover object-top"
                    />
                  </span>
                  <span className="mt-5 text-xl font-extrabold text-ink">{s.title}</span>
                  <span className="mt-2 text-sm text-ink/75">{s.text}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-paper transition group-hover:bg-brand">
                    Abrir la tarjeta <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-medium text-ink/80">
              Ábrelas desde el celular, que es donde las ven los invitados. Los nombres y datos son de ejemplo, y en estas
              muestras la confirmación de asistencia llega al WhatsApp de ZainSoft.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Qué incluye</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-black/5 bg-white p-5">
                  <p className="flex items-center gap-2 font-bold">
                    <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
                    {f.title}
                  </p>
                  <p className="mt-2 text-sm text-ink/70">{f.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Para cada ocasión</h2>
            <p className="mt-3 max-w-3xl text-ink/70">
              Si se festeja, hay tarjeta. Cada una se diseña para el evento: no usamos plantillas genéricas.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {occasions.map((o) => (
                <span key={o} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
                  {o}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Cómo la hacemos</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-3xl border border-black/5 bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 font-extrabold text-brand">{i + 1}</span>
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold">¿Armamos la tarjeta de tu evento?</h2>
              <p className="mt-2 text-paper/70">Cuéntanos qué festejas y la fecha, y te mostramos una propuesta.</p>
            </div>
            <a
              href={makeWhatsappLink(site.whatsapp, whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Pedir mi tarjeta <ArrowIcon className="h-4 w-4" />
            </a>
          </section>
        </article>
      </main>
      <Footer />
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, whatsappMsg)} />
    </>
  );
}
