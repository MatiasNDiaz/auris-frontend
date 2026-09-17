import type { Ficha, Professional, Trayectoria } from "@/lib/types";
import { trayectorias } from "./trayectorias";

/**
 * Ficha extendida de cada profesional: cómo se reparte su bio en la línea de
 * tiempo, el banner y las cifras.
 *
 * La bio no se reescribe acá: cada `texto`, `frase` e ítem de servicio es un
 * pedazo literal de su `Trayectoria`, y al final del archivo se comprueba que
 * (1) cada pedazo esté letra por letra en la bio y (2) no quede ninguna parte
 * de la bio afuera. Si alguien retoca una coma o se olvida un párrafo, el
 * build falla con el texto que no coincide.
 *
 * Las cifras son solo números que la bio dice: años, año de inicio, matrícula,
 * o la cuenta de una lista que está en la bio. Quien no tiene ninguno va sin
 * `cifras`.
 *
 * Quien todavía no tiene bio usa `fichaEnActualizacion`: la misma estructura,
 * sin inventar nada.
 */

const servicioAriel = {
  titulo: "Servicios en AURIS",
  grupos: [
    {
      items: [
        "Diagnóstico odontológico inicial.",
        "Evaluación integral y confección de planes de tratamiento personalizados.",
        "Diseño digital aplicado a la planificación odontológica.",
        "Rehabilitación Oral Funcional mediante tecnologías avanzadas.",
        "Diagnóstico y tratamiento del bruxismo y los desórdenes de la oclusión.",
        "Periodoncia.",
        "Cirugía odontológica.",
        "Operatoria Dental y Estética.",
        "Armonización Estética Orofacial.",
      ],
    },
  ],
};

const serviciosCarla = {
  titulo: "Servicios en AURIS",
  grupos: [
    {
      items: [
        "Odontología general.",
        "Odontopediatría.",
        "Evaluación de Crecimiento y Desarrollo.",
        "Ortopedia Miofuncional.",
        "Evaluación y abordaje de respiración bucal.",
        "Tratamiento de deglución atípica.",
        "Evaluación de alteraciones funcionales relacionadas con la postura y el sistema estomatognático.",
        "Ortodoncia con alineadores.",
        "Abordaje interdisciplinario junto a profesionales de fonoaudiología, kinesiología y otras especialidades.",
      ],
    },
  ],
};

const serviciosLaura = {
  titulo: "Servicios en AURIS",
  grupos: [
    {
      items: [
        "Consulta y evaluación odontológica inicial.",
        "Diagnóstico integral y planificación personalizada de tratamientos.",
        "Rehabilitación Oral Funcional.",
        "Prótesis fija y removible.",
        "Cirugía odontológica.",
        "Implantología.",
        "Estética odontológica y orofacial.",
        "Planificación de tratamientos interdisciplinarios en conjunto con profesionales de fisioterapia, psicología y fonoaudiología.",
      ],
    },
  ],
};

const cuenta = (servicios: { grupos: { items: string[] }[] }) =>
  servicios.grupos.flatMap((grupo) => grupo.items).length;

