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
  /**
   * Con qué color se pinta la tarjeta en el recorrido horizontal. Los seis
   * hitos de la crónica van en claro; los dos del final —que ya no cuentan
   * qué pasó sino para qué— se pintan con los colores del isotipo, que es
   * lo que los separa del relato y los deja como cierre.
   */
  tone?: "arena" | "verde";
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
      "La práctica odontológica estaba cambiando: la especialización, las nuevas tecnologías y los nuevos materiales empezaban a exigir mucha más formación y entrenamiento. Ya no alcanzaba con el consultorio general de siempre: cada área pedía su propio recorrido de estudio.",
  },
  {
    when: "1998",
    title: "Nace Kúspide",
    description:
      "Kúspide Consultorios Odontológicos abre con cuatro consultorios y todas las especialidades odontológicas bajo un mismo techo. La idea, poco común entonces, era que un tratamiento completo pudiera resolverse en un mismo lugar y entre profesionales que se conocen.",
  },
  {
    when: "Los años siguientes",
    title: "Tres centros",
    description:
      "Pese a las crisis y los desafíos, el proyecto crece hasta convertirse en tres centros de atención: dos en Córdoba y uno en San Francisco. Tres equipos distintos sosteniendo el mismo criterio de atención, que es lo que terminó de darle forma.",
  },
  {
    when: "Hace diez años",
    title: "La primera grieta",
    description:
      "Aun con una odontología cada vez más especializada, había situaciones que pedían mirar más allá de la boca. Empezamos a trabajar junto a fisioterapeutas para abordar el bruxismo y ciertas alteraciones funcionales, y la experiencia fue reveladora: cuando distintas disciplinas trabajan juntas, se entiende mejor lo que le pasa a una persona.",
  },
  {
    when: "Poco después",
    title: "El enfoque se extiende",
    description:
      "La misma lógica llega a la odontopediatría funcional, donde la odontología se complementa con fonoaudiología y kinesiología para acompañar el desarrollo de los chicos desde temprano. Mirar cómo respira, cómo traga y cómo mastica dice tanto como mirarle los dientes.",
  },
  {
    when: "Hoy",
    title: "AURIS",
    description:
      "El espacio pensado para reunir profesionales que comparten esta filosofía. Cada integrante del equipo fue elegido no solo por su formación y su experiencia, sino por su manera de entender la profesión, su empatía y sus ganas de trabajar junto a otros. El resultado es un equipo que se consulta entre sí.",
  },
  {
    when: "Todos los días",
    title: "Nuestro verdadero objetivo",
    tone: "arena",
    description:
      "Más allá de los tratamientos, las especialidades y los proyectos, hay algo que para nosotros es todavía más importante: que cada persona que entra a AURIS se sienta escuchada y contenida, que confíe en quienes la atienden, que encuentre profesionales comprometidos y que pueda sentirse cuidada.",
  },
  {
    when: "Lo que viene",
    title: "Bienvenidos a AURIS",
    tone: "verde",
    description:
      "Porque para nosotros, cuidar la salud también es cuidar a la persona. Eso es lo que sostiene cada consulta y lo que queremos que se note apenas se cruza la puerta: un espacio de salud y bienestar.",
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
