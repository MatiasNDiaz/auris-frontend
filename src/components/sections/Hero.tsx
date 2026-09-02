"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ServiceFan } from "./ServiceFan";
import { ShineButton } from "@/components/shared/ShineButton";
import { WaveDivider } from "@/components/shared/WaveDivider";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { siteConfig } from "@/config/site";
import { services } from "@/lib/data/services";

const AUTOPLAY_MS = 4000;

/**
 * Escalonado de la entrada, replicando el `staggerChildren` que antes hacía
 * Framer: 0.1s de arranque y 0.11s entre elementos. Se aplica como
 * `--rise-delay` sobre la clase `auris-rise` de `globals.css`.
 */
const RISE_DELAY = { eyebrow: "0.1s", cta: "0.21s", highlights: "0.32s" };

const highlights = [
  { icon: HeartHandshake, label: "Atención humana y personalizada" },
  { icon: ShieldCheck, label: "Equipo matriculado y con experiencia" },
  { icon: Sparkles, label: "Seis especialidades en un mismo lugar" },
];

/**
 * Hero por capas: la foto del servicio activo ocupa toda la sección, un
 * degradé oscuro sostiene la legibilidad del texto y el abanico de cards de
 * abajo a la derecha es el que decide qué foto se ve.
 */
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const step = useCallback((delta: number) => {
    setActive(
      (current) => (current + delta + services.length) % services.length,
    );
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => step(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, step]);

  return (
    <section
      className="relative isolate flex min-h-184 flex-col overflow-hidden lg:min-h-172"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* Capa 1 — fondo full-bleed con crossfade entre servicios. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-ink-900">
        {services.map((service, index) => (
          <motion.div
            key={service.slug}
            initial={false}
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={service.imageUrl}
              alt=""
              fill
              // El hero es full-bleed pero por encima de 1600px la foto ya no gana
              // detalle: se acota para no bajar el 1920 en pantallas grandes.
              sizes="(max-width: 1600px) 100vw, 1600px"
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Capa 2 — degradés neutros: el tinte verde ensuciaba el color de las
          fotos, así que el oscurecido va en negro y no altera los tonos. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-black/42 via-black/18 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/32 via-transparent to-black/12"
      />


      <div className="container-auris relative flex flex-1 flex-col justify-center gap-12 pt-16 pb-28 lg:gap-0 lg:pt-20 lg:pb-36">
        {/* Capa 3 — contenido, en claro sobre el overlay. */}
        <div className="max-w-2xl">
          <p
            style={{ "--rise-delay": RISE_DELAY.eyebrow } as CSSProperties}
            className="auris-rise inline-flex items-center gap-2 rounded-full border border-cream-50/35 bg-cream-50/10 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-cream-50 uppercase backdrop-blur-sm"
          >
            <Leaf className="size-3.5" strokeWidth={2} aria-hidden />
            Bienvenidos a {siteConfig.name}
          </p>

          {/* Titular y bajada del servicio activo. Se remontan con `key`, así
              cada cambio entra desde abajo en vez de reemplazarse de golpe. */}
          {/* Sin `mode="wait"`: esperar la salida del titular anterior lo dejaba
              un paso atrás del fondo. Entrada y salida corren a la vez, y el
              texto saliente va en absolute para no empujar el layout. */}
          <div className="relative mt-5 min-h-52 sm:min-h-56 lg:min-h-58">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: -18, position: "absolute" }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="inset-x-0 top-0"
              >
                <p className="text-sm font-semibold tracking-[0.2em] text-primary-200 uppercase">
                  {services[active].name}
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-[1.08] text-balance text-cream-50 sm:text-5xl lg:text-6xl">
                  {services[active].heroTitle}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-cream-100/90">
                  {services[active].heroSubtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            style={{ "--rise-delay": RISE_DELAY.cta } as CSSProperties}
            className="auris-rise mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ShineButton href="/servicios" tone="primary" effect="shine">
              Conocé nuestros servicios
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </ShineButton>
            <WhatsAppButton label="Contactanos por WhatsApp" variant="onDark" />
          </div>

          {/* Acotado a max-w-xl para no quedar debajo del abanico en desktop. */}
          <ul
            style={{ "--rise-delay": RISE_DELAY.highlights } as CSSProperties}
            className="auris-rise mt-8 grid max-w-xl gap-3 sm:grid-cols-3"
          >
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-2.5 text-sm text-cream-100/85"
              >
                <span
                  aria-hidden
                  className="mt-px inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-cream-50/15 text-primary-200"
                >
                  <Icon className="size-3.5" strokeWidth={1.9} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Capa 4 — abanico de servicios. */}
        <div
          style={
            {
              "--rise-delay": "0.5s",
              "--rise-duration": "0.8s",
              "--rise-y": "30px",
            } as CSSProperties
          }
          // Por encima del alto de la onda, para que la curva no le muerda el
          // pie a las cards.
          className="auris-rise lg:absolute lg:right-12 lg:bottom-28"
        >
          <ServiceFan
            active={active}
            onSelect={setActive}
            onStep={step}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>

      {/*
        Cierre curvo del hero: el color es el de la sección que sigue.

        Una sola capa a propósito. Se probó un apilado de tres ondas y no
        funciona: el relieve entre capas solo se percibe si hay diferencia de
        valor, y en tonos neutros esa diferencia no existe, así que las curvas
        se empastan en una sola mancha. Con color sí se leen, pero el pie del
        hero termina pesando más que el titular.
      */}
      <WaveDivider
        variant="hero"
        className="text-surface-base"
        underlineClassName="text-surface-sand"
      />
    </section>
  );
}
