import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { contentRepo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "ZainSoft no usa cookies de seguimiento ni de publicidad.",
};

const a = "font-semibold text-ink underline underline-offset-2 hover:text-brand";

export default async function Cookies() {
  const site = await contentRepo.getSiteData();
  return (
    <LegalPage
      title="Política de cookies"
      intro={
        <p>
          Las cookies son pequeños archivos que algunas páginas guardan en tu navegador. Te contamos cuáles usa esta página:
          en pocas palabras, <strong>ninguna para seguirte ni para publicidad</strong>.
        </p>
      }
      sections={[
        {
          title: "Qué usa esta página",
          body: (
            <>
              <p>
                Esta página no usa cookies propias, ni herramientas de analíticas (como Google Analytics), ni píxeles de
                publicidad (como el de Meta). Tampoco guarda nada en tu navegador para reconocerte en otra visita.
              </p>
              <p>
                Cloudflare, que aloja el sitio, podría poner una cookie técnica de seguridad (por ejemplo, para frenar
                ataques o tráfico automático). Esas cookies son necesarias para que la página funcione y no sirven para
                seguirte.
              </p>
            </>
          ),
        },
        {
          title: "Por qué no te pedimos permiso",
          body: (
            <p>
              Como solo podría haber cookies técnicas necesarias, no hace falta pedirte consentimiento ni mostrarte un
              cartel de cookies. Si algún día sumamos analíticas o publicidad, vamos a pedirte permiso antes de activarlas
              y a actualizar esta página.
            </p>
          ),
        },
        {
          title: "Enlaces a otros sitios",
          body: (
            <p>
              Cuando abres WhatsApp, Instagram, GitHub o LinkedIn desde esta página, esos sitios pueden usar sus propias
              cookies según sus políticas.
            </p>
          ),
        },
        {
          title: "Cómo borrar o bloquear cookies",
          body: <p>Puedes borrar o bloquear las cookies desde la configuración de tu navegador cuando quieras.</p>,
        },
        {
          title: "Contacto",
          body: (
            <p>
              Si tienes dudas, escríbenos a <a className={a} href={`mailto:${site.email}`}>{site.email}</a>. También puedes
              leer nuestra{" "}
              <Link className={a} href="/legal/privacidad/">
                política de privacidad
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
