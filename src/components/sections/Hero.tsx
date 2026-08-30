"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ServiceFan } from "./ServiceFan";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { services } from "@/lib/data/services";

const AUTOPLAY_MS = 4500;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

const highlights = [
  { icon: HeartHandshake, label: "Atención humana y personalizada" },
  { icon: ShieldCheck, label: "Equipo matriculado y con experiencia" },
  { icon: Sparkles, label: "Siete especialidades en un mismo lugar" },
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
    setActive((current) => (current + delta + services.length) % services.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => step(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, step]);

  return (
    <section
      className="relative isolate flex min-h-184 flex-col overflow-hidden lg:min-h-176"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* Capa 1 — fondo full-bleed con crossfade entre servicios. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-primary-900">
        {services.map((service, index) => (
          <motion.div
            key={service.slug}
            initial={false}
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={service.imageUrl}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Capa 2 — degradés: más denso a la izquierda, donde va el texto. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-primary-900/95 via-primary-900/70 to-primary-900/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-primary-900/70 via-transparent to-primary-900/25"
      />

      <div className="container-auris relative flex flex-1 flex-col justify-center gap-14 py-20 lg:gap-0 lg:py-24">
        {/* Capa 3 — contenido, en claro sobre el overlay. */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-cream-50/35 bg-cream-50/10 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-cream-50 uppercase backdrop-blur-sm"
          >
            <Leaf className="size-3.5" strokeWidth={2} aria-hidden />
            Bienvenidos a {siteConfig.name}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 font-serif text-4xl leading-[1.08] text-balance text-cream-50 sm:text-5xl lg:text-6xl"
          >
            Tu bienestar,{" "}
            <span className="text-primary-200">nuestra prioridad</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-cream-100/90"
          >
            Un espacio integral para cuidar tu salud física, mental y emocional,
            con un equipo de profesionales comprometidos con vos.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary-600 font-semibold text-cream-50 shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-700"
            >
              <Link href="/servicios">
                Conocé nuestros servicios
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <WhatsAppButton label="Contactanos por WhatsApp" variant="onDark" />
          </motion.div>

          {/* Acotado a max-w-xl para no quedar debajo del abanico en desktop. */}
          <motion.ul
            variants={item}
            className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3"
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
          </motion.ul>
        </motion.div>

        {/* Capa 4 — abanico de servicios. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="lg:absolute lg:right-12 lg:bottom-14"
        >
          <ServiceFan
            active={active}
            onSelect={setActive}
            onStep={step}
            reduceMotion={reduceMotion}
          />
        </motion.div>
      </div>
    </section>
  );
}
