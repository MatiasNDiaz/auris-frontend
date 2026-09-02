import type { CSSProperties } from "react";
import { Leaf, type LeafPalette } from "./leaf-art";
import { cn } from "@/lib/utils";

/**
 * Hojas sueltas cruzando la sección, empujadas por el viento.
 *
 * Cada hoja recorre el ancho completo en bucle infinito, con su propia
 * velocidad, altura, tamaño y giro. La trayectoria sube y baja en el camino
 * (ver `@keyframes auris-leaf-fly` en `globals.css`), que es lo que la separa
 * de un desplazamiento lateral plano.
 *
 * Se monta absoluto sobre el fondo y por debajo del contenido, así que la
 * sección tiene que ser `relative overflow-hidden` —todas lo son—.
 */

type Flyer = {
  /** Altura de vuelo dentro de la sección, en %. */
  top: string;
  /** Ancho en px sobre el que se escala la hoja. */
  width: number;
  /** Giro de partida, en grados. */
  rotate: number;
  /** Amplitud del vaivén vertical, en px. */
  amplitude: number;
  /** Segundos que tarda en cruzar. Más lenta = se lee más lejos. */
  duration: number;
  /**
   * Negativo a propósito: adelanta la animación, así al cargar la página las
   * hojas ya están repartidas por la sección en vez de entrar todas juntas
   * desde el borde izquierdo.
   */
  delay: number;
  opacity: number;
  flip?: boolean;
  /** Solo a partir de `sm`: en mobile se oculta. */
  wide?: boolean;
};

/**
 * Tres bandadas para que dos secciones seguidas no repitan el mismo vuelo.
 * Las duraciones son deliberadamente dispares: si fueran múltiplos entre sí,
 * las hojas se reagruparían cada tanto y se notaría el bucle.
 */
const flocks: Record<string, Flyer[]> = {
  a: [
    { top: "6%", width: 122, rotate: -24, amplitude: 34, duration: 34, delay: -3, opacity: 0.42 },
    { top: "23%", width: 88, rotate: 148, amplitude: 26, duration: 47, delay: -21, opacity: 0.32, flip: true, wide: true },
    { top: "46%", width: 146, rotate: 12, amplitude: 42, duration: 29, delay: -12, opacity: 0.36 },
    { top: "64%", width: 96, rotate: -52, amplitude: 22, duration: 53, delay: -34, opacity: 0.28, wide: true },
    { top: "83%", width: 128, rotate: 116, amplitude: 30, duration: 41, delay: -7, opacity: 0.3, flip: true, wide: true },
  ],
  b: [
    { top: "10%", width: 140, rotate: 166, amplitude: 30, duration: 38, delay: -17, opacity: 0.36, flip: true },
    { top: "31%", width: 100, rotate: -44, amplitude: 38, duration: 51, delay: -5, opacity: 0.3, wide: true },
    { top: "54%", width: 152, rotate: 26, amplitude: 24, duration: 31, delay: -25, opacity: 0.34 },
    { top: "72%", width: 84, rotate: 134, amplitude: 44, duration: 44, delay: -11, opacity: 0.26, flip: true, wide: true },
    { top: "90%", width: 116, rotate: -18, amplitude: 28, duration: 57, delay: -39, opacity: 0.28, wide: true },
  ],
  c: [
    { top: "8%", width: 106, rotate: 122, amplitude: 40, duration: 43, delay: -9, opacity: 0.34, flip: true },
    { top: "28%", width: 154, rotate: -30, amplitude: 26, duration: 33, delay: -27, opacity: 0.3 },
    { top: "50%", width: 92, rotate: 58, amplitude: 36, duration: 55, delay: -14, opacity: 0.26, wide: true },
    { top: "70%", width: 134, rotate: 152, amplitude: 30, duration: 37, delay: -2, opacity: 0.32, flip: true, wide: true },
    { top: "88%", width: 110, rotate: -40, amplitude: 46, duration: 49, delay: -31, opacity: 0.28, wide: true },
  ],
};

export type ScatterPattern = keyof typeof flocks;

type LeafScatterProps = {
  pattern?: ScatterPattern;
  palette?: LeafPalette;
  /**
   * Tope de hojas simultáneas. Sirve para bajar la densidad donde el follaje
   * compite con el contenido —el footer y el CTA de cierre— y para acotar
   * cuántas capas se animan a la vez.
   */
  count?: number;
  className?: string;
};

export function LeafScatter({
  pattern = "a",
  palette = "green",
  count,
  className,
}: LeafScatterProps) {
  const flock = count ? flocks[pattern].slice(0, count) : flocks[pattern];

  return (
    <div
      aria-hidden
      data-decor=""
      // Lo muta el observer del script inline, que le pone `data-offscreen`
      // para congelar la animación fuera de pantalla. React no lo sabe y lo
      // reporta como desajuste de hidratación; esto le avisa que este nodo se
      // toca por fuera. Silencia solo este elemento, no el árbol.
      suppressHydrationWarning
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className,
      )}
    >
      {flock.map((leaf, index) => (
        <Leaf
          key={index}
          palette={palette}
          // El id del degradé tiene que ser único en el documento: lo componen
          // el patrón, la paleta y el índice, que juntos no se repiten aunque
          // haya varias bandadas en la misma página.
          gradientId={`fly-${pattern}-${palette}-${index}`}
          className={cn(
            "auris-leaf-fly absolute left-0 h-auto",
            leaf.wide && "hidden sm:block",
          )}
          style={
            {
              top: leaf.top,
              width: leaf.width,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              "--leaf-rot": `${leaf.rotate}deg`,
              "--leaf-amp": `${leaf.amplitude}px`,
              "--leaf-alpha": leaf.opacity,
              "--leaf-flip": leaf.flip ? -1 : 1,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
