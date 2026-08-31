"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Estrella de cinco puntas, en el mismo sistema de 24×24 que los íconos. */
const STAR =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

type RatingStarsProps = {
  /** Puntuación de 0 a 5. */
  rating: number;
  className?: string;
};

/**
 * Puntuación en estrellas doradas.
 *
 * El relleno es un degradé vertical —claro arriba, profundo abajo— más un
 * halo suave por debajo: un dorado plano se lee apagado sobre el fondo salvia
 * de la sección. El `<linearGradient>` se declara una vez por instancia y su
 * id sale de `useId`, para que dos listados en la misma página no compartan
 * la misma definición.
 */
export function RatingStars({ rating, className }: RatingStarsProps) {
  // `useId` devuelve un valor con dos puntos y eso complica la referencia
  // `url(#…)` en algunos navegadores; se los sacamos.
  const gradientId = `gold-${useId().replace(/:/g, "")}`;

  return (
    <span
      role="img"
      aria-label={`Puntuación: ${rating} de 5`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;

        return (
          <svg
            key={index}
            viewBox="0 0 24 24"
            aria-hidden
            className={cn(
              "size-4",
              filled && "drop-shadow-[0_1px_1.5px_rgba(201,143,36,0.45)]",
            )}
          >
            {/* Una sola definición para todas: las `defs` son de documento, así
                que alcanza con declararla en la primera estrella. */}
            {index === 0 && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold-200)" />
                  <stop offset="40%" stopColor="var(--color-gold-300)" />
                  <stop offset="100%" stopColor="var(--color-gold-500)" />
                </linearGradient>
              </defs>
            )}

            <path
              d={STAR}
              fill={filled ? `url(#${gradientId})` : "var(--color-primary-200)"}
            />
          </svg>
        );
      })}
    </span>
  );
}
