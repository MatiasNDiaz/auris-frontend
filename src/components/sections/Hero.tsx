"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
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
    <section className="relative overflow-hidden bg-cream-50 pt-10 pb-20 sm:pt-16 lg:pb-28">
      {/* Composición de fondo: formas orgánicas en la paleta institucional. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute -top-32 -right-24 size-[34rem] rounded-full bg-primary-100/70 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-40 -left-32 size-[30rem] rounded-full bg-accent-100/60 blur-3xl"
        />
      </div>

      <div className="container-auris relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <motion.p
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-cream-100 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary-600 uppercase"
            >
              {siteConfig.tagline}
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-6 font-serif text-4xl leading-[1.08] text-balance text-ink-900 sm:text-5xl lg:text-6xl"
            >
              Tu bienestar, cuidado por un equipo que te escucha
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-700/85"
            >
              En {siteConfig.name} reunimos siete especialidades en un mismo
              espacio para acompañarte de forma integral, con tiempo real de
              consulta y un plan pensado para vos.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary-500 font-semibold text-cream-50 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-600"
              >
                <Link href="/servicios">
                  Conocé nuestros servicios
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <WhatsAppButton label="Contactanos por WhatsApp" />
            </motion.div>

            <motion.ul variants={item} className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-start gap-2.5 text-sm text-ink-700/80"
                >
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-primary-500"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Composición visual: bloques superpuestos en lugar de una foto única. */}
          <motion.div variants={item} className="relative">
            <div className="relative mx-auto aspect-4/5 w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 24, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
                className="absolute inset-x-6 top-0 bottom-16 rounded-[2.5rem] bg-primary-200/70"
              />
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                className="absolute inset-x-0 top-10 bottom-0 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary-400 to-primary-700 shadow-xl"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,.55), transparent 50%), radial-gradient(circle at 75% 80%, rgba(246,198,163,.6), transparent 45%)",
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                className="absolute -bottom-6 -left-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-lg sm:-left-8"
              >
                <p className="font-serif text-3xl text-primary-600">+2.500</p>
                <p className="mt-0.5 text-xs text-ink-700/70">
                  pacientes acompañados
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
