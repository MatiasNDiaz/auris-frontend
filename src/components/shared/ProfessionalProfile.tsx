"use client";

import { motion } from "framer-motion";
import { Award, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";
import { AnimatedProfessionalImage } from "./AnimatedProfessionalImage";
import { WhatsAppButton } from "./WhatsAppButton";
import type { Professional, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Perfil completo de un profesional. Se comparte entre la página
 * `/profesionales/[slug]` y la intercepting route que la muestra como overlay,
 * para que la foto conserve el mismo `layoutId` en ambos contextos.
 */

// El contenido entra después de que la imagen termina de morfear, para que el
// protagonismo del movimiento quede en la foto.
const content = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

const detailBlocks = [
  { key: "education", icon: GraduationCap, title: "Formación académica" },
  { key: "certifications", icon: Award, title: "Certificaciones" },
] as const;

type ProfessionalProfileProps = {
  professional: Professional;
  service?: Service;
  className?: string;
  /** En el overlay el encabezado va más compacto que en la página completa. */
  compact?: boolean;
};

export function ProfessionalProfile({
  professional,
  service,
  className,
  compact = false,
}: ProfessionalProfileProps) {
  return (
    <div className={cn("grid gap-10 lg:grid-cols-[0.85fr_1.15fr]", className)}>
      <AnimatedProfessionalImage
        slug={professional.slug}
        src={professional.photoUrl}
        alt={`Retrato de ${professional.name}`}
        priority
        sizes="(max-width: 1024px) 90vw, 420px"
        className={cn(
          "w-full rounded-3xl shadow-lg",
          compact ? "aspect-4/5 max-w-xs" : "aspect-4/5",
        )}
      />

      <div>
        <motion.div
          variants={content}
          initial="hidden"
          animate="visible"
          custom={0.25}
        >
          {service && (
            <Link
              href={`/servicios/${service.slug}`}
              className="inline-flex rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary-700 uppercase transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              {service.name}
            </Link>
          )}

          <h1
            className={cn(
              "mt-4 font-serif leading-tight text-balance text-ink-900",
              compact ? "text-3xl" : "text-4xl sm:text-5xl",
            )}
          >
            {professional.name}
          </h1>
          <p className="mt-2 text-lg text-ink-700/80">
            {professional.specialty}
          </p>
        </motion.div>

        <motion.p
          variants={content}
          initial="hidden"
          animate="visible"
          custom={0.35}
          className="mt-6 text-base leading-relaxed text-pretty text-ink-700/85"
        >
          {professional.bio}
        </motion.p>

        <motion.div
          variants={content}
          initial="hidden"
          animate="visible"
          custom={0.45}
          className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-cream-100 p-5"
        >
          <Briefcase
            className="mt-0.5 size-5 shrink-0 text-primary-700"
            strokeWidth={1.6}
            aria-hidden
          />
          <div>
            <p className="text-sm font-semibold text-ink-900">Experiencia</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700/80">
              {professional.experience}
            </p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {detailBlocks.map((block, index) => (
            <motion.section
              key={block.key}
              variants={content}
              initial="hidden"
              animate="visible"
              custom={0.55 + index * 0.08}
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <block.icon
                  className="size-4 text-primary-700"
                  strokeWidth={1.7}
                  aria-hidden
                />
                {block.title}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {professional[block.key].map((entry) => (
                  <li
                    key={entry}
                    className="border-l-2 border-primary-200 pl-3 text-sm leading-relaxed text-ink-700/80"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>

        <motion.div
          variants={content}
          initial="hidden"
          animate="visible"
          custom={0.75}
          className="mt-9"
        >
          <WhatsAppButton
            label={`Solicitar turno con ${professional.name.split(" ").slice(1).join(" ")}`}
            message={`¡Hola AURIS! Quisiera solicitar un turno con ${professional.name} (${professional.specialty}).`}
          />
        </motion.div>
      </div>
    </div>
  );
}
