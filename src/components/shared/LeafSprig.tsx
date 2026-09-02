import type { CSSProperties } from "react";
import { LEAF_ANCHOR_Y, LeafShape, type LeafPalette } from "./leaf-art";
import { cn } from "@/lib/utils";

/**
 * Tallo con hojitas, con balanceo en bucle infinito.
 *
 * Va suelto en un borde o una esquina de la sección, nunca sobre el contenido.
 * El movimiento son dos capas de rotación —el tallo cabecea, cada hoja aletea
 * con su propio período— definidas como keyframes CSS en `globals.css`: solo
 * animan `transform`, así que corren en la capa de composición sin repintar.
 *
 * Las hojas no están escritas a mano: se derivan del propio trazo del tallo.
 * Antes eran coordenadas puestas a ojo y quedaban hasta seis unidades fuera de
 * la curva —el pecíolo flotaba separado del tallo, sobre todo en la punta—, y
 * como el recorte por tamaño se llevaba las últimas del array, la mitad de
 * arriba del tallo quedaba pelada. Acá se reparten por longitud de arco sobre
 * la curva real, así que tocan el trazo y lo cubren entero sea cual sea el
 * tamaño: `size` cambia cuántas hay, no hasta dónde llegan.
 */

/** Un tramo del tallo: [x0,y0, x1,y1, x2,y2, x3,y3] en el sistema del viewBox. */
type Cubic = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

/**
 * El tallo, en coordenadas absolutas para poder evaluarlo.
 *
 * El primer tramo prolonga el trazo por debajo del alto de la caja, siguiendo
 * la tangente que traía: es el pedazo que queda tapado por el borde de la
 * sección y el que evita que la planta se lea como flotando.
 */
const STEM: readonly Cubic[] = [
  [52.3, 194, 52.8, 189.3, 53.4, 184.6, 54, 180],
  [54, 180, 58, 148, 62, 118, 74, 92],
  [74, 92, 83, 72, 90, 54, 94, 30],
];

/** El mismo recorrido, ya escrito para el atributo `d`. */
const STEM_D =
  "M52.3 194C52.8 189.3 53.4 184.6 54 180C58 148 62 118 74 92C83 72 90 54 94 30";

type StemPoint = { x: number; y: number; angle: number };

/** Punto y dirección de la curva en el parámetro `t`. */
function evalCubic(c: Cubic, t: number): StemPoint {
  const u = 1 - t;

  const x =
    u * u * u * c[0] +
    3 * u * u * t * c[2] +
    3 * u * t * t * c[4] +
    t * t * t * c[6];
  const y =
    u * u * u * c[1] +
    3 * u * u * t * c[3] +
    3 * u * t * t * c[5] +
    t * t * t * c[7];

  // Derivada: es la que da la inclinación del tallo en ese punto, y con ella
  // la hoja se orienta siguiendo el crecimiento en vez de apuntar a un ángulo
  // fijo. Es lo que separa una hoja nacida de una pegada encima.
  const dx =
    3 * u * u * (c[2] - c[0]) +
    6 * u * t * (c[4] - c[2]) +
    3 * t * t * (c[6] - c[4]);
  const dy =
    3 * u * u * (c[3] - c[1]) +
    6 * u * t * (c[5] - c[3]) +
    3 * t * t * (c[7] - c[5]);

  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/**
 * Tabla de longitud de arco.
 *
 * El parámetro `t` de una Bézier no avanza a velocidad constante: repartir las
 * hojas por `t` las amontona donde la curva se aplana. Muestrear el recorrido y
 * guardar la distancia acumulada permite pedir "el punto al 40% del largo" y
 * que sea realmente el 40%, que es lo que deja el reparto parejo y sin huecos.
 */
const SAMPLES_PER_SEGMENT = 96;

const arcTable: (StemPoint & { at: number })[] = (() => {
  const table: (StemPoint & { at: number })[] = [];
  let walked = 0;
  let previous = evalCubic(STEM[0], 0);

  table.push({ ...previous, at: 0 });

  for (const segment of STEM) {
    for (let i = 1; i <= SAMPLES_PER_SEGMENT; i++) {
      const point = evalCubic(segment, i / SAMPLES_PER_SEGMENT);
      walked += Math.hypot(point.x - previous.x, point.y - previous.y);
      table.push({ ...point, at: walked });
      previous = point;
    }
  }

  // Se normaliza al final, cuando ya se conoce el largo total.
  return table.map((entry) => ({ ...entry, at: entry.at / walked }));
})();

/** Punto del tallo a una fracción de su largo, con 0 en la base y 1 en la punta. */
function stemAt(fraction: number): StemPoint {
  let i = 1;
  while (i < arcTable.length - 1 && arcTable[i].at < fraction) i++;

  const a = arcTable[i - 1];
  const b = arcTable[i];
  const span = b.at - a.at;
  const k = span > 0 ? (fraction - a.at) / span : 0;

  // Entre muestra y muestra hay menos de dos unidades: interpolar recto no se
  // distingue de volver a evaluar la curva, y evita el caso borde del salto
  // entre un tramo y el siguiente.
  return {
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    angle: a.angle + (b.angle - a.angle) * k,
  };
}

/**
 * Ruido determinista.
 *
 * Da la variación de tamaño, fase y período que evita que las hojas se muevan
 * como un solo bloque. No puede ser `Math.random`: el componente se renderiza
 * en el servidor y cualquier diferencia con el cliente rompe la hidratación.
 */
function noise(n: number) {
  const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
}

type Leaf = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flip: boolean;
  delay: number;
  duration: number;
};

