import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { contentRepo } from "@/lib/content";

export const LEGAL_UPDATED = "12 de octubre de 2026";

export type LegalSection = { title: string; body: React.ReactNode };

// Molde de las páginas legales (privacidad, términos, cookies): título, fecha y secciones numeradas
export async function LegalPage({ title, intro, sections }: { title: string; intro: React.ReactNode; sections: LegalSection[] }) {
  const site = await contentRepo.getSiteData();
  return (
    // Columna de toda la pantalla: en páginas cortas el pie queda pegado abajo
    <div className="flex min-h-screen flex-col">
      <Header siteName={site.name} />
      <main className="flex-1 px-4 pb-20 pt-32 sm:px-6">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Legal</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-ink/70">Última actualización: {LEGAL_UPDATED}</p>
          <div className="mt-6 text-ink/80">{intro}</div>
          <ol className="mt-10 space-y-8">
            {sections.map((s, i) => (
              <li key={s.title}>
                <h2 className="text-xl font-bold">
                  {i + 1}. {s.title}
                </h2>
                <div className="legal-body mt-3 space-y-3 text-ink/80">{s.body}</div>
              </li>
            ))}
          </ol>
        </article>
      </main>
      <Footer />
    </div>
  );
}