const fichas: Partial<Record<keyof typeof trayectorias, Ficha>> = {
  "ariel-vidal": {
    hitos: [
      {
        icono: "formacion",
        marca: "Universidad Nacional de Córdoba",
        titulo: "Formación universitaria",
        texto: [
          "Es Doctor en Odontología por la Universidad Nacional de Córdoba y fue docente de la Facultad de Odontología de la UNC.",
        ],
      },
      {
        icono: "experiencia",
        marca: "Desde 1998",
        titulo: "Experiencia profesional",
        texto: [
          "Con más de 25 años de trayectoria profesional, el Dr. Ariel Vidal se desempeña en el campo de la odontología desde 1998.",
        ],
      },
      {
        icono: "especializacion",
        titulo: "Formación y especialización",
        texto: [
          "A lo largo de su carrera ha desarrollado una formación especializada en Periodoncia, Rehabilitación Oral, Bruxismo y Trastornos de la Articulación Temporomandibular (ATM), Operatoria Dental, Estética y Armonización Estética Orofacial.",
        ],
      },
      {
        icono: "tecnologia",
        titulo: "Experiencia y tecnología",
        texto: [
          "Su enfoque combina experiencia clínica, actualización permanente y tecnología aplicada al diagnóstico y tratamiento, buscando ofrecer soluciones personalizadas que contemplen la salud, la función y la estética de cada paciente.",
        ],
      },
    ],
    destacado: {
      titulo: "Experiencia clínica + tecnología",
      texto: "Aplicadas al diagnóstico y tratamiento",
    },
    enfoque: {
      etiqueta: "Su enfoque profesional",
      frase: "Cada tratamiento comienza con un diagnóstico preciso.",
      texto: [
        "A partir de allí, trabaja en el diseño de estrategias personalizadas que permitan recuperar la función, mejorar la salud bucal y acompañar las necesidades estéticas de cada persona.",
      ],
    },
    cifras: {
      firma: "Más de 25 años de trayectoria",
      items: [
        { valor: 25, sufijo: "+", etiqueta: "años de trayectoria profesional" },
        {
          valor: 1998,
          anio: true,
          etiqueta: "inicio en el campo de la odontología",
        },
        { valor: cuenta(servicioAriel), etiqueta: "servicios en AURIS" },
      ],
    },
    servicios: servicioAriel,
  },

  "carla-fernandez": {
    hitos: [
      {
        icono: "especializacion",
        marca: "18 años de trayectoria",
        titulo: "Formación y especialización",
        texto: [
          "Con 18 años de trayectoria en el ejercicio de la Odontología, la Dra. Carla Daniela Fernández cuenta con formación especializada en Odontopediatría, Odontología y Deporte, Crecimiento y Desarrollo, Ortopedia Miofuncional y Ortodoncia con Alineadores.",
        ],
      },
      {
        icono: "experiencia",
        titulo: "Práctica profesional",
        texto: [
          "Su práctica profesional se centra especialmente en el desarrollo y funcionamiento del sistema estomatognático, con una mirada que contempla la relación entre la respiración, la deglución, la masticación, la postura y el crecimiento facial.",
        ],
      },
      {
        icono: "equipo",
        marca: "Ortopedia Miofuncional",
        titulo: "Trabajo interdisciplinario",
        texto: [
          "Su formación en Ortopedia Miofuncional le permite abordar alteraciones como la respiración bucal y la deglución atípica, trabajando en conjunto con otras disciplinas cuando resulta necesario para favorecer un desarrollo funcional y equilibrado.",
        ],
      },
    ],
    destacado: {
      titulo: "Una mirada funcional",
      texto: "Respiración, deglución, masticación y postura",
    },
    enfoque: {
      etiqueta: "Su enfoque profesional",
      frase:
        "Su propuesta busca comprender a cada paciente de manera integral",
      texto: [
        "contemplando las estructuras y funciones del sistema estomatognático y su relación con el desarrollo, la respiración y el bienestar general.",
        "Cada tratamiento se adapta a las necesidades particulares de la persona, priorizando una atención personalizada, respetuosa y basada en la evaluación clínica y el trabajo interdisciplinario.",
      ],
    },
    cifras: {
      firma: "18 años de trayectoria",
      items: [
        { valor: 18, etiqueta: "años de trayectoria en Odontología" },
        // Odontopediatría, Odontología y Deporte, Crecimiento y Desarrollo,
        // Ortopedia Miofuncional y Ortodoncia con Alineadores.
        { valor: 5, etiqueta: "áreas de formación especializada" },
        { valor: cuenta(serviciosCarla), etiqueta: "servicios en AURIS" },
      ],
    },
    servicios: serviciosCarla,
  },

  "claudia-tomasi": {
    hitos: [
      {
        icono: "formacion",
        marca: "Universidad Nacional de Córdoba",
        titulo: "Formación universitaria",
        texto: [
          "La Dra. Claudia Tomasi es odontóloga graduada de la Universidad Nacional de Córdoba, con amplia trayectoria en el ejercicio profesional en clínicas privadas.",
        ],
      },
      {
        icono: "experiencia",
        titulo: "Experiencia profesional",
        texto: [
          "A lo largo de su carrera se ha desempeñado en las áreas de odontología general, prótesis y estética odontológica, desarrollando una mirada integral sobre la salud, la función y la armonía del rostro.",
        ],
      },
      {
        icono: "especializacion",
        marca: "Posgrado y Diplomatura",
        titulo: "Formación y especialización",
        texto: [
          "Cuenta con formación de posgrado y Diplomatura en Armonización Orofacial, Biorregeneración y Estética Facial, áreas en las que ha profundizado sus conocimientos y experiencia clínica.",
        ],
      },
      {
        icono: "acompanamiento",
        marca: "Actualidad",
        titulo: "Su práctica hoy",
        texto: [
          "Actualmente desarrolla su práctica profesional con especial dedicación a los tratamientos de armonización orofacial y a procedimientos estéticos y regenerativos, buscando resultados naturales y personalizados que respeten las características de cada persona.",
        ],
      },
    ],
    destacado: {
      titulo: "Salud, función y estética",
      texto: "Resultados naturales y personalizados",
    },
    enfoque: {
      etiqueta: "Su enfoque profesional",
      frase:
        "Cada tratamiento parte de una evaluación personalizada que permite comprender las necesidades y objetivos de cada paciente.",
      texto: [
        "Su enfoque busca integrar salud, función y estética, priorizando resultados armónicos, naturales y acordes a la identidad de cada persona.",
      ],
    },
    // Su bio no trae años ni fechas: va sin cifras.
    servicios: {
      titulo: "Servicios en AURIS",
      grupos: [
        {
          titulo: "Armonización Orofacial y Estética Facial",
          items: [
            "Aplicación de toxina botulínica.",
            "Bioestimuladores de colágeno.",
            "Diseño y armonización de labios con ácido hialurónico.",
            "Tratamientos regenerativos con exosomas y PDRN.",
            "Procedimientos de estética facial personalizados.",
          ],
        },
        {
          titulo: "Odontología",
          items: [
            "Odontología general.",
            "Prótesis fija y removible.",
            "Estética odontológica.",
            "Blanqueamiento dental.",
          ],
        },
      ],
    },
  },

  "laura-mansilla": {
    hitos: [
      {
        icono: "formacion",
        marca: "UNC · 2016",
        titulo: "Formación universitaria",
        texto: [
          "Odontóloga egresada de la Universidad Nacional de Córdoba en 2016, cuenta con experiencia en odontología general y una formación especializada en rehabilitación oral.",
        ],
      },
      {
        icono: "especializacion",
        titulo: "Actualización constante",
        texto: [
          "Su práctica profesional se caracteriza por una capacitación y actualización constante en distintas áreas de la odontología, incluyendo cirugía, prótesis, estética orofacial e implantología.",
        ],
      },
      {
        icono: "experiencia",
        marca: "En AURIS",
        titulo: "Una mirada integral",
        texto: [
          "En AURIS trabaja desde una mirada integral, orientada a comprender las necesidades de cada paciente y diseñar alternativas de tratamiento personalizadas que permitan recuperar la función, la salud y la estética de la boca.",
        ],
      },
    ],
    destacado: {
      titulo: "Función, salud y estética",
      texto: "Tratamientos personalizados",
    },
    enfoque: {
      etiqueta: "Su enfoque profesional",
      frase:
        "Su objetivo es que cada persona pueda volver a sonreír, comer y hablar con comodidad, confianza y naturalidad.",
      texto: [
        "Cada tratamiento comienza con una escucha atenta de las necesidades y expectativas del paciente. A partir de un diagnóstico preciso, desarrolla un plan personalizado que busca recuperar no solo la sonrisa, sino también la función oral y el bienestar cotidiano.",
      ],
    },
    cifras: {
      firma: "Egresada de la UNC en 2016",
      items: [
        {
          valor: 2016,
          anio: true,
          etiqueta: "egreso de la Universidad Nacional de Córdoba",
        },
        { valor: cuenta(serviciosLaura), etiqueta: "servicios en AURIS" },
      ],
    },
    servicios: serviciosLaura,
  },

  "eugenia-leiva": {
    hitos: [
      {
        icono: "formacion",
        marca: "Universidad Nacional de Córdoba",
        titulo: "Formación universitaria",
        texto: [
          "Licenciada en Kinesiología y Fisioterapia egresada de la Universidad Nacional de Córdoba.",
          "Cosmetóloga.",
        ],
      },
      {
        icono: "experiencia",
        marca: "Más de 25 años",
        titulo: "Experiencia profesional",
        texto: [
          "Cuenta con más de 25 años de trayectoria profesional dedicada a la estética, bienestar y formación profesional.",
        ],
      },
      {
        icono: "proyecto",
        marca: "10 años",
        titulo: "Estética Mediterránea",
        texto: [
          "Fue fundadora y directora de la firma Estética Mediterránea y Mediterránea Group, Estética & Rejuvenecimiento, proyectos que desarrolló durante 10 años. También fue organizadora del Congreso Estética Mediterránea, evento líder de Argentina en los rubros Estética Interdisciplinaria, Medicina Estética y Spa durante 10 años consecutivos.",
        ],
      },
      {
        icono: "publicacion",
        marca: "20 ediciones",
        titulo: "Identidad Estética",
        texto: [
          "Es creadora y directora de la revista científica Identidad Estética, con 20 ediciones publicadas.",
        ],
      },
      {
        icono: "docencia",
        titulo: "Capacitadora y disertante",
        texto: [
          "Cuenta con una amplia trayectoria como capacitadora y disertante a nivel nacional e internacional, siendo invitada a participar en congresos, brindar seminarios, cursos tanto en Argentina como en el extranjero.",
        ],
      },
      {
        icono: "certificacion",
        marca: "ICF · ACTP",
        titulo: "Coach Ontológico Profesional",
        texto: [
          "Además, es Coach Ontológico Profesional certificada por la Escuela Argentina de PNL y Coaching y cuenta con acreditación ACTP (Accredited Coach Training Program) de la International Coaching Federation.",
        ],
      },
    ],
    destacado: {
      titulo: "Ciencia, salud y bienestar",
      texto: "Tecnologías de vanguardia no invasivas",
    },
    enfoque: {
      etiqueta: "Su enfoque profesional",
      frase:
        "Entiende la estética como un equilibrio entre ciencia, salud y bienestar.",
      texto: [
        "Su experiencia y su formación continua en las últimas tecnologías le permiten desarrollar tratamientos de vanguardia, adaptados a las necesidades de cada persona.",
        "Su abordaje parte de una evaluación individual y busca acompañar cada proceso utilizando protocolos y tecnologías de vanguardia no invasivas orientadas al cuidado de la piel, el bienestar y una mejor calidad de vida.",
      ],
    },
    cifras: {
      firma: "Más de 25 años de trayectoria",
      items: [
        { valor: 25, sufijo: "+", etiqueta: "años de trayectoria profesional" },
        {
          valor: 20,
          etiqueta: "ediciones de la revista científica Identidad Estética",
        },
        {
          valor: 10,
          etiqueta: "años consecutivos del Congreso Estética Mediterránea",
        },
      ],
    },
    servicios: {
      titulo: "Servicios en AURIS",
      grupos: [
        {
          items: [
            "Evaluación estética personalizada.",
            "Estética avanzada y longevidad.",
            "Tratamientos faciales y cuidado avanzado de la piel.",
            "Tratamientos corporales.",
            "Rejuvenecimiento facial no invasivo y terapias regenerativas.",
            "Abordajes orientados al bienestar, la longevidad y la calidad de vida.",
            "Acompañamiento profesional durante todo el proceso.",
          ],
        },
      ],
      cierre: [
        "Su filosofía es que cada persona pueda verse y sentirse bien en cada etapa de su vida. La salud de la piel comienza con una observación atenta.",
      ],
    },
  },

  "romina-tchakerian": {
    trayectoriaTitulo: "Trayectoria profesional",
    hitos: [
      {
        icono: "formacion",
        marca: "Diploma de Honor · UNC",
        titulo: "Formación universitaria",
        texto: [
          "Licenciada en Fonoaudiología y Diploma de Honor de la Universidad Nacional de Córdoba (UNC), cuenta con más de 15 años de trayectoria profesional y más de una década de experiencia en reconocidas instituciones de salud.",
        ],
      },
      {
        icono: "especializacion",
        titulo: "Especialización",
        texto: [
          "A lo largo de su carrera se ha especializado en la evaluación, diagnóstico y tratamiento de dificultades relacionadas con el habla, el lenguaje, la comunicación y la voz en niños, adolescentes y adultos.",
        ],
      },
      {
        icono: "acompanamiento",
        titulo: "Armonización orofacial",
        texto: [
          "Su práctica profesional también incluye el abordaje de la armonización orofacial, orientado a favorecer funciones esenciales como la respiración, la deglución y la masticación.",
        ],
      },
      {
        icono: "experiencia",
        marca: "Desde 2007",
        titulo: "Experiencia profesional",
        texto: [
          "Más de 15 años de experiencia en el ejercicio de la Fonoaudiología, desde 2007.",
        ],
      },
      {
        icono: "institucion",
        marca: "Más de 10 años",
        titulo: "Instituciones de salud",
        texto: [
          "Más de 10 años de trayectoria en instituciones de salud de reconocida trayectoria, entre ellas el Centro Argentino Cubano y el Sanatorio de la Cañada.",
        ],
      },
      {
        icono: "equipo",
        marca: "Actualidad",
        titulo: "Fundaciones",
        texto: [
          "Actualmente desarrolla también su actividad profesional en fundaciones como Veci.",
        ],
      },
    ],
    destacado: {
      titulo: "Diploma de Honor UNC",
      texto: "Habla, lenguaje, comunicación y voz",
    },
    enfoque: {
      etiqueta: "Su enfoque",
      frase:
        "Brinda una atención profesional, personalizada y centrada en las necesidades de cada persona",
      texto: [
        "acompañando también a sus familias durante el proceso terapéutico.",
        "Su objetivo es favorecer el desarrollo y la recuperación de las funciones comunicativas y orofaciales, contribuyendo a mejorar la calidad de vida de cada paciente.",
      ],
    },
    cifras: {
      firma: "Más de 15 años de trayectoria",
      items: [
        { valor: 15, sufijo: "+", etiqueta: "años de trayectoria profesional" },
        {
          valor: 2007,
          anio: true,
          etiqueta: "inicio en el ejercicio de la Fonoaudiología",
        },
        {
          valor: 10,
          sufijo: "+",
          etiqueta: "años en instituciones de salud",
        },
        {
          valor: 7894,
          prefijo: "M.P. ",
          anio: true,
          etiqueta: "matrícula profesional",
        },
      ],
    },
  },

  "eugenia-villalobos": {
    trayectoriaTitulo: "Formación y trayectoria profesional",
    hitos: [
      {
        icono: "formacion",
        marca: "Universidad Nacional de Córdoba",
        titulo: "Neurolingüística",
        texto: [
          "Adscripción concluida a la Cátedra de Neurolingüística de la Facultad de Fonoaudiología de la Universidad Nacional de Córdoba.",
        ],
      },
      {
        icono: "institucion",
        marca: "Escobar, Buenos Aires",
        titulo: "FLENI",
        texto: [
          "Ex pasante del Servicio de Fonoaudiología del Centro de Rehabilitación para Adultos FLENI, sede Escobar, Buenos Aires.",
        ],
      },
      {
        icono: "institucion",
        titulo: "Sanatorio Allende",
        texto: [
          "Ex integrante del Servicio de Neurorehabilitación CNR del Sanatorio Allende.",
        ],
      },
      {
        icono: "institucion",
        titulo: "Hospital Nacional de Clínicas",
        texto: [
          "Ex integrante del Servicio de Fonoaudiología del Hospital Nacional de Clínicas.",
        ],
      },
      {
        icono: "docencia",
        marca: "Provincia de Córdoba",
        titulo: "Tallerista",
        texto: [
          "Tallerista dedicada a la comunicación y el lenguaje en adultos mayores en diferentes municipios de la provincia de Córdoba.",
        ],
      },
    ],
    destacado: {
      titulo: "Neurorehabilitación",
      texto: "Comunicación y lenguaje en adultos mayores",
    },
    enfoque: {
      etiqueta: "Atención especializada en adultos mayores",
      frase:
        "En AURIS desarrolla propuestas orientadas a fortalecer la comunicación, la memoria y la participación social",
      texto: [
        "Con una sólida trayectoria en el ámbito de la neurorehabilitación y la atención fonoaudiológica, Eugenia acompaña a adultos mayores promoviendo el bienestar comunicacional, la participación activa y el mantenimiento de sus capacidades cognitivas y lingüísticas.",
      ],
    },
    // Su bio no trae años ni fechas: va sin cifras.
    servicios: {
      titulo: "Talleres en AURIS",
      grupos: [
        { items: ["Taller de Conversación.", "Taller de Memoria Auditiva."] },
      ],
    },
  },
};

