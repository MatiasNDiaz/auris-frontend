import {
  ArrowRight,
  Building2,
  Check,
  HeartPulse,
  Play,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ShineButton } from "@/components/shared/ShineButton";
import { BLUR_DATA_URL } from "@/lib/blur";

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
      <LeafSprig palette="green" size="lg" className="-bottom-8 left-2 h-56 opacity-60 lg:h-72" />
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

        <Reveal from="right" className="order-1 lg:order-2">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -top-6 -right-6 size-40 rounded-full bg-primary-200/60 blur-2xl"
            />

            <div className="relative aspect-4/3 overflow-hidden rounded-[2.5rem] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1505410603994-c3ac6269711f?q=80&w=1400&auto=format&fit=crop"
                alt="Recepción del centro AURIS"
                fill
                sizes="(max-width: 1024px) 92vw, 620px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-primary-900/25" />

              <Link
                href="/sobre-el-centro#recorrido-virtual"
                aria-label="Ver el recorrido virtual del centro"
                className="group absolute inset-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
              >
                <span
                  aria-hidden
                  className="inline-flex size-18 items-center justify-center rounded-full bg-cream-50/95 text-primary-700 shadow-lg transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="ml-1 size-7 fill-current" strokeWidth={0} />
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
