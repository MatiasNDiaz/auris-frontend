import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHeader } from "@/components/shared/PageHeader";
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
        eyebrow="Preguntas frecuentes"
        title="Lo que más nos consultan"
        description="Reunimos las dudas que aparecen con más frecuencia. Si no encontrás la tuya, escribinos y te respondemos."
      />

      <section className="container-auris py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-14">
          {Object.entries(grouped).map(([category, items], index) => (
            <Reveal key={category} delay={index * 0.06}>
              <h2 className="font-serif text-2xl text-ink-900">{category}</h2>

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
