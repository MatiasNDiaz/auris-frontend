import { Compass, Ear, HeartHandshake, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { VirtualTour } from "@/components/sections/VirtualTour";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Leaf } from "@/components/shared/leaf-art";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { milestones, pillars } from "@/lib/data/about";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sobre el centro",
  description:
    "Treinta años de trabajo en salud detrás de AURIS: la historia, el enfoque interdisciplinario y hacia dónde va el centro.",
  alternates: { canonical: "/sobre-el-centro" },
};

/** Fotos que acompañan la historia, en el orden en que se entra al centro. */
const storyPhotos = [
  {
    src: "/images/galeria/ingreso-01.webp",
    alt: "Cartel de AURIS en el frente del centro",
  },
  {
    src: "/images/galeria/recepcion-02.webp",
    alt: "Sala de espera con el logo de AURIS en la pared",
  },
];

const values = [
  {
    icon: HeartHandshake,
    title: "La persona antes que la especialidad",
    description:
      "Somos cuerpo, emociones, pensamientos y vínculos. La consulta mira los hábitos, la postura, la respiración y el ánimo, no solo el motivo por el que llegaste.",
  },
  {
    icon: Compass,
    title: "Prevención",
    description:
      "Detectar señales y escuchar síntomas antes de que un problema se vuelva enfermedad. La especialización es fundamental; la mirada amplia es lo que la completa.",
  },
  {
    icon: Users,
    title: "Trabajo entre disciplinas",
    description:
      "Las especialidades se comunican entre sí. Cuando un caso lo pide, lo mira más de un profesional.",
  },
  {
    icon: Ear,
    title: "Escucha",
    description:
      "Que cada persona se sienta escuchada, contenida y cuidada. Para nosotros, cuidar la salud también es cuidar a la persona.",
  },
];

