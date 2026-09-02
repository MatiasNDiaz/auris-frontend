"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ServiceFan } from "./ServiceFan";
import { ShineButton } from "@/components/shared/ShineButton";
import { WaveDivider } from "@/components/shared/WaveDivider";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { siteConfig } from "@/config/site";
import { services } from "@/lib/data/services";
import { renderServiceIcon } from "@/lib/icons";

const AUTOPLAY_MS = 4000;

/**
 * Escalonado de la entrada, replicando el `staggerChildren` que antes hacía
 * Framer: 0.1s de arranque y 0.11s entre elementos. Se aplica como
 * `--rise-delay` sobre la clase `auris-rise` de `globals.css`.
 */
const RISE_DELAY = { eyebrow: "0.1s", cta: "0.21s" };

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
          <div className="relative mt-7 min-h-56 sm:min-h-60 lg:min-h-64">
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
                {/* El nombre del servicio. Antes iba en verde claro suelto
                    sobre la foto y contra un consultorio blanco desaparecía;
                    en pastilla llena gana fondo propio y queda una jerarquía
                    clara con el saludo de arriba, que va en contorno.

                    El relleno es un degradé y no un plano: en plano la
                    pastilla se leía como una etiqueta pegada. El degradé de
                    claro a oscuro, el filete de luz de un píxel en el borde
                    superior y el aro interior le dan el volumen que le
                    faltaba. El ícono del servicio, en disco crema, la ancla
                    a lo que está mostrando el carrusel. */}
                <p className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-linear-to-b from-primary-500 to-primary-700 py-1.5 pr-4 pl-1.5 text-xs font-semibold tracking-[0.16em] text-cream-50 uppercase shadow-lg shadow-primary-900/35 ring-1 ring-cream-50/30 ring-inset">
                  <span
                    aria-hidden
                    // Se apaga hacia las puntas: a lo ancho completo se leía
                    // como una línea dibujada y no como un reflejo.
                    className="absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-cream-50/55 to-transparent"
                  />
                  <span
                    aria-hidden
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cream-50 text-primary-700 shadow-sm shadow-primary-900/25"
                  >
                    {renderServiceIcon(services[active].icon, {
                      className: "size-3.5",
                      strokeWidth: 2,
                    })}
                  </span>
                  {services[active].name}
                </p>
                {/* La sombra de texto sostiene la lectura sobre las zonas
                    claras de la foto sin tener que oscurecer el overlay, que
                    apagaría la imagen entera. */}
                <h1 className="mt-5 font-serif text-4xl leading-[1.08] text-balance text-cream-50 [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
                  {services[active].heroTitle}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-cream-50/95 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
                  {services[active].heroSubtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            style={{ "--rise-delay": RISE_DELAY.cta } as CSSProperties}
            className="auris-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
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
          // pie a las cards. Los controles pasaron a dos filas —flechas y
          // puntos— así que el abanico sube lo que crecieron.
          className="auris-rise lg:absolute lg:right-12 lg:bottom-40"
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
