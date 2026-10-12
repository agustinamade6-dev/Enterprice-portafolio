import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { contentRepo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Cómo trabajamos, presupuestos, pagos, cancelaciones y reembolsos de ZainSoft.",
};

const a = "font-semibold text-ink underline underline-offset-2 hover:text-brand";

export default async function Terminos() {
  const site = await contentRepo.getSiteData();
  return (
    <LegalPage
      title="Términos y condiciones"
      intro={
        <p>
          Estos términos explican cómo trabajamos en {site.name}: qué ofrecemos, cómo se arma el presupuesto, cómo se paga y
          qué pasa si quieres cancelar. Si algo del presupuesto firmado dice otra cosa, vale lo que acordamos en el
          presupuesto, siempre que no te quite derechos que te da la ley.
        </p>
      }
      sections={[
        {
          title: "Qué ofrecemos",
          body: (
            <p>
              Diseñamos y desarrollamos páginas web, tiendas y menús online, sistemas a medida y chatbots, y damos
              mantenimiento y soporte. Los proyectos que se ven en esta página están marcados como &quot;Proyecto real&quot;,
              &quot;En desarrollo&quot;, &quot;Facultad&quot; o &quot;Concepto&quot;. Los conceptos son ideas de ejemplo,
              no trabajos hechos para un cliente.
            </p>
          ),
        },
        {
          title: "Presupuesto",
          body: (
            <>
              <p>
                No tenemos precios fijos. El armador de presupuesto de esta página solo nos cuenta qué necesitas: no es una
                oferta ni un contrato. Con eso te enviamos un presupuesto por escrito que detalla qué incluye, el precio, las
                etapas y los plazos estimados.
              </p>
              <p>El trabajo empieza recién cuando aceptas ese presupuesto.</p>
            </>
          ),
        },
        {
          title: "Cómo trabajamos",
          body: (
            <p>
              Trabajamos por etapas cortas (sprints). En cada una te entregamos un prototipo para que lo pruebes y nos digas
              qué cambiar. Los cambios que entran en lo acordado no tienen costo extra; si pides algo nuevo que no estaba en
              el presupuesto, te lo presupuestamos aparte antes de hacerlo.
            </p>
          ),
        },
        {
          title: "Pagos",
          body: (
            <p>
              Se paga 50% al empezar y 50% al entregar, salvo que el presupuesto diga otra cosa. Aceptamos efectivo,
              transferencia, Mercado Pago, tarjeta Naranja y otros medios que acordemos. Los planes de mantenimiento se pagan
              por mes, según lo acordado.
            </p>
          ),
        },
        {
          title: "Derecho de arrepentimiento",
          body: (
            <p>
              Como el acuerdo se hace a distancia (por WhatsApp, correo o esta página), puedes arrepentirte dentro de los 10
              días corridos desde que aceptas el presupuesto, sin dar motivos y sin costo, como indica el artículo 34 de la
              Ley 24.240 de Defensa del Consumidor. Te devolvemos todo lo que hayas pagado. Puedes pedirlo desde el{" "}
              <Link className={a} href="/arrepentimiento/">
                botón de arrepentimiento
              </Link>
              .
            </p>
          ),
        },
        {
          title: "Cancelación y reembolsos después de esos 10 días",
          body: (
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Si cancelas el proyecto a mitad de camino, te entregamos lo que esté hecho hasta ese momento y te devolvemos
                la parte del anticipo que corresponda al trabajo que todavía no hicimos.
              </li>
              <li>Si no podemos terminar el proyecto por una causa nuestra, te devolvemos lo que pagaste por lo no entregado.</li>
              <li>Los reembolsos se hacen por el mismo medio de pago, o por el que acordemos, dentro de los 10 días hábiles.</li>
              <li>
                Los costos de terceros que pagamos por ti con tu acuerdo (dominio, hosting, licencias) no se pueden recuperar
                una vez contratados, salvo que el proveedor los devuelva.
              </li>
            </ul>
          ),
        },
        {
          title: "Entrega y soporte",
          body: (
            <p>
              Al entregar, publicamos o instalamos el sistema y te enseñamos a usarlo. Si aparece un error en algo que
              entregamos, lo corregimos sin costo durante los 6 meses siguientes a la entrega (garantía). Los cambios
              nuevos o el soporte continuo se cubren con el plan de mantenimiento o con un presupuesto aparte.
            </p>
          ),
        },
        {
          title: "Lo que nos tienes que dar",
          body: (
            <p>
              Para avanzar necesitamos que nos envíes a tiempo los textos, fotos, logos y datos de tu negocio, y que esos
              materiales sean tuyos o tengas permiso para usarlos. Si se demoran, los plazos se corren lo mismo.
            </p>
          ),
        },
        {
          title: "Propiedad y uso del trabajo",
          body: (
            <>
              <p>
                Cuando el proyecto está pagado por completo, puedes usar, modificar y mantener libremente lo que te
                entregamos para tu negocio. Las herramientas y piezas de código generales que usamos en varios proyectos
                siguen siendo nuestras, pero puedes usarlas dentro de tu sistema sin límite.
              </p>
              <p>Solo mostramos tu proyecto en nuestro portafolio o redes si nos das permiso.</p>
            </>
          ),
        },
        {
          title: "Responsabilidad",
          body: (
            <p>
              Hacemos nuestro trabajo con cuidado y lo probamos antes de entregarlo. No respondemos por fallas de servicios
              de terceros (hosting, WhatsApp, pasarelas de pago, proveedores de internet) ni por cambios que haga otra
              persona en el sistema después de la entrega. Nada de esto limita los derechos que te da la Ley de Defensa del
              Consumidor.
            </p>
          ),
        },
        {
          title: "Ley aplicable y reclamos",
          body: (
            <p>
              Estos términos se rigen por las leyes de la República Argentina. Si tienes un problema, escríbenos primero a{" "}
              <a className={a} href={`mailto:${site.email}`}>{site.email}</a> y lo resolvemos juntos. Si eres consumidor,
              también puedes hacer tu reclamo ante la autoridad de Defensa del Consumidor de tu provincia o de la Nación.
            </p>
          ),
        },
        {
          title: "Cambios en estos términos",
          body: (
            <p>
              Si cambiamos estos términos, publicamos la nueva versión en esta página con su fecha. Los proyectos ya
              aceptados siguen con los términos vigentes cuando los aceptaste.
            </p>
          ),
        },
      ]}
    />
  );
}
