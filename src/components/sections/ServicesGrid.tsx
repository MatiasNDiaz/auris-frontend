"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ShineButton } from "@/components/shared/ShineButton";
import { listedServices } from "@/lib/data/services";
import { cn } from "@/lib/utils";

/**
 * Cuántas tarjetas se ven antes de desplegar. Son dos filas de tres en
 * escritorio; en pantallas más chicas la grilla se acomoda sola, pero la
 * cantidad no cambia: el corte es siempre a la sexta tarjeta.
 */
const VISIBLES = 6;

const GRILLA = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

type ServicesGridProps = {
  /** En la Home mostramos el encabezado y el CTA; en /servicios no hacen falta. */
  withHeading?: boolean;
};

export function ServicesGrid({ withHeading = true }: ServicesGridProps) {
  // Solo la Home recorta: /servicios es el listado completo y ahí esconder
  // servicios detrás de un botón no tiene sentido.
  const recorta = withHeading;

  const [abierto, setAbierto] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const primeras = recorta ? listedServices.slice(0, VISIBLES) : listedServices;
  const resto = recorta ? listedServices.slice(VISIBLES) : [];

  return (
    <section className="relative overflow-hidden bg-surface-sage py-20 lg:py-28">
      <LeafScatter pattern="b" />
      <LeafSprig
        palette="beige"
        size="lg"
        flip
        seed={5}
        className="bottom-0 right-2 h-60 opacity-60 lg:h-76"
      />
      <div className="container-auris relative">
        {withHeading && (
          <SectionHeading
            eyebrow="Nuestros servicios"
            title="Ocho especialidades, un mismo enfoque"
            description="Brindamos una atención integral en diferentes áreas para acompañarte en cada etapa de tu bienestar."
            className="mb-14"
          />
        )}

        <ul className={GRILLA}>
          {primeras.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={(index % 3) * 0.1}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </ul>

        {recorta && (
          <>
            <AnimatePresence initial={false}>
              {abierto && (
                <motion.div
                  key="resto"
                  initial={
                    reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { height: "auto", opacity: 1 }
                  }
                  exit={
                    reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  transition={{
                    duration: reduceMotion ? 0.15 : 0.5,
                    ease: [0.32, 0.08, 0.24, 1],
                  }}
                  className="overflow-hidden"
                >
                  {/* Sin `Reveal` acá: el revelado por scroll observa los nodos
                      que existen al cargar la página, y estos aparecen recién
                      al desplegar, así que se quedarían invisibles. La entrada
                      la da el propio despliegue. */}
                  <ul className={cn(GRILLA, "pt-6")}>
                    {resto.map((service) => (
                      <li key={service.slug}>
                        <ServiceCard service={service} />
                      </li>
                    ))}

                    <li>
                      <ConsultaCard />
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 flex justify-center">
              <ShineButton
                onClick={() => setAbierto((valor) => !valor)}
                tone="outlinePrimary"
                effect="ring"
                aria-expanded={abierto}
              >
                {abierto ? "Ver menos" : "Ver más servicios"}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-4 transition-transform duration-300",
                    abierto && "rotate-180",
                  )}
                />
              </ShineButton>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/** La tarjeta de cierre, para quien no sabe a qué especialidad ir. */
function ConsultaCard() {
  return (
    <div className="flex h-full flex-col justify-center rounded-3xl bg-primary-600 p-8 text-center">
      <p className="font-serif text-2xl text-balance text-cream-50">
        ¿No sabés por dónde empezar?
      </p>
      <p className="mt-3 text-sm leading-relaxed text-primary-100">
        Escribinos y te orientamos hacia la especialidad adecuada.
      </p>
      <ShineButton
        href="/contacto"
        tone="light"
        effect="halo"
        className="mx-auto mt-6 w-fit"
      >
        Hacer una consulta
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </ShineButton>
    </div>
  );
}
