import React from "react";
import { isValidExternalUrl } from "@/lib/security";

export interface ProjectLiveButtonProps {
  url?: string | null;
  label?: string;
  disabledLabel?: string;
  className?: string;
  disabledClassName?: string;
  fallbackMode?: "disable" | "hide";
}

/**
 * Botón blindado para redirección a proyectos externos en vivo.
 * - Valida la URL con el constructor nativo new URL() y restringe protocolos peligrosos (XSS).
 * - Protege contra Reverse Tabnabbing con rel="noopener noreferrer".
 * - Limita la fuga de Referer con referrerPolicy="strict-origin-when-cross-origin".
 * - Deshabilita u oculta el botón si la URL es inválida o insegura.
 */
export function ProjectLiveButton({
  url,
  label = "Visitar sitio oficial ↗",
  disabledLabel = "Sitio no disponible",
  className = "inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  disabledClassName = "inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/40 cursor-not-allowed select-none",
  fallbackMode = "disable",
}: ProjectLiveButtonProps) {
  const isSafe = isValidExternalUrl(url);

  if (!isSafe) {
    if (fallbackMode === "hide") {
      return null;
    }
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="El enlace en vivo no está disponible o no es seguro"
        className={disabledClassName}
      >
        {disabledLabel}
      </button>
    );
  }

  return (
    <a
      href={url as string}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="strict-origin-when-cross-origin"
      className={className}
    >
      {label}
    </a>
  );
}
