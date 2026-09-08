import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "odontologia",
    name: "Odontología",
    icon: "tooth",
    shortDescription:
      "El área central del centro: rehabilitación oral, implantología, odontopediatría funcional, alineadores y ortodoncia.",
    tagline: "Prevención antes que tratamiento",
    heroTitle: "Tu salud bucal, cuidada en serio",
    heroSubtitle:
      "Cinco áreas bajo el mismo techo, explicadas paso a paso antes de empezar.",
    fullDescription:
      "La odontología es el área central del centro y la que reúne más especialidades: rehabilitación oral, implantología, odontopediatría funcional, alineadores y ortodoncia. Trabajamos con un enfoque preventivo y mínimamente invasivo, desde el control periódico y la limpieza profesional hasta la reposición de piezas perdidas y la corrección de la mordida. Cada plan se arma después de un diagnóstico completo que conversamos con vos antes de empezar, con las etapas y los tiempos reales de cada tratamiento sobre la mesa. Contamos con equipamiento digital que reduce los tiempos de consulta y hace más cómoda cada visita.",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1920&auto=format&fit=crop",
    features: [
      "Rehabilitación oral, implantología y prótesis",
      "Odontopediatría funcional para los más chicos",
      "Alineadores transparentes y ortodoncia",
      "Diagnóstico, control preventivo y limpieza",
    ],
    branches: [
      {
        icon: "tooth",
        name: "Rehabilitación oral",
        description:
          "Reponemos piezas perdidas y devolvemos función a mordidas desgastadas o incompletas. Coronas, carillas y prótesis fijas o removibles, planificadas sobre un estudio previo de cómo cierra la mordida y de cuánto hueso hay disponible.",
      },
      {
        icon: "implant",
        name: "Implantología",
        description:
          "El implante reemplaza la raíz de la pieza perdida y es lo que sostiene la corona definitiva. No es un procedimiento de una sola visita: hay una etapa quirúrgica, una de cicatrización y una protésica, y conviene conocer los tiempos de cada una antes de empezar y no sobre la marcha.",
      },
      {
        icon: "baby",
        name: "Odontopediatría funcional",
        description:
          "Odontología infantil que mira algo más que las caries: cómo respira, cómo traga y cómo mastica el chico, porque esas funciones son las que van dando forma a los maxilares mientras crece. Se trabaja también sobre los hábitos —chupete, mamadera, succión digital— y sobre el seguimiento del crecimiento.",
      },
      {
        icon: "aligner",
        name: "Alineadores",
        description:
          "Férulas transparentes y removibles que van moviendo las piezas por etapas. Antes de colocar la primera hacemos el escaneo intraoral y la planificación digital del recorrido completo, así se sabe de entrada cuánto lleva el tratamiento y hasta dónde llega.",
      },
      {
        icon: "ortho",
        name: "Ortodoncia",
        description:
          "Brackets estéticos o metálicos, para los casos en que el movimiento necesita más control del que dan los alineadores o en que la constancia de uso no está garantizada. Terminado el tratamiento viene la contención, que es lo que evita que los dientes vuelvan a moverse.",
      },
    ],
  },
  {
    slug: "odontopediatria-funcional",
    name: "Odontopediatría funcional",
    icon: "baby",
    shortDescription:
      "Odontología infantil con mirada funcional: cómo el chico respira, traga y mastica, además de cómo están sus dientes.",
    tagline: "Mirar cómo crece, no solo cómo está",
    heroTitle: "Mirar cómo crece, no solo cómo está",
    heroSubtitle:
      "Control, prevención y hábitos, mirando la función completa: respiración, deglución y masticación.",
    fullDescription:
      "La odontopediatría funcional mira algo más que las caries: observa cómo respira el chico, cómo traga y cómo mastica, porque esas funciones son las que van dando forma a los maxilares mientras crece. Un chico que respira por la boca, o que sostiene una deglución infantil más allá de la edad esperable, desarrolla el paladar y la mordida de otra manera, y eso se corrige mucho mejor a los seis años que a los quince. Trabajamos la prevención, los hábitos —chupete, mamadera, succión digital— y el seguimiento del crecimiento, en consultas pensadas para que el chico no le tenga miedo al consultorio.",
    imageUrl: "/images/servicios/odontopediatria-funcional.webp",
    features: [
      "Control y prevención desde la primera infancia",
      "Evaluación de respiración, deglución y masticación",
      "Abordaje de hábitos: chupete, mamadera, succión digital",
      "Seguimiento del crecimiento de los maxilares",
    ],
  },
  {
    slug: "alineadores-y-ortodoncia",
    name: "Alineadores y ortodoncia",
    icon: "tooth",
    // Submarca propia del centro para los alineadores.
    iconImage: "/images/smile-now-alineadores.webp",
    shortDescription:
      "Ortodoncia con alineadores transparentes o brackets, planificada digitalmente desde el primer estudio.",
    tagline: "Alinear sin que se note",
    heroTitle: "Alinear sin que se note",
    heroSubtitle:
      "Alineadores transparentes o brackets, con el recorrido planificado digitalmente antes de colocar nada.",
    fullDescription:
      "Antes de empezar cualquier tratamiento de ortodoncia hacemos un escaneo intraoral y planificamos digitalmente el recorrido completo: qué pieza se mueve, en qué orden y cuánto tiempo lleva. Recién con esa planificación sobre la mesa conversamos las opciones. Los alineadores transparentes son removibles y prácticamente invisibles, pero dependen de que los uses las horas indicadas; los brackets no dependen de eso, pero se ven y exigen más cuidado en la higiene. Ninguna de las dos opciones es mejor en abstracto: la elección depende del caso y de la rutina de cada persona. Terminado el tratamiento viene la contención, que es lo que evita que los dientes vuelvan a moverse.",
    imageUrl: "/images/servicios/alineadores-y-ortodoncia.webp",
    features: [
      "Escaneo intraoral y planificación digital",
      "Alineadores transparentes removibles",
      "Ortodoncia con brackets estéticos y metálicos",
      "Controles periódicos y contención posterior",
    ],
  },
  {
    slug: "bruxismo-y-disfunciones",
    name: "Bruxismo y disfunciones",
    icon: "activity",
    shortDescription:
      "Diagnóstico y tratamiento del bruxismo y de las disfunciones de la articulación temporomandibular.",
    tagline: "Frenar el desgaste antes de que avance",
    heroTitle: "Frenar el desgaste antes de que avance",
    heroSubtitle:
      "Placas, ajuste de la mordida y trabajo sobre la articulación, para detener el desgaste a tiempo.",
    fullDescription:
      "El bruxismo casi nunca llega como motivo de consulta: llega como un diente sensible, una restauración que se fisura o un dolor de cabeza al despertar. El diagnóstico mira el patrón de desgaste del esmalte, la musculatura de la mandíbula y cómo cierra la mordida. El tratamiento suele combinar una placa de descarga hecha a medida, ajustes sobre la oclusión cuando corresponde y trabajo sobre la articulación temporomandibular. El desgaste que ya ocurrió no se revierte solo, pero se puede frenar; por eso el seguimiento en el tiempo es parte del tratamiento y no un extra.",
    imageUrl: "/images/servicios/bruxismo-y-disfunciones.webp",
    features: [
      "Diagnóstico del desgaste y de la mordida",
      "Placas de descarga hechas a medida",
      "Abordaje del dolor y la tensión mandibular",
      "Control del desgaste en el tiempo",
    ],
  },
  {
    slug: "estetica-facial-y-corporal",
    name: "Estética facial y corporal",
    icon: "sparkles",
    shortDescription:
      "Tratamientos que cuidan la piel y el cuerpo con criterio profesional y resultados progresivos.",
    tagline: "Resultados que se sostienen",
    heroTitle: "Resultados que se sostienen",
    heroSubtitle:
      "Planes faciales y corporales diseñados sobre un diagnóstico real, sin promesas desmedidas.",
    fullDescription:
      "Diseñamos planes de tratamiento personalizados a partir de un diagnóstico de piel y de los objetivos de cada persona. Priorizamos procedimientos seguros, con evidencia y resultados sostenibles en el tiempo, evitando promesas desmedidas. El seguimiento posterior es parte del tratamiento: acompañamos con pautas de cuidado domiciliario para que los resultados se mantengan.",
    imageUrl: "/EsteticaCorporal.webp",
    features: [
      "Diagnóstico y limpieza facial profunda",
      "Tratamientos de hidratación y renovación cutánea",
      "Abordaje corporal y drenaje linfático",
      "Plan de cuidado domiciliario personalizado",
    ],
  },
  {
    slug: "fonoaudiologia",
    name: "Fonoaudiología",
    icon: "ear",
    shortDescription:
      "Evaluación y tratamiento del lenguaje, la voz, la audición y la deglución.",
    tagline: "Comunicarse mejor, a toda edad",
    heroTitle: "Comunicarse mejor, a toda edad",
    heroSubtitle:
      "Lenguaje, voz, audición y deglución, con evaluación diagnóstica y trabajo articulado.",
    fullDescription:
      "Atendemos a niños, adolescentes y adultos en dificultades del lenguaje, el habla, la voz, la audición y la deglución. El proceso comienza con una evaluación diagnóstica detallada y, cuando corresponde, se articula con la familia, la escuela o el equipo médico tratante. Los tratamientos se planifican en ciclos con revisión periódica de objetivos.",
    imageUrl: "/Fonoaudiologia.webp",
    features: [
      "Evaluación del lenguaje y el habla",
      "Tratamiento de la voz profesional",
      "Estudios y abordaje auditivo",
      "Trabajo articulado con familia y escuela",
    ],
  },
  {
    slug: "psicologia",
    name: "Psicología",
    icon: "brain",
    shortDescription:
      "Acompañamiento terapéutico individual, de pareja y familiar en un espacio de escucha y confianza.",
    tagline: "Un espacio para pensarte con tiempo",
    heroTitle: "Un espacio para pensarte con tiempo",
    heroSubtitle:
      "Terapia individual, de pareja y familiar, con la escucha y el encuadre que cada proceso necesita.",
    fullDescription:
      "Nuestro equipo de psicología acompaña procesos de cambio personal desde un enfoque integrador, respetando el tiempo y la singularidad de cada persona. Trabajamos sobre ansiedad, estados de ánimo, duelos, vínculos y crisis vitales, tanto en formato individual como de pareja y familia. Cada proceso comienza con entrevistas de admisión donde definimos objetivos claros y elegimos juntos el encuadre más adecuado.",
    imageUrl: "/Piscologia.webp",
    features: [
      "Terapia individual para adolescentes y adultos",
      "Terapia de pareja y orientación familiar",
      "Abordaje de ansiedad, estrés y estados de ánimo",
      "Sesiones presenciales y por videollamada",
    ],
  },
  {
    slug: "taller-de-adultos-mayores",
    name: "Taller de adultos mayores",
    icon: "users",
    shortDescription:
      "Encuentros grupales para sostener la autonomía, la memoria y el vínculo social.",
    tagline: "Seguir activo, en buena compañía",
    heroTitle: "Seguir activo, en buena compañía",
    heroSubtitle:
      "Encuentros grupales que sostienen la memoria, la autonomía y el vínculo social.",
    fullDescription:
      "Un espacio grupal pensado para personas mayores, coordinado por profesionales del equipo. Los encuentros combinan estimulación cognitiva, actividad física suave adaptada y dinámicas de participación que fortalecen el vínculo social. El objetivo es sostener la autonomía en la vida cotidiana y acompañar esta etapa desde el encuentro con otros, en grupos reducidos donde cada persona avanza a su ritmo.",
    imageUrl: "/TallerAdultos.webp",
    features: [
      "Estimulación cognitiva y de la memoria",
      "Actividad física suave y adaptada",
      "Grupos reducidos y encuentros semanales",
      "Articulación con la familia y el médico tratante",
    ],
  },
  {
    slug: "kinesiologia",
    name: "Kinesiología",
    icon: "waves",
    // Fuera de las grillas: no entra en el orden de ocho que definió el
    // centro. La página sigue existiendo y se llega desde Bruxismo, que es
    // el tratamiento que la usa como complemento.
    listed: false,
    shortDescription:
      "Kinesiología aplicada a los tratamientos estéticos y odontológicos: drenaje, recuperación y trabajo sobre la zona tratada.",
    tagline: "El complemento que sostiene el resultado",
    heroTitle: "El complemento que sostiene el resultado",
    heroSubtitle:
      "Drenaje, recuperación y trabajo manual sobre la zona tratada, para que lo que se hizo en el gabinete se mantenga.",
    fullDescription:
      "Trabajamos la kinesiología como complemento de los tratamientos estéticos y odontológicos del centro, no como una consulta aparte. El abordaje incluye drenaje linfático después de procedimientos faciales y corporales, trabajo sobre la articulación temporomandibular en pacientes con bruxismo o tensión mandibular, y acompañamiento en la recuperación posterior a intervenciones odontológicas. Cada plan se arma junto al profesional que llevó adelante el tratamiento, porque el resultado depende tanto de lo que se hizo en el gabinete como de cómo responde el tejido después.",
    imageUrl:
      "https://images.unsplash.com/photo-1713085085470-fba013d67e65?q=80&w=1920&auto=format&fit=crop",
    features: [
      "Drenaje linfático post tratamiento estético",
      "Abordaje de la articulación temporomandibular (ATM)",
      "Recuperación tras procedimientos odontológicos",
      "Plan coordinado con estética y odontología",
    ],
  },
];

/**
 * Los que se muestran en las grillas, el hero, el footer y el filtro del
 * equipo. `services` sigue teniendo todos para las rutas y las búsquedas por
 * slug: un servicio sin listar conserva su página.
 */
export const listedServices = services.filter(
  (service) => service.listed !== false,
);

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
