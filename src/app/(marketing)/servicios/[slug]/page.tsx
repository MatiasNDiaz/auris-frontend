import {
  ArrowLeft,
  Baby,
  Bolt,
  Check,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProfessionalCard } from "@/components/shared/ProfessionalCard";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getProfessionalsByService } from "@/lib/data/professionals";
import { getServiceBySlug, services } from "@/lib/data/services";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { ToothIcon } from "@/components/shared/ToothIcon";
import { renderServiceIcon } from "@/lib/icons";

/**
 * Íconos de las ramas de un servicio. Van acá y no en `lib/icons`, que es el
 * mapa de los servicios en sí: son dos vocabularios distintos y mezclarlos
 * obligaría a cargar todos los íconos de ramas en cada tarjeta del sitio.
 */
const branchIcons: Record<string, (props: { className: string }) => ReactNode> =
  {
    tooth: (props) => <ToothIcon {...props} strokeWidth={1.5} />,
    implant: (props) => <Bolt {...props} strokeWidth={1.5} />,
    baby: (props) => <Baby {...props} strokeWidth={1.5} />,
    aligner: (props) => <Layers {...props} strokeWidth={1.5} />,
    ortho: (props) => <SlidersHorizontal {...props} strokeWidth={1.5} />,
  };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: service.shortDescription,
    alternates: { canonical: `/servicios/${service.slug}` },
  };
}

export default async function ServicioDetallePage({
  params,
}: PageProps<"/servicios/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const team = getProfessionalsByService(service.slug);

  return (
    <>
      {/* Banner del servicio: foto full-bleed con el nombre superpuesto, con
          el mismo criterio de overlay neutro que usa el Hero. */}
      <header className="relative isolate flex min-h-100 items-end overflow-hidden lg:min-h-120">
        <Image
          src={service.imageUrl}
          alt=""
          fill
          sizes="100vw"
          priority
          className="-z-20 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/45 to-black/25"
        />

        <div className="container-auris relative w-full pt-24 pb-14 lg:pt-28 lg:pb-16">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-cream-100 transition-colors hover:text-cream-50 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Todos los servicios
          </Link>

          <Reveal className="mt-8 text-center">
            <span
              aria-hidden
              className="inline-flex size-16 items-center justify-center rounded-2xl bg-cream-50/95 text-primary-700 shadow-lg"
            >
              {renderServiceIcon(service.icon, {
                className: "size-8",
                strokeWidth: 1.5,
              })}
            </span>
          </Reveal>

          <SectionHeading
            as="h1"
            eyebrow={service.tagline}
            title={service.name}
            description={service.shortDescription}
            tone="light"
            className="mt-6"
          />
        </div>
      </header>

      <section className="container-auris py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
              Cómo trabajamos
            </h2>
            <p className="mt-5 text-base leading-relaxed text-pretty text-ink-700/85">
              {service.fullDescription}
            </p>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
              <h2 className="font-serif text-xl text-ink-900">Qué incluye</h2>
              <ul className="mt-5 space-y-3.5">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-700/85">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <WhatsAppButton
                className="mt-7 w-full"
                message={`¡Hola AURIS! Quisiera consultar por un turno de ${service.name}.`}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Solo lo tiene odontología: es el área que reúne varias especialidades
          con entidad propia, y el detalle se queda corto sin desplegarlas. */}
      {service.branches && (
        <section className="relative overflow-hidden bg-surface-sage py-20 lg:py-24">
          <LeafScatter pattern="b" />
          <LeafSprig
            palette="beige"
            size="md"
            flip
            seed={16}
            className="bottom-0 right-3 h-44 opacity-40"
          />

          <div className="container-auris relative">
            <SectionHeading
              eyebrow="Áreas del servicio"
              title="Cinco especialidades bajo el mismo techo"
              description="Cada rama tiene su propio abordaje y sus propios tiempos. Estas son las que cubrimos y cómo trabaja cada una."
              className="mb-14"
            />

            {/* La primera ocupa el ancho completo: es la que ordena la lectura
                y evita que cinco tarjetas en dos columnas dejen un hueco. */}
            <ol className="grid gap-5 lg:grid-cols-2">
              {service.branches.map((branch, index) => (
                <Reveal
                  as="li"
                  key={branch.name}
                  delay={index * 0.07}
                  className={index === 0 ? "lg:col-span-2" : undefined}
                >
                  <article className="group flex h-full gap-5 rounded-3xl border border-primary-100 bg-card p-7 shadow-sm transition-[box-shadow,border-color,translate] duration-300 ease-out hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl sm:gap-7 sm:p-8 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <span
                      aria-hidden
                      className="hidden shrink-0 font-serif text-4xl leading-none text-primary-200 transition-colors duration-300 group-hover:text-primary-400 sm:block"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 ring-1 ring-primary-200 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-cream-50"
                        >
                          {(branchIcons[branch.icon] ?? branchIcons.tooth)({
                            className: "size-5",
                          })}
                        </span>
                        <h3 className="font-serif text-xl text-ink-900 sm:text-[1.375rem]">
                          {branch.name}
                        </h3>
                      </div>

                      <p className="mt-3.5 text-sm leading-relaxed text-pretty text-ink-700/80">
                        {branch.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="bg-surface-sand py-20 lg:py-24">
          <div className="container-auris">
            <SectionHeading
              eyebrow="Equipo"
              title={`Profesionales de ${service.name.toLowerCase()}`}
              className="mb-12"
            />

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((professional, index) => (
                <Reveal as="li" key={professional.slug} delay={index * 0.08}>
                  <ProfessionalCard
                    professional={professional}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner
        title={`¿Querés empezar con ${service.name.toLowerCase()}?`}
        description="Escribinos por WhatsApp y coordinamos una primera consulta con el profesional disponible."
      />
    </>
  );
}
