"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Quote } from "lucide-react";
import Link from "next/link";
import { AnimatedProfessionalImage } from "./AnimatedProfessionalImage";
import { LeafSprig } from "./LeafSprig";
import { ProfessionalBackLinks } from "./ProfessionalBackLinks";
import { ProfessionalFicha } from "./ProfessionalFicha";
import { WhatsAppButton } from "./WhatsAppButton";
import { getAreaBySlug } from "@/lib/data/areas";
import type { FotosProfesional } from "@/lib/fotos-profesional";
import type { Ficha, Professional, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Ficha completa de un profesional.
 *
 * La foto es el destino del shared element transition; el resto del contenido
 * entra escalonado después, para que el movimiento quede en la imagen.
 */
/**
 * Entrada de todos los bloques de la ficha. Una sola variante: misma distancia,
 * misma duración y misma curva para todo, y lo único que cambia es el retardo.
 * Con recorridos y curvas distintas por bloque —como estaba— cada uno llegaba a
 * su ritmo y el conjunto se leía descoordinado.
 *
 * La curva anterior era `[0.16, 0.68, 0.3, 1]`: sube el 68% del recorrido en el
 * primer 16% del tiempo y después se arrastra. Ese arrastre final es lo que se
 * percibía como un saltito extra al terminar, sobre todo en los párrafos. Esta
 * arranca normal y cierra limpio, sin cola.
 */
const content = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.33, 0, 0.2, 1] as const },
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
    band: "bg-rose-100/60",
    panel: "bg-rose-200/55",
    ring: "ring-rose-300/60",
    outline: "text-rose-400",
    card: "bg-rose-50/80",
    button: "rose",
    ctaPanel: "bg-rose-700",
    ctaText: "text-rose-100",
    ctaMuted: "text-rose-200",
    header:
      "linear-gradient(180deg, #f6d9e8 0%, #fbe9f2 52%, #fdf3f8 100%), radial-gradient(80% 60% at 85% 8%, rgba(181,72,126,.30), transparent 70%)",
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
    band: "bg-clinic-100/60",
    panel: "bg-clinic-200/55",
    ring: "ring-clinic-300/60",
    outline: "text-clinic-400",
    card: "bg-clinic-50/80",
    button: "clinic",
    ctaPanel: "bg-clinic-700",
    ctaText: "text-clinic-100",
    ctaMuted: "text-clinic-200",
    header:
      "linear-gradient(180deg, #d5e0f0 0%, #e6edf7 52%, #f0f4fa 100%), radial-gradient(80% 60% at 85% 8%, rgba(68,95,149,.30), transparent 70%)",
    ctaGlow:
      "radial-gradient(circle at 15% 20%, rgba(147,170,210,.75), transparent 45%), radial-gradient(circle at 85% 80%, rgba(76,122,65,.5), transparent 45%)",
  },
} as const;

type ProfessionalProfileProps = {
  professional: Professional;
  service?: Service;
  /** Trayectoria, banner y cifras: todo lo que va debajo del hero. */
  ficha: Ficha;
  /** Fotos de su carpeta en `public/images/profesionales/`, por lugar. */
  fotos: FotosProfesional;
  fotoCifras?: "izquierda" | "derecha";
  className?: string;
};

export function ProfessionalProfile({
  professional,
  service,
  ficha,
  fotos,
  fotoCifras,
  className,
}: ProfessionalProfileProps) {
  const firstName = professional.name.split(" ").slice(1).join(" ");
  const area = getAreaBySlug(professional.areaSlug);
  const c = palettes[professional.gender];
  const { trayectoria } = professional;

  return (
    <div className={className}>
      {/* Presentación. Los enlaces de vuelta viven dentro de esta sección para
          que compartan el mismo fondo y no quede una costura de color. */}
      <section
        className="relative overflow-hidden pt-6 pb-20 lg:pb-24"
        style={{ backgroundImage: c.header }}
      >
        <LeafSprig
          palette="green"
          size="sm"
          flip
          seed={10}
          className="-top-2 right-4 h-32 opacity-35"
        />

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
                hoverSrc={fotos.heroHover}
                // El hero es una sola foto grande: acá sí conviene que vaya
                // alternando sola, no solo con el cursor encima.
                autoAlterna
                objectPosition={ficha.heroFoco ?? professional.fotoFoco}
                hoverObjectPosition={
                  ficha.heroHoverFoco ?? professional.fotoHoverFoco
                }
                alt={`Retrato de ${professional.name}`}
                priority
                isTransitionTarget
                // Pide el doble del ancho de la card. Con una foto vertical
                // alcanzaría con 460, pero una apaisada se recorta a lo ancho
                // y solo muestra la mitad: con 460 el navegador bajaba 640px
                // y la card los estiraba al doble, que es lo que se pixelaba.
                sizes="(max-width: 1024px) 100vw, 960px"
                className="aspect-4/5 w-full rounded-3xl"
              />

              {/* Sombra: la última en llegar.

                  No usa `shadow-2xl`: ese preset lleva -12px de spread, que la
                  encoge tanto que sobre el fondo claro de la ficha no se
                  distinguía. Van dos capas —una de contacto, corta, y una de
                  ambiente, difusa— que es como se lee una tarjeta apoyada. */}
              <span
                aria-hidden
                className="auris-photo-shadow pointer-events-none absolute inset-0 rounded-3xl shadow-[0_4px_10px_-2px_rgba(43,43,40,0.16),0_22px_45px_-10px_rgba(43,43,40,0.30)]"
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
                custom={0.14}
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
                    <BadgeCheck
                      className="size-4"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {area?.name ?? professional.specialty}
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
                custom={0.28}
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
                custom={0.35}
                className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-ink-700/85"
              >
                {professional.bio}
              </motion.p>

              <motion.div
                variants={content}
                initial="hidden"
                animate="visible"
                // Cierra el escalonado del texto, sin esperar al trazo del
                // contorno: entre retardo y recorrido tardaba casi dos segundos
                // en estar disponible.
                custom={0.42}
                className="mt-9"
              >
                <WhatsAppButton
                  tone={c.button}
                  phone={professional.whatsapp}
                  label={`Solicitar turno con ${firstName}`}
                  message={`¡Hola AURIS! Quisiera solicitar un turno con ${professional.name} (${professional.specialty}).`}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ProfessionalFicha
        professional={professional}
        trayectoria={trayectoria}
        ficha={ficha}
        fotos={fotos}
        fotoCifras={fotoCifras}
      />
    </div>
  );
}
