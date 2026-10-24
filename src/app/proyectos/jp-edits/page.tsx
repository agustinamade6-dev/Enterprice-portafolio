import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProjectLiveButton } from "@/components/ProjectLiveButton";
import { contentRepo } from "@/lib/content";

function makeWhatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const metadata: Metadata = {
  title: "JP Edits, web profesional y panel de administración para un editor de videos cortos",
  description:
    "Caso de estudio: web bilingüe para JP Edits, editor de Reels, TikTok y Shorts, con reels por nicho, motion graphics, resultados reales, formulario protegido y panel de administración propio.",
};

const facts = [
  { label: "Cliente", value: "JP Edits · Juan Pablo Cabana" },
  { label: "Rubro", value: "Edición de videos cortos" },
  { label: "Tipo", value: "Web bilingüe + Panel de administración" },
  { label: "Desarrollo", value: "Fabrizio Nicolás Andrada Simeon" },
];

const areas = [
  {
    title: "1. Web pública bilingüe (/ y /en)",
    badge: "Español e inglés",
    items: [
      "Portada con titular animado, prueba de antes y después y una barra superior que imita la línea de tiempo de un editor de video y marca en qué sección estás.",
      "Galería de reels filtrable por nicho (tecnología y fitness), con carrusel y reproductor que abre YouTube, Vimeo o Instagram sin salir de la página.",
      "Motion graphics que se reproducen al pasar el mouse o tocar, y gráfico interactivo de vistas reales del TikTok del cliente actual, con promedio y mejor video.",
      "Servicios, proceso de trabajo, paquetes, preguntas frecuentes y testimonios, con la versión en inglés en /en y sin redirecciones automáticas.",
    ],
  },
  {
    title: "2. Panel de administración propio (/admin)",
    badge: "Sin tocar código",
    items: [
      "Carga y orden de reels, motion graphics, antes y después, cifras, testimonios, paquetes y preguntas frecuentes en los dos idiomas, con arrastrar y soltar.",
      "Subida de imágenes y clips a Vercel Blob; lo que se guarda se publica al instante, sin volver a desplegar la web.",
      "Bandeja de mensajes del formulario con aviso por mail, y opción para exportar o borrar los datos de una persona.",
      "Contenido de ejemplo que solo se ve en desarrollo y nunca llega a la web publicada.",
    ],
  },
  {
    title: "3. Seguridad, datos personales y rendimiento",
    badge: "Listo para producción",
    items: [
      "Un solo administrador con Better Auth, límite de intentos de login guardado en la base y todas las acciones del panel verificadas en el servidor.",
      "Formulario con Cloudflare Turnstile, límite de 5 envíos por hora por IP, campo trampa y consentimiento registrado con la versión de la política.",
      "Content-Security-Policy estricta, sin cookies en la web pública y purga automática diaria de mensajes con más de 12 meses.",
      "Caché de una hora con contenido de respaldo si la base no responde, para que la web nunca se rompa.",
    ],
  },
];

const features = [
  "Barra superior con estética de línea de tiempo de edición que sigue el scroll",
  "Apertura animada con la marca y la firma de ZainSoft",
  "Gráfico de vistas reales, navegable con mouse, toque o teclado",
  "Reels filtrables por nicho con reproductor integrado",
  "Todo el contenido editable desde el panel, en español e inglés",
  "Formulario antispam con aviso por mail y bandeja de mensajes",
  "Páginas legales de privacidad, términos y cookies",
  "Optimizada para celular y buscadores: sitemap, JSON-LD y metadatos por idioma",
];

const stack = [
  {
    name: "Next.js 16 y React 19",
    why: "App Router con TypeScript, Tailwind v4 y GSAP cargado bajo demanda para las animaciones",
  },
  {
    name: "Neon PostgreSQL y Drizzle",
    why: "Base de datos serverless con migraciones versionadas y caché con contenido de respaldo",
  },
  {
    name: "Better Auth, Zod y Turnstile",
    why: "Acceso único al panel, validación de cada dato y formulario protegido contra spam",
  },
  {
    name: "Vercel, Blob y Resend",
    why: "Deploy continuo en São Paulo, almacenamiento de medios y avisos por mail de cada consulta",
  },
];

