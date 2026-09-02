import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ShineButton } from "@/components/shared/ShineButton";

const highlights = [
  {
    title: "Diagnóstico de piel",
    description:
      "Cada plan arranca con una evaluación real, no con un tratamiento de catálogo.",
  },
  {
    title: "Aparatología con criterio",
    description:
      "Equipamiento profesional aplicado solo donde aporta al objetivo del tratamiento.",
  },
  {
    title: "Seguimiento posterior",
    description:
      "Pautas de cuidado domiciliario para que el resultado se sostenga en el tiempo.",
  },
];

/**
 * Bloque de revelado por scroll.
 *
 * La foto queda fija ocupando la pantalla (`sticky top-0`) mientras el panel
 * de abajo, que va en flujo normal y con `z-index` mayor, sube y la tapa. El
 * contenedor exterior es más alto que la foto: esa diferencia es lo que
 * determina cuánto tiempo permanece anclada.
 */
export function StickyTreatment() {
  return (
    <section className="relative bg-ink-900">
      <div className="sticky top-0 z-0 h-screen overflow-hidden">
        <Image
          src="/ChicaTratamiento.webp"
          alt="Paciente durante un tratamiento facial en AURIS"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-transparent"
        />

        <div className="container-auris relative flex h-full items-center">
          <div className="max-w-lg">
            <p className="inline-flex items-center gap-2 rounded-full border border-cream-50/35 bg-cream-50/10 px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-cream-50 uppercase backdrop-blur-sm">
              <Sparkles className="size-3.5" strokeWidth={2} aria-hidden />
              Estética facial y corporal
            </p>
            <p className="mt-6 font-serif text-4xl leading-tight text-balance text-cream-50 sm:text-5xl">
              El cuidado de la piel, con criterio profesional
            </p>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-cream-100/90">
              Tratamientos pensados sobre un diagnóstico real, con resultados
              progresivos y sostenibles.
            </p>
          </div>
        </div>
      </div>

      {/* Panel que sube por encima de la foto y la cubre. */}
      <div className="relative z-10 overflow-hidden rounded-t-[3rem] bg-surface-sage pt-20 pb-24 shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.35)] lg:pt-24">
        <LeafScatter pattern="a" />
        <LeafSprig palette="green" size="md" flip seed={6} className="-bottom-6 right-4 h-48 opacity-55" />

        <div className="container-auris relative">
          <SectionHeading
            eyebrow="Cómo trabajamos la estética"
            title="Un plan por persona, no un tratamiento estándar"
            description="Diseñamos cada abordaje a partir de tu piel y de tus objetivos, y te acompañamos también después de la sesión."
            className="mb-14"
          />

          <ul className="grid gap-6 sm:grid-cols-3">
            {highlights.map((highlight, index) => (
              <Reveal as="li" key={highlight.title} delay={index * 0.09}>
                <div className="h-full rounded-3xl border border-primary-100 bg-card p-7 shadow-sm">
                  <span
                    aria-hidden
                    className="inline-flex size-11 items-center justify-center rounded-2xl bg-warm-100 font-serif text-lg text-warm-700"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-primary-800">
                    {highlight.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700/80">
                    {highlight.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-12 flex justify-center" delay={0.15}>
            <ShineButton href="/servicios/estetica-facial-y-corporal">
              Ver el servicio completo
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </ShineButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