/** Texto con al menos una letra o un número: lo demás es puntuación suelta. */
const TIENE_CONTENIDO = /[\p{L}\p{N}]/u;

/**
 * Comprueba que la ficha use la bio completa y sin cambios.
 *
 * Hay dos clases de citas:
 *
 *   - Texto: tiene que estar tal cual en la bio, o el build falla.
 *   - Rótulos (títulos, marcas, etiquetas): si coinciden exacto con un
 *     encabezado de la bio, lo cubren; si no, son rótulos de la interfaz.
 *
 * Título, especialidad y contactos no entran: la plantilla los muestra
 * siempre directo de la `Trayectoria`.
 */
function comprobar(slug: string, bio: Trayectoria, ficha: Ficha) {
  const piezas = bio.bloques.flatMap((bloque) =>
    bloque.tipo === "lista" ? bloque.items : [bloque.texto],
  );

  const citas = [
    ...ficha.hitos.flatMap((hito) => hito.texto),
    ficha.enfoque.frase,
    ...ficha.enfoque.texto,
    ...(ficha.servicios
      ? [
          ...(ficha.servicios.intro ?? []),
          ...ficha.servicios.grupos.flatMap((grupo) => grupo.items),
          ...(ficha.servicios.cierre ?? []),
        ]
      : []),
  ];

  const rotulos = [
    ficha.trayectoriaTitulo,
    ...ficha.hitos.flatMap((hito) => [hito.titulo, hito.marca]),
    ficha.enfoque.etiqueta,
    ficha.servicios?.titulo,
    ...(ficha.servicios?.grupos.map((grupo) => grupo.titulo) ?? []),
  ].filter((rotulo): rotulo is string => Boolean(rotulo));

  const restos = [...piezas];

  // Primero los rótulos, que solo cubren una pieza idéntica.
  for (const rotulo of rotulos) {
    const indice = restos.findIndex((resto) => resto.trim() === rotulo);
    if (indice !== -1) restos[indice] = "";
  }

  // Las más largas primero, y cada una busca antes una pieza idéntica: así un
  // ítem corto como "Periodoncia." no se come un pedazo de un párrafo largo
  // que casualmente lo contenga.
  for (const cita of [...citas].sort((a, b) => b.length - a.length)) {
    let indice = restos.findIndex((resto) => resto.trim() === cita);
    if (indice === -1) indice = restos.findIndex((r) => r.includes(cita));

    if (indice === -1) {
      throw new Error(
        `[fichas] ${slug}: "${cita}" no está tal cual en su bio, o se usa dos veces.`,
      );
    }
    restos[indice] = restos[indice].replace(cita, "");
  }

  // Lo que sobra después de partir una oración —una coma, un punto, dos
  // puntos— no es contenido perdido.
  const faltan = restos
    .map((resto) => resto.trim())
    .filter((resto) => TIENE_CONTENIDO.test(resto));
  if (faltan.length) {
    throw new Error(
      `[fichas] ${slug}: estas partes de la bio no aparecen en la ficha: ${faltan
        .map((texto) => `"${texto}"`)
        .join(", ")}`,
    );
  }
}

