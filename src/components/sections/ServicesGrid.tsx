import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";

type ServicesGridProps = {
  /** En la Home mostramos el encabezado y el CTA; en /servicios no hacen falta. */
  withHeading?: boolean;
};

export function ServicesGrid({ withHeading = true }: ServicesGridProps) {
  return (
    <section className="container-auris py-20 lg:py-28">
      {withHeading && (
        <SectionHeading
          eyebrow="Nuestros servicios"
          title="Siete especialidades, un mismo enfoque"
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
              <Button
                asChild
                className="mx-auto mt-6 w-fit rounded-full bg-cream-50 font-semibold text-primary-800 hover:bg-cream-100"
              >
                <Link href="/contacto">
                  Hacer una consulta
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </Reveal>
        )}
      </ul>
    </section>
  );
}
