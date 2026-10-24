import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { contentRepo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos usa ZainSoft, para qué y cómo puedes ejercer tus derechos según la Ley 25.326.",
};

const a = "font-semibold text-ink underline underline-offset-2 hover:text-brand";

export default async function Privacidad() {
  const site = await contentRepo.getSiteData();
  const phone = `+${site.whatsapp.slice(0, 2)} ${site.whatsapp.slice(2, 3)} ${site.whatsapp.slice(3, 6)} ${site.whatsapp.slice(6, 9)}-${site.whatsapp.slice(9)}`;
  return (
    <LegalPage
      title="Política de privacidad"
      intro={
        <p>
          En {site.name} cuidamos los datos que nos compartes. Acá te contamos, en simple, qué datos usamos, para qué, con
          quién se comparten y cómo puedes pedir verlos, corregirlos o borrarlos. Esta política sigue la Ley 25.326 de
          Protección de los Datos Personales de la República Argentina.
        </p>
      }
      sections={[
        {
          title: "Quiénes somos",
          body: (
            <>
              <p>
                {site.name} es un equipo de desarrollo de software de Tucumán, Argentina. Somos los responsables de los datos que
                recibimos por esta página.
              </p>
              <p>
                Contacto: <a className={a} href={`mailto:${site.email}`}>{site.email}</a> · WhatsApp {phone}.
              </p>
            </>
          ),
        },
        {
          title: "Qué datos recibimos",
          body: (
            <>
              <p>
                Esta página no tiene registro de usuarios ni guarda en un servidor lo que escribes. Los formularios de
                contacto y de &quot;Arma tu presupuesto&quot; solo arman un mensaje y lo abren en tu WhatsApp:{" "}
                <strong>nos llega únicamente si tú decides enviarlo.</strong>
              </p>
              <p>Si nos escribes, recibimos:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Tu nombre y, si lo pones, el nombre de tu negocio.</li>
                <li>Tu número de WhatsApp o tu correo, según por dónde nos escribas.</li>
                <li>Lo que nos cuentes en el mensaje y lo que elijas en el armador de presupuesto.</li>
              </ul>
              <p>No pedimos ni guardamos datos sensibles (salud, religión, opiniones políticas, etc.) ni datos de tarjetas.</p>
            </>
          ),
        },
        {
          title: "Para qué los usamos",
          body: (
            <ul className="list-disc space-y-1 pl-6">
              <li>Responder tu consulta y prepararte un presupuesto.</li>
              <li>Si nos contratas, llevar adelante el proyecto, coordinar entregas, cobrar y darte soporte.</li>
              <li>Cumplir obligaciones legales (por ejemplo, impositivas).</li>
            </ul>
          ),
        },
        {
          title: "Qué no hacemos",
          body: (
            <p>
              No vendemos, alquilamos ni cedemos tus datos. No te enviamos publicidad si no nos lo pides. No usamos tus
              datos para perfiles ni decisiones automatizadas.
            </p>
          ),
        },
        {
          title: "Servicios de terceros",
          body: (
            <>
              <p>Para funcionar usamos servicios de otras empresas, que tratan los datos según sus propias políticas:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>WhatsApp (Meta):</strong> por donde llegan los mensajes de los formularios y los botones de contacto.
                </li>
                <li>
                  <strong>Gmail (Google):</strong> si nos escribes por correo.
                </li>
                <li>
                  <strong>Cloudflare:</strong> aloja esta página. Como cualquier servidor web, puede registrar datos técnicos
                  de la visita (dirección IP, navegador, fecha y hora) por seguridad y para que el sitio funcione.
                </li>
              </ul>
              <p>
                Estos servicios pueden guardar datos fuera de Argentina. Los enlaces a Instagram, GitHub y LinkedIn te llevan
                a esos sitios, que tienen sus propias políticas.
              </p>
            </>
          ),
        },
        {
          title: "Cuánto tiempo los guardamos",
          body: (
            <p>
              Mientras dure tu consulta o el proyecto, y después solo lo que haga falta para cumplir obligaciones legales o
              darte soporte. Puedes pedirnos que los borremos en cualquier momento (ver el punto siguiente).
            </p>
          ),
        },
        {
          title: "Tus derechos",
          body: (
            <>
              <p>
                Puedes pedirnos ver tus datos (acceso), corregirlos o actualizarlos (rectificación) y borrarlos (supresión),
                escribiendo a <a className={a} href={`mailto:${site.email}`}>{site.email}</a> o por WhatsApp. Es gratis.
                Respondemos los pedidos de acceso dentro de los 10 días corridos y los de corrección o borrado dentro de
                los 5 días hábiles, como indica la ley.
              </p>
              <p className="rounded-2xl bg-black/[0.04] p-4 text-sm">
                El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
                gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme
                lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La AGENCIA DE ACCESO A LA INFORMACIÓN
                PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias
                y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas
                vigentes en materia de protección de datos personales.
              </p>
            </>
          ),
        },
        {
          title: "Datos de los sistemas que desarrollamos",
          body: (
            <p>
              Si te hacemos un sistema, los datos que cargues en él (clientes, ventas, stock, etc.) son tuyos. Solo los
              vemos si hace falta para desarrollarlo, probarlo o darte soporte, los tratamos con confidencialidad y no los
              usamos para nada más.
            </p>
          ),
        },
        {
          title: "Cookies",
          body: (
            <p>
              Esta página no usa cookies de seguimiento ni de publicidad. Más detalle en la{" "}
              <Link className={a} href="/legal/cookies/" prefetch={false}>
                política de cookies
              </Link>
              .
            </p>
          ),
        },
        {
          title: "Menores de edad",
          body: <p>Nuestros servicios están pensados para personas mayores de 18 años y para negocios.</p>,
        },
        {
          title: "Cambios en esta política",
          body: (
            <p>
              Si cambiamos esta política, publicamos la nueva versión en esta página con su fecha de actualización.
            </p>
          ),
        },
      ]}
    />
  );
}
