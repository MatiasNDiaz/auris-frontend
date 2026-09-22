/**
 * Recorrido virtual de las instalaciones.
 *
 * DOS NIVELES DE NAVEGACIÓN, que es la idea que sostiene todo el archivo:
 *
 *   - **Entre ambientes** (nodos): se camina tocando los círculos que hay
 *     sobre las puertas. Es el recorrido propiamente dicho.
 *   - **Dentro de un ambiente** (fotos): se pasan con las flechas laterales
 *     del visor. Son fotos del mismo lugar, no paradas nuevas.
 *
 * Por eso los hotspots viven en el nodo y no en cada foto: la que navega es
 * siempre la primera de la lista —la que "encaja" con el recorrido, tomada
 * desde la puerta— y las demás son el detalle de adentro. Si alguna vez hace
 * falta un hotspot en una foto que no sea la primera, este es el lugar donde
 * habría que abrir `hotspots` a nivel de foto.
 *
 * EL MAPA, leído contra el plano de planta baja:
 *
 *   Calle → puerta vidriada → hall. El hall es la bifurcación: a la izquierda
 *   la sala de espera, a la derecha el mostrador. Desde el mostrador arranca
 *   el pasillo, que es el eje del centro.
 *
 *   Sobre la izquierda hay cuatro consultorios, y el primero no está adentro
 *   del pasillo sino en su boca: su puerta asoma en el filo de la foto de
 *   `pasillo`, junto a la del baño. Los otros tres aparecen de a uno por tramo.
 *
 *   Entrando por el pasillo, y en este orden:
 *     - en la boca: consultorio 1 (izquierda) y el baño (derecha);
 *     - primer tramo: consultorio 2 (izquierda) y el laboratorio (derecha);
 *     - segundo tramo: consultorio 3 (izquierda);
 *     - al fondo: consultorio 4 (izquierda) y consultorio 5 (derecha).
 *
 * DOS REGLAS ESPECIALES que pidió el centro y que no se pueden inferir de
 * las fotos:
 *
 *   1. Volver desde el consultorio 4 o desde el 5 no lleva al pasillo de una:
 *      pasa por `pasillo-volver`, que es la foto del pasillo mirando hacia la
 *      salida, y desde ahí un círculo devuelve a la boca del pasillo.
 *   2. La primera foto de cada carpeta es la que abre el ambiente.
 *
 * Antes había una tercera: al baño se entraba viendo primero el pasillo frente
 * a su puerta. Dejó de hacer falta cuando la toma panorámica del pasillo pasó a
 * mostrar esa misma puerta negra, así que el paso intermedio repetía lo que ya
 * se acababa de ver.
 *
 * UN LÍMITE AL PONER CÍRCULOS. El visor encuadra la foto centrada en el
 * promedio de las `y` de los hotspots de esa parada. En una foto vertical
 * dentro de una ventana apaisada entra alrededor de un tercio del alto, así
 * que en la práctica quedan unos catorce puntos porcentuales de margen a cada
 * lado de ese promedio: un círculo más lejos que eso queda fuera del marco y
 * no se puede tocar. Con fotos apaisadas pasa lo mismo pero en el eje X.
 */

export type TourHotspot = {
  /** Posición del centro del círculo, en % del ancho y del alto de la foto. */
  x: number;
  y: number;
  /** Lo que dice el globo al pasar el cursor, y el `aria-label` del botón. */
  label: string;
  /** Id del nodo destino. */
  to: string;
};

export type TourPhoto = {
  src: string;
  alt: string;
  /** Ancho dividido alto. El visor lo necesita para cubrir sin deformar. */
  aspect: number;
  /**
   * Altura del motivo, en % del alto de la foto: es donde se centra el
   * encuadre al abrirla. Solo hace falta cuando lo que importa no está cerca
   * del medio.
   */
  focus?: number;
  /**
   * Dónde se centra el encuadre a lo ancho, en % del ancho de la foto.
   *
   * Por defecto el visor usa el promedio de los círculos, que sirve para que
   * todos queden a la vista. Pero al encadenar varias fotos del mismo pasillo
   * ese promedio cambia en cada tramo —según cuántas puertas haya— y el fondo
   * salta de costado al avanzar. Fijándolo acá, el punto de fuga cae siempre en
   * la misma columna y el recorrido se siente derecho.
   */
  focoX?: number;
};