for (const [slug, ficha] of Object.entries(fichas)) {
  if (ficha) {
    comprobar(slug, trayectorias[slug as keyof typeof trayectorias], ficha);
  }
}

/**
 * Ficha de quien todavía no tiene bio: la misma estructura que el resto, con
 * los rótulos de siempre y "Información en actualización" donde iría su
 * historia. La frase del banner es la del hero. No lleva cifras.
 */
export function fichaEnActualizacion(professional: Professional): Ficha {
  return {
    enActualizacion: true,
    hitos: [
      { icono: "formacion", titulo: "Formación universitaria", texto: [] },
      { icono: "experiencia", titulo: "Experiencia profesional", texto: [] },
      {
        icono: "especializacion",
        titulo: "Formación y especialización",
        texto: [],
      },
    ],
    destacado: {
      titulo: professional.specialty,
      texto: "Equipo AURIS",
    },
    enfoque: {
      etiqueta: "Su enfoque profesional",
      frase: professional.motto,
      texto: [],
    },
  };
}

/**
 * Encuadre de la foto del banner de cada uno: dónde cae su cara dentro de la
 * foto 6.
 *
 * Va aparte de la ficha a propósito: esto depende de la foto y no de la bio,
 * así que también lo puede tener quien todavía está "en actualización". Sin
 * entrada acá se usan los valores por defecto de la plantilla.
 *
 * `bannerFoco` es la altura de la cara en la foto —y sube dentro de la franja
 * a medida que el número crece—; `bannerCorrimiento`, cuánto hay que empujar
 * la foto a la derecha para que la cara no quede debajo del texto.
 */
