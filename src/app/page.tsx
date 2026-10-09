import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BudgetBuilder } from "@/components/BudgetBuilder";
import { ArrowIcon, CheckIcon, WhatsAppIcon } from "@/components/icons";
import { PosMockup } from "@/components/PosMockup";
import { Carousel3D } from "@/components/Carousel3D";
import { TeamShowcase } from "@/components/TeamShowcase";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contentRepo } from "@/lib/content";

function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export default async function Home() {
  const site = await contentRepo.getSiteData();
  const projects = await contentRepo.getProjects();
  const team = await contentRepo.getTeam();
  const faqs = await contentRepo.getFaqs();
  const process = await contentRepo.getProcessSteps();
  const sprintLoop = await contentRepo.getSprintLoop();
  
  const budgetTypes = await contentRepo.getBudgetTypes();
  const budgetExtras = await contentRepo.getBudgetExtras();
  const budgetSectors = await contentRepo.getBudgetSectors();
  const budgetTimes = await contentRepo.getBudgetTimes();

  // Orden del mazo: primero lo real, después lo que está en desarrollo, los trabajos de la facultad y al final los conceptos
  const deck = ["real", "desarrollo", "facultad", "concepto"].flatMap((k) => projects.filter((p) => p.kind === k));

  return (
    <>
      <Header siteName={site.name} />
      <main data-stage>
        {/* Inicio */}
        <section className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 md:pt-40 lg:pb-20">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div data-reveal data-hero-text>
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
                  href={makeWhatsappLink(site.whatsapp, "Hola, quiero consultar por un proyecto.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3.5 font-bold transition hover:border-ink"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25d366]" /> Escribirnos por WhatsApp
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block" data-reveal data-hero-art style={{ "--reveal-delay": "150ms" } as React.CSSProperties}>
              <PosMockup className="mx-auto max-w-lg rotate-1" />
              <div className="absolute -bottom-6 left-2 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/10 sm:left-0">
                <p className="text-xs text-ink/60">Proyecto real</p>
                <p className="font-bold">AKROS Café · punto de venta</p>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos */}
        <div id="proyectos" className="scroll-anchor" />
        <section className="overflow-x-clip bg-paper py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTitle
              eyebrow="Proyectos"
              title="Trabajos y prototipos"
              text="Sistemas reales en uso, lo que cada uno del equipo va construyendo y conceptos pensados para cada tipo de negocio."
            />
          </div>
          {/* Sacamos el carrusel del max-w-6xl para que use el ancho completo de la ventana sin cortarse */}
          {/* Sin data-reveal: animar la opacidad de un padre aplana el 3D y obliga a redibujar el cilindro entero */}
          <div className="mt-6 w-full">
            <Carousel3D projects={deck as any} />
          </div>
        </section>

        {/* Servicios */}
        <div id="servicios" className="scroll-anchor" />
        <section className="bg-white px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle
              eyebrow="Servicios"
              title="Arma tu presupuesto"
              text="Cada negocio es distinto, por eso no tenemos precios fijos. Elige lo que necesitas y te pasamos un presupuesto a medida, por escrito y antes de empezar."
            />
            <div className="mt-12" data-reveal>
              <BudgetBuilder
                budgetTypes={budgetTypes}
                budgetExtras={budgetExtras}
                budgetSectors={budgetSectors}
                budgetTimes={budgetTimes}
                whatsapp={site.whatsapp}
              />
            </div>
            <p className="mt-8 text-center text-sm text-ink/60" data-reveal>
              ¿Ya tienes una web? También ofrecemos un plan mensual de mantenimiento con cambios, copias de seguridad y soporte.
            </p>
          </div>
        </section>

        {/* Proceso */}
        <div id="proceso" className="scroll-anchor" />
        <section className="bg-paper px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle
              eyebrow="Cómo trabajamos"
              title="Paso a paso, y siempre con tu opinión"
              text="No desaparecemos hasta la entrega: vas viendo prototipos, los pruebas y decides cómo sigue."
            />
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {process.map((step, i) => (
                <li
                  key={step.title}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                  className={`flex flex-col rounded-3xl border p-6 ${i === 2 ? "border-ink bg-ink text-paper md:row-span-2" : "border-black/5 bg-white"}`}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full font-extrabold ${i === 2 ? "bg-brand text-white" : "bg-brand/10 text-brand"}`}
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className={`mt-2 text-sm ${i === 2 ? "text-paper/70" : "text-ink/70"}`}>{step.text}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {step.details.map((d) => (
                      <li key={d} className="flex gap-2">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {i === 2 && (
                    <div className="mt-6 rounded-2xl bg-white/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand">En cada sprint</p>
                      <ol className="mt-3 space-y-2.5">
                        {sprintLoop.map((s, j) => (
                          <li key={s} className="flex items-center gap-3 text-sm">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 text-xs font-bold">
                              {j + 1}
                            </span>
                            {s}
                          </li>
                        ))}
                      </ol>
                      <p className="mt-3 text-xs text-paper/60">↻ Y se repite hasta que quede como lo imaginaste.</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Nosotros */}
        <div id="nosotros" className="scroll-anchor" />
        <section data-hold={Math.max(0, team.length - 1)} className="overflow-x-clip bg-white px-4 pb-28 pt-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle
              eyebrow="Nosotros"
              title={`Somos ${site.name}`}
              text="Somos cuatro estudiantes de Ingeniería en Sistemas de la Universidad Tecnológica Nacional, Facultad Regional Tucumán, que empezamos de cero y vamos por el cien. Nuestro nombre lo dice: Zain significa bueno y lindo, y Soft, software. Hacemos software bueno, con un backend sólido que funciona, y lindo, con un diseño cuidado y fácil de usar. Cada uno aporta lo suyo, y juntos convertimos las ideas de cada negocio en sistemas y páginas que funcionan."
            />
            <TeamShowcase
              team={team.map(({ slug, name, fullName, role, photo, href, network, bio, skills }) => ({
                slug, name, fullName, role, photo, href, network, bio, skills,
              }))}
            />
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <div id="preguntas" className="scroll-anchor" />
        <section className="bg-paper px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarnos" />
            <div className="mt-10 space-y-3">
              {faqs.map((f, i) => (
                <details
                  key={f.q}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
                  className="group rounded-2xl border border-black/5 bg-white p-5 open:shadow-sm">
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
        <div id="contacto" className="scroll-anchor" />
        <div className="bg-ink">
          <section className="bg-ink px-4 py-20 text-paper sm:px-6">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
              <div data-reveal>
                <p className="text-sm font-bold uppercase tracking-widest text-brand">Contacto</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">¿Hablamos de tu proyecto?</h2>
                <p className="mt-4 text-lg text-paper/70">
                  Cuéntanos qué necesitas y te respondemos en el día con una propuesta. La primera charla no tiene costo.
                </p>
                <div className="mt-8 space-y-3 text-paper/80">
                  <a
                    href={makeWhatsappLink(site.whatsapp, "Hola, quiero consultar por un proyecto.")}
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
              <div data-reveal style={{ "--reveal-delay": "150ms" } as React.CSSProperties}>
                <ContactForm whatsapp={site.whatsapp} />
              </div>
            </div>
          </section>
          <Footer name={site.name} instagram={site.instagram} github={site.github} />
        </div>
      </main>
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, "Hola, vi el portafolio de ZainSoft y quiero consultar por un proyecto.")} />
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
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""} data-reveal>
      <p className="text-sm font-bold uppercase tracking-widest text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-ink/70">{text}</p>}
    </div>
  );
}
