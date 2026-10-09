import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grid min-h-[calc(100vh-5rem)] place-items-center px-4 pb-20 pt-32 text-center sm:px-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Error 404</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Esta página no existe</h1>
          <p className="mx-auto mt-4 max-w-md text-ink/70">
            Puede que el enlace esté mal escrito o que la página se haya movido. Desde el inicio puedes ver todos nuestros
            proyectos.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-paper transition hover:bg-brand"
          >
            Volver al inicio <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