const encuadreBanner: Record<
  string,
  Pick<
    Ficha,
    "bannerFoco" | "bannerCorrimiento" | "heroFoco" | "heroHoverFoco"
  >
> = {
  // De pie y centrado en su foto.
  "ariel-vidal": { bannerFoco: "center 38%", bannerCorrimiento: "8%" },
  // Sentada y hacia la izquierda de su foto: hay que correrla bastante.
  "carla-fernandez": { bannerFoco: "center 56%", bannerCorrimiento: "30%" },
  // Sentada, con la cara alta y ya algo a la derecha en su foto.
  "soledad-di-martino": { bannerFoco: "center 42%", bannerCorrimiento: "12%" },
  // De pie, con la cara bien arriba en su foto y apenas a la derecha. Su foto
  // 2 es apaisada y ella está sobre el borde derecho, así que el recorte
  // vertical del hero tiene que ir a buscarla ahí.
  "daniela-giansetto": {
    bannerFoco: "center 29%",
    bannerCorrimiento: "15%",
    // Pasado del 50% el recorte se va hacia la derecha de la foto, que es
    // donde está ella: con 86% queda con cara y cuerpo al centro de la card.
    heroHoverFoco: "86% center",
  },
};

export function getFicha(professional: Professional): Ficha {
  const ficha =
    fichas[professional.slug as keyof typeof trayectorias] ??
    fichaEnActualizacion(professional);

  return { ...ficha, ...encuadreBanner[professional.slug] };
}
