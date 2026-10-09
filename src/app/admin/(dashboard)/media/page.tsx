import { mediaRepo } from "@/lib/content/media";
import { MediaGalleryClient } from "./MediaGalleryClient";

export const metadata = {
  title: "Galería de Medios - Admin",
};

export default async function MediaPage() {
  const images = await mediaRepo.listImages();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-white">Galería de Medios</h1>
        <p className="mt-2 text-paper/70">
          Todas las imágenes subidas al portafolio. Haz clic para copiar su URL.
        </p>
      </header>

      <MediaGalleryClient images={images} />
    </div>
  );
}
