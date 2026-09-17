"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import { BLUR_DATA_URL } from "@/lib/blur";
import { CALIDAD_FOTO } from "@/lib/calidad-foto";
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
  /**
   * Imagen 2 de la convención (ver
   * `docs/modus-operandi-imagenes-profesionales.md`). Solo la usa el hero de
   * la ficha: con esta prop puesta, la foto alterna con `src` cada 3s en un
   * crossfade continuo, y al pasar el mouse se queda mostrando esta hasta que
   * el cursor se va. Sin ella el componente es una sola foto fija, como
   * siempre.
   */
  hoverSrc?: string;
  /**
   * Qué parte de la foto queda a la vista (`object-position`). La caja es
   * vertical: una foto apaisada, o con la persona corrida, necesita decir por
   * dónde recortar o queda descentrada.
   */
  objectPosition?: string;
  /** Lo mismo para la foto 2, que suele tener otro encuadre. */
  hoverObjectPosition?: string;
};

/** Cada cuánto alterna, en el hero, entre la imagen 1 y la 2. */
const CICLO_MS = 3000;

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
    hoverSrc,
    objectPosition,
    hoverObjectPosition,
  },
  ref,
) {
  const activeSlug = useActiveProfessionalSlug();
  const named = isTransitionTarget || (!!vtSlug && vtSlug === activeSlug);
  const reduceMotion = useReducedMotion();

  // Sin segunda foto, o con el movimiento reducido, no hay nada que alternar:
  // se ve siempre la 1, quieta.
  const alterna = Boolean(hoverSrc) && !reduceMotion;
  const [mostrarHover, setMostrarHover] = useState(false);
  // El mouse encima gana: mientras dura, el loop no la vuelve a tapar.
  const hoverManual = useRef(false);
  // Cambia al salir del hover para rearmar el intervalo desde cero: si no, el
  // tick pendiente podía saltar apenas se iba el cursor.
  const [ciclo, setCiclo] = useState(0);

  useEffect(() => {
    if (!alterna) return;
    const id = setInterval(() => {
      if (!hoverManual.current) setMostrarHover((valor) => !valor);
    }, CICLO_MS);
    return () => clearInterval(id);
  }, [alterna, ciclo]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden bg-cream-100", className)}
      data-professional-photo={isTransitionTarget ? "" : undefined}
      style={named ? { viewTransitionName: PHOTO_VT_NAME } : undefined}
      onMouseEnter={
        alterna
          ? () => {
              hoverManual.current = true;
              setMostrarHover(true);
            }
          : undefined
      }
      onMouseLeave={
        alterna
          ? () => {
              hoverManual.current = false;
              setMostrarHover(false);
              // El ciclo vuelve a empezar acá, así la foto 1 se queda los 3
              // segundos completos antes del próximo cruce.
              setCiclo((n) => n + 1);
            }
          : undefined
      }
    >
      {/* Capa de abajo: siempre opaca, nunca se atenúa. Antes las dos se
          cruzaban a la vez y a mitad de camino ninguna tapaba del todo, así
          que se veía el fondo claro de la caja como un parpadeo. */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={CALIDAD_FOTO}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />

      {/* Capa de arriba: la única que anima. Solo se monta si de verdad
          alterna, para no pedir una imagen que nunca se llega a ver. */}
      {alterna && hoverSrc && (
        <Image
          aria-hidden
          alt=""
          src={hoverSrc}
          fill
          sizes={sizes}
          quality={CALIDAD_FOTO}
          // Se precarga junto con la primera: si llega tarde, el primer
          // cruce muestra un hueco en vez de la foto.
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-opacity duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          style={{
            opacity: mostrarHover ? 1 : 0,
            objectPosition: hoverObjectPosition ?? objectPosition,
          }}
        />
      )}
    </div>
  );
});
