import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contentRepo } from "@/lib/content";
import { MenuDemo } from "./MenuDemo";

function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const metadata: Metadata = {
  title: "Demo: menú digital con QR",
  description: "Prueba cómo funciona un menú digital: el cliente elige, arma su pedido y lo envía por WhatsApp.",
};

const steps = [
  { title: "Escanea el QR", text: "Cada mesa tiene un código. El cliente lo escanea con la cámara del celular, sin instalar nada." },
  { title: "Arma su pedido", text: "Ve fotos, descripciones y precios, y suma lo que quiere con un toque." },
  { title: "Lo envía por WhatsApp", text: "El pedido llega ordenado al WhatsApp del local, con la mesa y el total." },
];

export default async function MenuDigitalDemo() {
  const site = await contentRepo.getSiteData();

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Link href="/#proyectos" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Restaurantes</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">Demo para probar</span>
          </div>

          {/* En celular la demo va justo después del título; en pantallas grandes queda a la derecha. */}
          <div className="mt-4 grid items-start gap-x-12 gap-y-10 lg:grid-cols-[1fr_auto] lg:grid-rows-[auto_1fr]">
            <div className="max-w-xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Menú digital con QR</h1>
              <p className="mt-4 text-lg text-ink/70">
                Así lo vería un cliente desde el celular. Pruébalo: elige platos, cambia cantidades y mira cómo quedaría el
                pedido que le llega al local.
              </p>
            </div>
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <MenuDemo />
            </div>
            <div className="max-w-xl">
              <ol className="space-y-6">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-bold text-paper">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold">{s.title}</p>
                      <p className="text-ink/70">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-10 rounded-3xl bg-ink p-8 text-paper">
                <h2 className="text-2xl font-extrabold">¿Lo quieres para tu local?</h2>
                <p className="mt-2 text-paper/70">
                  Lo armamos con tus platos, tus fotos y tus colores. Tú cambias precios cuando quieras, sin pagar comisiones.
                </p>
                <a
                  href={makeWhatsappLink(site.whatsapp, "Hola, probé la demo del menú digital y quiero uno para mi local.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
                >
                  Pedir el mío <ArrowIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer name={site.name} instagram={site.instagram} github={site.github} />
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, "Hola, vi el portafolio de Enterprice y quiero consultar por un proyecto.")} />
    </>
  );
}
