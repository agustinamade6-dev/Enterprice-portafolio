import Image from "next/image";
import Link from "next/link";

export function Footer({ name, instagram, github }: { name: string; instagram: string; github: string }) {
  const social = [
    { href: instagram, label: "Instagram" },
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
            © {new Date().getFullYear()} {name}. Hecho a mano con Next.js.
          </p>
        </div>
        <div className="flex gap-5">
          {social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
