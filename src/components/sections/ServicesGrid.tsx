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
          description="Cada disciplina trabaja con su propia mirada, pero todas comparten la misma forma de acompañar: con tiempo, claridad y seguimiento."
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
            <div className="flex h-full flex-col justify-center rounded-3xl border border-dashed border-primary-300 bg-primary-50/60 p-7 text-center">
              <p className="font-serif text-xl text-primary-700">
                ¿No sabés por dónde empezar?
              </p>
              <p className="mt-2 text-sm text-ink-700/80">
                Escribinos y te orientamos hacia la especialidad adecuada.
              </p>
              <Button
                asChild
                variant="ghost"
                className="mt-4 rounded-full text-primary-600 hover:bg-primary-100"
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
