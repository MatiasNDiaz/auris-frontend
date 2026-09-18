import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHeader } from "@/components/shared/PageHeader";
import { bannerDeSeccion } from "@/lib/banners-secciones";
import { Reveal } from "@/components/shared/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqsByCategory } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre turnos, coberturas, tratamientos y las instalaciones de AURIS.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default function PreguntasFrecuentesPage() {
  const grouped = getFaqsByCategory();

  return (
    <>
      <PageHeader
        surface="sage"
        wave="soft"
        waveTone="base"
        foto={bannerDeSeccion("preguntas-frecuentes")}
        fotoFoco="center 100%"
        fotoAlt="Recepción de AURIS con el cartel del centro en la pared"
        eyebrow="Preguntas frecuentes"
        title="Lo que más nos consultan"
        description="Reunimos las dudas que aparecen con más frecuencia. Si no encontrás la tuya, escribinos y te respondemos."
      />

      {/* El fondo va declarado y no heredado del body: la curva del encabezado
          se pinta con el color de lo que sigue, y el del body es apenas más
          claro. Esa diferencia dibujaba una línea recta justo debajo de la
          onda, que es lo que la curva viene a evitar. */}
      <section className="bg-surface-base py-16 lg:py-20">
        <div className="container-auris mx-auto max-w-3xl space-y-14">
          {Object.entries(grouped).map(([category, items], index) => (
            <Reveal key={category} delay={index * 0.06}>
              <h2 className="text-center font-serif text-2xl text-primary-800">
                {category}
                <span
                  aria-hidden
                  className="mx-auto mt-4 block h-0.5 w-12 rounded-full bg-primary-500"
                />
              </h2>

              <Accordion type="single" collapsible className="mt-5">
                {items.map((faq) => (
                  <AccordionItem
                    key={faq.question}
                    value={faq.question}
                    className="border-b border-border"
                  >
                    <AccordionTrigger className="py-5 text-left font-sans text-base font-medium text-ink-900 hover:no-underline focus-visible:ring-2 focus-visible:ring-primary-400">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-base leading-relaxed text-pretty text-ink-700/85">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="¿Tenés otra pregunta?"
        description="Escribinos por WhatsApp y te respondemos a la brevedad, sin compromiso."
      />
    </>
  );
}
