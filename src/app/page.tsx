import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BudgetBuilder } from "@/components/BudgetBuilder";
import { ArrowIcon, CheckIcon, WhatsAppIcon } from "@/components/icons";
import { PosMockup } from "@/components/PosMockup";
import { Carousel3D } from "@/components/Carousel3D";
import { TeamShowcase } from "@/components/TeamShowcase";
import { Bit } from "@/components/Bit";
import { Intro } from "@/components/Intro";
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
  const t = await contentRepo.getPageTexts();
  const fill = (v: string) => v.replaceAll("{nombre}", site.name);
  const bit = (l: { pose: string; text: string }) => `${l.pose}|${l.text}`;
  
  const budgetTypes = await contentRepo.getBudgetTypes();
  const budgetExtras = await contentRepo.getBudgetExtras();
  const budgetSectors = await contentRepo.getBudgetSectors();
  const budgetTimes = await contentRepo.getBudgetTimes();

  // Orden del mazo: primero lo real, después lo que está en desarrollo, los trabajos de la facultad y al final los conceptos
  const deck = ["real", "desarrollo", "facultad", "concepto"].flatMap((k) => projects.filter((p) => p.kind === k));

  return (
    <>
      <Intro />
      <Header siteName={site.name} />
      <main data-stage>
        {/* Inicio */}
        <section data-bit={bit(t.bit.hero)} className="fondo-inicio relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 md:pt-40 lg:pb-20">
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div data-reveal data-hero-text>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {t.hero.badge}
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {t.hero.titleStart} <span className="text-brand">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink/70">{site.tagline} {t.hero.subtitleExtra}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#proyectos"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-paper transition hover:bg-brand"
                >
                  {t.hero.buttonProjects} <ArrowIcon className="h-4 w-4" />
                </Link>
                <a
                  href={makeWhatsappLink(site.whatsapp, t.hero.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3.5 font-bold transition hover:border-ink"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25d366]" /> {t.hero.buttonWhatsapp}
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block" data-reveal data-hero-art style={{ "--reveal-delay": "150ms" } as React.CSSProperties}>
              <PosMockup className="mx-auto max-w-lg rotate-1" />
              <div className="absolute -bottom-6 left-2 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/10 sm:left-0">
                <p className="text-xs text-ink/60">{t.hero.cardLabel}</p>
                <p className="font-bold">{t.hero.cardTitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos */}
        <div id="proyectos" className="scroll-anchor" />
        <section data-bit={bit(t.bit.projects)} className="fondo-proyectos overflow-x-clip py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTitle eyebrow={t.projects.eyebrow} title={fill(t.projects.title)} text={fill(t.projects.text)} />
          </div>
          {/* Sacamos el carrusel del max-w-6xl para que use el ancho completo de la ventana sin cortarse */}
          {/* Sin data-reveal: animar la opacidad de un padre aplana el 3D y obliga a redibujar el cilindro entero */}
          <div className="mt-6 w-full">
            <Carousel3D projects={deck as any} />
          </div>
        </section>

        {/* Servicios */}
        <div id="servicios" className="scroll-anchor" />
        <section data-bit={bit(t.bit.services)} className="fondo-servicios px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow={t.services.eyebrow} title={fill(t.services.title)} text={fill(t.services.text)} />
            <div className="mt-12" data-reveal>
              <BudgetBuilder
                budgetTypes={budgetTypes}
                budgetExtras={budgetExtras}
                budgetSectors={budgetSectors}
                budgetTimes={budgetTimes}
                whatsapp={site.whatsapp}
              />
            </div>
            {t.services.note && (
              <p className="mt-8 text-center text-sm text-ink/60" data-reveal>
                {fill(t.services.note)}
              </p>
            )}
          </div>
        </section>

        {/* Proceso */}
        <div id="proceso" className="scroll-anchor" />
        <section data-bit={bit(t.bit.process)} data-hold={4} data-hold-fit className="fondo-proceso px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow={t.process.eyebrow} title={fill(t.process.title)} text={fill(t.process.text)} />
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {process.map((step, i) => (
                <li
                  key={step.title}
                  data-reveal
                  data-step
                  style={{ "--reveal-delay": `${i * 90}ms`, "--i": i, "--n": process.length } as React.CSSProperties}
                  // El paso 3 es negro solo en la compu; en el celular es blanco como los demás
                  className={`flex flex-col rounded-3xl border p-6 border-black/5 bg-white ${i === 2 ? "md:row-span-2 pc:border-ink pc:bg-ink pc:text-paper" : ""}`}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full font-extrabold bg-brand/10 text-brand ${i === 2 ? "pc:bg-brand pc:text-white" : ""}`}
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className={`mt-2 text-sm text-ink/70 ${i === 2 ? "pc:text-paper/70" : ""}`}>{step.text}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {step.details.map((d) => (
                      <li key={d} className="flex gap-2">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {i === 2 && (
                    <div className="mt-6 rounded-2xl bg-brand/5 p-4 pc:bg-white/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand">{t.process.sprintTitle}</p>
                      <ol className="mt-3 space-y-2.5">
                        {sprintLoop.map((s, j) => (
                          <li key={s} className="flex items-center gap-3 text-sm">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/20 text-xs font-bold pc:border-white/20">
                              {j + 1}
                            </span>
                            {s}
                          </li>
                        ))}
                      </ol>
                      <p className="mt-3 text-xs text-ink/60 pc:text-paper/60">{t.process.sprintRepeat}</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Nosotros */}
        <div id="nosotros" className="scroll-anchor" />
        <section data-hold={Math.max(0, team.length - 1)} data-bit={bit(t.bit.team)} className="fondo-nosotros overflow-x-clip px-4 pb-20 pt-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle wide eyebrow={t.team.eyebrow} title={fill(t.team.title)} text={fill(t.team.text)} />
            <TeamShowcase
              team={team.map(({ slug, name, fullName, role, photo, href, network, bio, skills }) => ({
                slug, name, fullName, role, photo, href, network, bio, skills,
              }))}
            />
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <div id="preguntas" className="scroll-anchor" />
        <section data-bit={bit(t.bit.faqs)} className="fondo-preguntas px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow={t.faqs.eyebrow} title={fill(t.faqs.title)} text={fill(t.faqs.text)} />
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
        <div data-bit={bit(t.bit.contact)} className="scene-end fondo-contacto">
          <section className="grid content-center px-4 py-20 text-paper sm:px-6">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
              <div data-reveal>
                <p className="text-sm font-bold uppercase tracking-widest text-brand">{t.contact.eyebrow}</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{fill(t.contact.title)}</h2>
                <p className="mt-4 text-lg text-paper/70">
                  {fill(t.contact.text)}
                </p>
                <div className="mt-8 space-y-3 text-paper/80">
                  <a
                    href={makeWhatsappLink(site.whatsapp, t.contact.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-paper"
                  >
                    <WhatsAppIcon className="h-5 w-5 text-[#25d366]" /> {t.contact.whatsappLabel}
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
          <Footer />
        </div>
      </main>
      <Bit clicks={t.bit.click} />
    </>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
  align = "center",
  wide = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  wide?: boolean;
}) {
  return (
    <div className={align === "center" ? `mx-auto text-center ${wide ? "max-w-4xl" : "max-w-2xl"}` : ""} data-reveal>
      <p className="text-sm font-bold uppercase tracking-widest text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {/* En pantallas bajas el texto largo (Nosotros) se achica para que el apartado entre entero */}
      {text && (
        <p className={`mt-4 text-lg text-ink/70 ${wide ? "[@media(max-height:820px)]:mt-3 [@media(max-height:820px)]:text-base" : ""}`}>
          {text}
        </p>
      )}
    </div>
  );
}
