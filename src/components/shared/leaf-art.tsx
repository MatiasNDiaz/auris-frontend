import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Hoja botánica detallada, en la paleta del isotipo.
 *
 * Se dibuja sobre un sistema local de 120×56 con el eje mayor horizontal —base
 * en (6,28), punta en (114,28)— para que rotarla sea un solo `rotate` sin
 * tener que recalcular nada. Todo el detalle vive en ese sistema:
 *
 *   1. lámina, con el margen levemente asimétrico entre mitad y mitad;
 *    2. degradé propio, más claro sobre el nervio y más saturado en el borde;
 *    3. nervio central;
 *    4. cinco pares de venas laterales, abiertas hacia la punta;
 *    5. venillas finas entre pares;
 *    6. pecíolo.
 *
 * `detail` recorta ese despliegue segun el tamano al que se dibuje la hoja:
 *
 *   - `full`    — todo: diez venas y ocho venillas. Para hojas sueltas grandes.
 *   - `veined`  — nervio y tres pares de venas. Es el nivel de los tallos: a
 *                 30-40px se leen como textura, mientras que los diez pares de
 *                 `full` se empastan en una mancha y solo suman nodos al DOM.
 *   - `simple`  — nervio y nada mas. Para las hojas de 20px o menos.
 */

export const leafPalettes = {
  /** Hoja verde del isotipo. */
  green: {
    edge: "var(--color-primary-400)",
    body: "var(--color-primary-200)",
    core: "var(--color-primary-100)",
    vein: "var(--color-primary-600)",
  },
  /** Hoja beige/marrón claro del isotipo. */
  beige: {
    edge: "var(--color-warm-300)",
    body: "var(--color-warm-200)",
    core: "var(--color-warm-100)",
    vein: "var(--color-accent-500)",
  },
  /** Marrón oscuro, para contraste sobre fondos claros. */
  brown: {
    edge: "var(--color-accent-500)",
    body: "var(--color-accent-300)",
    core: "var(--color-accent-200)",
    vein: "var(--color-accent-700)",
  },
  /** Crema, para fondos verdes u oscuros. */
  cream: {
    edge: "var(--color-cream-200)",
    body: "var(--color-cream-100)",
    core: "var(--color-cream-50)",
    vein: "var(--color-cream-300)",
  },
} as const;

/**
 * Altura del arranque del pecíolo dentro del sistema local de la hoja.
 *
 * El dibujo nace en (0, 28), no en el origen del lienzo: quien quiera apoyar la
 * hoja sobre un punto tiene que compensar ese desfasaje o el punto le va a caer
 * en el medio de la lámina.
 */
export const LEAF_ANCHOR_Y = 28;

export type LeafPalette = keyof typeof leafPalettes;
export type LeafDetail = "full" | "veined" | "simple";

/** Contorno de la lámina. La mitad de abajo abre un poco más que la de arriba. */
const BLADE =
  "M6 28C18 9 44 0 74 3c17 2 31 9 40 25-9 16-23 24-40 26-31 3-57-7-68-26Z";

/** Nervio central, de la base a la punta. */
const MIDRIB = "M9 28C38 26 76 26 111 28";

/** Venas laterales: cinco arriba y cinco abajo, abriéndose hacia la punta. */
const VEINS_TOP = [
  "M17 26C24 19 32 14 42 11",
  "M31 25C40 18 50 13 61 10",
  "M47 24C57 17 67 13 78 11",
  "M64 24C73 18 83 14 92 13",
  "M80 25C88 20 95 17 102 16",
];
const VEINS_BOTTOM = [
  "M17 30C24 37 32 42 42 45",
  "M31 31C40 38 50 43 61 46",
  "M47 32C57 39 67 43 78 45",
  "M64 32C73 38 83 42 92 43",
  "M80 31C88 36 95 39 102 40",
];

/** Venillas cortas entre pares, lo que le da la textura de hoja real. */
const VEINLETS = [
  "M24 27C28 24 32 22 36 21",
  "M39 26C43 23 47 21 52 20",
  "M55 25C60 22 64 20 69 19",
  "M72 25C76 22 81 20 85 19",
  "M24 29C28 32 32 34 36 35",
  "M39 30C43 33 47 35 52 36",
  "M55 31C60 34 64 36 69 37",
  "M72 31C76 34 81 36 85 37",
];

/** Nivel intermedio: un par cerca de la base, otro al medio y otro en la punta. */
const VEINED_INDEXES = [0, 2, 4] as const;

type LeafShapeProps = {
  palette?: LeafPalette;
  detail?: LeafDetail;
  /**
   * Id del degradé; tiene que ser único dentro del documento. Sin él la lámina
   * va en color plano, que es lo que corresponde en las hojas chicas de los
   * tallos: a 20px el degradé no se percibe y solo suma un `<defs>` por hoja.
   */
  gradientId?: string;
};

/**
 * Solo las formas, sin `<svg>` alrededor: así el mismo dibujo sirve suelto
 * (`<Leaf />`) y repetido dentro del tallo (`<LeafSprig />`) sin duplicar SVGs
 * anidados.
 */
export function LeafShape({
  palette = "green",
  detail = "full",
  gradientId,
}: LeafShapeProps) {
  const c = leafPalettes[palette];

  return (
    <>
      {gradientId && (
        <defs>
          {/* El degradé corre perpendicular al nervio: claro en el eje, más
              saturado hacia los bordes. Le da volumen a la lámina. */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.edge} />
            <stop offset="42%" stopColor={c.core} />
            <stop offset="58%" stopColor={c.core} />
            <stop offset="100%" stopColor={c.body} />
          </linearGradient>
        </defs>
      )}

      {/* Pecíolo. */}
      <path
        d="M0 28C2 28 4 28 7 28"
        stroke={c.vein}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />

      <path d={BLADE} fill={gradientId ? `url(#${gradientId})` : c.body} />

      <path
        d={MIDRIB}
        stroke={c.vein}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />

      {detail !== "simple" && (
        <g
          stroke={c.vein}
          strokeWidth={detail === "veined" ? "1.2" : "1"}
          strokeLinecap="round"
          fill="none"
          // Menos venas piden mas presencia: en `veined` cada trazo tiene que
          // leerse solo, sin la trama del nivel completo que lo acompane.
          opacity={detail === "veined" ? "0.5" : "0.38"}
        >
          {(detail === "veined"
            ? VEINED_INDEXES.flatMap((i) => [VEINS_TOP[i], VEINS_BOTTOM[i]])
            : [...VEINS_TOP, ...VEINS_BOTTOM]
          ).map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}

      {detail === "full" && (
        <g
          stroke={c.vein}
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.22"
        >
          {VEINLETS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}
    </>
  );
}

type LeafProps = {
  palette?: LeafPalette;
  detail?: LeafDetail;
  className?: string;
  style?: CSSProperties;
  /** Id del degradé; en listas conviene derivarlo del índice. */
  gradientId?: string;
};

/** Hoja suelta, lista para posicionar de forma absoluta. */
export function Leaf({
  palette = "green",
  detail = "full",
  className,
  style,
  gradientId,
}: LeafProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 56"
      fill="none"
      style={style}
      className={cn("pointer-events-none select-none", className)}
    >
      <LeafShape palette={palette} detail={detail} gradientId={gradientId} />
    </svg>
  );
}
