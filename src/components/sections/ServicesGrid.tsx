import { ArrowRight } from "lucide-react";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ShineButton } from "@/components/shared/ShineButton";
import { services } from "@/lib/data/services";

type ServicesGridProps = {
  /** En la Home mostramos el encabezado y el CTA; en /servicios no hacen falta. */
  withHeading?: boolean;
};

export function ServicesGrid({ withHeading = true }: ServicesGridProps) {
  return (
    <section className="relative overflow-hidden bg-surface-sage py-20 lg:py-28">
      <LeafScatter pattern="b" />
      <LeafSprig palette="beige" size="lg" flip className="-bottom-10 right-2 h-60 opacity-60 lg:h-76" />
      <div className="container-auris relative">
        {withHeading && (
          <SectionHeading
            eyebrow="Nuestros servicios"
            title="Seis especialidades, un mismo enfoque"
            description="Brindamos una atención integral en diferentes áreas para acompañarte en cada etapa de tu bienestar."
            className="mb-14"
          />
        )}

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={(index % 3) * 0.1}>
              <ServiceCard service={service} />
            </Reveal>
          ))}

          {withHeading && (
            <Reveal as="li" delay={0.1}>
              <div className="flex h-full flex-col justify-center rounded-3xl bg-primary-600 p-8 text-center">
                <p className="font-serif text-2xl text-balance text-cream-50">
                  ¿No sabés por dónde empezar?
                </p>
                <p className="mt-3 text-sm leading-relaxed text-primary-100">
                  Escribinos y te orientamos hacia la especialidad adecuada.
                </p>
                <ShineButton
                  href="/contacto"
                  tone="light"
                  effect="halo"
                  className="mx-auto mt-6 w-fit"
                >
                  Hacer una consulta
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </ShineButton>
              </div>
            </Reveal>
          )}
        </ul>
      </div>
    </section>
  );
}
