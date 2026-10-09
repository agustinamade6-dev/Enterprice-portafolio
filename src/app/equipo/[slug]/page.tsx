import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { type Member } from "@/lib/content/schemas";
import { contentRepo } from "@/lib/content";

function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const team = await contentRepo.getTeam();
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await contentRepo.getMember(slug);
  if (!m) return {};
  return {
    title: `La historia de ${m.name}`,
    description: `${m.fullName}, ${m.role.toLowerCase()} en ZainSoft. Cómo empezó y en qué está hoy.`,
  };
}

function Avatar({ m, size }: { m: Member; size: string }) {
  return m.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.photo} alt={`Foto de ${m.fullName}`} className={`${size} rounded-[1.75rem] object-cover object-top`} />
  ) : (
    <span className={`${size} grid place-items-center rounded-[1.75rem] bg-ink text-4xl font-extrabold text-paper`}>
      {m.fullName.charAt(0)}
      {m.fullName.split(" ").at(-1)?.charAt(0)}
    </span>
  );
}

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const site = await contentRepo.getSiteData();
  const m = await contentRepo.getMember(slug);
  if (!m) notFound();
  
  const team = await contentRepo.getTeam();
  const others = team.filter((t) => t.slug !== m.slug);

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-3xl">
          <Link href="/#nosotros" className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver al equipo
          </Link>

          <header className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative h-32 w-32 shrink-0">
              <div className="absolute -inset-1.5 rotate-6 rounded-[2rem] bg-gradient-to-br from-brand to-amber-400" />
              <div className="relative">
                <Avatar m={m} size="h-32 w-32" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-brand">Su historia</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">{m.name}</h1>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-ink/50">{m.fullName}</p>
              <p className="mt-2 font-semibold text-brand-dark">{m.role}</p>
            </div>
          </header>

          <p className="mt-10 text-xl leading-relaxed text-ink/80">{m.story.intro}</p>

          <ol className="relative mt-12 space-y-10 border-l-2 border-black/10 pl-8">
            {m.story.chapters.map((c) => (
              <li key={c.title} className="relative">
                <span className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full border-4 border-paper bg-brand" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">{c.label}</p>
                <h2 className="mt-1 text-2xl font-extrabold">{c.title}</h2>
                <p className="mt-2 text-ink/70">{c.text}</p>
                {c.href && (
                  <Link href={c.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold hover:text-brand">
                    Ver el proyecto <ArrowIcon className="h-4 w-4" />
                  </Link>
                )}
              </li>
            ))}
            {m.story.pending && (
              <li className="relative">
                <span className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full border-4 border-paper bg-black/20" />
                <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Próximamente</p>
                <div className="mt-2 rounded-2xl border border-dashed border-black/15 p-5 text-ink/60">
                  Muy pronto {m.name} va a contar {m.story.pending}.
                </div>
              </li>
            )}
          </ol>

          <div className="mt-12 flex flex-wrap gap-1.5">
            {m.skills.map((t) => (
              <span key={t} className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium">
                {t}
              </span>
            ))}
          </div>
          {m.href && (
            <a
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-bold hover:text-brand"
            >
              Seguir a {m.name} en {m.network ?? "Instagram"} →
            </a>
          )}

          <section className="mt-16">
            <h2 className="text-xl font-extrabold">Conoce al resto del equipo</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/equipo/${o.slug}/`}
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 transition hover:shadow-md"
                >
                  <Avatar m={o} size="h-16 w-16 text-xl" />
                  <div>
                    <p className="font-bold">{o.name}</p>
                    <p className="text-sm text-ink/60">{o.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold">¿Tienes un proyecto?</h2>
              <p className="mt-2 text-paper/70">Cuéntanos qué necesitas y lo vemos entre todos.</p>
            </div>
            <a
              href={makeWhatsappLink(site.whatsapp, "Hola, leí sobre el equipo de ZainSoft y quiero consultar por un proyecto.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Escríbenos <ArrowIcon className="h-4 w-4" />
            </a>
          </section>
        </article>
      </main>
      <Footer name={site.name} instagram={site.instagram} github={site.github} />
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, "Hola, vi el portafolio de ZainSoft y quiero consultar por un proyecto.")} />
    </>
  );
}
