import { Compass, HeartHandshake, Leaf, Users } from "lucide-react";
import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHeader } from "@/components/shared/PageHeader";
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { VirtualTour } from "@/components/sections/VirtualTour";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre el centro",
  description:
    "Conocé la historia, el enfoque de atención y los valores de AURIS, centro de salud y bienestar integral.",
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
  {
    src: "/images/galeria/pasillo-01.webp",
    alt: "Pasillo del centro hacia los consultorios",
  },
  {
    src: "/images/galeria/odontologia-1-01.webp",
    alt: "Consultorio odontológico del centro",
  },
];

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
        surface="sand"
        wave="valley"
        waveTone="base"
        eyebrow="Sobre el centro"
        title="Un lugar donde la salud se piensa completa"
        description="Empezamos como Kúspide, consultorios odontológicos en Cerro de las Rosas. Hoy somos AURIS: el mismo equipo, el mismo lugar y una idea más grande de lo que significa cuidar a alguien."
      />

      <section className="container-auris py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-center font-serif text-3xl leading-tight text-balance text-primary-800 sm:text-4xl">
              Nuestra historia
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-pretty text-ink-700/85">
              <p>
                Durante años fuimos <strong className="font-semibold text-primary-800">Kúspide,
                consultorios odontológicos</strong>. Con el tiempo pasó algo que no
                estaba en el plan: quienes venían por una consulta dental
                empezaron a preguntarnos por un kinesiólogo, por alguien que
                los escuchara, por un tratamiento de piel. Y nosotros
                empezamos a notar que detrás de cada síntoma había una historia
                más larga que la que entraba en una ficha odontológica.
              </p>
              <p>
                Así fuimos sumando kinesiología, estética facial y corporal,
                psicología y fonoaudiología. En algún momento quedó claro que el
                nombre se nos había quedado chico: seguíamos siendo los mismos,
                pero ya no éramos un consultorio odontológico.
              </p>
              <p>
                De ahí nace{" "}
                <strong className="font-semibold text-primary-800">AURIS</strong>. Un
                nombre nuevo para la misma esencia: acompañarte en tu salud y tu
                bienestar, con el equipo de siempre y en el mismo lugar de
                siempre, sobre {siteConfig.address.street}.
              </p>
            </div>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            {/* Cuatro fotos reales del centro: la fachada, la recepción con el
                logo nuevo, el pasillo y un consultorio. */}
            <div className="grid grid-cols-2 gap-4">
              {storyPhotos.map((photo, index) => (
                <div
                  key={photo.src}
                  className={cn(
                    "relative overflow-hidden rounded-3xl bg-cream-100 shadow-sm",
                    index % 3 === 0 ? "aspect-4/5" : "aspect-square",
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 45vw, 300px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface-sage py-20 lg:py-24">
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
                    className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"
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
