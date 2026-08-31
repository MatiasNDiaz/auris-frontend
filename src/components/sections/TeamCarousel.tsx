"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatedProfessionalImage } from "@/components/shared/AnimatedProfessionalImage";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { CAROUSEL_LIMIT, professionals } from "@/lib/data/professionals";
import { getServiceBySlug } from "@/lib/data/services";
import { useMediaQuery } from "@/lib/use-media-query";
import { useViewTransitionRouter } from "@/components/providers/ViewTransitionProvider";
import { cn } from "@/lib/utils";

/** El acordeón es una muestra: el listado completo vive en /profesionales. */
const featured = professionals.slice(0, CAROUSEL_LIMIT);

/**
 * Acordeón de paneles verticales.
 *
 * En desktop los paneles reparten el ancho por `flexGrow`: el que recibe hover
 * o foco crece y el resto se comprime, todos animados a la vez. En mobile no
 * hay hover, así que la misma fila pasa a ser un carousel con scroll-snap y
 * cada panel ya viene expandido.
 */
export function TeamCarousel() {
  // Se consulta por mobile y no por desktop a propósito: el snapshot del
  // servidor es `false`, así que el estado por defecto queda "colapsado".
  // Con la consulta invertida, en el primer pintado `!isDesktop` era true y
  // los doce paneles aparecían expandidos y superpuestos por un instante.
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useViewTransitionRouter();
  // Un ref por panel, para poder marcar la foto del que se clickea.
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    // El id es el destino del enlace "Volver" desde la ficha de un profesional.
    <section
      id="equipo"
      className="relative overflow-hidden bg-surface-sand py-20 lg:py-28"
    >
      <LeafScatter pattern="c" palette="beige" />
      <LeafSprig palette="beige" size="lg" className="-bottom-8 left-2 h-56 opacity-60 lg:h-72" />
      <div className="container-auris relative">
        <SectionHeading
          eyebrow="Nuestro equipo"
          title="Profesionales que te acompañan"
          description="Pasá el mouse por cada panel para conocer a quien te acompaña; en celular, deslizá para verlos."
        />
      </div>

      <ul className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:px-8 md:overflow-x-visible md:px-12 [&::-webkit-scrollbar]:hidden">
        {featured.map((professional) => {
          const service = getServiceBySlug(professional.serviceSlug);
          // En mobile todos van expandidos; en desktop, solo el activo.
          const isOpen = isMobile || expanded === professional.slug;

          return (
            <motion.li
              key={professional.slug}
              animate={isMobile ? undefined : { flexGrow: isOpen ? 4.2 : 1 }}
              // Respuesta al click: el panel se hunde apenas antes de navegar.
              whileTap={reduceMotion ? undefined : { scale: 0.975 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 210, damping: 30, mass: 0.8 }
              }
              onMouseEnter={() => setExpanded(professional.slug)}
              onMouseLeave={() => setExpanded(null)}
              onFocusCapture={() => setExpanded(professional.slug)}
              onBlurCapture={() => setExpanded(null)}
              // El panel entero navega, no solo el nombre.
              onClick={(event) => {
                if (event.defaultPrevented) return;
                navigate(
                  `/profesionales/${professional.slug}`,
                  photoRefs.current[professional.slug],
                );
              }}
              className={cn(
                "group relative h-104 w-64 shrink-0 cursor-pointer snap-start overflow-hidden rounded-3xl shadow-md",
                "md:h-112 md:w-0 md:min-w-0 md:shrink md:basis-0",
              )}
            >
              <AnimatedProfessionalImage
                ref={(node) => {
                  photoRefs.current[professional.slug] = node;
                }}
                vtSlug={professional.slug}
                src={professional.photoUrl}
                alt={`Retrato de ${professional.name}`}
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

              {/* Estado colapsado: el nombre en vertical, que es lo único que
                  entra en un panel angosto. */}
              <motion.span
                aria-hidden
                initial={false}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 [writing-mode:vertical-rl] font-serif text-base whitespace-nowrap text-cream-50 md:block"
                style={{ rotate: "180deg" }}
              >
                {professional.name}
              </motion.span>

              {/* Estado expandido. */}
              <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 12 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  delay: isOpen ? 0.1 : 0,
                }}
                className={cn(
                  "absolute inset-x-0 bottom-0 p-6",
                  !isOpen && "pointer-events-none",
                )}
              >
                {service && (
                  <p className="text-xs font-semibold tracking-[0.14em] text-primary-200 uppercase">
                    {service.name}
                  </p>
                )}
                <h3 className="mt-2 font-serif text-2xl leading-tight text-balance text-cream-50">
                  {/* El <a> sostiene accesibilidad y abrir-en-pestaña; el click
                      normal lo intercepta el panel para animar la transición. */}
                  <Link
                    href={`/profesionales/${professional.slug}`}
                    tabIndex={isOpen ? undefined : -1}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.button !== 0)
                        return;
                      event.preventDefault();
                      navigate(
                        `/profesionales/${professional.slug}`,
                        photoRefs.current[professional.slug],
                      );
                    }}
                    className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
                  >
                    {professional.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-cream-100/85">
                  {professional.specialty}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cream-50/95 px-4 py-2 text-sm font-semibold text-primary-800 transition-colors group-hover:bg-cream-50">
                  Ver perfil
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>

      <div className="container-auris mt-10 flex justify-center">
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-primary-700 hover:bg-primary-100"
        >
          <Link href="/profesionales">
            Ver todo el equipo
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