/**
 * Dónde arranca y termina el follaje sobre el tallo.
 *
 * `FIRST` deja libre el tramo de abajo —el que se hunde bajo el borde de la
 * sección—: una hoja ahí queda partida al medio por el corte. Arranca por
 * encima de `PAIR_AT` para dejarle lugar a la compañera de la base.
 */
const FIRST = 0.16;
const LAST = 0.97;

/**
 * Dónde va la compañera de la base, por debajo de la serie.
 *
 * Es lo más abajo que puede ir sin que el borde de la sección le coma la punta:
 * la hoja cuelga unas once unidades por debajo de donde se inserta.
 */
const PAIR_AT = 0.1;

/**
 * Reparto de la serie sobre el tallo.
 *
 * El exponente junta las inserciones hacia la punta. Con paso constante la
 * separación no acompañaba al tamaño: abajo, donde la hoja es grande, se
 * superponían, y arriba, donde es chica, quedaba tallo a la vista.
 */
const leafAt = (k: number) => FIRST + (LAST - FIRST) * Math.pow(k, 0.8);

/**
 * Una hoja sobre el tallo.
 *
 * `at` es dónde se inserta —fracción del largo— y `k`, de 0 en la base a 1 en
 * la punta, gobierna cuánto se abre y cuánto mide. Van separados para poder
 * pedir una hoja fuera del reparto de la serie sin que pierda el tamaño que le
 * corresponde a esa altura. `salt` solo desordena la variación.
 */
function makeLeaf(
  at: number,
  k: number,
  side: -1 | 1,
  seed: number,
  salt: number,
): Leaf {
  const point = stemAt(at);

  // Apertura respecto del tallo: las de abajo se abren casi en cruz y las de
  // la punta van cada vez más pegadas al eje, como en la planta real.
  const spread = (62 - 20 * k) * side;

  // La de la base casi triplica a la de la punta. La variación por hoja se
  // queda en un ±8%: más que eso alcanza para que una hoja de abajo salga
  // más chica que la de arriba y se pierda la lectura del degradé.
  const scale = (0.42 - 0.29 * k) * (0.92 + noise(salt * 3 + seed) * 0.16);

  return {
    x: point.x,
    y: point.y,
    rotate: point.angle + spread,
    scale,
    // Espejada de un lado: deja el envés hacia afuera y las dos mitades del
    // tallo no se leen como la misma hoja calcada.
    flip: side > 0,
    delay: -(noise(salt * 7 + seed * 2 + 11) * 5),
    duration: 3.4 + noise(salt * 5 + seed * 3 + 29) * 2.2,
  };
}

function buildLeaves(count: number, seed: number, pairBase: boolean): Leaf[] {
  const leaves = Array.from({ length: count }, (_, i) => {
    const k = count === 1 ? 0 : i / (count - 1);
    return makeLeaf(leafAt(k), k, i % 2 === 0 ? -1 : 1, seed, i);
  });

  // Las hojas van alternando un lado y el otro, así que la primera se queda
  // sin par y el arranque del tallo se ve desbalanceado. Esta es su compañera:
  // del lado contrario y un escalón por debajo, porque a la misma altura el
  // par se lee como un dibujo espejado y no como una planta.
  //
  // Va por debajo de la serie y no intercalada entre sus dos primeras hojas:
  // ahí caía al lado de una del mismo lado y las dos se empastaban.
  if (pairBase) leaves.push(makeLeaf(PAIR_AT, 0, 1, seed, count + 4));

  return leaves;
}

