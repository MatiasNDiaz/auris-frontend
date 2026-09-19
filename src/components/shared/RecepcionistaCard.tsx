"use client";

import { motion } from "framer-motion";
import { AnimatedProfessionalImage } from "./AnimatedProfessionalImage";
import type { Recepcionista } from "@/lib/types";
import { cn } from "@/lib/utils";

type RecepcionistaCardProps = {
  recepcionista: Recepcionista;
  className?: string;
  sizes?: string;
};

/**
 * Tarjeta de alguien de recepción.
 *
 * Es la misma tarjeta del equipo —misma proporción, mismo cruce de fotos al
 * pasar el cursor— pero sin enlace: no tienen ficha propia. Por eso no se
 * reusa `ProfessionalCard`: esa componente existe para navegar, y sacarle el
 * enlace la dejaría con la mitad del código apagado y con un `cursor-pointer`
 * que promete algo que no pasa.
 *
 * Tampoco lleva `vtSlug`: la transición de elemento compartido es para el
 * morph de la foto hacia la ficha, y acá no hay a dónde ir.
 */
export function RecepcionistaCard({
  recepcionista,
  className,
  sizes,
}: RecepcionistaCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100 bg-card shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <AnimatedProfessionalImage
        src={recepcionista.photoUrl}
        hoverSrc={recepcionista.photoHoverUrl}
        objectPosition={recepcionista.fotoFoco}
        hoverObjectPosition={recepcionista.fotoHoverFoco}
        alt={`Retrato de ${recepcionista.name}`}
        sizes={sizes}
        className="aspect-4/5 w-full rounded-t-3xl"
      />

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary-700 uppercase">
          Recepción
        </p>
        <h3 className="mt-2 font-serif text-xl text-ink-900">
          {recepcionista.name}
        </h3>
      </div>
    </motion.article>
  );
}
