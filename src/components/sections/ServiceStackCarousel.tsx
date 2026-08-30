"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BLUR_DATA_URL } from "@/lib/blur";
import { services } from "@/lib/data/services";
import { renderServiceIcon } from "@/lib/icons";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4500;
const COUNT = services.length;

type Slot = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotate: number;
};

/**
 * Posición de cada card según su distancia al servicio activo.
 * El índice 0 es la protagonista; 1–3 forman el stack en profundidad; el resto
 * se va hacia la izquierda, que es por donde sale la card que deja de estar
 * activa (su distancia pasa de 0 a COUNT-1).
 */
const desktopSlots: Slot[] = [
  { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 40, rotate: 0 },
  { x: 44, y: 20, scale: 0.94, opacity: 1, zIndex: 30, rotate: 2 },
  { x: 80, y: 38, scale: 0.88, opacity: 0.8, zIndex: 20, rotate: 3.5 },
  { x: 110, y: 54, scale: 0.83, opacity: 0.45, zIndex: 10, rotate: 5 },
];
const desktopExit: Slot = {
  x: -200,
  y: -16,
  scale: 0.78,
  opacity: 0,
  zIndex: 0,
  rotate: -7,
};

/** En pantallas chicas el stack profundo no se lee: queda casi plano. */
const mobileSlots: Slot[] = [
  { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 40, rotate: 0 },
  { x: 14, y: 12, scale: 0.96, opacity: 0.7, zIndex: 30, rotate: 0 },
  { x: 26, y: 22, scale: 0.92, opacity: 0.35, zIndex: 20, rotate: 0 },
];
const mobileExit: Slot = {
  x: -70,
  y: 0,
  scale: 0.94,
  opacity: 0,
  zIndex: 0,
  rotate: 0,
};

const staticSlot: Slot = { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 40, rotate: 0 };
const staticHidden: Slot = { x: 0, y: 0, scale: 1, opacity: 0, zIndex: 0, rotate: 0 };

export function ServiceStackCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useReducedMotion();

  const go = useCallback((step: number) => {
    setActive((current) => (current + step + COUNT) % COUNT);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [go, paused, reduceMotion]);

  const slots = isMobile ? mobileSlots : desktopSlots;
  const exitSlot = isMobile ? mobileExit : desktopExit;

  const slotFor = (distance: number): Slot => {
    if (reduceMotion) return distance === 0 ? staticSlot : staticHidden;
    return slots[distance] ?? exitSlot;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* Halo verde detrás del stack. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-primary-100/60 blur-2xl"
      />

      <div className="relative mx-auto h-100 w-full max-w-76 sm:h-108 sm:max-w-sm">
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
                scale: slot.scale,
                opacity: slot.opacity,
                rotate: slot.rotate,
              }}
              style={{ zIndex: slot.zIndex }}
              transition={
                reduceMotion
                  ? { duration: 0.2 }
                  : { type: "spring", stiffness: 190, damping: 26, mass: 0.9 }
              }
              aria-hidden={!isFront}
              className={cn(
                "absolute inset-0 overflow-hidden rounded-[2rem] border border-primary-100 bg-card shadow-xl",
                !isFront && "pointer-events-none",
              )}
            >
              <div className="relative h-60 w-full sm:h-64">
                <Image
                  src={service.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 80vw, 384px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  priority={index === 0}
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-primary-900/55 via-primary-900/5 to-transparent"
                />
                <span
                  aria-hidden
                  className="absolute bottom-4 left-5 inline-flex size-12 items-center justify-center rounded-2xl bg-cream-50 text-primary-700 shadow-md"
                >
                  {renderServiceIcon(service.icon, {
                    className: "size-6",
                    strokeWidth: 1.5,
                  })}
                </span>
              </div>

              <div className="flex flex-col p-6">
                <h3 className="font-serif text-2xl leading-snug text-balance text-ink-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700/75">
                  {service.tagline}
                </p>

                <Link
                  href={`/servicios/${service.slug}`}
                  tabIndex={isFront ? undefined : -1}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none after:absolute after:inset-0"
                >
                  Ver servicio
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="relative mt-7 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Servicio anterior"
          className="inline-flex size-10 items-center justify-center rounded-full border border-primary-200 bg-cream-50 text-primary-700 transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <div className="flex items-center gap-2">
          {services.map((service, index) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver ${service.name}`}
              aria-current={index === active}
              className={cn(
                "h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                index === active
                  ? "w-7 bg-primary-600"
                  : "w-2 bg-primary-200 hover:bg-primary-300",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Servicio siguiente"
          className="inline-flex size-10 items-center justify-center rounded-full border border-primary-200 bg-cream-50 text-primary-700 transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      {/* Anuncia el cambio de servicio a lectores de pantalla. */}
      <p className="sr-only" aria-live="polite">
        {services[active].name}
      </p>
    </div>
  );
}
