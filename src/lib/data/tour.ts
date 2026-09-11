/**
 * Grafo de navegación del recorrido virtual.
 *
 * Cada nodo es una vista del centro y cada hotspot una puerta o un pasaje que
 * se ve en esa foto. Las coordenadas van en porcentaje sobre la imagen —no en
 * píxeles— para que el punto siga cayendo sobre la puerta en cualquier pantalla.
 *
 * El orden del recorrido y de qué lado del pasillo queda cada espacio salen de
 * `gallery.ts`, que ya lo tenía relevado. Lo que cambia es la presentación: en
 * vez de una lista con flechas, se camina de foto en foto.
 *
 * El hall reparte en tres: la sala de espera a la izquierda de la columna,
 * el mostrador a la derecha y el pasillo entre los dos.
 *
 * EL MAPA, tal como está el pasillo:
 *
 *   - Izquierda: consultorios 1, 2 y 3. El 1 se ve desde el primer tramo; el
 *     2 y el 3, desde el tramo del fondo.
 *   - Derecha: una sola abertura en todo el pasillo, el laboratorio. Se la ve
 *     desde los dos tramos y lleva la misma etiqueta en los dos: no cambia de
 *     nombre según desde dónde se la mire.
 *   - Al fondo, sobre la derecha: el consultorio 5, que es el de psicología.
 *   - La puerta de madera que cierra el pasillo da al patio. No es una sala,
 *     así que no lleva punto ni etiqueta.
 */

export type TourHotspot = {
  /** Posición del centro del círculo, en % del ancho y del alto de la foto. */
  x: number;
  y: number;
  /** Lo que dice el globo al pasar el cursor. */
  label: string;
  /** Id del nodo destino. */
  to: string;
};

export type TourNode = {
  id: string;
  /** Nombre de la parada, el que se muestra como título. */
  title: string;
  /** Una línea de contexto, debajo del título. */
  caption: string;
  /** La foto que se navega. */
  image: string;
  alt: string;
  /**
   * Ancho dividido alto de esa foto. Casi todas son verticales de teléfono
   * —9:16—, pero la del hall es apaisada, y el visor necesita el dato para
   * cubrir la ventana sin dejar franjas.
   */
  aspect: number;
  /**
   * Nodo al que lleva el hotspot de volver, abajo y al centro. `null` solo en
   * el ingreso, que es donde arranca el recorrido.
   */
  back: string | null;
  hotspots: TourHotspot[];
  /**
   * El resto de las fotos del mismo espacio. No participan de la navegación:
   * son las que hoy viven en la grilla y que, al sacarla, se quedarían sin
   * lugar. Van como tira chica dentro del nodo.
   */
  extras?: {
    src: string;
    alt: string;
    /** Ancho sobre alto. Si no está, se asume vertical de teléfono. */
    aspect?: number;
    /**
     * Altura del motivo de la foto, en % de su alto. Es donde se centra el
     * encuadre al abrirla. Sin esto se centra un poco por encima de la mitad,
     * que es donde suele estar lo que importa en una foto de interior.
     */
    focus?: number;
  }[];
};

