import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon, CheckIcon, WhatsAppIcon } from "@/components/icons";
import { PosMockup } from "@/components/PosMockup";
import { ProjectDeck } from "@/components/ProjectDeck";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { faqs, process, projects, services, site, team, whatsappLink } from "@/content/site";

export default function Home() {
  // Orden del mazo: primero lo real, después lo que está en desarrollo, los trabajos de la facultad y al final los conceptos
  const deck = ["real", "desarrollo", "facultad", "concepto"].flatMap((k) => projects.filter((p) => p.kind === k));

  return (
    <>
      <Header />
      <main>
        {/* Inicio */}
        <section className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 md:pt-40 lg:pb-20">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Disponible para nuevos proyectos
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Tu negocio, <span className="text-brand">vendiendo más</span> con una web o un sistema a medida.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink/70">{site.tagline} Diseño simple, rápido y pensado para tus clientes.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#proyectos"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-paper transition hover:bg-brand"
                >
                  Ver proyectos <ArrowIcon className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappLink("Hola, quiero consultar por un proyecto.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3.5 font-bold transition hover:border-ink"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25d366]" /> Escribirnos por WhatsApp
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <PosMockup className="mx-auto max-w-lg rotate-1" />
              <div className="absolute -bottom-6 left-2 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/10 sm:left-0">
                <p className="text-xs text-ink/60">Proyecto real</p>
                <p className="font-bold">AKROS Café · punto de venta</p>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos */}
        <section id="proyectos" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle
              eyebrow="Proyectos"
              title="Trabajos y prototipos"
              text="Sistemas reales en uso, lo que cada uno del equipo va construyendo y conceptos pensados para cada tipo de negocio."
            />
            <div className="mt-12">
              <ProjectDeck projects={deck} />
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section id="servicios" className="bg-white px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle
              eyebrow="Servicios"
              title="Elige lo que necesita tu negocio"
              text="Precios claros desde el primer día. Te enviamos la propuesta final por escrito antes de empezar."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.name}
                  className={`relative flex flex-col rounded-3xl border p-8 ${s.featured ? "border-ink bg-ink text-paper" : "border-black/10 bg-paper"}`}
                >
                  {s.featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                      Más elegido
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold">{s.name}</h3>
                  <p className={`mt-1 text-sm ${s.featured ? "text-paper/70" : "text-ink/60"}`}>{s.forWho}</p>
                  <p className="mt-6">
                    <span className={`text-sm ${s.featured ? "text-paper/70" : "text-ink/60"}`}>desde </span>
                    <span className="text-4xl font-extrabold tracking-tight">{s.price}</span>
                    <span className={`text-sm ${s.featured ? "text-paper/70" : "text-ink/60"}`}> ARS</span>
                  </p>
                  <p className={`mt-1 text-sm ${s.featured ? "text-paper/70" : "text-ink/60"}`}>Plazo: {s.timeline}</p>
                  <ul className="mt-6 space-y-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappLink(`Hola, me interesa el servicio "${s.name}".`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 rounded-full px-6 py-3 text-center font-bold transition ${s.featured ? "bg-brand text-white hover:bg-brand-dark" : "bg-ink text-paper hover:bg-brand"}`}
                  >
                    Pedir presupuesto
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-ink/60">
              ¿Ya tienes una web? También ofrecemos un plan mensual de mantenimiento con cambios, copias de seguridad y soporte.
            </p>
          </div>
        </section>

        {/* Proceso */}
        <section id="proceso" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Cómo trabajamos" title="Cuatro pasos, sin sorpresas" />
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {process.map((step, i) => (
                <li key={step.title} className="rounded-3xl border border-black/5 bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 font-extrabold text-brand">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Nosotros */}
        <section id="nosotros" className="bg-white px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle
              eyebrow="Nosotros"
              title={`Somos ${site.name}`}
              text="Somos tres estudiantes de Ingeniería en Sistemas de la Universidad Tecnológica Nacional, Facultad Regional Tucumán, que empezamos de cero y vamos por el cien. Cada uno aporta lo suyo, y juntos convertimos las ideas de cada negocio en sistemas y páginas que funcionan."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {team.map((m) => (
                <article key={m.name} className="flex flex-col rounded-3xl border border-black/5 bg-paper p-6 text-center">
                  <div className="relative mx-auto h-36 w-36">
                    <div className="absolute -inset-1.5 rotate-6 rounded-[2rem] bg-gradient-to-br from-brand to-amber-400" />
                    {m.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photo}
                        alt={`Foto de ${m.fullName}`}
                        className="relative h-36 w-36 rounded-[1.75rem] object-cover object-top"
                      />
                    ) : (
                      <span className="relative grid h-36 w-36 place-items-center rounded-[1.75rem] bg-ink text-4xl font-extrabold text-paper">
                        {m.fullName.charAt(0)}
                        {m.fullName.split(" ").at(-1)?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-6 text-2xl font-extrabold">{m.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/50">{m.fullName}</p>
                  <p className="mt-2 text-sm font-semibold text-brand-dark">{m.role}</p>
                  <p className="mt-4 text-ink/70">{m.bio}</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                    {m.skills.map((t) => (
                      <span key={t} className="rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-xs font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-6 text-sm font-bold">
                    <Link
                      href={`/equipo/${m.slug}/`}
                      className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-brand"
                    >
                      Leer su historia
                    </Link>
                    {m.href && (
                      <a href={m.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                        Ver {m.network ?? "Instagram"} →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarnos" />
            <div className="mt-10 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-black/5 bg-white p-5 open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                    {f.q}
                    <span className="text-2xl leading-none text-brand transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="bg-ink px-4 py-20 text-paper sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-brand">Contacto</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">¿Hablamos de tu proyecto?</h2>
              <p className="mt-4 text-lg text-paper/70">
                Cuéntanos qué necesitas y te respondemos en el día con una propuesta. La primera charla no tiene costo.
              </p>
              <div className="mt-8 space-y-3 text-paper/80">
                <a
                  href={whatsappLink("Hola, quiero consultar por un proyecto.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-paper"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25d366]" /> WhatsApp
                </a>
                <a href={`mailto:${site.email}`} className="block hover:text-paper">
                  {site.email}
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <p className="text-sm font-bold uppercase tracking-widest text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-ink/70">{text}</p>}
    </div>
  );
}
