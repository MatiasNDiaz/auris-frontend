import type { GalleryItem, TourStop } from "@/lib/types";

/**
 * Recorrido guiado por el centro, en el orden real en que se camina: se entra
 * por la fachada, se pasa por recepción, se toma el pasillo y desde ahí salen
 * los consultorios —los cuatro de la izquierda—, el laboratorio a la derecha y
 * el consultorio de entrevista al fondo.
 *
 * Ese orden es el que consume el visor tipo mapa: `TourStops` se recorre tal
 * cual está y cada parada indica de qué lado del pasillo queda, para poder
 * dibujar la planta.
 */
export const tourStops: TourStop[] = [
  {
    id: "ingreso",
    name: "Ingreso",
    caption: "La entrada sobre la calle, con el cartel del centro.",
    side: "start",
    photos: [
      { src: "/images/galeria/ingreso-01.webp", alt: "Cartel de AURIS en el frente del centro" },
      { src: "/images/galeria/ingreso-02.webp", alt: "Fachada del centro con el número 2044" },
      { src: "/images/galeria/ingreso-03.webp", alt: "Puerta de entrada vidriada del centro" },
    ],
  },
  {
    id: "recepcion",
    name: "Recepción y sala de espera",
    caption: "Mostrador de atención y sala de espera con luz natural.",
    side: "start",
    photos: [
      { src: "/images/galeria/recepcion-01.webp", alt: "Vista del hall hacia el mostrador de recepción" },
      { src: "/images/galeria/recepcion-02.webp", alt: "Sala de espera con el logo de AURIS en la pared" },
      { src: "/images/galeria/recepcion-03.webp", alt: "Mostrador de recepción en madera bajo el logo" },
      { src: "/images/galeria/recepcion-04.webp", alt: "Sala de espera con asientos y pantalla" },
      { src: "/images/galeria/recepcion-05.webp", alt: "Rincón de la sala de espera junto al mostrador" },
    ],
  },
  {
    id: "pasillo",
    name: "Pasillo",
    caption: "El eje del centro: de acá salen todos los consultorios.",
    side: "center",
    photos: [
      { src: "/images/galeria/pasillo-01.webp", alt: "Pasillo central del centro" },
      { src: "/images/galeria/pasillo-02.webp", alt: "Pasillo iluminado hacia los consultorios" },
      { src: "/images/galeria/pasillo-03.webp", alt: "Pasillo con obras de arte en las paredes" },
      { src: "/images/galeria/pasillo-04.webp", alt: "Puerta de consultorio sobre el pasillo" },
    ],
  },
  {
    id: "consultorio-1",
    name: "Consultorio 1 — Odontología",
    caption: "Primer consultorio odontológico sobre la izquierda.",
    side: "left",
    photos: [
      { src: "/images/galeria/odontologia-1-01.webp", alt: "Sillón odontológico del consultorio 1" },
      { src: "/images/galeria/odontologia-1-02.webp", alt: "Consultorio 1 con sillón junto a la ventana" },
      { src: "/images/galeria/odontologia-1-03.webp", alt: "Mesada y equipamiento del consultorio 1" },
    ],
  },
  {
    id: "consultorio-2",
    name: "Consultorio 2 — Odontología",
    caption: "Segundo consultorio odontológico, con escritorio de consulta.",
    side: "left",
    photos: [
      { src: "/images/galeria/odontologia-2-01.webp", alt: "Consultorio 2 con sillón y escritorio" },
      { src: "/images/galeria/odontologia-2-02.webp", alt: "Sillón odontológico del consultorio 2" },
      { src: "/images/galeria/odontologia-2-03.webp", alt: "Vista general del consultorio 2" },
    ],
  },
  {
    id: "consultorio-3",
    name: "Consultorio 3 — Odontología",
    caption: "Tercer consultorio odontológico sobre la izquierda.",
    side: "left",
    photos: [
      { src: "/images/galeria/odontologia-3-01.webp", alt: "Consultorio 3 con sillón junto a la ventana" },
      { src: "/images/galeria/odontologia-3-02.webp", alt: "Equipamiento odontológico del consultorio 3" },
    ],
  },
  {
    id: "consultorio-4",
    name: "Consultorio 4 — Estética",
    caption: "Camilla y aparatología para los tratamientos estéticos.",
    side: "left",
    photos: [
      { src: "/images/galeria/estetica-01.webp", alt: "Camilla del consultorio de estética" },
      { src: "/images/galeria/estetica-02.webp", alt: "Consultorio de estética con aparatología y bacha" },
      { src: "/images/galeria/estetica-03.webp", alt: "Escritorio de consulta del consultorio de estética" },
    ],
  },
  {
    id: "laboratorio",
    name: "Laboratorio",
    caption: "Sobre la derecha del pasillo: esterilización e impresión 3D.",
    side: "right",
    photos: [
      { src: "/images/galeria/laboratorio-01.webp", alt: "Mesada del laboratorio con equipamiento" },
      { src: "/images/galeria/laboratorio-02.webp", alt: "Impresoras 3D y autoclave del laboratorio" },
      { src: "/images/galeria/laboratorio-03.webp", alt: "Vista general del laboratorio" },
    ],
  },
  {
    id: "consultorio-5",
    name: "Consultorio 5 — Entrevista",
    caption: "Al fondo del pasillo, para consultas y entrevistas.",
    side: "end",
    photos: [
      { src: "/images/galeria/consulta-01.webp", alt: "Consultorio de entrevista al fondo del pasillo" },
      { src: "/images/galeria/consulta-02.webp", alt: "Escritorio del consultorio de entrevista" },
    ],
  },
];

/**
 * La grilla de la galería es el mismo material, aplanado. Se deriva del
 * recorrido para que no haya dos listas que mantener en sincronía.
 */
export const gallery: GalleryItem[] = tourStops.flatMap((stop) =>
  stop.photos.map((photo, index) => ({
    id: `${stop.id}-${index + 1}`,
    title: stop.name,
    category: photo.alt,
    imageUrl: photo.src,
  })),
);
