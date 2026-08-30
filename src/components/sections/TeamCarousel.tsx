"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProfessionalCard } from "@/components/shared/ProfessionalCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { professionals } from "@/lib/data/professionals";
import { cn } from "@/lib/utils";

/**
 * Carousel con scroll nativo (snap) en lugar de transform manual: mantiene el
 * gesto táctil del sistema, funciona sin JS y evita romper el `layoutId` de
 * las fotos, que necesita medir posiciones reales en el DOM.
 */
export function TeamCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState({ prev: false, next: true });

  const syncState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScroll({
      prev: scrollLeft > 8,
      next: scrollLeft < scrollWidth - clientWidth - 8,
    });

    const card = track.firstElementChild as HTMLElement | null;
    if (card) {
      const step = card.offsetWidth + 24; // ancho de card + gap
      setActiveIndex(Math.round(scrollLeft / step));
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncState();
    track.addEventListener("scroll", syncState, { passive: true });
    window.addEventListener("resize", syncState);
    return () => {
      track.removeEventListener("scroll", syncState);
      window.removeEventListener("resize", syncState);
    };
  }, [syncState]);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollTo({ left: index * (card.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="container-auris">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Nuestro equipo"
            title="Profesionales que te acompañan"
            description="Cada integrante del equipo trabaja en su especialidad y en articulación con el resto del centro."
            align="left"
            className="md:mb-0"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              disabled={!canScroll.prev}
              aria-label="Ver profesionales anteriores"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none disabled:opacity-35 disabled:hover:bg-card"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              disabled={!canScroll.next}
              aria-label="Ver profesionales siguientes"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none disabled:opacity-35 disabled:hover:bg-card"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {professionals.map((professional) => (
            <li
              key={professional.slug}
              className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-[45vw] lg:w-[calc((min(80rem,100vw)-6rem-4.5rem)/4)]"
            >
              <ProfessionalCard
                professional={professional}
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 320px"
              />
            </li>
          ))}
        </ul>

        <div className="container-auris mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2" role="tablist" aria-label="Ir a un profesional">
            {professionals.map((professional, index) => (
              <button
                key={professional.slug}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Ir a ${professional.name}`}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                  index === activeIndex
                    ? "w-7 bg-primary-500"
                    : "w-2 bg-primary-200 hover:bg-primary-300",
                )}
              />
            ))}
          </div>

          <Button
            asChild
            variant="ghost"
            className="rounded-full text-primary-600 hover:bg-primary-50"
          >
            <Link href="/profesionales">
              Ver todo el equipo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
