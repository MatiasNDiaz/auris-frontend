import { Quote } from "lucide-react";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { RatingStars } from "@/components/shared/RatingStars";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { testimonials } from "@/lib/data/testimonials";

/**
 * Copias de la lista dentro de la cinta. Tiene que coincidir con el
 * desplazamiento de `@keyframes auris-marquee-right` en `globals.css`
 * (un tercio del ancho total).
 */
const COPIES = 3;

/** "María Elena Gómez" -> "MG": primera y última inicial. */
function initials(name: string) {
  const parts = name.split(" ").filter((part) => part.length > 1);
  if (parts.length === 0) return "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (parts[0][0] + last).toUpperCase();
}

/**
 * Reseñas en cinta continua hacia la derecha.
 *
 * El movimiento es una animación CSS sobre `transform` —no hay estado de
 * página ni temporizador en JS—, así que el componente puede quedarse del lado
 * del servidor. Se frena con el puntero encima o al tabular una tarjeta.
 */
export function TestimonialsSlider() {
  return (
    <section className="relative overflow-hidden bg-surface-sage py-20 lg:py-28">
      {/* Follaje de fondo, en la misma línea que el resto de la landing. */}
      <LeafScatter pattern="a" />
      <LeafSprig palette="green" size="lg" className="-bottom-8 left-2 h-56 opacity-55 lg:h-72" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/4 size-96 rounded-full bg-primary-200/30 blur-3xl"
      />

      <div className="container-auris relative">
        <SectionHeading
          eyebrow="Testimonios"
          title="Lo que dicen nuestros pacientes"
          description="Experiencias reales que nos inspiran a seguir creciendo."
        />
      </div>

      {/* La cinta se sale del container a propósito: recorre todo el ancho de
          la ventana, que es lo que hace que el bucle se lea como continuo. */}
      <div
        data-decor=""
        className="auris-marquee relative mt-14 overflow-hidden [--marquee-duration:70s]"
      >
        {/* Los bordes se funden con el fondo para que las tarjetas entren y
            salgan en vez de cortarse contra el filo de la pantalla. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-surface-sage to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-surface-sage to-transparent sm:w-28"
        />

        <ul className="auris-marquee-track flex w-max gap-6 px-3 py-2">
          {Array.from({ length: COPIES }).flatMap((_, copy) =>
            testimonials.map((testimonial) => (
              <li
                key={`${copy}-${testimonial.authorName}`}
                // Solo la primera copia se anuncia: las otras dos existen para
                // que el bucle no tenga costura, no para volver a leerse.
                aria-hidden={copy > 0}
                className="w-76 shrink-0 sm:w-88"
              >
                <figure className="flex h-full flex-col rounded-3xl border border-primary-100 bg-card p-7 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <Quote
                      className="size-7 shrink-0 text-primary-300"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <RatingStars rating={testimonial.rating} />
                  </div>

                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-pretty text-ink-700/90">
                    {testimonial.content}
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-primary-100 pt-5">
                    <span
                      aria-hidden
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-600 font-semibold text-cream-50"
                    >
                      {initials(testimonial.authorName)}
                    </span>
                    <span className="font-medium text-ink-900">
                      {testimonial.authorName}
                    </span>
                  </figcaption>
                </figure>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
