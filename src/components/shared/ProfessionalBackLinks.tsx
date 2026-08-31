"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import {
  useProfessionalOrigin,
  useViewTransitionRouter,
} from "@/components/providers/ViewTransitionProvider";
import { cn } from "@/lib/utils";

/** Si se entró por URL directa no hay origen guardado: cae al listado. */
const FALLBACK = "/profesionales";

const linkStyles =
  "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none";

type ProfessionalBackLinksProps = {
  /** Selector de la foto de la ficha, origen del morph inverso. */
  photoSelector?: string;
};

/**
 * Navegación de salida de la ficha.
 *
 * "Volver" apunta a la vista desde la que se entró — la Home, el listado
 * general o el equipo de un servicio — y no a una ruta fija: así el usuario
 * cae en el lugar del que salió. La transición se dispara con la foto de la
 * ficha como elemento compartido, de modo que el morph corre en reversa y la
 * imagen aterriza sobre la card de origen.
 */
export function ProfessionalBackLinks({
  photoSelector = "[data-professional-photo]",
}: ProfessionalBackLinksProps) {
  const origin = useProfessionalOrigin();
  const navigate = useViewTransitionRouter();
  const busy = useRef(false);

  const back = origin ?? FALLBACK;

  const go = (href: string) => (event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.button !== 0) return;
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const photo = document.querySelector<HTMLElement>(photoSelector);
    navigate(href, photo);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={back}
        onClick={go(back)}
        className={cn(
          linkStyles,
          "border-primary-300 bg-primary-50/70 text-primary-800 hover:border-primary-500 hover:bg-primary-100",
        )}
      >
        <ArrowLeft
          className="size-4 transition-transform duration-200 group-hover:-translate-x-1"
          aria-hidden
        />
        Volver
      </Link>

      <Link
        href={FALLBACK}
        onClick={go(FALLBACK)}
        className={cn(
          linkStyles,
          "border-accent-300 bg-accent-50/70 text-accent-700 hover:border-accent-500 hover:bg-accent-100",
        )}
      >
        Ver todo el equipo
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </div>
  );
}
