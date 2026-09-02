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
  /** Altura respecto del tope de la caja. Es la que curva la fila. */
  y: number;
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
  { x: 0, y: 10, rotate: -12, scale: 1, opacity: 1, zIndex: 40 },
  { x: 124, y: -24, rotate: -4, scale: 0.96, opacity: 1, zIndex: 30 },
  { x: 248, y: -18, rotate: 6, scale: 0.92, opacity: 0.95, zIndex: 20 },
  { x: 372, y: 16, rotate: 15, scale: 0.88, opacity: 0.7, zIndex: 10 },
];
const desktopHidden: Slot = {
  x: 480,
  y: 30,
  rotate: 19,
  scale: 0.85,
  opacity: 0,
  zIndex: 0,
};
const desktopExit: Slot = {
  x: -240,
  y: 34,
  rotate: -22,
  scale: 0.8,
  opacity: 0,
  zIndex: 0,
};

/** En mobile el abanico se acorta a tres cards para que siga siendo legible. */
const mobileFan: Slot[] = [
  { x: 0, y: 12, rotate: -9, scale: 1, opacity: 1, zIndex: 40 },
  { x: 82, y: -18, rotate: 0, scale: 0.95, opacity: 1, zIndex: 30 },
  { x: 156, y: 16, rotate: 10, scale: 0.9, opacity: 0.7, zIndex: 20 },
];
const mobileHidden: Slot = {
  x: 214,
  y: 24,
  rotate: 14,
  scale: 0.86,
  opacity: 0,
  zIndex: 0,
};
const mobileExit: Slot = {
  x: -150,
  y: 26,
  rotate: -16,
  scale: 0.82,
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
    <div className={cn("flex flex-col gap-2", className)}>
      {/* El ancho fija el abanico completo; lo que se va fuera lo recorta el hero. */}
      <div className="relative mt-6 h-44 w-69 sm:h-50 md:h-54 md:w-131">
        {services.map((service, index) => {
          const distance = (index - active + COUNT) % COUNT;
          const slot = slotFor(distance);
          const isFront = distance === 0;

          return (
            <motion.article
              key={service.slug}
              animate={{
                x: slot.x,
                y: slot.y,
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

      {/* Los controles van centrados bajo el abanico: pegados a la izquierda
          quedaban colgando del borde de la primera card, lejos del grupo de
          fotos que gobiernan. El contador entre las flechas y los puntos
          debajo, para que el bloque lea como una sola unidad centrada. */}
      {/* Mismo ancho que la caja de las cards: centrado sobre el contenedor
          quedaba unos cuarenta píxeles corrido del grupo de fotos, que ocupa
          solo una parte de ese ancho. */}
      <div className="flex w-69 flex-col items-center gap-3.5 md:w-131">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Servicio anterior"
            className="inline-flex size-10 items-center justify-center rounded-full border border-cream-50/35 bg-ink-900/25 text-cream-50 backdrop-blur-sm transition-colors hover:bg-cream-50/20 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>

          <p className="min-w-14 text-center font-serif text-lg text-cream-50 tabular-nums">
            <span className="sr-only">Servicio </span>
            {active + 1}
            <span className="text-cream-50/55"> / {COUNT}</span>
          </p>

          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Servicio siguiente"
            className="inline-flex size-10 items-center justify-center rounded-full border border-cream-50/35 bg-ink-900/25 text-cream-50 backdrop-blur-sm transition-colors hover:bg-cream-50/20 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>

        {/* Selección directa, además de las flechas. */}
        <div className="flex items-center gap-1.5">
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
