"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { tourStops } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

/**
 * Recorrido guiado por el centro, en el orden real en que se camina.
 *
 * La columna izquierda es la planta: una línea vertical que representa el
 * pasillo, con cada parada colgando del lado que le corresponde —izquierda,
 * derecha, o sobre el eje— igual que en el plano de un lugar. Funciona además
 * como índice: se puede saltar a cualquier espacio.
 *
 * La derecha es el visor. Las fotos son verticales (salieron de un celular),
 * así que el marco es 3:4 y la foto entra completa, sin recortes.
 */
export function GuidedTour() {
  const reduceMotion = useReducedMotion() ?? false;
  const [stopIndex, setStopIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  // +1 avanzando, -1 retrocediendo: define de qué lado entra la foto nueva.
  const [dir, setDir] = useState(1);

  const stop = tourStops[stopIndex];
  const photo = stop.photos[photoIndex];

  /**
   * Avanza dentro del espacio actual y, al pasarse de la última foto, sigue
   * al espacio siguiente entrando por su primera. El recorrido es circular:
   * del último espacio se vuelve al ingreso.
   */
  const step = useCallback(
    (delta: number) => {
      setDir(delta);
      const next = photoIndex + delta;

      if (next >= 0 && next < tourStops[stopIndex].photos.length) {
        setPhotoIndex(next);
        return;
      }

      const nextStop =
        (stopIndex + delta + tourStops.length) % tourStops.length;
      setStopIndex(nextStop);
      // Al retroceder se entra por la última foto del espacio anterior.
      setPhotoIndex(delta > 0 ? 0 : tourStops[nextStop].photos.length - 1);
    },
    [stopIndex, photoIndex],
  );

  const goTo = (index: number) => {
    setDir(index > stopIndex ? 1 : -1);
    setStopIndex(index);
    setPhotoIndex(0);
  };

  return (
    <section className="relative overflow-hidden bg-surface-sage py-16 lg:py-20">
      <LeafSprig
        palette="beige"
        size="md"
        flip
        seed={11}
        className="-bottom-6 right-2 h-44 opacity-45"
      />
      <div className="container-auris relative">
        <SectionHeading
          eyebrow="Recorrido guiado"
          title="Caminá el centro antes de venir"
          description="Las fotos siguen el camino real: entrás por la puerta, pasás por recepción y desde el pasillo se abren los consultorios."
          className="mb-12"
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10">
          {/* Planta: el pasillo como eje y las paradas a los costados. */}
          <nav aria-label="Espacios del centro" className="relative">
            <ol className="relative space-y-1">
              {/* Línea del pasillo, por detrás de las paradas.
                  `left-2.75` la deja centrada bajo los puntos: el punto mide
                  24px y arranca pegado al borde, así que su eje cae en 12px, y
                  la línea mide 2px. */}
              <span
                aria-hidden
                className="absolute top-4 bottom-4 left-2.75 w-0.5 rounded-full bg-primary-300"
              />

              {tourStops.map((item, index) => {
                const active = index === stopIndex;

                return (
                  <li key={item.id} className="relative">
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "group flex w-full items-start gap-3 rounded-2xl py-2.5 pr-3 pl-0 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
                        active
                          ? "bg-primary-100/70"
                          : "hover:bg-primary-100/40",
                      )}
                    >
                      {/* Punto sobre la línea. El activo se llena y muestra el
                          pin. Sin margen izquierdo: su eje tiene que caer justo
                          sobre la línea del pasillo. */}
                      <span
                        aria-hidden
                        className={cn(
                          "relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-[background-color,border-color,translate] duration-300 ease-out",
                          active
                            ? "border-primary-700 bg-primary-700"
                            : "border-primary-300 bg-cream-50 group-hover:border-primary-500",
                        )}
                      >
                        {active && (
                          <MapPin
                            className="size-3.5 text-cream-50"
                            strokeWidth={2.4}
                          />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-sm leading-snug font-semibold transition-colors",
                            active ? "text-primary-900" : "text-ink-900/80",
                          )}
                        >
                          {item.name}
                        </span>
                        {/* La aclaración solo en el activo: con todas abiertas
                            la columna se vuelve un muro de texto. */}
                        {active && (
                          <span className="mt-1 block text-xs leading-relaxed text-ink-700/75">
                            {item.caption}
                          </span>
                        )}
                      </span>

                      {/* De qué lado del pasillo queda. */}
                      {item.side === "left" || item.side === "right" ? (
                        <span
                          className={cn(
                            "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase",
                            active
                              ? "bg-primary-700 text-cream-50"
                              : "bg-primary-200/70 text-primary-800",
                          )}
                        >
                          {item.side === "left" ? "Izq" : "Der"}
                        </span>
                      ) : null}
                    </button>

                    {/* Sub-paradas: una por foto del espacio abierto. Van fuera
                        del botón de arriba —un botón no puede contener otro— y
                        sangradas para que se lean como una rama del pasillo.
                        Solo aparecen si hay más de una foto que elegir. */}
                    {active && item.photos.length > 1 && (
                      <ol className="relative mt-0.5 mb-1 ml-8 space-y-0.5">
                        {/* Rama corta que cuelga del punto de la parada. */}
                        <span
                          aria-hidden
                          className="absolute top-0 bottom-3 -left-3.5 w-px rounded-full bg-primary-300"
                        />

                        {item.photos.map((sub, subIndex) => {
                          const current = subIndex === photoIndex;

                          return (
                            <li key={sub.src} className="relative">
                              {/* Tramo horizontal hasta el punto chico. */}
                              <span
                                aria-hidden
                                className="absolute top-1/2 -left-3.5 w-2.5 border-t border-primary-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setDir(subIndex > photoIndex ? 1 : -1);
                                  setPhotoIndex(subIndex);
                                }}
                                aria-current={current ? "true" : undefined}
                                className={cn(
                                  "group/sub flex w-full items-center gap-2.5 rounded-xl py-1 pr-2 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
                                  current
                                    ? "bg-primary-200/50"
                                    : "hover:bg-primary-100/50",
                                )}
                              >
                                <span
                                  aria-hidden
                                  className={cn(
                                    "size-2.5 shrink-0 rounded-full border transition-colors duration-300",
                                    current
                                      ? "border-primary-700 bg-primary-700"
                                      : "border-primary-400 bg-cream-50 group-hover/sub:border-primary-600",
                                  )}
                                />
                                <span
                                  className={cn(
                                    "line-clamp-1 text-xs transition-colors",
                                    current
                                      ? "font-medium text-primary-900"
                                      : "text-ink-700/70",
                                  )}
                                >
                                  {sub.alt}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Visor. */}
          <div>
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-3xl bg-ink-900 shadow-xl sm:aspect-4/3">
              <AnimatePresence initial={false} mode="popLayout" custom={dir}>
                <motion.div
                  key={`${stop.id}-${photoIndex}`}
                  custom={dir}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, x: dir * 48, scale: 1.02 }
                  }
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: dir * -48, position: "absolute" }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 92vw, 60vw"
                    // `contain`: las fotos son verticales y recortarlas a un
                    // marco apaisado se comía media habitación.
                    className="object-contain"
                    priority={stopIndex === 0 && photoIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Rótulo del espacio, sobre la foto. */}
              <div className="pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-ink-900/70 to-transparent p-5">
                <p className="text-xs font-semibold tracking-[0.16em] text-cream-50/80 uppercase">
                  Parada {stopIndex + 1} de {tourStops.length}
                </p>
                <p className="mt-1 font-serif text-xl text-cream-50">
                  {stop.name}
                </p>
              </div>

              {/* Flechas, al estilo de un visor de mapa. */}
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Foto anterior"
                className="group absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/45 text-cream-50 ring-1 ring-cream-50/25 backdrop-blur-md transition-[background-color,transform,translate] duration-300 ease-out hover:-translate-x-0.5 hover:-translate-y-1/2 hover:bg-ink-900/70 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Foto siguiente"
                className="group absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/45 text-cream-50 ring-1 ring-cream-50/25 backdrop-blur-md transition-[background-color,transform,translate] duration-300 ease-out hover:translate-x-0.5 hover:-translate-y-1/2 hover:bg-ink-900/70 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>

            {/* Tira de miniaturas del espacio actual. */}
            <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1">
              {stop.photos.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => {
                    setDir(index > photoIndex ? 1 : -1);
                    setPhotoIndex(index);
                  }}
                  aria-label={`Ver foto ${index + 1} de ${stop.name}`}
                  aria-current={index === photoIndex}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded-xl transition-[box-shadow,opacity,translate] duration-300 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none sm:size-20",
                    index === photoIndex
                      ? "opacity-100 ring-2 ring-primary-700"
                      : "opacity-65 hover:opacity-100",
                  )}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-ink-700/80">
              {stop.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
