import { Leaf, LeafShape } from "./leaf-art";
import { RatingStars } from "./RatingStars";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

/** "María Elena Gómez" -> "MG": primera y última inicial. */
function initials(name: string) {
  const parts = name.split(" ").filter((part) => part.length > 1);
  if (parts.length === 0) return "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (parts[0][0] + last).toUpperCase();
}

/**
 * Comilla de apertura, dibujada con dos hojas.
 *
 * Reemplaza al ícono genérico de comillas: son las dos mismas láminas del
 * isotipo, inclinadas y en tamaño chico, ocupando el lugar donde iría la
 * comilla. Se lee como una cita y como parte del follaje al mismo tiempo, que
 * es justo lo que no lograba el glifo tipográfico.
 */
function OrganicQuote({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      aria-hidden
      className={cn("pointer-events-none select-none", className)}
    >
      {[1, 22].map((x) => (
        <g key={x} transform={`translate(${x} 2) rotate(42) scale(0.185)`}>
          <LeafShape palette="green" detail="veined" />
        </g>
      ))}
    </svg>
  );
}

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

/**
 * Tarjeta de reseña.
 *
 * Misma familia que las de servicio y profesional: el mismo radio, el mismo
 * borde verde claro, la misma sombra en reposo y el mismo gesto al pasar el
 * cursor. El hover va por CSS y no por Framer para que no compita con el
 * arrastre del carrusel, y la lista de propiedades nombra `translate` porque
 * es lo que emite Tailwind v4 para las utilidades de desplazamiento.
 */
export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100 bg-card p-7 shadow-sm",
        "transition-[box-shadow,border-color,translate] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {/* Hoja de marca de agua en la esquina. Sin degradé —no hace falta a esta
          opacidad— y recortada por el `overflow-hidden` de la tarjeta. */}
      <Leaf
        palette="green"
        detail="full"
        className="absolute -top-8 -right-12 h-28 w-auto rotate-[26deg] opacity-[0.13]"
      />

      <header className="relative flex items-start justify-between gap-4">
        <OrganicQuote className="h-7 w-auto shrink-0" />
        <RatingStars rating={testimonial.rating} />
      </header>

      <blockquote className="relative mt-5 flex-1 text-base leading-relaxed text-pretty text-ink-700/90">
        {testimonial.content}
      </blockquote>

      <figcaption className="relative mt-6 flex items-center gap-3 border-t border-primary-100 pt-5">
        <span
          aria-hidden
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-800 ring-1 ring-primary-200"
        >
          {initials(testimonial.authorName)}
        </span>
        <span className="font-medium text-ink-900">
          {testimonial.authorName}
        </span>
      </figcaption>
    </figure>
  );
}
