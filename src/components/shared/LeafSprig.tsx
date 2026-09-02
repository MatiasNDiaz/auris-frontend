import { LeafShape, type LeafPalette } from "./leaf-art";
import { cn } from "@/lib/utils";

/**
 * Tallo con hojitas, con balanceo en bucle infinito.
 *
 * Va suelto en un borde o una esquina de la sección, nunca sobre el contenido.
 * El movimiento son dos capas de rotación —el tallo cabecea, cada hoja aletea
 * con su propio desfasaje— definidas como keyframes CSS en `globals.css`: solo
 * animan `transform`, así que corren en la capa de composición sin repintar.
 *
 * `size` regula cuántas hojas se dibujan. `sm` existe para la ficha de
 * profesional, donde el follaje tiene que estar apenas insinuado.
 */

type Sprig = {
  /** Punto de inserción sobre el tallo, en el sistema del viewBox (140×180). */
  x: number;
  y: number;
  rotate: number;
  scale: number;
  /** Desfasaje del aleteo, para que no se muevan todas a la vez. */
  delay: number;
  /** Espeja la hoja sobre su nervio: las de un lado y otro no se repiten. */
  flip?: boolean;
};

/** Hojas alternadas a lo largo del tallo, decreciendo hacia la punta. */
const sprigs: Sprig[] = [
  { x: 62, y: 150, rotate: -32, scale: 0.34, delay: 0 },
  { x: 58, y: 150, rotate: 200, scale: 0.3, delay: -1.4, flip: true },
  { x: 70, y: 116, rotate: -26, scale: 0.3, delay: -2.6 },
  { x: 66, y: 116, rotate: 194, scale: 0.26, delay: -0.8, flip: true },
  { x: 78, y: 84, rotate: -20, scale: 0.25, delay: -3.4 },
  { x: 74, y: 84, rotate: 188, scale: 0.22, delay: -1.9, flip: true },
  { x: 84, y: 56, rotate: -14, scale: 0.2, delay: -2.2 },
  { x: 88, y: 32, rotate: -8, scale: 0.16, delay: -4.1 },
];

/** Cuántas hojas entran según el tamaño. Menos hojas, menos capas animadas. */
const counts = { sm: 3, md: 5, lg: 8 } as const;

type LeafSprigProps = {
  palette?: LeafPalette;
  size?: keyof typeof counts;
  /** Espeja el tallo entero, para anclarlo al borde derecho. */
  flip?: boolean;
  /** Posición y opacidad: se fijan desde la sección que lo usa. */
  className?: string;
};

export function LeafSprig({
  palette = "green",
  size = "md",
  flip = false,
  className,
}: LeafSprigProps) {
  // Sin degradé por hoja: a este tamaño no se percibe y evita tanto un `<defs>`
  // por hoja como tener que generar ids únicos, que obligaría a volver cliente
  // a un componente que no necesita serlo.
  const visible = sprigs.slice(0, counts[size]);

  return (
    <svg
      aria-hidden
      data-decor=""
      // Lo muta el observer del script inline, que le pone `data-offscreen`
      // para congelar la animación fuera de pantalla. React no lo sabe y lo
      // reporta como desajuste de hidratación; esto le avisa que este nodo se
      // toca por fuera. Silencia solo este elemento, no el árbol.
      suppressHydrationWarning
      viewBox="0 0 140 180"
      fill="none"
      className={cn(
        "pointer-events-none absolute select-none",
        flip && "-scale-x-100",
        className,
      )}
    >
      {/* El grupo entero cabecea desde la base del tallo. */}
      <g className="auris-stem-sway">
        <path
          d="M54 180C58 148 62 118 74 92c9-20 16-38 20-62"
          stroke="var(--color-primary-500)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.55"
        />

        {visible.map((sprig) => (
          // El `transform` de atributo posiciona; el de CSS anima. Van en
          // grupos distintos porque, sobre un mismo elemento, la regla CSS
          // pisaría al atributo y la hoja saltaría al origen del lienzo.
          <g
            key={`${sprig.x}-${sprig.y}`}
            transform={`translate(${sprig.x} ${sprig.y}) rotate(${sprig.rotate}) scale(${sprig.scale} ${sprig.flip ? -sprig.scale : sprig.scale})`}
          >
            <g
              className="auris-leaf-flutter"
              style={{ animationDelay: `${sprig.delay}s` }}
            >
              <LeafShape palette={palette} detail="simple" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
