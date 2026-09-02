"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck, Briefcase, GraduationCap, Quote } from "lucide-react";
import Link from "next/link";
import { AnimatedProfessionalImage } from "./AnimatedProfessionalImage";
import { LeafSprig } from "./LeafSprig";
import { ProfessionalBackLinks } from "./ProfessionalBackLinks";
import { ShineButton } from "./ShineButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { siteConfig } from "@/config/site";
import type { Professional, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Ficha completa de un profesional.
 *
 * La foto es el destino del shared element transition; el resto del contenido
 * entra escalonado después, para que el movimiento quede en la imagen.
 */
const content = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 0.68, 0.3, 1] as const },
  }),
};

/** El CTA sube más y desacelera más, para que no llegue de golpe. */
const cta = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * Cada ficha toma su acento del profesional: azul profundo para varones, rosa
 * violáceo para mujeres. El encabezado es un único degradé continuo de arriba
 * abajo — antes eran una banda plana más el degradé, y el empalme entre las
 * dos se veía como un corte horizontal de color.
 */
const palettes = {
  female: {
    name: "text-rose-900",
    label: "text-rose-700",
    badge: "bg-rose-200/80 text-rose-900 hover:bg-rose-300/80",
    softBadge: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    rule: "bg-rose-500",
    quote: "text-rose-400",
    iconBox: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    border: "border-rose-200",
    band: "bg-rose-50",
    panel: "bg-rose-100/70",
    ring: "ring-rose-300/60",
    outline: "text-rose-400",
    card: "bg-rose-50/80",
    button: "rose",
    ctaPanel: "bg-rose-700",
    ctaText: "text-rose-100",
    ctaMuted: "text-rose-200",
    header:
      "linear-gradient(180deg, #fae4ef 0%, #fdf3f8 55%, #fdfbf6 100%), radial-gradient(80% 60% at 85% 8%, rgba(212,112,159,.28), transparent 70%)",
    ctaGlow:
      "radial-gradient(circle at 15% 20%, rgba(231,158,194,.75), transparent 45%), radial-gradient(circle at 85% 80%, rgba(76,122,65,.5), transparent 45%)",
  },
  male: {
    name: "text-clinic-900",
    label: "text-clinic-700",
    badge: "bg-clinic-200/80 text-clinic-900 hover:bg-clinic-300/80",
    softBadge: "bg-clinic-100 text-clinic-700 ring-1 ring-clinic-200",
    rule: "bg-clinic-500",
    quote: "text-clinic-400",
    iconBox: "bg-clinic-100 text-clinic-700 ring-1 ring-clinic-200",
    border: "border-clinic-200",
    band: "bg-clinic-50",
    panel: "bg-clinic-100/70",
    ring: "ring-clinic-300/60",
    outline: "text-clinic-400",
    card: "bg-clinic-50/80",
    button: "clinic",
    ctaPanel: "bg-clinic-700",
    ctaText: "text-clinic-100",
    ctaMuted: "text-clinic-200",
    header:
      "linear-gradient(180deg, #dfe7f4 0%, #f0f4fa 55%, #fdfbf6 100%), radial-gradient(80% 60% at 85% 8%, rgba(100,128,180,.26), transparent 70%)",
    ctaGlow:
      "radial-gradient(circle at 15% 20%, rgba(147,170,210,.75), transparent 45%), radial-gradient(circle at 85% 80%, rgba(76,122,65,.5), transparent 45%)",
  },
} as const;

type ProfessionalProfileProps = {
  professional: Professional;
  service?: Service;
  className?: string;
};