/**
 * Cuántas hojas lleva cada tamaño. Todas cubren el tallo entero: lo que cambia
 * es la densidad, no el tramo. Con más de estas se tocan entre sí y el tallo
 * deja de verse por debajo del follaje.
 */
const counts = { sm: 4, md: 7, lg: 8 } as const;

type LeafSprigProps = {
  palette?: LeafPalette;
  size?: keyof typeof counts;
  /** Espeja el tallo entero, para anclarlo al borde derecho. */
  flip?: boolean;
  /**
   * Desplaza el ruido. Dos tallos con semillas distintas no comparten ni los
   * tamaños ni el ritmo, así que no se ven como el mismo dibujo repetido.
   */
  seed?: number;
  /** Posición y opacidad: se fijan desde la sección que lo usa. */
  className?: string;
};

export function LeafSprig({
  palette = "green",
  size = "md",
  flip = false,
  seed = 0,
  className,
}: LeafSprigProps) {
  // Sin degradé por hoja: a este tamaño no se percibe y evita tanto un `<defs>`
  // por hoja como tener que generar ids únicos, que obligaría a volver cliente
  // a un componente que no necesita serlo.
  const leaves = buildLeaves(counts[size], seed, size !== "sm");

  // A 25px las venas se empastan; recién desde `md` aportan textura.
  const detail = size === "sm" ? "simple" : "veined";

  return (
    <svg
      aria-hidden
      data-decor=""
      // Lo muta el observer del script inline, que le pone `data-offscreen`
      // para congelar la animación fuera de pantalla. React no lo sabe y lo
      // reporta como desajuste de hidratación; esto le avisa que este nodo se
      // toca por fuera. Silencia solo este elemento, no el árbol.
      suppressHydrationWarning
      // Hasta 190 y no 180: el tallo arranca en y=180 y la hoja de la base
      // cuelga unas unidades mas abajo. Con la caja cortada en el arranque,
      // apoyarla contra el borde de la seccion escondia justo esa hoja.
      viewBox="0 0 140 190"
      fill="none"
      className={cn(
        // Sin `overflow-visible` el SVG recorta contra su propio viewBox y la
        // hoja de la base —la más grande, que asoma unas unidades por debajo
        // del arranque del tallo— queda con la punta cortada al ras. Recortar
        // es tarea de la sección, que ya lleva `overflow-hidden`.
        "pointer-events-none absolute overflow-visible select-none",
        flip && "-scale-x-100",
        className,
      )}
    >
      {/* El grupo entero cabecea desde la base del tallo. */}
      <g
        className="auris-stem-sway"
        style={
          {
            "--sway-duration": `${(4.6 + noise(seed * 13 + 3) * 2.4).toFixed(2)}s`,
          } as CSSProperties
        }
      >
        <path
          d={STEM_D}
          stroke="var(--color-primary-500)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.55"
        />

        {leaves.map((leaf, index) => (
          // El `transform` de atributo posiciona; el de CSS anima. Van en
          // grupos distintos porque, sobre un mismo elemento, la regla CSS
          // pisaría al atributo y la hoja saltaría al origen del lienzo.
          <g
            key={index}
            // El `translate` final es el que hace que la hoja toque el tallo por
            // donde nace y no por el medio: sin él se ancla por el origen de su
            // lienzo, que queda 28 unidades por encima del pecíolo, y el trazo
            // termina cruzando la lámina.
            transform={`translate(${leaf.x.toFixed(2)} ${leaf.y.toFixed(2)}) rotate(${leaf.rotate.toFixed(2)}) scale(${leaf.scale.toFixed(3)} ${(leaf.flip ? -leaf.scale : leaf.scale).toFixed(3)}) translate(0 ${-LEAF_ANCHOR_Y})`}
          >
            <g
              className="auris-leaf-flutter"
              style={
                {
                  animationDelay: `${leaf.delay.toFixed(2)}s`,
                  "--flutter-duration": `${leaf.duration.toFixed(2)}s`,
                } as CSSProperties
              }
            >
              <LeafShape palette={palette} detail={detail} />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
