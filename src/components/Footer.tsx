import { site } from "@/content/site";

export function Footer() {
  const social = [
    { href: site.instagram, label: "Instagram" },
    { href: site.github, label: "GitHub" },
  ];
  return (
    <footer className="bg-ink text-paper/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-white/10 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}. Hecho a mano con Next.js.
        </p>
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