export function ProfessionalProfile({
  professional,
  service,
  className,
}: ProfessionalProfileProps) {
  const firstName = professional.name.split(" ").slice(1).join(" ");
  const c = palettes[professional.gender];

  return (
    <div className={className}>
      {/* Presentación. Los enlaces de vuelta viven dentro de esta sección para
          que compartan el mismo fondo y no quede una costura de color. */}
      <section
        className="relative overflow-hidden pt-6 pb-20 lg:pb-24"
        style={{ backgroundImage: c.header }}
      >
        <LeafSprig palette="green" size="sm" flip className="-top-2 right-4 h-32 opacity-35" />

        <div className="container-auris relative">
          <ProfessionalBackLinks tone={c.button} />

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            {/* La foto llega sola. Recién cuando se detiene, un trazo recorre
                el contorno y después entra la sombra. Ninguna de las dos capas
                puede existir durante el morph: quedarían dibujadas en la
                posición final mientras la imagen todavía se mueve. */}
            <div className="relative">
              <AnimatedProfessionalImage
                src={professional.photoUrl}
                alt={`Retrato de ${professional.name}`}
                priority
                isTransitionTarget
                sizes="(max-width: 1024px) 90vw, 460px"
                className="aspect-4/5 w-full rounded-3xl"
              />

              {/* Sombra: la última en llegar. */}
              <span
                aria-hidden
                className="auris-photo-shadow pointer-events-none absolute inset-0 rounded-3xl shadow-2xl"
              />

              {/* Trazo del contorno, en el color de la persona. */}
              <svg
                aria-hidden
                className={cn(
                  "auris-photo-outline pointer-events-none absolute inset-0 size-full",
                  c.outline,
                )}
              >
                <rect pathLength={100} />
              </svg>
            </div>

            <div>
              <motion.div
                variants={content}
                initial="hidden"
                animate="visible"
                custom={0.15}
              >
                <p
                  className={cn(
                    "text-xs font-semibold tracking-[0.24em] uppercase",
                    c.label,
                  )}
                >
                  Equipo AURIS
                </p>

                <h1
                  className={cn(
                    "mt-4 font-serif text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl",
                    c.name,
                  )}
                >
                  {professional.name}
                </h1>

                <span
                  aria-hidden
                  className={cn("mt-6 block h-1 w-20 rounded-full", c.rule)}
                />

                {/* Área y servicio, debajo del nombre. */}
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold",
                      c.softBadge,
                    )}
                  >
                    <BadgeCheck className="size-4" strokeWidth={2} aria-hidden />
                    {professional.specialty}
                  </span>

                  {service && (
                    <Link
                      href={`/servicios/${service.slug}`}
                      className={cn(
                        "inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                        c.badge,
                      )}
                    >
                      {service.name}
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Frase en primera persona. */}
              <motion.figure
                variants={content}
                initial="hidden"
                animate="visible"
                custom={0.3}
                className="mt-8 max-w-xl"
              >
                <Quote
                  aria-hidden
                  className={cn("size-6", c.quote)}
                  strokeWidth={1.6}
                />
                <blockquote className="mt-2 font-serif text-xl leading-snug text-pretty text-ink-900 sm:text-2xl">
                  {professional.motto}
                </blockquote>
              </motion.figure>

              <motion.p
                variants={content}
                initial="hidden"
                animate="visible"
                custom={0.4}
                className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-ink-700/85"
              >
                {professional.bio}
              </motion.p>

              <motion.div
                variants={cta}
                initial="hidden"
                animate="visible"
                // Sube después de que el trazo cerró el contorno, con más
                // recorrido y una curva que desacelera de a poco.
                custom={0.95}
                className="mt-9"
              >
                <WhatsAppButton
                  tone={c.button}
                  label={`Solicitar turno con ${firstName}`}
                  message={`¡Hola AURIS! Quisiera solicitar un turno con ${professional.name} (${professional.specialty}).`}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia. */}
      <section className={cn("py-14", c.band)}>
        <div className="container-auris">
          <motion.div
            variants={content}
            initial="hidden"
            animate="visible"
            custom={0.55}
            className={cn(
              "mx-auto flex max-w-3xl items-start gap-5 rounded-3xl border bg-cream-50 p-8 shadow-sm",
              c.border,
            )}
          >
            <span
              aria-hidden
              className={cn(
                "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl",
                c.iconBox,
              )}
            >
              <Briefcase className="size-6" strokeWidth={1.6} />
            </span>
            <div>
              <p
                className={cn(
                  "text-xs font-semibold tracking-[0.18em] uppercase",
                  c.label,
                )}
              >
                Experiencia
              </p>
              <p className="mt-2 text-lg leading-relaxed text-pretty text-ink-900">
                {professional.experience}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Credenciales, presentadas como diplomas. */}
      <section className={cn("relative overflow-hidden py-16 lg:py-20", c.panel)}>


        <div className="container-auris relative">
          <motion.div
            variants={content}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="text-center"
          >
            <p
              className={cn(
                "text-xs font-semibold tracking-[0.24em] uppercase",
                c.label,
              )}
            >
              Formación y certificaciones
            </p>
            <h2 className="mt-3 font-serif text-3xl text-balance text-ink-900 sm:text-4xl">
              Títulos que respaldan su práctica
            </h2>
            <span
              aria-hidden
              className={cn("mx-auto mt-5 block h-0.5 w-16 rounded-full", c.rule)}
            />
          </motion.div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professional.credentials.map((cred, index) => (
              <motion.li
                key={`${cred.title}-${cred.year}`}
                variants={content}
                initial="hidden"
                animate="visible"
                custom={0.65 + index * 0.06}
              >
                {/* Diploma estilizado: no es un escaneo real, es una
                    representación con los datos del título. */}
                <article
                  className={cn(
                    "flex h-full flex-col rounded-2xl border-2 bg-cream-50 p-6 shadow-sm",
                    c.border,
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3",
                      c.card,
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-lg",
                        c.iconBox,
                      )}
                    >
                      {index === 0 ? (
                        <GraduationCap className="size-4.5" strokeWidth={1.7} />
                      ) : (
                        <Award className="size-4.5" strokeWidth={1.7} />
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-serif text-lg tabular-nums",
                        c.label,
                      )}
                    >
                      {cred.year}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-lg leading-snug text-balance text-ink-900">
                    {cred.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700/80">
                    {cred.institution}
                  </p>

                  <p
                    className={cn(
                      "mt-5 border-t pt-4 text-[0.7rem] tracking-[0.16em] uppercase",
                      c.border,
                      c.label,
                    )}
                  >
                    {siteConfig.name} · Documentación verificada
                  </p>
                </article>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cierre: contacto. */}
      <section className={cn("py-16 lg:py-20", c.band)}>
        <div className="container-auris">
          <motion.div
            variants={content}
            initial="hidden"
            animate="visible"
            custom={0.85}
            className={cn(
              "relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] px-8 py-12 text-center",
              c.ctaPanel,
            )}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-35"
              style={{ backgroundImage: c.ctaGlow }}
            />

            <div className="relative">
              <h2 className="font-serif text-2xl text-balance text-cream-50 sm:text-3xl">
                ¿Querés coordinar una consulta con {firstName}?
              </h2>
              <p className={cn("mx-auto mt-4 max-w-lg text-pretty", c.ctaText)}>
                Escribinos y te confirmamos la disponibilidad. También podés ver
                los horarios y la ubicación del centro.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <WhatsAppButton
                  label="Escribinos por WhatsApp"
                  variant="outline"
                  message={`¡Hola AURIS! Quisiera solicitar un turno con ${professional.name} (${professional.specialty}).`}
                />
                <ShineButton
                  href="/contacto"
                  tone="outlineLight"
                  effect="fill"
                >
                  Ver datos de contacto
                </ShineButton>
              </div>

              <p className={cn("mt-6 text-sm", c.ctaMuted)}>
                {siteConfig.address.street}, {siteConfig.address.city}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