export default function SobreElCentroPage() {
  return (
    <>
      <PageHeader
        surface="sand"
        wave="valley"
        waveTone="base"
        eyebrow="Sobre el centro"
        title="Una nueva forma de entender la salud y el bienestar"
        description="AURIS es el resultado de treinta años de trabajo en salud. Un espacio donde distintas disciplinas se encuentran para acompañar a la persona completa, en cada etapa de su vida."
      />

      {/* 1 — La historia, como línea de tiempo. En prosa eran tres párrafos
          largos que nadie termina; en hitos se recorre de un vistazo. */}
      <section className="container-auris py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.24em] text-primary-700 uppercase">
              Nuestra historia
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-balance text-primary-800 sm:text-4xl">
              De Kúspide a AURIS
            </h2>

            <ol className="mt-10">
              {milestones.map((milestone, index) => (
                <li
                  key={milestone.when}
                  className="relative grid gap-x-6 gap-y-1 pb-9 pl-8 sm:grid-cols-[8.5rem_1fr] sm:pl-10 last:pb-0"
                >
                  {/* El hilo une los hitos; el último no lo lleva para que la
                      línea no quede colgando en el aire. */}
                  {index < milestones.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-3 bottom-0 left-[0.3125rem] w-px bg-primary-200 sm:left-[0.4375rem]"
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute top-2 left-0 size-2.5 rounded-full bg-primary-500 ring-4 ring-surface-base sm:size-3.5"
                  />

                  <p className="font-serif text-lg leading-tight text-primary-700 sm:text-right">
                    {milestone.when}
                  </p>

                  <div className="sm:row-span-2">
                    <h3 className="font-semibold text-ink-900">
                      {milestone.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-700/80">
                      {milestone.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* La segunda foto crece hasta emparejar el alto de la línea de
              tiempo: fijarle una proporción obligaba a estirar o recortar el
              texto cada vez que se corrige un hito. */}
          <Reveal from="left" delay={0.1} className="h-full">
            <div className="flex h-full flex-col gap-4">
              {storyPhotos.map((photo, index) => (
                <div
                  key={photo.src}
                  className={cn(
                    "relative overflow-hidden rounded-3xl bg-cream-100 shadow-sm",
                    index === 0 ? "aspect-4/5" : "min-h-56 flex-1",
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 380px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — La pregunta. Un solo enunciado grande sobre fondo oscuro: es el
          giro de toda la historia y necesita respirar solo. */}
      <section className="relative isolate overflow-hidden bg-primary-800 py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(120% 90% at 15% 0%, rgba(147,194,124,.4), transparent 60%)",
          }}
        />
        <Leaf
          palette="cream"
          detail="full"
          className="absolute -right-16 -bottom-12 h-64 w-auto -rotate-12 opacity-[0.07]"
        />

        <div className="container-auris relative max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.24em] text-primary-200 uppercase">
              La pregunta que cambió todo
            </p>
            <p className="mt-7 font-serif text-3xl leading-tight text-balance text-cream-50 sm:text-4xl lg:text-[2.75rem]">
              «¿Alcanza con especializarnos cada vez más?»
            </p>
            <span
              aria-hidden
              className="mx-auto mt-8 block h-px w-16 bg-cream-50/40"
            />
            <p className="mt-8 text-base leading-relaxed text-pretty text-cream-100/90 sm:text-lg">
              La especialización es fundamental, pero puede completarse con una
              mirada más amplia: atender a la persona antes de que un problema
              se convierta en enfermedad.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3 — Los valores, en la grilla de tarjetas que ya usa el sitio. */}
      <section className="relative overflow-hidden bg-surface-sage py-20 lg:py-24">
        <LeafScatter pattern="a" />
        <LeafSprig
          palette="beige"
          size="md"
          flip
          seed={17}
          className="bottom-0 right-3 h-44 opacity-40"
        />

        <div className="container-auris relative">
          <SectionHeading
            eyebrow="Enfoque"
            title="Cómo entendemos el cuidado"
            description="La salud implica mucho más que la ausencia de enfermedad. Estos son los cuatro principios que atraviesan todas las especialidades del centro."
            className="mb-14"
          />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal as="li" key={value.title} delay={index * 0.08}>
                <div className="h-full rounded-3xl border border-primary-100 bg-card p-7 shadow-sm">
                  <span
                    aria-hidden
                    className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 ring-1 ring-primary-200"
                  >
                    <value.icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl leading-snug text-balance text-ink-900">
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

      {/* 4 — Adultos mayores. Va con foto para cortar la seguidilla de texto
          antes de los pilares. */}
      <section className="container-auris py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-cream-100 shadow-sm">
              <Image
                src="/TallerAdultos.webp"
                alt="Encuentro del taller de adultos mayores en el centro"
                fill
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.24em] text-primary-700 uppercase">
              Todas las etapas de la vida
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-balance text-primary-800 sm:text-4xl">
              Un lugar para seguir aprendiendo a cualquier edad
            </h2>
            <p className="mt-6 text-base leading-relaxed text-pretty text-ink-700/85">
              La expectativa de vida aumenta y, con ella, la necesidad de
              propuestas que acompañen esa etapa desde varias dimensiones. Por
              eso proyectamos talleres y espacios de encuentro alrededor de la
              comunicación, la actividad neuronal, los vínculos, la respiración,
              el movimiento, la tecnología y la participación social.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5 — Los pilares, numerados como las ramas de odontología: mismo
          vocabulario, así se leen como parte de la misma familia. */}
      <section className="relative overflow-hidden bg-surface-sand py-20 lg:py-24">
        <LeafScatter pattern="c" palette="beige" />

        <div className="container-auris relative">
          <SectionHeading
            eyebrow="Hacia dónde vamos"
            title="Cinco pilares"
            description="La visión de crecimiento del centro, en las cinco líneas sobre las que estamos trabajando."
            className="mb-14"
          />

          <ol className="grid gap-5 lg:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal
                as="li"
                key={pillar.title}
                delay={index * 0.07}
                className={index === 0 ? "lg:col-span-2" : undefined}
              >
                <article className="group flex h-full gap-5 rounded-3xl border border-primary-100 bg-card p-7 shadow-sm transition-[box-shadow,border-color,translate] duration-300 ease-out hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:gap-7 sm:p-8">
                  <span
                    aria-hidden
                    className="shrink-0 font-serif text-4xl leading-none text-primary-200 transition-colors duration-300 group-hover:text-primary-400"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl text-ink-900 sm:text-[1.375rem]">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-pretty text-ink-700/80">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — El cierre. Tres líneas y nada más: es la frase que resume todo y
          compite con cualquier cosa que le pongas al lado. */}
      <section className="container-auris py-20 text-center lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary-700 uppercase">
            Nuestro objetivo
          </p>
          <p className="mt-7 font-serif text-2xl leading-snug text-balance text-primary-800 sm:text-3xl">
            Que cada persona que entra a AURIS se sienta escuchada, contenida y
            cuidada.
          </p>
          <p className="mt-6 text-base leading-relaxed text-pretty text-ink-700/80">
            Que confíe en quienes la atienden y encuentre profesionales
            comprometidos. Porque para nosotros, cuidar la salud también es
            cuidar a la persona.
          </p>
        </Reveal>
      </section>

      <VirtualTour />
      <CtaBanner />
    </>
  );
}
