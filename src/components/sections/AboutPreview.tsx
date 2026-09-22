import { ArrowRight, Building2, Check, HeartPulse, Users } from "lucide-react";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ShineButton } from "@/components/shared/ShineButton";
import { VideoEnBucle } from "@/components/shared/VideoEnBucle";

const pillars = [
  {
    icon: HeartPulse,
    title: "Enfoque integral",
    description: "Abordamos tu bienestar físico, mental y emocional.",
  },
  {
    icon: Users,
    title: "Profesionales comprometidos",
    description: "Equipo interdisciplinario en constante capacitación.",
  },
  {
    icon: Building2,
    title: "Instalaciones modernas",
    description: "Espacios diseñados para la comodidad y la tranquilidad.",
  },
];

const values = [
  "Consultas con tiempo real de escucha, sin apuro",
  "Equipo interdisciplinario que se comunica entre sí",
  "Planes de tratamiento explicados y acordados con vos",
];

export function AboutPreview() {
  return (
    <section className="relative overflow-hidden bg-surface-base py-20 lg:py-28">
      <LeafScatter pattern="a" />
      <LeafSprig
        palette="green"
        size="lg"
        seed={2}
        className="bottom-0 left-2 h-56 opacity-60 lg:h-72"
      />
      <div className="container-auris relative">
        <SectionHeading
          eyebrow="Sobre AURIS"
          title="Sobre el centro"
          description="Somos un espacio de salud y bienestar integral que busca promover la calidad de vida a través de un enfoque humano, profesional y personalizado."
          className="mb-16"
        />
      </div>

      <div className="container-auris grid items-center gap-14 lg:grid-cols-2">
        <Reveal from="left" className="order-2 lg:order-1">
          <ul className="space-y-5">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700"
                >
                  <pillar.icon className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{pillar.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-700/75">
                    {pillar.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <ul className="mt-8 space-y-2.5 border-t border-primary-100 pt-7">
            {values.map((value) => (
              <li
                key={value}
                className="flex items-start gap-3 text-ink-700/85"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-cream-50"
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed">{value}</span>
              </li>
            ))}
          </ul>

          <ShineButton
            href="/sobre-el-centro"
            tone="primary"
            effect="fill"
            className="mt-9"
          >
            Conocé más sobre nosotros
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </ShineButton>
        </Reveal>

        {/* Pegado al texto y no centrado en su columna: centrado quedaban más
            de cien píxeles de aire entre una cosa y la otra. */}
        <Reveal
          from="right"
          className="order-1 lg:order-2 lg:justify-self-start"
        >
          <div className="group relative mx-auto w-full max-w-104 lg:mx-0">
            <div
              aria-hidden
              className="absolute -top-6 -right-6 size-40 rounded-full bg-primary-200/60 blur-2xl"
            />

            {/* Bloque verde desplazado por detrás, el mismo gesto que la foto
                de las fichas: le da profundidad y se abre un poco al pasar el
                cursor. Va hacia la derecha, del lado contrario al texto. */}
            <span
              aria-hidden
              className="absolute inset-0 translate-x-5 translate-y-5 rounded-[2.5rem] bg-primary-200/70 transition-[translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-7 group-hover:translate-y-7"
            />

            {/* El recuadro sigue la proporción del video —vertical, 464×832—
                en vez de recortarlo dentro de uno apaisado. Y no pasa de 416px:
                el original mide 464 de ancho, así que estirarlo más sería
                agrandar píxeles. */}
            <VideoEnBucle
              src="/videos/video-equipo-auris.mp4"
              poster="/videos/video-equipo-auris-poster.webp"
              descripcion="El equipo de AURIS entre risas, en la recepción del centro"
              // Versión corta de la frase del centro: "Porque cuidar a
              // otros también empieza por construir un equipo que disfruta
              // de estar juntos". Entera no entraba cómoda en el cuadro del
              // video, así que se acortó sin perder la idea.
              pie="Cuidar a otros empieza por un equipo que disfruta estar juntos"
              className="relative aspect-464/832 w-full rounded-[2.5rem] shadow-xl"
            />
          </div>

          <p className="mx-auto mt-8 max-w-104 text-sm leading-relaxed text-pretty text-ink-700/75 lg:mx-0">
            Esta toma iba a ser la seria. Quedó esta, y nos gustó más: acá no
            hay batas almidonadas ni salas silenciosas, hay gente que trabaja
            junta, se conoce y te recibe así.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
