"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { MARK } from "@/components/shared/Logo";
import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/lib/use-media-query";

const MARK_WIDTH = 46;
const EASE = [0.19, 0.66, 0.29, 1] as const;

/**
 * Dos estados del lockup.
 *
 * `large` es el reposo: solo el isotipo, agrandado y corrido a la derecha.
 * `compact` es el estado con el cursor encima: el isotipo se achica
 * desplazándose a la izquierda mientras el texto entra desde la izquierda.
 */
const states = {
  large: { mark: { scale: 1.85, x: 16 }, text: { opacity: 0, x: -22 } },
  compact: { mark: { scale: 1, x: 0 }, text: { opacity: 1, x: 0 } },
} as const;

type AnimatedNavLogoProps = {
  /** El puntero está sobre la navbar. */
  hovered: boolean;
};

export function AnimatedNavLogo({ hovered }: AnimatedNavLogoProps) {
  const reduceMotion = useReducedMotion() ?? false;
  // En pantallas táctiles no hay hover: el logo se queda en el estado
  // compacto, que es el único donde el nombre es legible.
  const canHover = useMediaQuery("(hover: hover)");

  const mark = (
    <Image
      src={MARK.src}
      alt=""
      width={MARK.width}
      height={MARK.height}
      priority
      unoptimized
      className="h-auto"
      style={{ width: MARK_WIDTH }}
    />
  );

  const text = (
    <>
      <span className="font-serif text-2xl tracking-tight text-primary-800">
        {siteConfig.name}
      </span>
      <span className="mt-1 text-[0.65rem] tracking-[0.14em] whitespace-nowrap text-primary-600 uppercase">
        {siteConfig.tagline}
      </span>
    </>
  );

  if (reduceMotion || !canHover) {
    return (
      <span className="flex items-center gap-2.5">
        <span className="block shrink-0">{mark}</span>
        <span className="flex flex-col leading-none">{text}</span>
      </span>
    );
  }

  const state = hovered ? states.compact : states.large;
  const transition = { duration: 0.42, ease: EASE };

  return (
    <span className="flex items-center gap-2.5">
      <motion.span
        animate={state.mark}
        initial={false}
        transition={transition}
        // Origen a la izquierda: el isotipo crece hacia adentro de la navbar
        // y no se sale por el borde de la página.
        className="block shrink-0 origin-left"
      >
        {mark}
      </motion.span>

      <motion.span
        animate={state.text}
        initial={false}
        transition={transition}
        className="flex flex-col leading-none"
      >
        {text}
      </motion.span>
    </span>
  );
}
