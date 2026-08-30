"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import { cn } from "@/lib/utils";

type AnimatedProfessionalImageProps = {
  slug: string;
  src: string;
  alt: string;
  className?: string;
  /** `sizes` de next/image; ajustar al ancho real que ocupa en cada vista. */
  sizes?: string;
  priority?: boolean;
};

/**
 * Foto de un profesional participando del shared element transition.
 *
 * El `layoutId` es el mismo en la card del carousel y en el detalle, así que
 * Framer Motion interpola posición y tamaño entre ambas vistas siempre que las
 * dos estén montadas en el mismo árbol (ver la intercepting route
 * `@modal/(.)profesionales/[slug]`). En una navegación completa el `layoutId`
 * no tiene con qué emparejar y la imagen simplemente aparece: es la
 * degradación esperada, no un error.
 */
export function AnimatedProfessionalImage({
  slug,
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px",
  priority = false,
}: AnimatedProfessionalImageProps) {
  return (
    <motion.div
      layoutId={`professional-photo-${slug}`}
      className={cn("relative overflow-hidden bg-cream-100", className)}
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover"
      />
    </motion.div>
  );
}
