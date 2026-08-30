"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

/** "María Elena G." -> "ME" */
function initials(name: string) {
  return name
    .split(" ")
    .filter((part) => part.length > 1)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function TestimonialsSlider() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const perPage = isDesktop ? 3 : 1;
  const pageCount = Math.ceil(testimonials.length / perPage);

  const [[page, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  // Al cambiar el ancho cambia la cantidad de páginas: acotamos la actual.
  const safePage = Math.min(page, pageCount - 1);

  const paginate = useCallback(
    (step: number) => {
      setState(([current]) => {
        const bounded = Math.min(current, pageCount - 1);
        return [(bounded + step + pageCount) % pageCount, step];
      });
    },
    [pageCount],
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paginate, paused]);

  const visible = testimonials.slice(
    safePage * perPage,
    safePage * perPage + perPage,
  );

  return (
    <section className="bg-primary-50 py-20 lg:py-28">
      <div className="container-auris">
        <SectionHeading
          eyebrow="Testimonios"
          title="Lo que dicen nuestros pacientes"
          description="Experiencias reales que nos inspiran a seguir creciendo."
          className="mb-14"
        />

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="min-h-72 lg:min-h-64">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.ul
                key={safePage}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="grid gap-6 lg:grid-cols-3"
                aria-live="polite"
              >
                {visible.map((testimonial) => (
                  <li key={testimonial.authorName}>
                    <figure className="flex h-full flex-col rounded-3xl border border-primary-100 bg-card p-7 shadow-sm">
                      <Quote
                        className="size-7 text-primary-300"
                        strokeWidth={1.5}
                        aria-hidden
                      />

                      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-pretty text-ink-700/90">
                        {testimonial.content}
                      </blockquote>

                      <figcaption className="mt-6 flex items-center gap-3 border-t border-primary-100 pt-5">
                        <span
                          aria-hidden
                          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-600 font-semibold text-cream-50"
                        >
                          {initials(testimonial.authorName)}
                        </span>
                        <span>
                          <span className="block font-medium text-ink-900">
                            {testimonial.authorName}
                          </span>
                          <span
                            className="mt-0.5 flex items-center gap-0.5"
                            aria-label={`Puntuación: ${testimonial.rating} de 5`}
                          >
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                aria-hidden
                                className={cn(
                                  "size-3.5",
                                  i < testimonial.rating
                                    ? "fill-accent-400 text-accent-400"
                                    : "text-primary-200",
                                )}
                              />
                            ))}
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <div className="mt-9 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Testimonios anteriores"
              className="inline-flex size-11 items-center justify-center rounded-full border border-primary-200 bg-card text-primary-700 transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir al grupo de testimonios ${i + 1}`}
                  aria-current={i === safePage}
                  onClick={() => setState([i, i > safePage ? 1 : -1])}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                    i === safePage
                      ? "w-7 bg-primary-600"
                      : "w-2 bg-primary-200 hover:bg-primary-300",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Testimonios siguientes"
              className="inline-flex size-11 items-center justify-center rounded-full border border-primary-200 bg-card text-primary-700 transition-colors hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
