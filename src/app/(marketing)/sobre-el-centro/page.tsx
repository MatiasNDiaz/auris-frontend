import { Compass, HeartHandshake, Leaf, Users } from "lucide-react";
import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VirtualTour } from "@/components/sections/VirtualTour";
import { gallery } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Sobre el centro",
  description:
    "Conocé la historia, el enfoque de atención y los valores de AURIS, centro de salud y bienestar integral.",
  alternates: { canonical: "/sobre-el-centro" },
};

const values = [
  {
    icon: HeartHandshake,
    title: "Atención humana",
    description:
      "Consultas con tiempo real de escucha. Nadie llega a una consulta solo por un síntoma.",
  },
  {
    icon: Users,
    title: "Trabajo en equipo",
    description:
      "Las especialidades se comunican entre sí para que el tratamiento tenga una dirección común.",
  },
  {
    icon: Compass,
    title: "Claridad",
    description:
      "Explicamos el diagnóstico, el plan y los costos antes de empezar. Sin letra chica.",
  },
  {
    icon: Leaf,
    title: "Cuidado sostenible",
    description:
      "Buscamos resultados que se mantengan en el tiempo, no mejoras rápidas que no se sostienen.",
  },
];

export default function SobreElCentroPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre el centro"
        title="Un lugar donde la salud se piensa completa"
        description="AURIS nació de una idea simple: que las distintas disciplinas del cuidado no deberían trabajar aisladas. Hoy somos un equipo interdisciplinario con un mismo modo de acompañar."
      />

      <section className="container-auris py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="font-serif text-3xl leading-tight text-balance text-ink-900 sm:text-4xl">
              Nuestra historia
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-pretty text-ink-700/85">
              <p>
                Empezamos como un consultorio de psicología y kinesiología que
                compartía una sala de espera. Lo que parecía una casualidad
                administrativa terminó siendo el origen del proyecto: las
                consultas se enriquecían cuando los profesionales conversaban
                entre sí sobre cómo acompañar a una misma persona.
              </p>
              <p>
                Con los años sumamos odontología, nutrición, estética,
                fonoaudiología y los talleres grupales, siempre con el mismo
                criterio de selección: profesionales formados que entienden el
                cuidado como un proceso compartido con quien consulta.
              </p>
              <p>
                Hoy atendemos a más de dos mil quinientas personas por año en un
                espacio diseñado para que la visita al centro de salud deje de
                sentirse como un trámite.
              </p>
            </div>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {gallery.slice(0, 4).map((item, index) => (
                <Placeholder
                  key={item.id}
                  seed={item.id}
                  label={item.title}
                  className={
                    index % 3 === 0
                      ? "aspect-4/5 rounded-3xl"
                      : "aspect-square rounded-3xl"
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-24">
        <div className="container-auris">
          <SectionHeading
            eyebrow="Enfoque y valores"
            title="Cómo entendemos el cuidado"
            description="Cuatro principios que atraviesan todas las especialidades del centro."
            className="mb-14"
          />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal as="li" key={value.title} delay={index * 0.08}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-sm">
                  <span
                    aria-hidden
                    className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500"
                  >
                    <value.icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-ink-900">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700/80">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <VirtualTour />
      <CtaBanner />
    </>
  );
}
