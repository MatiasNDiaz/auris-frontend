import { cn } from "@/lib/utils";

/**
 * Divisor de onda para el borde inferior de una sección.
 *
 * Cada `variant` es una curva distinta —amplia y de un solo gesto, no una onda
 * repetitiva— para que las secciones no se sientan cortadas con la misma
 * plantilla. El SVG se estira con `preserveAspectRatio="none"`: la altura la
 * fija la clase, así que en mobile la curva se aplana en vez de recortarse.
 */

const shapes = {
  /** Hero: caída amplia y asimétrica, el gesto más marcado del sitio. */
  hero: "M0 160V58c180 62 372 84 560 52 176-30 300-84 452-96 148-12 288 22 428 74v72z",
  /** Curva suave y pareja, casi un arco. */
  gentle: "M0 160V72c240 56 480 76 720 60s480-64 720-60v88z",
  /** Valle profundo al centro. */
  valley: "M0 160V44c220 92 470 116 720 92 250-24 500-72 720-92v116z",
  /** Cresta: sube al centro y baja hacia los bordes. */
  crest: "M0 160V96c250-72 500-96 720-64 220 32 470 60 720-4v132z",
  /** Pendiente continua de izquierda a derecha. */
  slope: "M0 160V40c320 84 640 108 960 78 160-16 320-46 480-70v112z",
  /** Doble seno, largo y de amplitud baja. */
  ripple:
    "M0 160V84c180-40 340 18 520 34 180 16 340-30 520-46 180-16 340 26 400 44v44z",
  /** Hombro alto a la izquierda que se relaja hacia la derecha. */
  shoulder: "M0 160V52c200 74 420 96 660 66 240-30 500-58 780-30v72z",
  /** Curva breve, apenas insinuada. */
  soft: "M0 160V112c240 40 480 56 720 40s480-56 720-48v56z",
} as const;

export type WaveVariant = keyof typeof shapes;

type WaveDividerProps = {
  variant?: WaveVariant;
  /** Color de la curva: debe ser el de la sección que viene abajo. */
  className?: string;
  /** Espeja horizontalmente, para alternar entre secciones. */
  flip?: boolean;
};

export function WaveDivider({
  variant = "gentle",
  className,
  flip = false,
}: WaveDividerProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-10 block h-12 w-full sm:h-16 lg:h-24",
        flip && "-scale-x-100",
        className,
      )}
    >
      <path d={shapes[variant]} fill="currentColor" />
    </svg>
  );
}