export default async function JpEditsCase() {
  const site = await contentRepo.getSiteData();

  const developer = {
    name: "Fabrizio",
    fullName: "Fabrizio Nicolás Andrada Simeon",
    role: "Programador: diseño, frontend, backend y panel de administración",
    photo: "/equipo/fabrizio-andrada.jpg",
    href: "https://www.linkedin.com/in/fabrizio-andrada-0b70532a1",
  };

  const whatsappMsg =
    "Hola, vi la web de JP Edits y me interesa una web profesional con panel de administración para mi trabajo.";

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" prefetch={false} className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Edición de video</span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">Proyecto real</span>
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-indigo-800">ES · EN</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            JP Edits: web profesional y panel propio para un editor de videos cortos
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Portfolio bilingüe para un editor de Reels, TikTok y Shorts que trabaja con marcas de tecnología y fitness,
            pensado para que cada visita termine en un pedido de muestra.
          </p>

          {/* Hero mockup del proyecto con enlace a la web en vivo */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 p-4 sm:p-8 shadow-2xl">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              {/* Barra de ventana simulada */}
              <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5 text-xs text-white/70">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-zinc-400">jp-edits.vercel.app</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Online
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/jp-edits.png"
                alt="Captura de la portada de la web de JP Edits"
                className="w-full object-cover object-top"
              />
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row">
              <p className="text-sm text-zinc-400">
                Web en producción, usada por el editor para mostrar su trabajo y recibir consultas de clientes.
              </p>
              <ProjectLiveButton url="https://jp-edits.vercel.app/" label="Visitar sitio oficial ↗" />
            </div>
          </div>

          {/* Ficha técnica */}
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl border border-black/5 bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{f.label}</dt>
                <dd className="mt-1 font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>

          {/* Problema y Solución */}
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <section>
              <h2 className="text-2xl font-extrabold">El problema</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                Un editor de videos cortos vende con su trabajo, pero los reels quedaban dispersos entre Instagram, TikTok
                y carpetas compartidas. No había un lugar propio que mostrara resultados reales, explicara cómo trabaja y
                cuánto cuesta, ni una forma ordenada de recibir consultas de marcas en español e inglés.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                Se diseñó una web bilingüe con estética de editor de video: reels por nicho, motion graphics, un gráfico
                con las vistas reales de un cliente, proceso, paquetes y un formulario protegido. Detrás, un panel propio
                permite cargar y ordenar todo el contenido en los dos idiomas y ver las consultas, sin tocar código.
              </p>
            </section>
          </div>

          {/* Las 3 áreas de la plataforma */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Estructura de la plataforma</h2>
            <div className="mt-6 space-y-6">
              {areas.map((area) => (
                <div key={area.title} className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-bold">{area.title}</h3>
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                      {area.badge}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {area.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink/80">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Funcionalidades destacadas */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Funcionalidades destacadas</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quién lo hizo (Fabrizio) */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Quién lo hizo</h2>
            <p className="mt-3 max-w-3xl text-ink/70">
              Fabrizio diseñó y desarrolló la web completa: armó la identidad visual con estética de línea de tiempo,
              programó la web pública bilingüe con Next.js y GSAP, modeló la base de datos en Neon con Drizzle,
              construyó el panel de administración con Better Auth y se encargó de la seguridad, los datos personales y
              el despliegue en Vercel.
            </p>
            <div className="mt-6 max-w-md">
              <a
                href={developer.href}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="strict-origin-when-cross-origin"
                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 transition hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={developer.photo}
                  alt={`Foto de ${developer.fullName}`}
                  className="h-16 w-16 shrink-0 rounded-full object-cover object-top"
                />
                <div>
                  <p className="font-bold">{developer.name}</p>
                  <p className="text-xs text-ink/50">{developer.fullName}</p>
                  <p className="text-sm text-ink/60">{developer.role}</p>
                </div>
              </a>
            </div>
          </section>

          {/* Tecnologías */}
          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Tecnologías y Arquitectura</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stack.map((s) => (
                <div key={s.name} className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-5">
                  <p className="font-bold">{s.name}</p>
                  <p className="mt-2 text-sm text-ink/60">{s.why}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Llamado a la acción */}
          <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold">¿Quieres una web profesional para mostrar tu trabajo?</h2>
              <p className="mt-2 text-paper/70">
                Diseñamos portfolios y webs con panel propio para que actualices tu contenido sin depender de nadie.
              </p>
            </div>
            <a
              href={makeWhatsappLink(site.whatsapp, whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
            >
              Escríbenos <ArrowIcon className="h-4 w-4" />
            </a>
          </section>
        </article>
      </main>
      <Footer />
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, whatsappMsg)} />
    </>
  );
}