export const tourNodes: TourNode[] = [
  {
    id: "ingreso",
    title: "Ingreso",
    caption:
      "El equipo en la puerta del centro, sobre Juan Bautista Daniel, con el cartel de las especialidades a la derecha.",
    // El recorrido abre con el equipo y no con la fachada vacía: lo primero
    // que se ve del centro son las personas que atienden. La fachada sola
    // queda abajo, entre las fotos del ingreso.
    image: "/images/galeria/doce-entrada.webp",
    aspect: 1672 / 940,
    alt: "Los doce profesionales de AURIS en la puerta del centro",
    back: null,
    hotspots: [
      // El frente vidriado asoma por encima del grupo: el punto va ahí y no
      // en el medio de la foto, que es donde están las personas.
      { x: 46, y: 24, label: "Acercarse a la entrada", to: "entrada" },
    ],
    extras: [
      {
        src: "/images/galeria/entrada-lejos.webp",
        alt: "Frente del centro visto desde la vereda, con el número 2044",
        aspect: 1672 / 940,
      },
      {
        src: "/images/galeria/ingreso-01.webp",
        alt: "Cartel de AURIS en el frente del centro",
      },
      {
        src: "/images/galeria/ingreso-02.webp",
        alt: "Fachada del centro con el número 2044",
      },
    ],
  },
  {
    id: "entrada",
    title: "Entrada",
    caption:
      "Ya en la puerta. A través del vidrio se ven la sala de espera y el mostrador.",
    image: "/images/galeria/entrada-cerca.webp",
    aspect: 1672 / 940,
    alt: "Puerta vidriada del centro vista de cerca, con la sala de espera a la izquierda y la recepción a la derecha",
    back: "ingreso",
    hotspots: [
      // Sobre la manija de la puerta.
      { x: 53, y: 52, label: "Entrar al centro", to: "recepcion" },
    ],
    extras: [
      {
        src: "/images/galeria/ingreso-03.webp",
        alt: "Puerta de entrada vidriada del centro",
      },
    ],
  },
  {
    id: "recepcion",
    // "Hall de entrada" y no "Recepción": la recepción es el mostrador, que
    // ahora es su propia parada. Con las dos llamándose igual, el "volver"
    // del mostrador decía "Volver a Recepción" y no se entendía a cuál.
    title: "Hall de entrada",
    caption:
      "La columna parte el hall en dos: a la izquierda la sala de espera, a la derecha el mostrador y el pasillo.",
    // La única foto apaisada del recorrido, y la que mejor explica la planta:
    // se ven las dos áreas de una, separadas por la columna.
    image: "/images/galeria/recepcion-panoramica.webp",
    aspect: 1448 / 1086,
    alt: "Hall de entrada: la sala de espera a la izquierda y el mostrador de recepción a la derecha, separados por una columna",
    back: "entrada",
    hotspots: [
      // Los bancos y el logo, del lado izquierdo de la columna.
      { x: 24, y: 53, label: "Sala de espera", to: "sala-espera" },
      // El mostrador, del lado derecho.
      { x: 78, y: 48, label: "Recepción", to: "recepcion-mostrador" },
      // El pasillo se ve iluminado entre la columna y el mostrador.
      { x: 58, y: 46, label: "Ir al pasillo", to: "pasillo" },
    ],
    // Sin fotos sueltas: esta parada es el reparto, y las del mostrador ahora
    // viven en su propia parada.
  },
  {
    id: "recepcion-mostrador",
    title: "Recepción",
    caption: "El mostrador, bajo el logo. Es donde arranca cualquier visita.",
    image: "/images/galeria/reunion-recepcion.webp",
    aspect: 1448 / 1086,
    alt: "El equipo de AURIS reunido frente al mostrador de recepción",
    back: "recepcion",
    hotspots: [],
    extras: [
      {
        src: "/images/galeria/recepcion-01.webp",
        alt: "Vista del hall hacia el mostrador de recepción",
      },
      {
        src: "/images/galeria/recepcion-03.webp",
        alt: "Mostrador de recepción en madera bajo el logo",
        // El logo está arriba de todo; centrada, la foto abre sobre la veta
        // de la madera del mostrador y no se entiende qué se está mirando.
        focus: 26,
      },
    ],
  },
  {
    id: "sala-espera",
    title: "Sala de espera",
    caption: "Bancos, luz natural y el logo sobre la pared.",
    image: "/images/galeria/recepcion-04.webp",
    aspect: 9 / 16,
    alt: "Sala de espera con bancos, ventana y el logo de AURIS en la pared",
    back: "recepcion",
    hotspots: [],
    extras: [
      {
        src: "/images/galeria/recepcion-02.webp",
        alt: "Sala de espera con el logo de AURIS en la pared",
      },
      {
        src: "/images/galeria/recepcion-05.webp",
        alt: "Rincón de la sala de espera junto al mostrador",
      },
    ],
  },
  {
    id: "pasillo",
    title: "Pasillo",
    caption: "El eje del centro. De acá salen los consultorios.",
    image: "/images/galeria/pasillo-03.webp",
    aspect: 9 / 16,
    alt: "Pasillo del centro, con el laboratorio a la derecha",
    back: "recepcion",
    hotspots: [
      // Puerta de la izquierda, la que deja salir luz azulada.
      { x: 30, y: 48, label: "Consultorio 1", to: "consultorio-1" },
      // Puerta abierta de la derecha: se ve la mesada del laboratorio. Es la
      // única abertura de ese lado y se la ve desde los dos tramos, así que
      // lleva la misma etiqueta en los dos.
      { x: 82, y: 47, label: "Laboratorio", to: "laboratorio" },
      // El pasillo sigue hacia el fondo.
      { x: 50, y: 63, label: "Seguir por el pasillo", to: "pasillo-fondo" },
    ],
    extras: [
      {
        src: "/images/galeria/pasillo-01.webp",
        alt: "Pasillo visto desde la recepción",
      },
      {
        src: "/images/galeria/pasillo-04.webp",
        alt: "Puerta de los sanitarios sobre el pasillo",
      },
    ],
  },
  {
    id: "consultorio-1",
    title: "Consultorio 1 — Odontología",
    caption: "Primer consultorio odontológico sobre la izquierda.",
    image: "/images/galeria/odontologia-1-01.webp",
    aspect: 9 / 16,
    alt: "Sillón odontológico del consultorio 1",
    back: "pasillo",
    hotspots: [],
    extras: [
      {
        src: "/images/galeria/odontologia-1-02.webp",
        alt: "Consultorio 1 con sillón junto a la ventana",
      },
      {
        src: "/images/galeria/odontologia-1-03.webp",
        alt: "Mesada y equipamiento del consultorio 1",
      },
    ],
  },
  {
    id: "consultorio-2",
    title: "Consultorio 2 — Odontología",
    caption: "Segundo consultorio odontológico, con escritorio de consulta.",
    image: "/images/galeria/odontologia-2-01.webp",
    aspect: 9 / 16,
    alt: "Consultorio 2 con sillón y escritorio",
    back: "pasillo-fondo",
    hotspots: [],
    extras: [
      {
        src: "/images/galeria/odontologia-2-02.webp",
        alt: "Sillón odontológico del consultorio 2",
      },
      {
        src: "/images/galeria/odontologia-2-03.webp",
        alt: "Vista general del consultorio 2",
      },
    ],
  },
  {
    id: "pasillo-fondo",
    title: "Pasillo — tramo del fondo",
    caption:
      "Los consultorios 2 y 3, el laboratorio y, al fondo, el consultorio 5. La puerta de madera del final da al patio.",
    image: "/images/galeria/pasillo-02.webp",
    aspect: 9 / 16,
    alt: "Tramo final del pasillo, con puertas a ambos lados y una puerta de madera al fondo",
    back: "pasillo",
    hotspots: [
      // Los dos consultorios que quedan, sobre la izquierda.
      { x: 24, y: 44, label: "Consultorio 2", to: "consultorio-2" },
      { x: 38, y: 41, label: "Consultorio 3", to: "consultorio-3" },
      // La misma puerta del laboratorio, vista desde más adentro. Acá decía
      // "Gabinete de estética": era la única abertura de la derecha en todo el
      // pasillo y no puede cambiar de nombre según desde dónde se la mire.
      { x: 81, y: 44, label: "Laboratorio", to: "laboratorio" },
      // Al fondo, sobre la derecha.
      { x: 66, y: 42, label: "Consultorio 5", to: "consultorio-5" },
      // La puerta de madera del fondo da al patio: no es una sala y por eso no
      // lleva punto. Marcarla como consultorio mandaba al visitante a una
      // habitación que no existe detrás de esa puerta.
    ],
  },
  {
    id: "consultorio-3",
    title: "Consultorio 3 — Odontología",
    caption: "Tercer consultorio odontológico sobre la izquierda.",
    image: "/images/galeria/odontologia-3-01.webp",
    aspect: 9 / 16,
    alt: "Consultorio 3 con sillón junto a la ventana",
    back: "pasillo-fondo",
    hotspots: [],
    extras: [
      {
        src: "/images/galeria/odontologia-3-02.webp",
        alt: "Equipamiento odontológico del consultorio 3",
      },
    ],
  },
  {
    id: "laboratorio",
    title: "Laboratorio",
    caption: "Donde se preparan y se imprimen los trabajos del consultorio.",
    image: "/images/galeria/laboratorio-01.webp",
    aspect: 9 / 16,
    alt: "Mesada del laboratorio con esterilizador e impresoras 3D",
    back: "pasillo",
    hotspots: [],
    extras: [
      {
        src: "/images/galeria/laboratorio-02.webp",
        alt: "Equipamiento del laboratorio",
      },
      {
        src: "/images/galeria/laboratorio-03.webp",
        alt: "Vista general del laboratorio",
      },
    ],
  },
  {
    id: "consultorio-5",
    title: "Consultorio 5 — Psicología",
    caption: "El consultorio del fondo, sobre la derecha.",
    image: "/images/galeria/consulta-01.webp",
    aspect: 9 / 16,
    alt: "Consultorio de psicología con escritorio",
    back: "pasillo-fondo",
    hotspots: [],
    extras: [
      {
        src: "/images/galeria/consulta-02.webp",
        alt: "Vista general del consultorio de psicología",
      },
    ],
  },
];

/** El nodo por donde arranca el recorrido. */
export const TOUR_START = "ingreso";

export function getTourNode(id: string) {
  return tourNodes.find((node) => node.id === id);
}
