import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { contentRepo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Botón de arrepentimiento",
  description: "Pide la cancelación de tu contratación con ZainSoft dentro de los 10 días, sin costo.",
};

// Botón de arrepentimiento (Ley 24.240, art. 34, y Resolución 424/2020 de la Secretaría de Comercio Interior):
// tiene que estar a la vista, sin registro previo, y quien lo usa recibe un código de su pedido
export default async function Arrepentimiento() {
  const site = await contentRepo.getSiteData();
  const text =
    "Hola, quiero arrepentirme de mi contratación con ZainSoft (botón de arrepentimiento).\nNombre:\nProyecto o fecha del presupuesto:";
  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("Botón de arrepentimiento")}&body=${encodeURIComponent(text)}`;
  return (
    // Columna de toda la pantalla: en páginas cortas el pie queda pegado abajo
    <div className="flex min-h-screen flex-col">
      <Header siteName={site.name} />
      <main className="flex-1 px-4 pb-20 pt-32 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Legal</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Botón de arrepentimiento</h1>
          <p className="mt-6 text-ink/80">
            Si aceptaste un presupuesto con nosotros, tienes 10 días corridos para arrepentirte, sin dar motivos y sin
            costo. Te devolvemos todo lo que hayas pagado. No necesitas registrarte: envíanos tu pedido por WhatsApp o por
            correo con tu nombre y el proyecto o la fecha del presupuesto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Pedir la cancelación por WhatsApp
            </a>
            <a
              href={mail}
              className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3.5 font-bold transition hover:bg-black/5"
            >
              Pedirla por correo
            </a>
          </div>
          <p className="mt-6 text-sm text-ink/70">
            Dentro de las 24 horas te respondemos, por el mismo medio, con un código de tu pedido de arrepentimiento, y
            después coordinamos la devolución. Más detalle en los{" "}
            <Link className="font-semibold text-ink underline underline-offset-2" href="/legal/terminos/">
              términos y condiciones
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
