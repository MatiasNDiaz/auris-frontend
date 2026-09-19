import { Building2, CreditCard, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
    "Servicios, obras sociales, medios de pago, turnos y tratamientos estéticos: respuestas a las consultas más frecuentes sobre AURIS.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

/**
 * Ícono de cada categoría. Vive en la página y no en `faqs.ts` porque es
 * puramente decorativo y solo lo usa esta pantalla; una categoría nueva que
 * todavía no está acá simplemente sale sin ícono, en vez de romper.
 *
 * Comparten lenguaje con los del resto del sitio: "Taller de adultos
 * mayores" y "Tratamientos estéticos" repiten los íconos que ya identifican
 * a esos mismos servicios en `lib/icons.tsx` (`users` y `sparkles`).
 */
const categoryIcons: Record<string, LucideIcon> = {
  "Sobre el centro": Building2,
  "Pagos y cobertura": CreditCard,
  "Taller de adultos mayores": Users,
  "Tratamientos estéticos": Sparkles,
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
        <div className="container-auris mx-auto max-w-3xl space-y-12">
          {Object.entries(grouped).map(([category, items], index) => {
            const Icon = categoryIcons[category];

            return (
              <Reveal key={category} delay={index * 0.08}>
                <div className="mb-5 flex items-center gap-3">
                  {Icon && (
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                      <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                    </span>
                  )}
                  <div>
                    <h2 className="font-serif text-xl text-primary-800 sm:text-2xl">
                      {category}
                    </h2>
                    <span
                      aria-hidden
                      className="mt-2 block h-0.5 w-10 rounded-full bg-primary-500"
                    />
                  </div>
                </div>

                {/* Una sola tarjeta por categoría, con las preguntas
                    separadas por un filete interno: reemplaza a la lista
                    plana de antes, que terminaba en un borde suelto sin nada
                    que la contuviera. */}
                <Accordion
                  type="single"
                  collapsible
                  className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
                >
                  {items.map((faq) => (
                    <AccordionItem
                      key={faq.question}
                      value={faq.question}
                      className="border-b border-border last:border-b-0"
                    >
                      <AccordionTrigger className="px-5 py-5 text-left font-sans text-base font-medium text-ink-900 transition-colors duration-300 hover:no-underline hover:bg-primary-50/60 focus-visible:ring-2 focus-visible:ring-primary-400 sm:px-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5 text-base leading-relaxed text-pretty text-ink-700/85 sm:px-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBanner
        title="¿Tenés otra pregunta?"
        description="Escribinos por WhatsApp y te respondemos a la brevedad, sin compromiso."
      />
    </>
  );
}
