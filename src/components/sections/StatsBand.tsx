import {
  CalendarDays,
  HeartHandshake,
  Layers,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";
import { CountUp } from "@/components/shared/CountUp";
import { Leaf } from "@/components/shared/leaf-art";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { stats as defaultStats, type Stat } from "@/lib/data/stats";
import { cn } from "@/lib/utils";

/**
 * Íconos de la franja, en el mismo trazo fino que los de las tarjetas de
 * servicio. Se resuelven acá y no en `lib/icons`, que es el mapa de servicios.
 */
const icons: Record<Stat["icon"], (props: { className: string }) => ReactNode> =
  {
    calendar: (props) => <CalendarDays {...props} strokeWidth={1.5} />,
    heart: (props) => <HeartHandshake {...props} strokeWidth={1.5} />,
    stethoscope: (props) => <Stethoscope {...props} strokeWidth={1.5} />,
    layers: (props) => <Layers {...props} strokeWidth={1.5} />,
  };

type StatsBandProps = {
  /** Solo para la vista previa; en la Home usa la config de `lib/data/stats`. */
  items?: Stat[];
};

/**
 * Franja de confianza: cuatro cifras del centro.
 *
 * Va sobre el mismo salvia de la grilla de servicios. Contra el arena del
 * equipo que viene arriba hace pausa, y las tarjetas blancas se recortan
 * limpias sin necesidad de un fondo oscuro —que además habría quedado pegado
 * al bloque de tratamiento, que ya es oscuro—.
 *
 * Cada tarjeta da media vuelta al pasar el cursor y muestra un texto que
 * cuenta de qué habla esa cifra. Las dos caras van absolutas sobre el mismo
 * hueco y ocultas por el dorso, así que el contenido de atrás no se transparenta
 * a través del frente mientras gira.
 */
export function StatsBand({ items = defaultStats }: StatsBandProps) {
  return (
    <section className="relative overflow-hidden bg-surface-sage py-20 lg:py-24">
      <LeafScatter pattern="b" />
      <LeafSprig
        palette="beige"
        size="md"
        flip
        seed={15}
        className="bottom-0 right-3 h-44 opacity-45"
      />

      <div className="container-auris relative">
        <SectionHeading
          eyebrow="Nuestra trayectoria"
          title="Números que respaldan cada tratamiento"
          description="Años de trabajo en el Cerro de las Rosas, medidos en las personas que ya pasaron por el centro."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat, index) => (
            <Reveal as="li" key={stat.key} delay={index * 0.08}>
              {/* La perspectiva vive en un envoltorio aparte: si va sobre el
                  mismo elemento que gira, el navegador la aplica después de la
                  rotación y el giro se ve plano, sin profundidad. */}
              <div className="group h-full [perspective:1200px]">
                <div
                  // Enfocable a propósito: el dorso solo existe al pasar el
                  // cursor, así que sin esto no hay forma de leerlo con
                  // teclado. El `focus-within` cubre el caso del navegador que
                  // mueve el foco al contenedor.
                  tabIndex={0}
                  className={cn(
                    "relative h-full min-h-64 rounded-3xl outline-none",
                    "transition-transform duration-[700ms] [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(0.4,0.1,0.2,1)]",
                    "group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]",
                    "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-sage",
                    "motion-reduce:transition-none",
                  )}
                >
                  {/* Frente */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-primary-100 bg-card px-6 py-8 text-center shadow-sm [backface-visibility:hidden]">
                    <span
                      aria-hidden
                      className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700"
                    >
                      {icons[stat.icon]({ className: "size-5" })}
                    </span>

                    <p className="mt-5 font-serif text-4xl leading-none font-semibold text-primary-700 sm:text-[2.75rem]">
                      <CountUp to={stat.value} delay={index * 0.12} />
                      {stat.suffix && (
                        <span aria-hidden className="text-primary-500">
                          {stat.suffix}
                        </span>
                      )}
                    </p>

                    <p className="mt-3 text-sm leading-snug text-balance text-ink-700/75">
                      {stat.label}
                    </p>
                  </div>

                  {/* Dorso: media vuelta ya girado, para que quede de frente
                      cuando la tarjeta completa la suya. */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl bg-primary-800 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {/* Foco de luz arriba a la izquierda: sin esto el verde
                        plano deja el dorso muerto al lado del frente, que sí
                        tiene relieve por la sombra y el borde. */}
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(120% 100% at 12% 0%, rgba(147,194,124,.45), transparent 62%)",
                      }}
                    />
                    <Leaf
                      palette="cream"
                      detail="full"
                      className="absolute -bottom-10 -left-12 h-36 w-auto -rotate-12 opacity-[0.09]"
                    />
                    {/* Filo interior: separa el dorso del fondo salvia igual
                        que el borde separa al frente. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-3xl ring-1 ring-cream-50/20 ring-inset"
                    />

                    <div className="relative flex h-full flex-col items-center justify-center px-6 py-8 text-center">
                      <span
                        aria-hidden
                        className="inline-flex size-10 items-center justify-center rounded-xl bg-cream-50/15 text-white ring-1 ring-cream-50/25"
                      >
                        {icons[stat.icon]({ className: "size-[1.125rem]" })}
                      </span>

                      <p className="mt-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-white uppercase">
                        {stat.label}
                      </p>
                      <span
                        aria-hidden
                        className="mt-2.5 block h-px w-8 rounded-full bg-cream-50/45"
                      />

                      <p className="mt-3.5 text-[0.8125rem] leading-relaxed text-balance text-white">
                        {stat.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
