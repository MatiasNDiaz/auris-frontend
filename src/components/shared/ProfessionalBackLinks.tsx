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
  "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none";

/**
 * Los dos enlaces toman el acento de la persona, igual que el resto de la
 * ficha: el rosa violáceo o el azul profundo del titular. El primario va más
 * saturado que el secundario para que se distingan entre sí.
 */
const tones = {
  rose: {
    primary:
      "border-rose-300 bg-rose-100/70 text-rose-900 hover:border-rose-500 hover:bg-rose-200/80 focus-visible:ring-rose-400",
    secondary:
      "border-rose-200 bg-rose-50/70 text-rose-700 hover:border-rose-400 hover:bg-rose-100/80 focus-visible:ring-rose-400",
  },
  clinic: {
    primary:
      "border-clinic-300 bg-clinic-100/70 text-clinic-900 hover:border-clinic-500 hover:bg-clinic-200/80 focus-visible:ring-clinic-400",
    secondary:
      "border-clinic-200 bg-clinic-50/70 text-clinic-700 hover:border-clinic-400 hover:bg-clinic-100/80 focus-visible:ring-clinic-400",
  },
} as const;

type ProfessionalBackLinksProps = {
  /** Selector de la foto de la ficha, origen del morph inverso. */
  photoSelector?: string;
  /** Acento de la ficha. Lo pasa `ProfessionalProfile` desde su paleta. */
  tone?: keyof typeof tones;
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
  tone = "rose",
}: ProfessionalBackLinksProps) {
  const c = tones[tone];
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
          c.primary,
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
          c.secondary,
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
