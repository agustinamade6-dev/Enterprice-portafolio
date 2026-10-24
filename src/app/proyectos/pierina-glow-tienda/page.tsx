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

const LIVE_URL = "https://bypierina.netlify.app/";

export const metadata: Metadata = {
  title: "Pierina Glow, tienda online con panel de administración",
  description:
    "Caso de estudio: tienda online de la marca de ropa Pierina Glow, con catálogo, carrito con pedido por WhatsApp y un panel para cargar prendas desde el celular. Prototipo publicado y funcionando.",
};

const facts = [
  { label: "Cliente", value: "Pierina Glow" },
  { label: "Rubro", value: "Indumentaria femenina" },
  { label: "Tipo", value: "Tienda online + panel de administración" },
  { label: "Estado", value: "Prototipo en funcionamiento" },
  { label: "Equipo", value: "Agustin" },
];

const areas = [
  {
    title: "1. La tienda",
    badge: "Para las clientas",
    items: [
      "Catálogo dividido por categorías (remeras, buzos, pantalones, shorts…) con buscador, filtro por talle, orden por precio y solo ofertas.",
      "Página propia para cada prenda: galería de fotos, talles disponibles y agotados, guía de medidas y prendas relacionadas.",
      "Al pasar el mouse sobre una prenda (o deslizar en el celular) aparece la foto puesta en modelo.",
      "Carrito con elección de pago y entrega: el pedido se arma solo y se envía por WhatsApp a la tienda.",
      "Animación de entrada con el logo y transición entre páginas con un mosaico de cuadraditos.",
    ],
  },
  {
    title: "2. El panel de administración",
    badge: "Para la dueña",
    items: [
      "Se usa online, desde el celular o cualquier compu, con contraseña.",
      "Cargar, editar, duplicar, ordenar y eliminar prendas, con fotos que se achican solas antes de subirse.",
      "Editar categorías, textos de cada página, fotos de portada, datos de contacto, promociones, envíos y guía de talles.",
      "Lo que se guarda se ve al instante en la tienda, sin volver a publicar, y cada cambio deja un respaldo para volver atrás.",
    ],
  },
  {
    title: "3. Legal y seguridad",
    badge: "Para vender tranquilos",
    items: [
      "Botón de arrepentimiento, política de cambios y devoluciones, términos, privacidad y cookies según la ley argentina (Ley 24.240, Disp. 954/2025, Res. 270/2020 y Ley 25.326).",
      "Las promociones solo se muestran cuando están confirmadas, porque lo publicado obliga a cumplirlo.",
      "Contraseña cifrada, freno a quien prueba contraseñas, sesiones firmadas y protección contra pedidos de otros sitios.",
      "Política de seguridad de contenido, encabezados de seguridad y validación de todo lo que se carga desde el panel.",
    ],
  },
];

const screens = [
  { src: "/pierina-tienda/catalogo.jpg", title: "Catálogo", text: "Categorías con cantidad de prendas, buscador, filtros por talle y orden." },
  { src: "/pierina-tienda/producto.jpg", title: "Página de la prenda", text: "Fotos, precio, talles, compra por WhatsApp y guía de medidas." },
  { src: "/pierina-tienda/panel-prendas.jpg", title: "Panel: prendas", text: "Lista de prendas con fotos, precios, ofertas y talles sin stock." },
  { src: "/pierina-tienda/panel-editar.jpg", title: "Panel: editar una prenda", text: "Nombre, precio, talles, stock y fotos, todo en un mismo formulario." },
];

const stack = [
  { name: "HTML, CSS y JavaScript", why: "Sin frameworks: la tienda carga rápido incluso con datos móviles" },
  { name: "GSAP", why: "Animaciones de la portada, del catálogo y de las secciones al hacer scroll" },
  { name: "Netlify Functions y Edge", why: "El panel online y la aplicación de los cambios en la tienda al instante" },
  { name: "Netlify Blobs", why: "Prendas, textos, fotos y respaldos guardados sin necesidad de una base de datos aparte" },
];

