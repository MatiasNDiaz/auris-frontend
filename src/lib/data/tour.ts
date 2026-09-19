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
 *   Entrando por el pasillo, y en este orden:
 *     - derecha: el baño (casi en la boca) y el laboratorio;
 *     - izquierda: consultorio 1, consultorio 2 y consultorio 3;
 *     - al fondo a la derecha: el consultorio 5.
 *
 *   El consultorio 5 es el que el plano anterior llamaba 4: es el mismo
 *   ambiente, no dos. No existe un nodo "consultorio 4".
 *
 * TRES REGLAS ESPECIALES que pidió el centro y que no se pueden inferir de
 * las fotos:
 *
 *   1. El baño no se entra directo: primero se ve el pasillo frente a su
 *      puerta (`pasillo-1-5banos`) y recién después el baño en sí.
 *   2. Volver desde el consultorio 3 o desde el 5 no lleva al pasillo de una:
 *      pasa por `pasillo-volver`, que es la foto del pasillo mirando hacia la
 *      salida, y desde ahí un círculo devuelve a la boca del pasillo.
 *   3. La primera foto de cada carpeta es la que abre el ambiente.
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
      // El pasillo se abre a la derecha del mostrador, por detrás.
      { x: 78, y: 45, label: "Ir al pasillo", to: "pasillo" },
    ],
  },
  {
    id: "pasillo",
    title: "Pasillo",
    caption:
      "El eje del centro, desde la boca. A la derecha, la puerta del baño.",
    photos: [
      {
        src: `${F}/pasillo/pasillo-01.webp`,
        alt: "Pasillo del centro visto desde la recepción, con la puerta del patio al fondo",
        aspect: 1080 / 1920,
      },
    ],
    back: "recepcion",
    hotspots: [
      // El baño es lo primero sobre la derecha: el hueco que se abre en esa
      // pared, antes del laboratorio.
      { x: 72, y: 47, label: "Baño", to: "bano" },
      { x: 50, y: 60, label: "Seguir por el pasillo", to: "pasillo-2" },
    ],
  },
  {
    id: "bano",
    title: "Baño",
    caption: "Sobre el pasillo, a pasos de la recepción. Es accesible.",
    photos: [
      // Esta foto no se saltea: es la que ubica dónde está la puerta antes de
      // entrar, y por eso abre el ambiente en vez de ir directo al interior.
      {
        src: `${F}/pasillo/pasillo-1-5banos.webp`,
        alt: "El pasillo frente a la puerta del baño, con el cuadro sobre la pared de la izquierda",
        aspect: 1080 / 1920,
      },
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
      "Unos pasos adentro. A la izquierda el consultorio 1 y, enfrente, la puerta del laboratorio.",
    photos: [
      {
        src: `${F}/pasillo/pasillo-02.webp`,
        alt: "Tramo del pasillo con una puerta abierta a la izquierda y la del laboratorio a la derecha",
        aspect: 1080 / 1920,
      },
    ],
    back: "pasillo",
    hotspots: [
      // La abertura de la izquierda, la que deja salir luz azulada.
      { x: 17, y: 45, label: "Consultorio 1", to: "consultorio-1" },
      // La única puerta de la derecha en este tramo.
      { x: 84, y: 45, label: "Laboratorio", to: "laboratorio" },
      { x: 50, y: 62, label: "Seguir por el pasillo", to: "pasillo-3" },
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
        aspect: 447 / 797,
      },
    ],
    back: "pasillo-2",
    hotspots: [
      { x: 24, y: 45, label: "Consultorio 2", to: "consultorio-2" },
      { x: 50, y: 62, label: "Seguir por el pasillo", to: "pasillo-4" },
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
        aspect: 445 / 793,
      },
      {
        src: `${F}/pasillo/pasillo-05.webp`,
        alt: "La puerta de madera que cierra el pasillo, de cerca",
        aspect: 442 / 791,
      },
    ],
    back: "pasillo-3",
    hotspots: [
      { x: 30, y: 42, label: "Consultorio 3", to: "consultorio-3" },
      // La abertura del fondo a la derecha. No va más al borde: el círculo
      // mide 44px y pegado al 92% se corta contra el marco en un teléfono.
      { x: 88, y: 50, label: "Consultorio 5", to: "consultorio-5" },
      // La puerta de madera del centro da al patio: no es una sala, así que
      // no lleva círculo. Marcarla mandaría a una habitación que no existe.
    ],
  },
  {
    id: "consultorio-1",
    title: "Consultorio 1 — Odontología",
    caption: "Primer consultorio sobre la izquierda del pasillo.",
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
    back: "pasillo-2",
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
    back: "pasillo-3",
    hotspots: [],
  },
  {
    id: "consultorio-3",
    title: "Consultorio 3 — Kinesiología y estética",
    caption:
      "Al final del pasillo, sobre la izquierda: escritorio de consulta y camilla de estética.",
    photos: [
      {
        src: `${F}/consultorio-3/kinesiologia1.webp`,
        alt: "El consultorio 3 visto desde la puerta, con el escritorio y las sillas",
        aspect: 720 / 1280,
      },
      {
        src: `${F}/consultorio-3/kinesiologia2.webp`,
        alt: "Escritorio del consultorio 3 con las orquídeas sobre la mesada",
        aspect: 1920 / 1079,
      },
      {
        src: `${F}/consultorio-3/kinesiologia3.webp`,
        alt: "La camilla de estética y el equipamiento del consultorio 3",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/consultorio-3/kinesiologia4.webp`,
        alt: "Vista general del consultorio 3, con el escritorio y la camilla",
        aspect: 1920 / 1280,
      },
      {
        src: `${F}/consultorio-3/kinesiologia5.webp`,
        alt: "El consultorio 3 desde el escritorio hacia la camilla",
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
        alt: "El consultorio de psicología visto desde la puerta, con el escritorio al fondo",
        aspect: 900 / 1600,
      },
      {
        src: `${F}/consultorio-5-entrevista/psicologia2.webp`,
        alt: "Escritorio y sillas del consultorio de psicología, con el cuadro sobre la pared",
        aspect: 900 / 1600,
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
    // Sin botón de volver: esta parada ya es la vuelta. Se sigue por el
    // círculo, que devuelve a la boca del pasillo.
    back: null,
    hotspots: [{ x: 48, y: 46, label: "Volver al pasillo", to: "pasillo" }],
  },
];

/** El nodo por donde arranca el recorrido. */
export const TOUR_START = "ingreso";

export function getTourNode(id: string) {
  return tourNodes.find((node) => node.id === id);
}
