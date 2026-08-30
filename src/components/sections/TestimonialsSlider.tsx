"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

const variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -48 }),
};

export function TestimonialsSlider() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((step: number) => {
    setState(([current]) => [
      (current + step + testimonials.length) % testimonials.length,
      step,
    ]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paginate, paused]);

  const testimonial = testimonials[index];

  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="container-auris">
        <SectionHeading
          eyebrow="Testimonios"
          title="Lo que cuentan nuestros pacientes"
          description="Experiencias reales de personas que eligieron acompañarse con nuestro equipo."
          className="mb-14"
        />

        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="relative min-h-72 sm:min-h-64">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.figure
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:p-12"
                aria-live="polite"
              >
                <Quote
                  className="size-8 text-accent-300"
                  strokeWidth={1.5}
                  aria-hidden
                />

                <blockquote className="mt-5 font-serif text-xl leading-relaxed text-pretty text-ink-900 sm:text-2xl">
                  {testimonial.content}
                </blockquote>

                <figcaption className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-medium text-ink-900">
                    {testimonial.authorName}
                  </span>
                  <span
                    className="flex items-center gap-0.5"
                    aria-label={`Puntuación: ${testimonial.rating} de 5`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        aria-hidden
                        className={cn(
                          "size-4",
                          i < testimonial.rating
                            ? "fill-accent-400 text-accent-400"
                            : "text-primary-200",
                        )}
                      />
                    ))}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Testimonio anterior"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={item.authorName}
                  type="button"
                  aria-label={`Ver testimonio de ${item.authorName}`}
                  aria-current={i === index}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                    i === index
                      ? "w-7 bg-primary-500"
                      : "w-2 bg-primary-200 hover:bg-primary-300",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Testimonio siguiente"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
