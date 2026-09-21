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
  /**
   * U tendida y alta: el mismo gesto suave que `gentle` —52 unidades de
   * amplitud contra 60— pero apoyado mucho más arriba: cubre 156 unidades en
   * los bordes y 104 en el centro, contra 88 y 28. Es para montar la onda
   * sobre una foto sin hacerla más pronunciada; sube entera en vez de
   * ahondarse.
   */
  hueco: "M0 160V4c240 34 480 52 720 52s480-18 720-52v156z",
} as const;

export type WaveVariant = keyof typeof shapes;

/**
 * Aire de más, en unidades del viewBox, para que las copias corridas de la
 * curva nunca queden cortadas por el borde del lienzo.
 *
 * `ARRIBA` se suma al viewBox por encima de la curva —es transparente, así que
 * ahí se sigue viendo la foto— y `ABAJO` alarga el relleno de cada copia por
 * debajo del lienzo. Sin esto, la copia que va corrida hacia arriba dejaba sin
 * pintar la tira de abajo de todo.
 */
const ARRIBA = 60;
const ABAJO = 80;

/**
 * Estira el relleno de una curva hacia abajo sin cambiarle el dibujo.
 *
 * Todas empiezan en `M0 160` y cierran con `v<n>z`: subiendo los dos números a
 * la vez, la curva queda igual y el relleno sigue `ABAJO` unidades más lejos.
 */
const alargar = (d: string) =>
  d
    .replace(/^M0 160/, `M0 ${160 + ABAJO}`)
    .replace(/v(\d+)z$/, (_, n: string) => `v${Number(n) + ABAJO}z`);

type WaveDividerProps = {
  variant?: WaveVariant;
  /** Color de la curva: debe ser el de la sección que viene abajo. */
  className?: string;
  /** Espeja horizontalmente, para alternar entre secciones. */
  flip?: boolean;
  /**
   * Color de una franja que repite el mismo trazo por debajo de la curva, como
   * un subrayado. Sin esto no se dibuja.
   */
  underlineClassName?: string;
  /**
   * Grosor de esa franja, en unidades del viewBox —que mide 160 de alto—.
   *
   * El alto del lienzo cambia por breakpoint (48, 64 y 96px), así que el grosor
   * en pantalla acompaña: 30 unidades dan unos 9px en un teléfono y 18px en
   * escritorio. Por debajo de eso se lee como una línea y no como una franja.
   */
  underlineWidth?: number;
  /**
   * Color de un filete que va pegado al borde de la curva, por encima de la
   * franja. Es el mismo trazo otra vez, apenas separado: sirve para rematar el
   * corte de una foto con una línea de color. Sin esto no se dibuja.
   */
  lineaClassName?: string;
  /** Grosor de ese filete, en las mismas unidades que `underlineWidth`. */
  lineaWidth?: number;
  /**
   * Alto del lienzo. `alta` estira la misma curva a un tercio más de alto: el
   * dibujo es el mismo pero el gesto se lee mucho más, que es lo que hace
   * falta cuando la onda corta una foto y no un fondo de color.
   */
  alto?: "normal" | "alta" | "extra";
};

/**
 * Alto del lienzo por variante.
 *
 * `alta` lleva además el aire de arriba —el viewBox es 220 y no 160—, así que
 * sus medidas van multiplicadas por 220/160: 176px son los mismos 128px de
 * curva de antes más 48 de aire transparente. La curva queda exactamente donde
 * estaba y del mismo tamaño.
 */
const altos = {
  normal: "h-12 sm:h-16 lg:h-24",
  alta: "h-22 sm:h-33 lg:h-44",
  // Un lienzo más grande no engorda el dibujo: sube la curva dentro de la
  // sección, que es lo que hace falta cuando el banner es muy alto y el corte
  // queda demasiado abajo. El grosor de las tiras se compensa desde afuera.
  extra: "h-36 sm:h-54 lg:h-72",
} as const;

/**
 * `normal` cuando hay que reservar el aire de arriba: las mismas medidas
 * multiplicadas por 1,375 (220/160, que es lo que crece el viewBox).
 *
 * La curva queda exactamente del mismo tamaño y en el mismo lugar; lo único
 * que se agrega es hueco transparente por encima, donde apoyan las tiras.
 * `alta` y `extra` ya lo traen incluido en sus propias medidas.
 */
const NORMAL_CON_AIRE = "h-16.5 sm:h-22 lg:h-33";

export function WaveDivider({
  variant = "gentle",
  className,
  flip = false,
  underlineClassName,
  underlineWidth = 30,
  lineaClassName,
  lineaWidth = 9,
  alto = "normal",
}: WaveDividerProps) {
  const franja = underlineClassName ? underlineWidth : 0;
  const filete = lineaClassName ? lineaWidth : 0;
  const d = alargar(shapes[variant]);

  /*
   * Si hay tiras, el lienzo tiene que reservar aire por encima de la curva.
   *
   * Las tiras son copias del mismo trazo corridas hacia arriba, así que lo que
   * en la curva original queda cerca del techo, en la copia se va afuera del
   * lienzo y el navegador lo recorta al ras.
   *
   * `alta` y `extra` ya reservaban ese aire; `normal` no, y ahí se veía: la
   * curva del hero sube hasta 11,6 unidades del techo en x≈1072 de 1440 —el
   * pico del lado derecho—, y su franja, corrida 30 unidades, terminaba en
   * −18. Justo el punto más alto salía rebanado, plano, como si la onda
   * estuviera cortada.
   */
  const conAire = alto !== "normal" || franja + filete > 0;

  return (
    <svg
      aria-hidden
      // Con franja el lienzo sube `ARRIBA` unidades. Ese espacio de más es
      // transparente y el alto en pantalla lo acompaña, así que la curva no se
      // mueve ni cambia de tamaño: solo aparece lugar por encima para apoyar
      // las tiras de color.
      viewBox={conAire ? `0 ${-ARRIBA} 1440 ${160 + ARRIBA}` : "0 0 1440 160"}
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-10 block w-full",
        alto === "normal" && conAire ? NORMAL_CON_AIRE : altos[alto],
        flip && "-scale-x-100",
        className,
      )}
    >
      {/* Ni la franja ni el filete son trazos: son copias del mismo relleno
          corridas hacia arriba, y de cada una se ve la tira que la siguiente
          todavía no tapó. Un `stroke` habría servido, pero con
          `preserveAspectRatio="none"` el lienzo se estira distinto en cada eje
          y el grosor saldría deformado.

          Van hacia arriba y no hacia abajo, que es como estaban: hacia abajo,
          en las curvas que bajan mucho la franja se pasaba del borde inferior
          del lienzo y quedaba cortada al ras, con una línea recta de lado a
          lado justo donde la onda tiene que disimular el corte. */}
      {lineaClassName && (
        <path
          d={d}
          fill="currentColor"
          className={lineaClassName}
          transform={`translate(0 ${-(filete + franja)})`}
        />
      )}

      {underlineClassName && (
        <path
          d={d}
          fill="currentColor"
          className={underlineClassName}
          transform={`translate(0 ${-franja})`}
        />
      )}

      {/* La curva propiamente dicha, en el color de la sección que sigue. */}
      <path d={d} fill="currentColor" />
    </svg>
  );
}
