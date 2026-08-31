"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import { services } from "@/lib/data/services";
import { renderServiceIcon } from "@/lib/icons";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const COUNT = services.length;

type Slot = {
  x: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

/**
 * Posición de cada card según su distancia al servicio activo.
 *
 * Los índices 0–3 forman el abanico visible: la del frente y tres asomando
 * detrás con desfasaje y rotación crecientes. La card que deja de estar activa
 * pasa a distancia COUNT-1 y sale por la izquierda; las intermedias esperan
 * fuera de cuadro a la derecha, ya invisibles, para volver a entrar al abanico.
 */
const desktopFan: Slot[] = [
  { x: 0, rotate: -5, scale: 1, opacity: 1, zIndex: 40 },
  { x: 124, rotate: 1, scale: 0.96, opacity: 1, zIndex: 30 },
  { x: 248, rotate: 6, scale: 0.92, opacity: 0.95, zIndex: 20 },
  { x: 372, rotate: 11, scale: 0.88, opacity: 0.7, zIndex: 10 },
];
const desktopHidden: Slot = {
  x: 480,
  rotate: 15,
  scale: 0.85,
  opacity: 0,
  zIndex: 0,
};
const desktopExit: Slot = {
  x: -240,
  rotate: -18,
  scale: 0.8,
  opacity: 0,
  zIndex: 0,
};

/** En mobile el abanico se acorta a tres cards para que siga siendo legible. */
const mobileFan: Slot[] = [
  { x: 0, rotate: -4, scale: 1, opacity: 1, zIndex: 40 },
  { x: 82, rotate: 2, scale: 0.95, opacity: 1, zIndex: 30 },
  { x: 156, rotate: 8, scale: 0.9, opacity: 0.7, zIndex: 20 },
];
const mobileHidden: Slot = {
  x: 214,
  rotate: 11,
  scale: 0.88,
  opacity: 0,
  zIndex: 0,
};
const mobileExit: Slot = {
  x: -150,
  rotate: -14,
  scale: 0.85,
  opacity: 0,
  zIndex: 0,
};

type ServiceFanProps = {
  active: number;
  onSelect: (index: number) => void;
  onStep: (step: number) => void;
  className?: string;
  /** Con motion reducida el abanico queda quieto y sin transiciones. */
  reduceMotion: boolean;
};

export function ServiceFan({
  active,
  onSelect,
  onStep,
  className,
  reduceMotion,
}: ServiceFanProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  const fan = isMobile ? mobileFan : desktopFan;
  const hidden = isMobile ? mobileHidden : desktopHidden;
  const exit = isMobile ? mobileExit : desktopExit;

  const slotFor = (distance: number): Slot => {
    if (distance < fan.length) return fan[distance];
    return distance === COUNT - 1 ? exit : hidden;
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* El ancho fija el abanico completo; lo que se va fuera lo recorta el hero. */}
      <div className="relative h-40 w-69 sm:h-46 md:h-50 md:w-131">
        {services.map((service, index) => {
          const distance = (index - active + COUNT) % COUNT;
          const slot = slotFor(distance);
          const isFront = distance === 0;

          return (
            <motion.article
              key={service.slug}
              animate={{
                x: slot.x,
                rotate: slot.rotate,
                scale: slot.scale,
                opacity: slot.opacity,
              }}
              style={{ zIndex: slot.zIndex }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : // Rígido a propósito: la card tiene que asentarse bastante
                    // antes del siguiente cambio del autoplay.
                    { type: "spring", stiffness: 280, damping: 32, mass: 0.7 }
              }
              aria-hidden={!isFront}
              className={cn(
                "absolute top-0 left-0 h-40 w-30 overflow-hidden rounded-2xl border border-cream-50/25 shadow-xl sm:h-46 md:h-50 md:w-38",
                !isFront && "pointer-events-none",
              )}
            >
              <Image
                src={service.imageUrl}
                alt=""
                fill
                sizes="160px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/5"
              />

              <span
                aria-hidden
                className="absolute top-3 left-3 inline-flex size-8 items-center justify-center rounded-lg bg-cream-50/95 text-primary-700"
              >
                {renderServiceIcon(service.icon, {
                  className: "size-4",
                  strokeWidth: 1.8,
                })}
              </span>

              {/* El nombre se muestra solo en la card del frente: en las de
                  atrás lo taparía la card siguiente y se leería cortado. */}
              <Link
                href={`/servicios/${service.slug}`}
                tabIndex={isFront ? undefined : -1}
                className="absolute inset-x-0 bottom-0 p-4 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
              >
                <motion.span
                  animate={{ opacity: isFront ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  className="block font-serif text-base leading-tight text-balance text-cream-50 md:text-lg"
                >
                  {service.name}
                </motion.span>
              </Link>
            </motion.article>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Servicio anterior"
          className="inline-flex size-10 items-center justify-center rounded-full border border-cream-50/35 text-cream-50 transition-colors hover:bg-cream-50/15 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Servicio siguiente"
          className="inline-flex size-10 items-center justify-center rounded-full border border-cream-50/35 text-cream-50 transition-colors hover:bg-cream-50/15 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>

        <p className="ml-1 font-serif text-lg text-cream-50 tabular-nums">
          <span className="sr-only">Servicio </span>
          {active + 1}
          <span className="text-cream-50/55"> / {COUNT}</span>
        </p>

        {/* Selección directa, además de las flechas. */}
        <div className="ml-auto flex items-center gap-1.5">
          {services.map((service, index) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Ver ${service.name}`}
              aria-current={index === active}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none",
                index === active
                  ? "w-6 bg-cream-50"
                  : "w-1.5 bg-cream-50/45 hover:bg-cream-50/75",
              )}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {services[active].name}
      </p>
    </div>
  );
}
