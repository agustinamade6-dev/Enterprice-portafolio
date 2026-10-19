import Image from "next/image";
import Link from "next/link";
import { contentRepo } from "@/lib/content";
import { site } from "@/content/site";

// Lee los datos del admin directamente, así todas las páginas muestran lo mismo
export async function Footer() {
  const { name, instagram, facebook, github, email } = await contentRepo.getSiteData();
  const { footer } = await contentRepo.getPageTexts();
  const note = footer.note;
  const legal = [
    { href: "/legal/privacidad/", label: "Privacidad" },
    { href: "/legal/terminos/", label: "Términos y condiciones" },
    { href: "/legal/cookies/", label: "Cookies" },
  ];
  const social = [
    { href: instagram, label: "Instagram" },
    { href: facebook || site.facebook, label: "Facebook" },
    { href: github, label: "GitHub" },
  ];
  return (
    <footer className="bg-ink text-paper/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-white/10 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90" aria-label={name}>
            <Image
              src="/logo-dark.png"
              alt={name}
              width={110}
              height={28}
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </Link>
          <span className="hidden sm:inline text-white/20">|</span>
          <p>
            © {new Date().getFullYear()} {name}.{note ? ` ${note}` : ""}
          </p>
        </div>
        <div className="flex gap-5">
          {social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" referrerPolicy="strict-origin-when-cross-origin" className="hover:text-paper">
              {s.label}
            </a>
          ))}
        </div>
      </div>
      {/* Enlaces legales. El botón de arrepentimiento se sacó del pie a pedido de Agustin (2026-10-19);
          la página /arrepentimiento/ sigue enlazada desde Términos. La Res. 424/2020 pide tenerlo a la vista. */}
      <nav aria-label="Legal" className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-3 px-4 pb-8 text-xs sm:px-6">
        {legal.map((l) => (
          <Link key={l.href} href={l.href} className="underline-offset-2 hover:text-paper hover:underline">
            {l.label}
          </Link>
        ))}
        <span className="text-paper/60">
          {name} · Tucumán, Argentina · {email}
        </span>
      </nav>
    </footer>
  );
}
