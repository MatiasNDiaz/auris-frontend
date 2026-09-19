"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AnimatedProfessionalImage } from "@/components/shared/AnimatedProfessionalImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { recepcionistas } from "@/lib/data/recepcionistas";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * El equipo de recepción, con los mismos paneles que el acordeón del equipo:
 * en escritorio reparten el ancho por `flexGrow` y el que recibe el cursor
 * crece; en mobile, donde no hay hover, van todos expandidos y la fila se
 * desliza.
 *
 * Dos diferencias con `TeamCarousel`, las dos porque no tienen ficha propia:
 * el panel no navega a ningún lado, y por eso tampoco hay `vtSlug` ni refs de
 * foto —eso existe para el morph de la imagen al entrar a una ficha—. A
 * cambio, la foto sí cruza a la segunda al pasar el cursor, que acá es todo lo
 * que el panel tiene para dar.
 */
export function ReceptionTeam() {
  // Igual que en el acordeón del equipo: se consulta por mobile y no por
  // desktop porque el snapshot del servidor es `false`, así que el estado por
  // defecto queda "colapsado" y no aparecen los tres expandidos de golpe.
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState<string | null>(null);

  if (recepcionistas.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-surface-base py-20 lg:py-24">
      <div className="container-auris relative">
        <SectionHeading
          eyebrow="Recepción"
          title="Recepcionistas"
          description="Las primeras caras que ves en AURIS: las que te reciben, te dan el turno y te acompañan hasta el consultorio."
        />
      </div>

      <ul className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:px-8 md:overflow-x-visible md:px-12 [&::-webkit-scrollbar]:hidden">
        {recepcionistas.map((persona) => {
          const isOpen = isMobile || expanded === persona.slug;

          return (
            <motion.li
              key={persona.slug}
              animate={isMobile ? undefined : { flexGrow: isOpen ? 2.4 : 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 210, damping: 30, mass: 0.8 }
              }
              onMouseEnter={() => setExpanded(persona.slug)}
              onMouseLeave={() => setExpanded(null)}
              onFocusCapture={() => setExpanded(persona.slug)}
              onBlurCapture={() => setExpanded(null)}
              tabIndex={0}
              className={cn(
                "group relative h-104 w-64 shrink-0 snap-start overflow-hidden rounded-3xl shadow-md focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                // `md:grow` le da ancho desde el primer fotograma; Framer anima
                // 1 ↔ 2.4 por encima. Son tres paneles y no doce, así que el
                // que se expande no necesita crecer tanto para destacarse.
                "md:h-112 md:w-0 md:min-w-0 md:shrink md:grow md:basis-0",
              )}
            >
              <AnimatedProfessionalImage
                src={persona.photoUrl}
                hoverSrc={persona.photoHoverUrl}
                objectPosition={persona.fotoFoco}
                hoverObjectPosition={persona.fotoHoverFoco}
                alt={`Retrato de ${persona.name}`}
                sizes="(max-width: 768px) 16rem, 420px"
                className="absolute inset-0 size-full rounded-3xl"
              />

              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 transition-opacity duration-500",
                  isOpen
                    ? "bg-linear-to-t from-ink-900/90 via-ink-900/25 to-transparent"
                    : "bg-linear-to-t from-ink-900/75 to-ink-900/15",
                )}
              />

              {/* Colapsado: el nombre en vertical, que es lo único que entra
                  en un panel angosto. */}
              <motion.span
                aria-hidden
                initial={false}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 [writing-mode:vertical-rl] font-serif text-base whitespace-nowrap text-cream-50 md:block"
                style={{ rotate: "180deg" }}
              >
                {persona.name}
              </motion.span>

              <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 12 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  delay: isOpen ? 0.1 : 0,
                }}
                className="absolute inset-x-0 bottom-0 p-6"
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-primary-200 uppercase">
                  Recepción
                </p>
                <h3 className="mt-2 font-serif text-2xl leading-tight text-balance text-cream-50">
                  {persona.name}
                </h3>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
