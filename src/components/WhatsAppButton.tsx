import { whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hola, vi el portafolio de Enterprice y quiero consultar por un proyecto.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
