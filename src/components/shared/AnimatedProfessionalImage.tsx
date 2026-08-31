"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { BLUR_DATA_URL } from "@/lib/blur";
import {
  PHOTO_VT_NAME,
  useActiveProfessionalSlug,
} from "@/components/providers/ViewTransitionProvider";
import { cn } from "@/lib/utils";

type AnimatedProfessionalImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** `sizes` de next/image; ajustar al ancho real que ocupa en cada vista. */
  sizes?: string;
  priority?: boolean;
  /**
   * Marca este elemento como destino fijo de la View Transition. Lo usa la
   * ficha de profesional; en los listados el nombre se aplica al vuelo, solo
   * sobre la card clickeada, porque no puede haber dos a la vez.
   */
  isTransitionTarget?: boolean;
  /**
   * Slug del profesional de esta card. Si coincide con el que está en tránsito,
   * la foto se marca sola: es lo que permite que al volver desde la ficha el
   * navegador tenga a dónde morfear la imagen.
   */
  vtSlug?: string;
};

/**
 * Foto de un profesional que participa del shared element transition.
 *
 * El morph lo hace el navegador vía View Transitions: `view-transition-name`
 * empareja la foto de la card con la de la ficha. Ver `useViewTransitionRouter`.
 */
export const AnimatedProfessionalImage = forwardRef<
  HTMLDivElement,
  AnimatedProfessionalImageProps
>(function AnimatedProfessionalImage(
  {
    src,
    alt,
    className,
    sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px",
    priority = false,
    isTransitionTarget = false,
    vtSlug,
  },
  ref,
) {
  const activeSlug = useActiveProfessionalSlug();
  const named = isTransitionTarget || (!!vtSlug && vtSlug === activeSlug);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden bg-cream-100", className)}
      data-professional-photo={isTransitionTarget ? "" : undefined}
      style={named ? { viewTransitionName: PHOTO_VT_NAME } : undefined}
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
    </div>
  );
});