export type TourNode = {
  id: string;
  /** Nombre de la parada, el que se muestra como título. */
  title: string;
  /** Una línea de contexto, debajo del título. */
  caption: string;
  /**
   * Las fotos del ambiente. La primera es la que navega —lleva los círculos—
   * y las demás se recorren con las flechas laterales.
   */
  photos: TourPhoto[];
  /**
   * A dónde lleva el botón de volver. `null` en el ingreso, que es el
   * principio, y en `pasillo-volver`, que ya es en sí mismo una vuelta.
   */
  back: string | null;
  hotspots: TourHotspot[];
};

/** Raíz de las fotos, para no repetirla en cada línea. */
const F = "/images/instalaciones";

/**
 * Dónde cae el punto de fuga del pasillo, en % del ancho de la foto.
 *
 * Las cuatro tomas del pasillo están hechas desde el mismo eje, así que el
 * fondo se va siempre al mismo lugar. Fijando ahí el encuadre —y no en el
 * promedio de los círculos, que cambia en cada tramo— el pasillo queda en la
 * misma columna de la pantalla al pasar de una foto a la siguiente, y caminarlo
 * se siente derecho en vez de ir saltando de costado.
 */
const FUGA = 44;

export const tourNodes: TourNode[] = [
  {
    id: "ingreso",
    title: "Ingreso",
    caption:
      "El frente del centro sobre Juan Bautista Daniel, con el número 2044 a la izquierda de la puerta.",
    photos: [
      {
        src: `${F}/ingreso/entrada1.webp`,
        alt: "Frente del centro visto desde la vereda, con la puerta vidriada iluminada y el número 2044",
        aspect: 1672 / 940,
      },
    ],
    back: null,
    hotspots: [
      // Sobre el hueco iluminado de la puerta vidriada.
      { x: 46, y: 52, label: "Acercarse a la entrada", to: "puerta" },
    ],
  },
  {
    id: "puerta",
    title: "Puerta de entrada",
    caption:
      "Ya sobre la puerta. A través del vidrio se ven la sala de espera y el mostrador.",
    photos: [
      {
        src: `${F}/ingreso/entrada2.webp`,
        alt: "Puerta vidriada del centro vista de cerca, con el logo de AURIS y la sala de espera detrás",
        aspect: 1672 / 940,
      },
    ],
    back: "ingreso",
    hotspots: [{ x: 52, y: 50, label: "Entrar al centro", to: "hall" }],
  },
  {
    id: "hall",
    title: "Hall de entrada",
    caption:
      "La columna parte el hall en dos: a la izquierda la sala de espera, a la derecha el mostrador.",
    photos: [
      {
        src: `${F}/ingreso/entrada3.webp`,
        alt: "Hall de entrada: la sala de espera a la izquierda y el mostrador de recepción a la derecha, separados por una columna",
        aspect: 1448 / 1086,
      },
    ],
    back: "puerta",
    hotspots: [
      // Los dos círculos van más adentro de lo que pediría la foto. Esta es
      // una de las pocas paradas apaisadas: en la ventana vertical del
      // teléfono, una foto 4:3 se agranda para cubrir por alto y de su ancho
      // solo se ve poco más de la mitad —de 22% a 78%—. Pegados a los bordes
      // reales de los bancos y del mostrador, en un teléfono no habría forma
      // de tocarlos.
      { x: 28, y: 55, label: "Sala de espera", to: "sala-espera" },
      { x: 72, y: 50, label: "Recepción", to: "recepcion" },
    ],
  },
  {
    id: "sala-espera",
    title: "Sala de espera",
    caption: "Bancos, luz natural y el logo sobre la pared.",
    photos: [
      {
        src: `${F}/ingreso/entrada4.webp`,
        alt: "Sala de espera vista desde el hall, con los bancos contra la pared y la ventana al fondo",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/sala-espera/sala-espera1.webp`,
        alt: "Bancos de la sala de espera bajo el logo de AURIS, con las plantas sobre el paño divisorio",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/sala-espera/sala-espera2.webp`,
        alt: "La sala de espera hacia la puerta vidriada, con las plantas junto al ventanal",
        aspect: 1920 / 1079,
      },
    ],
    back: "hall",
    hotspots: [],
  },
  {
    id: "recepcion",
    title: "Recepción",
    caption:
      "El mostrador, bajo el logo. Es donde arranca cualquier visita, y desde donde sale el pasillo.",
    photos: [
      {
        src: `${F}/ingreso/entrada5.webp`,
        alt: "Mostrador de recepción visto desde el hall, con el logo de AURIS en la pared",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/recepcion/recepcion1.webp`,
        alt: "El mostrador verde de recepción y el paño con plantas que lo separa de la sala de espera",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/recepcion/recepcion2.webp`,
        alt: "Recepción desde el otro lado, con el logo de AURIS sobre la pared y la puerta vidriada al fondo",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/recepcion/recepcion3.webp`,
        alt: "Los puestos de trabajo detrás del mostrador de recepción",
        aspect: 1920 / 1079,
      },
    ],
    back: "hall",
    hotspots: [
      // El pasillo no sale por detrás del mostrador: es el hueco del extremo
      // izquierdo, el que deja ver el piso perdiéndose hacia el fondo. El
      // punto va sobre ese piso —no sobre el marco— porque es lo único que se
      // lee como "por acá se sigue".
      { x: 14, y: 55, label: "Ir al pasillo", to: "pasillo" },
    ],
  },
  {
    id: "pasillo",
    title: "Pasillo",
    caption:
      "La boca del pasillo: a la izquierda el consultorio 1, al centro el pasillo y a la derecha el baño.",
    photos: [
      {
        src: `${F}/pasillo/pasillo-01.webp`,
        alt: "Vista panorámica desde la recepción: a la izquierda la puerta del consultorio 1, al centro la boca del pasillo y a la derecha la puerta negra del baño",
        aspect: 1774 / 887,
        // Anclado al borde izquierdo, que es lo más lejos que el visor puede
        // correr el encuadre sin destapar la foto. Sin esto la puerta del
        // consultorio 1 —que asoma en el filo, del 0% al 3,5% del ancho— quedaba
        // muy lejos de la ventana. Lo que se pierde por la derecha es el
        // mostrador, que no lleva ningún círculo.
        focoX: 0,
      },
    ],
    back: "recepcion",
    hotspots: [
      // Marca la puerta que asoma en el filo izquierdo, pero no va sobre ella.
      // Medido en el navegador: aun con el encuadre en su tope, en escritorio
      // el recorte empieza recién en el 4,8% de la foto, así que la puerta
      // queda 74px afuera y un círculo encima sería intocable. Además, con el
      // cursor sobre la mitad derecha el paneo corre la foto hasta 13px más a
      // la izquierda. El 8% es el punto más pegado al borde que sigue siendo
      // tocable en los dos casos: a 48px en escritorio y 45px en un teléfono.
      { x: 8, y: 45, label: "Consultorio 1", to: "consultorio-1" },
      // La boca del pasillo, al fondo a la izquierda.
      { x: 18, y: 55, label: "Seguir por el pasillo", to: "pasillo-2" },
      // Sobre la hoja de la puerta negra, que ocupa del 51% al 70% del ancho.
      { x: 54, y: 45, label: "Baño", to: "bano" },
    ],
  },
  {
    id: "bano",
    title: "Baño",
    caption: "Sobre el pasillo, a pasos de la recepción. Es accesible.",
    photos: [
      {
        src: `${F}/banos/banorecepcion1.webp`,
        alt: "Puerta del baño abierta, con los pictogramas de accesibilidad y el inodoro con barra de apoyo",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/banos/banorecepcion2.webp`,
        alt: "Interior del baño, con la barra de apoyo junto al inodoro",
        aspect: 1920 / 1079,
      },
    ],
    back: "pasillo",
    hotspots: [],
  },
  {
    id: "pasillo-2",
    title: "Pasillo — primer tramo",
    caption:
      "Unos pasos adentro. A la izquierda el consultorio 1 y, a la derecha, la puerta del laboratorio.",
    photos: [
      {
        src: `${F}/pasillo/pasillo-02.webp`,
        alt: "Tramo del pasillo con una puerta abierta a la izquierda y la del laboratorio a la derecha",
        aspect: 1774 / 887,
        focoX: FUGA,
      },
    ],
    back: "pasillo",
    hotspots: [
      // Medidos por pixel sobre el archivo: la abertura angosta de luz
      // azulada, entre el 33% y el 37% del ancho.
      { x: 34.5, y: 28, label: "Consultorio 2", to: "consultorio-2" },
      // La puerta entornada de la derecha, vista casi de canto entre el 58% y
      // el 61%.
      { x: 60, y: 26, label: "Laboratorio", to: "laboratorio" },
      { x: FUGA, y: 62, label: "Seguir por el pasillo", to: "pasillo-3" },
    ],
  },
  {
    id: "pasillo-3",
    title: "Pasillo — segundo tramo",
    caption: "El laboratorio ya quedó atrás. A la izquierda, el consultorio 2.",
    photos: [
      {
        src: `${F}/pasillo/pasillo-03.webp`,
        alt: "Tramo del pasillo con la puerta del consultorio 2 abierta sobre la izquierda",
        aspect: 1774 / 887,
        focoX: FUGA,
      },
    ],
    back: "pasillo-2",
    hotspots: [
      { x: 31, y: 45, label: "Consultorio 3", to: "consultorio-3" },
      { x: FUGA, y: 62, label: "Seguir por el pasillo", to: "pasillo-4" },
    ],
  },
  {
    id: "pasillo-4",
    title: "Final del pasillo",
    caption:
      "Frente a la puerta del patio: a la izquierda el consultorio 3 y, sobre la derecha, el 5.",
    photos: [
      {
        src: `${F}/pasillo/pasillo-04.webp`,
        alt: "Final del pasillo, con la puerta de madera del patio al frente y aberturas a los costados",
        aspect: 1774 / 887,
        focoX: FUGA,
      },
    ],
    back: "pasillo-3",
    hotspots: [
      { x: 28, y: 45, label: "Consultorio 4", to: "consultorio-4" },
      // La abertura del fondo a la derecha, la que deja ver el escritorio.
      { x: 54, y: 45, label: "Consultorio 5", to: "consultorio-5" },
      // La puerta de madera del centro da al patio: no es una sala, así que
      // no lleva círculo. Marcarla mandaría a una habitación que no existe.
    ],
  },
  {
    id: "consultorio-1",
    title: "Consultorio 1 — Odontología",
    caption: "El primero de todos: su puerta da a la boca del pasillo.",
    photos: [
      {
        src: `${F}/consultorio-1/odontologia1.webp`,
        alt: "El consultorio 1 visto desde la puerta, con el sillón odontológico al fondo",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-1/odontologia2.webp`,
        alt: "Sillón odontológico del consultorio 1 junto al escritorio",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/consultorio-1/odontologia3.webp`,
        alt: "Mesada con bacha y el sillón del consultorio 1",
        aspect: 1920 / 1189,
      },
      {
        src: `${F}/consultorio-1/odontologia4.webp`,
        alt: "Vista general del consultorio 1 con el equipo y el taburete",
        aspect: 1920 / 1229,
      },
      {
        src: `${F}/consultorio-1/odontologia5.webp`,
        alt: "El consultorio 1 desde el otro extremo, con la ventana al fondo",
        aspect: 1920 / 1280,
      },
    ],
    back: "pasillo",
    hotspots: [],
  },
  {
    id: "consultorio-2",
    title: "Consultorio 2 — Odontopediatría",
    caption: "El consultorio de los chicos, sobre la izquierda del pasillo.",
    photos: [
      {
        src: `${F}/consultorio-2/odontopediatria1.webp`,
        alt: "Consultorio de odontopediatría con el sillón, el taburete naranja y la ventana",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-2/odontopediatria2.webp`,
        alt: "El sillón del consultorio de odontopediatría, con el almohadón con carita",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-2/odontopedriatia3.webp`,
        alt: "Mesada y equipamiento del consultorio de odontopediatría",
        aspect: 1920 / 1079,
      },
    ],
    back: "pasillo-2",
    hotspots: [],
  },
  {
    id: "consultorio-3",
    title: "Consultorio 3 — Odontología",
    caption: "Sobre la izquierda del pasillo, pasando odontopediatría.",
    photos: [
      {
        src: `${F}/consultorio-03/consultorio-01.webp`,
        alt: "El consultorio 3 visto desde la puerta, con el sillón odontológico a la izquierda y el escritorio bajo la ventana",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-03/consultorio-02.webp`,
        alt: "El sillón del consultorio 3 junto a la mesada con bacha",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-03/consultorio-03.webp`,
        alt: "El consultorio 3 desde el otro extremo, con el cuadro de la muela sobre la pared",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-03/consultorio-04.webp`,
        alt: "Vista general del consultorio 3, con el equipo y el escritorio de trabajo",
        aspect: 1920 / 1079,
      },
    ],
    back: "pasillo-3",
    hotspots: [],
  },
  {
    id: "consultorio-4",
    title: "Consultorio 4 — Kinesiología y estética",
    caption:
      "Al final del pasillo, sobre la izquierda: escritorio de consulta y camilla de estética.",
    photos: [
      {
        src: `${F}/consultorio-4-estetica/kinesiologia1.webp`,
        alt: "Vista panorámica del consultorio 4: la camilla contra la pared de la izquierda y el escritorio con dos sillas bajo la ventana",
        aspect: 1920 / 720,
      },
      {
        src: `${F}/consultorio-4-estetica/kinesiologia2.webp`,
        alt: "Escritorio del consultorio 4 con las orquídeas sobre la mesada",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-4-estetica/kinesiologia3.webp`,
        alt: "La camilla de estética y el equipamiento del consultorio 4",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/consultorio-4-estetica/kinesiologia4.webp`,
        alt: "Vista general del consultorio 4, con el escritorio y la camilla",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/consultorio-4-estetica/kinesiologia5.webp`,
        alt: "El consultorio 4 desde el escritorio hacia la camilla",
        aspect: 1920 / 1079,
      },
    ],
    // Regla del centro: no vuelve directo al pasillo, pasa por la vista de
    // vuelta. Ver el bloque de arriba.
    back: "pasillo-volver",
    hotspots: [],
  },
  {
    id: "consultorio-5",
    title: "Consultorio 5 — Psicología",
    caption: "El consultorio del fondo, sobre la derecha del pasillo.",
    photos: [
      {
        src: `${F}/consultorio-5-entrevista/psicologia1.webp`,
        alt: "El consultorio de psicología visto desde la puerta: el escritorio blanco con dos sillas y el cuadro de flores sobre la pared",
        aspect: 1774 / 887,
      },
      {
        src: `${F}/consultorio-5-entrevista/psicologia2.webp`,
        alt: "El escritorio del consultorio de psicología de cerca, con el difusor y las flores sobre la mesa",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/consultorio-5-entrevista/psicologia3.webp`,
        alt: "Vista general del consultorio de psicología, con las flores sobre el escritorio",
        aspect: 1920 / 1280,
      },
    ],
    // Misma regla que el consultorio 3.
    back: "pasillo-volver",
    hotspots: [],
  },
  {
    id: "laboratorio",
    title: "Laboratorio",
    caption: "Donde se preparan y se imprimen los trabajos del consultorio.",
    photos: [
      {
        src: `${F}/laboratorio/laboratorio1.webp`,
        alt: "El laboratorio visto desde la puerta, con las impresoras 3D sobre la mesada",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/laboratorio/laboratorio2.webp`,
        alt: "Mesada del laboratorio con la bacha, el esterilizador y los estantes",
        aspect: 1920 / 1180,
      },
      {
        src: `${F}/laboratorio/laboratorio3.webp`,
        alt: "Las impresoras 3D y el equipamiento del laboratorio",
        aspect: 1920 / 1180,
      },
    ],
    back: "pasillo-2",
    hotspots: [],
  },
  {
    id: "pasillo-volver",
    // Se llama igual que la parada `pasillo` a propósito: es el mismo lugar
    // mirado al revés, y el botón de volver de los consultorios 3 y 5 arma su
    // texto con este título ("Volver a Pasillo"). Con un nombre propio —"De
    // vuelta por el pasillo"— ese botón quedaba ilegible. Lo que distingue a
    // las dos paradas es el pie, no el título.
    title: "Pasillo",
    caption: "Mirando hacia la salida, con el hall iluminado al fondo.",
    photos: [
      {
        src: `${F}/pasillo/pasillovolver.webp`,
        alt: "El pasillo mirando hacia la recepción, con el hall iluminado al fondo",
        aspect: 1920 / 1079,
      },
    ],
    // Sin botón de volver: esta parada ya es la vuelta, se sigue por los
    // círculos.
    back: null,
    hotspots: [
      // Dos salidas, y las dos hacen falta. Acá se llega desde el consultorio
      // 3 o el 5, que están al fondo: con una sola salida a la boca del
      // pasillo, ver el otro consultorio obligaba a recorrerlo entero de nuevo.
      // Arriba, el fondo iluminado que es la recepción; abajo, cerca del
      // observador, la vuelta al final del pasillo, que es de donde se viene.
      { x: 49, y: 42, label: "Ir a recepción", to: "recepcion" },
      { x: 49, y: 72, label: "Seguir por el pasillo", to: "pasillo-4" },
    ],
  },
];

/** El nodo por donde arranca el recorrido. */
export const TOUR_START = "ingreso";

export function getTourNode(id: string) {
  return tourNodes.find((node) => node.id === id);
}
