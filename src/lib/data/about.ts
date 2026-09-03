/**
 * Contenido institucional de "Sobre el centro".
 *
 * Sale del texto de presentación que escribió el fundador. Vive acá y no
 * dentro de la página para que se pueda corregir una fecha o sumar un pilar
 * sin tocar el maquetado.
 */

export type Milestone = {
  /** Lo que se lee en la columna de la izquierda. */
  when: string;
  title: string;
  description: string;
};

/**
 * La historia como línea de tiempo y no como tres párrafos seguidos: son
 * treinta años y en prosa se lee como un bloque que nadie termina.
 */
export const milestones: Milestone[] = [
  {
    when: "Fines de los 90",
    title: "El punto de partida",
    description:
      "La práctica odontológica estaba cambiando: la especialización, las nuevas tecnologías y los nuevos materiales empezaban a exigir mucha más formación y entrenamiento.",
  },
  {
    when: "1998",
    title: "Nace Kúspide",
    description:
      "Kúspide Consultorios Odontológicos abre con cuatro consultorios y todas las especialidades odontológicas bajo un mismo techo.",
  },
  {
    when: "Los años siguientes",
    title: "Tres centros",
    description:
      "Pese a las crisis y los desafíos, el proyecto crece hasta convertirse en tres centros de atención: dos en Córdoba y uno en San Francisco.",
  },
  {
    when: "Hace diez años",
    title: "La primera grieta",
    description:
      "Empezamos a trabajar junto a fisioterapeutas para abordar el bruxismo y ciertas alteraciones funcionales. La experiencia fue reveladora, y de ahí salió la pregunta que cambió la forma de trabajar.",
  },
  {
    when: "Hoy",
    title: "AURIS",
    description:
      "El espacio pensado para reunir profesionales de distintas disciplinas que comparten una misma manera de entender la salud.",
  },
];

export type Pillar = {
  title: string;
  description: string;
};

/** Hacia dónde va el centro. Se numeran solas en la página. */
export const pillars: Pillar[] = [
  {
    title: "Odontología funcional",
    description:
      "Consolidarnos como referentes en una atención odontológica que contemple a la persona de manera integral.",
  },
  {
    title: "Integración profesional",
    description:
      "Un espacio donde distintas disciplinas puedan encontrarse, complementarse y desarrollar proyectos nuevos.",
  },
  {
    title: "Adultos mayores",
    description:
      "Propuestas que acompañen el bienestar físico, cognitivo, emocional y social durante esta etapa de la vida.",
  },
  {
    title: "Estética consciente y longevidad",
    description:
      "La estética entendida desde el cuidado, la prevención y el acompañamiento saludable del paso del tiempo.",
  },
  {
    title: "Wellness",
    description:
      "Un lugar donde la salud, el bienestar, la prevención y la calidad de vida puedan encontrarse.",
  },
];