export default async function PierinaTiendaCase() {
  const site = await contentRepo.getSiteData();
  const agustin = (await contentRepo.getTeam()).find((m) => m.slug === "agustin");
  const developer = {
    name: agustin?.name ?? site.owner,
    fullName: agustin?.fullName ?? "Leandro Agustin Amade",
    role: "Programador: diseño, frontend, panel y publicación",
    photo: agustin?.photo ?? site.photo,
    href: agustin?.href ?? site.instagram,
  };
  const whatsappMsg = "Hola, vi la tienda online de Pierina Glow y quiero una tienda así para mi negocio.";

  return (
    <>
      <Header siteName={site.name} />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-5xl">
          <Link href="/#proyectos" prefetch={false} className="text-sm font-semibold text-ink/60 hover:text-ink">
            ← Volver a proyectos
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-black/5 px-2.5 py-1">Indumentaria femenina</span>
            <span className="rounded-full bg-teal-100 px-2.5 py-1 text-teal-800">Prototipo en funcionamiento</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Pierina Glow: la tienda online de la marca, con su propio panel
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-ink/70">
            Una tienda para mostrar las prendas, ver talles y formas de pago, y hacer el pedido por WhatsApp. La dueña carga
            todo desde el celular, sin depender de un programador.
          </p>

          {/* Captura con enlace a la tienda en vivo */}
          <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#f3e3da] to-[#c96f5d] p-4 shadow-2xl sm:p-8">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-black/5 bg-[#f4f4f6] px-4 py-2.5 text-xs text-ink/60">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-zinc-500">bypierina.netlify.app</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Online</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pierina-tienda/inicio.jpg"
                alt="Página de inicio de la tienda online de Pierina Glow"
                className="w-full object-cover object-top"
              />
            </div>
            <div className="mx-auto mt-6 flex max-w-4xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-ink/80">
                Está publicada y se puede recorrer: catálogo, prendas, carrito y pedido. Los productos y fotos todavía son de ejemplo.
              </p>
              <ProjectLiveButton url={LIVE_URL} label="Ver la tienda funcionando ↗" />
            </div>
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl border border-black/5 bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{f.label}</dt>
                <dd className="mt-1 font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <section>
              <h2 className="text-2xl font-extrabold">El problema</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                La marca vendía solo por Instagram: cada clienta preguntaba por mensaje los talles, los precios y las formas de
                pago, y las prendas se perdían entre publicaciones. Hacía falta un lugar ordenado para ver todo el catálogo y
                pedir, que la dueña pudiera mantener sola.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-extrabold">La solución</h2>
              <p className="mt-3 leading-relaxed text-ink/70">
                Una tienda online con la estética de la marca, donde cada prenda tiene su página y el pedido llega armado por
                WhatsApp, y un panel con contraseña para cargar prendas, fotos y textos desde el celular. Además, cumple con lo
                que pide la ley argentina para vender por internet.
              </p>
            </section>
          </div>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Qué incluye</h2>
            <div className="mt-6 space-y-6">
              {areas.map((area) => (
                <div key={area.title} className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-bold">{area.title}</h3>
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{area.badge}</span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {area.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-ink/80">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Pantallas</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {screens.map((s) => (
                <figure key={s.src}>
                  <a href={s.src} target="_blank" rel="noopener noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt={`${s.title} de la tienda online de Pierina Glow`}
                      loading="lazy"
                      className="w-full rounded-xl border border-black/10 shadow-lg shadow-black/5"
                    />
                  </a>
                  <figcaption className="mt-3 text-sm">
                    <span className="font-bold">{s.title}.</span> <span className="text-ink/70">{s.text}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <figure className="mt-10 flex flex-col items-center gap-6 rounded-3xl border border-black/5 bg-white p-6 sm:flex-row sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pierina-tienda/celular.jpg"
                alt="Página de una prenda de Pierina Glow vista en el celular"
                loading="lazy"
                className="w-56 shrink-0 rounded-[2rem] border-8 border-ink shadow-xl"
              />
              <figcaption>
                <p className="text-xl font-bold">Pensada para el celular</p>
                <p className="mt-2 text-ink/70">
                  La mayoría de las clientas llegan desde Instagram, así que todo se probó primero en el celular: las fotos se
                  deslizan con el dedo, el menú se abre debajo del encabezado y el botón de compra queda siempre a mano.
                </p>
              </figcaption>
            </figure>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Quién lo hizo</h2>
            <p className="mt-3 max-w-3xl text-ink/70">
              Agustin hizo la tienda de punta a punta: el diseño con los colores y el logo de la marca, la tienda, el panel de
              administración online, las páginas legales y la publicación. Es el segundo proyecto para Pierina Glow, después de
              su{" "}
              <Link href="/proyectos/pierina-glow/" prefetch={false} className="font-semibold text-ink underline underline-offset-2">
                sistema de gestión
              </Link>
              .
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

          <section className="mt-14">
            <h2 className="text-2xl font-extrabold">Tecnologías</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stack.map((s) => (
                <div key={s.name} className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-5">
                  <p className="font-bold">{s.name}</p>
                  <p className="mt-2 text-sm text-ink/60">{s.why}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold">¿Quieres una tienda así para tu negocio?</h2>
              <p className="mt-2 text-paper/70">Te armamos el catálogo, el pedido por WhatsApp y un panel para que la manejes tú.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ProjectLiveButton
                url={LIVE_URL}
                label="Probar la tienda ↗"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              />
              <a
                href={makeWhatsappLink(site.whatsapp, whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark"
              >
                Escríbenos <ArrowIcon className="h-4 w-4" />
              </a>
            </div>
          </section>
        </article>
      </main>
      <Footer />
      <WhatsAppButton url={makeWhatsappLink(site.whatsapp, whatsappMsg)} />
    </>
  );
}
