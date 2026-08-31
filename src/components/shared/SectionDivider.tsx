import { cn } from "@/lib/utils";

/**
 * Divisor orgánico entre dos secciones consecutivas.
 *
 * A diferencia de `WaveDivider` —que va absoluto dentro de una sección para
 * poder montarse sobre una foto, como en el Hero— este es un bloque propio que
 * se inserta entre dos secciones. Pinta el fondo de la de arriba (`from`) y
 * recorta la curva con el color de la de abajo (`to`), así que no necesita que
 * la sección padre sea `relative` ni pelea con ningún `z-index`.
 *
 *   <AboutPreview />
 *   <SectionDivider from="base" to="sage" variant="blob" />
 *   <ServicesGrid />
 *
 * Los paths se dibujan sobre un `viewBox` de 1440×200 y se estiran con
 * `preserveAspectRatio="none"`: la altura la fija la clase, de modo que en
 * mobile la curva se aplana en vez de recortarse.
 */

/** Superficies del sitio, mapeadas a fondo y a `currentColor` de la curva. */
const surfaces = {
  base: { bg: "bg-surface-base", text: "text-surface-base" },
  sage: { bg: "bg-surface-sage", text: "text-surface-sage" },
  sand: { bg: "bg-surface-sand", text: "text-surface-sand" },
  cream: { bg: "bg-cream-50", text: "text-cream-50" },
  warm: { bg: "bg-warm-100", text: "text-warm-100" },
  primary: { bg: "bg-primary-700", text: "text-primary-700" },
  ink: { bg: "bg-ink-900", text: "text-ink-900" },
} as const;

export type DividerSurface = keyof typeof surfaces;

/**
 * Cada forma tiene dos trazados: `wide` para desktop y `narrow` —de menos
 * curvas— para mobile, donde el detalle fino se pierde y solo agrega ruido.
 *
 * Todos arrancan en la esquina inferior izquierda, suben al borde de la curva,
 * la recorren con Béziers cúbicas hasta x=1440 y cierran por abajo: lo que
 * queda relleno es la sección de abajo asomando hacia arriba.
 */
const shapes = {
  /**
   * Onda de un solo gesto, pero asimétrica: cresta corrida a la izquierda,
   * valle largo a la derecha y remonte corto al final. Las longitudes de onda
   * son desparejas a propósito, para que no se lea como una sinusoide.
   */
  wave: {
    wide:
      "M0 200 V116 C196 54 388 40 596 72 C804 104 988 170 1188 160 C1276 155 1352 134 1440 104 V200 Z",
    narrow:
      "M0 200 V124 C300 66 560 134 840 118 C1060 106 1266 74 1440 100 V200 Z",
  },
  /**
   * Mancha: un lóbulo alto y angosto sobre el tercio izquierdo, caída abrupta
   * a un valle profundo y un segundo remonte más bajo y ancho. Las tangentes
   * de entrada y salida de cada tramo son distintas, que es lo que le da la
   * sensación de gota y no de onda.
   */
  blob: {
    wide:
      "M0 200 V128 C104 126 186 112 274 84 C398 44 452 14 574 22 C692 30 730 104 842 132 C962 162 1074 128 1184 96 C1282 68 1372 76 1440 106 V200 Z",
    narrow:
      "M0 200 V132 C260 40 520 150 820 128 C1080 109 1268 66 1440 104 V200 Z",
  },
  /**
   * Gota espejada: el lóbulo pesa sobre la derecha. Pensada para alternar con
   * `blob` cuando hay dos divisores cerca y uno espejaría al otro.
   */
  drop: {
    wide:
      "M0 200 V104 C88 78 168 62 268 68 C384 75 452 122 566 138 C668 152 742 130 838 96 C946 58 1046 6 1176 18 C1288 28 1372 62 1440 112 V200 Z",
    narrow:
      "M0 200 V110 C280 60 520 150 800 120 C1040 94 1260 40 1440 96 V200 Z",
  },
} as const;

export type DividerVariant = keyof typeof shapes;

/** Altura del divisor. `sm` para transiciones seguidas, `lg` para un corte fuerte. */
const heights = {
  sm: "h-8 sm:h-12 lg:h-16",
  md: "h-10 sm:h-16 lg:h-24",
  lg: "h-14 sm:h-24 lg:h-32",
} as const;

type SectionDividerProps = {
  /** Superficie de la sección que queda ARRIBA: es el fondo del divisor. */
  from: DividerSurface;
  /** Superficie de la sección que queda ABAJO: es el color de la curva. */
  to: DividerSurface;
  variant?: DividerVariant;
  size?: keyof typeof heights;
  /**
   * Espeja la curva en horizontal. Sirve para alternar entre divisores
   * consecutivos y que no se lea la misma plantilla dos veces.
   */
  flip?: boolean;
  className?: string;
};

export function SectionDivider({
  from,
  to,
  variant = "wave",
  size = "md",
  flip = false,
  className,
}: SectionDividerProps) {
  const shape = shapes[variant];
  const fill = surfaces[to].text;

  const svgClass = cn(
    "block w-full",
    heights[size],
    fill,
    flip && "-scale-x-100",
  );

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none w-full overflow-hidden leading-none",
        surfaces[from].bg,
        className,
      )}
    >
      {/* En mobile va el trazado simplificado: a 40px de alto las curvas
          chicas del `wide` se empastan y no aportan nada. */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className={cn(svgClass, "sm:hidden")}
      >
        <path d={shape.narrow} fill="currentColor" />
      </svg>

      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className={cn(svgClass, "hidden sm:block")}
      >
        <path d={shape.wide} fill="currentColor" />
      </svg>
    </div>
  );
}
