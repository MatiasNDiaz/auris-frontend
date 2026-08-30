"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ServiceStackCarousel } from "./ServiceStackCarousel";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
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

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-100 pt-10 pb-24 sm:pt-16 lg:pb-32">
      {/* Manchas orgánicas verdes de fondo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute -top-40 -right-32 size-152 rounded-full bg-primary-200/55 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-48 -left-40 size-128 rounded-full bg-accent-100/70 blur-3xl"
        />
      </div>

      {/* Curva de separación hacia la sección siguiente. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-16 w-full text-cream-50 lg:h-24"
      >
        <path
          fill="currentColor"
          d="M0 120V44c220 48 420 62 720 30S1220-4 1440 26v94z"
        />
      </svg>

      <div className="container-auris relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <motion.p
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary-700 uppercase"
            >
              <Leaf className="size-3.5" strokeWidth={2} aria-hidden />
              Bienvenidos a {siteConfig.name}
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-6 font-serif text-4xl leading-[1.08] text-balance text-ink-900 sm:text-5xl lg:text-6xl"
            >
              Tu bienestar,{" "}
              <span className="text-primary-600">nuestra prioridad</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-700/85"
            >
              Un espacio integral para cuidar tu salud física, mental y
              emocional, con un equipo de profesionales comprometidos con vos.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary-700 font-semibold text-cream-50 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-800"
              >
                <Link href="/servicios">
                  Conocé nuestros servicios
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <WhatsAppButton label="Contactanos por WhatsApp" variant="outline" />
            </motion.div>

            <motion.ul variants={item} className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-start gap-2.5 text-sm text-ink-700/80"
                >
                  <span
                    aria-hidden
                    className="mt-px inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700"
                  >
                    <Icon className="size-3.5" strokeWidth={1.9} />
                  </span>
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div variants={item}>
            <ServiceStackCarousel />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
