import { CalendarDays, HeartHandshake, Layers, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import { CountUp } from "@/components/shared/CountUp";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { stats as defaultStats, type Stat } from "@/lib/data/stats";

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
              <div className="flex h-full flex-col items-center rounded-3xl border border-primary-100 bg-card px-6 py-8 text-center shadow-sm">
                <span
                  aria-hidden
                  className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700"
                >
                  {icons[stat.icon]({ className: "size-5" })}
                </span>

                {stat.value === null ? (
                  // Sin número todavía. El token va en una etiqueta chica y
                  // monoespaciada, sin el sufijo: puesto en el lugar de la
                  // cifra se desarmaba en varias líneas y parecía un error de
                  // la página en vez de un dato pendiente de cargar.
                  <p className="mt-5 flex min-h-11 items-center">
                    <span className="rounded-lg bg-primary-100 px-2 py-1 font-mono text-[0.6875rem] leading-tight text-primary-700 ring-1 ring-primary-200">
                      {stat.placeholder}
                      {stat.suffix}
                    </span>
                  </p>
                ) : (
                  <p className="mt-5 font-serif text-4xl leading-none font-semibold text-primary-700 sm:text-[2.75rem]">
                    <CountUp to={stat.value} delay={index * 0.12} />
                    {stat.suffix && (
                      <span aria-hidden className="text-primary-500">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                )}

                <p className="mt-3 text-sm leading-snug text-balance text-ink-700/75">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
