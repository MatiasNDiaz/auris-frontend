import type { Trayectoria } from "@/lib/types";

/**
 * Trayectoria de cada profesional, tal como la escribió el centro.
 *
 * El texto es literal: no está resumido ni retocado. Se muestra en la ficha
 * de cada profesional, en la sección de trayectoria. Quien no figura acá
 * todavía no mandó su información y la ficha lo avisa.
 */
export const trayectorias = {
  // Dr. Ariel Vidal
  "ariel-vidal": {
    titulo: "Doctor en Odontología",
    especialidad:
      "Diplomado en Bruxismo, Disfunción Temporomandibular (DTM) y Neuropatías. Especialista en Rehabilitación Oral Funcional.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Con más de 25 años de trayectoria profesional, el Dr. Ariel Vidal se desempeña en el campo de la odontología desde 1998. Es Doctor en Odontología por la Universidad Nacional de Córdoba y fue docente de la Facultad de Odontología de la UNC.",
      },
      {
        tipo: "parrafo",
        texto:
          "A lo largo de su carrera ha desarrollado una formación especializada en Periodoncia, Rehabilitación Oral, Bruxismo y Trastornos de la Articulación Temporomandibular (ATM), Operatoria Dental, Estética y Armonización Estética Orofacial.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su enfoque combina experiencia clínica, actualización permanente y tecnología aplicada al diagnóstico y tratamiento, buscando ofrecer soluciones personalizadas que contemplen la salud, la función y la estética de cada paciente.",
      },
      { tipo: "titulo", texto: "Servicios en AURIS" },
      {
        tipo: "lista",
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
      { tipo: "titulo", texto: "Su enfoque profesional" },
      {
        tipo: "parrafo",
        texto:
          "Cada tratamiento comienza con un diagnóstico preciso. A partir de allí, trabaja en el diseño de estrategias personalizadas que permitan recuperar la función, mejorar la salud bucal y acompañar las necesidades estéticas de cada persona.",
      },
    ],
  },
  // Dra. Carla Daniela Fernández
  "carla-fernandez": {
    titulo: "Odontóloga",
    especialidad:
      "Especialista en Odontopediatría, Crecimiento y Desarrollo, Ortopedia Miofuncional y Ortodoncia con Alineadores.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Con 18 años de trayectoria en el ejercicio de la Odontología, la Dra. Carla Daniela Fernández cuenta con formación especializada en Odontopediatría, Odontología y Deporte, Crecimiento y Desarrollo, Ortopedia Miofuncional y Ortodoncia con Alineadores.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su práctica profesional se centra especialmente en el desarrollo y funcionamiento del sistema estomatognático, con una mirada que contempla la relación entre la respiración, la deglución, la masticación, la postura y el crecimiento facial.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su formación en Ortopedia Miofuncional le permite abordar alteraciones como la respiración bucal y la deglución atípica, trabajando en conjunto con otras disciplinas cuando resulta necesario para favorecer un desarrollo funcional y equilibrado.",
      },
      { tipo: "titulo", texto: "Servicios en AURIS" },
      {
        tipo: "lista",
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
      { tipo: "titulo", texto: "Su enfoque profesional" },
      {
        tipo: "parrafo",
        texto:
          "Su propuesta busca comprender a cada paciente de manera integral, contemplando las estructuras y funciones del sistema estomatognático y su relación con el desarrollo, la respiración y el bienestar general.",
      },
      {
        tipo: "parrafo",
        texto:
          "Cada tratamiento se adapta a las necesidades particulares de la persona, priorizando una atención personalizada, respetuosa y basada en la evaluación clínica y el trabajo interdisciplinario.",
      },
    ],
  },
  // Dra. Claudia Tomasi
  "claudia-tomasi": {
    titulo: "Odontóloga",
    especialidad:
      "Especialista en Armonización Orofacial, Biorregeneración y Estética Facial.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "La Dra. Claudia Tomasi es odontóloga graduada de la Universidad Nacional de Córdoba, con amplia trayectoria en el ejercicio profesional en clínicas privadas.",
      },
      {
        tipo: "parrafo",
        texto:
          "A lo largo de su carrera se ha desempeñado en las áreas de odontología general, prótesis y estética odontológica, desarrollando una mirada integral sobre la salud, la función y la armonía del rostro.",
      },
      {
        tipo: "parrafo",
        texto:
          "Cuenta con formación de posgrado y Diplomatura en Armonización Orofacial, Biorregeneración y Estética Facial, áreas en las que ha profundizado sus conocimientos y experiencia clínica.",
      },
      {
        tipo: "parrafo",
        texto:
          "Actualmente desarrolla su práctica profesional con especial dedicación a los tratamientos de armonización orofacial y a procedimientos estéticos y regenerativos, buscando resultados naturales y personalizados que respeten las características de cada persona.",
      },
      { tipo: "titulo", texto: "Servicios en AURIS" },
      { tipo: "subtitulo", texto: "Armonización Orofacial y Estética Facial" },
      {
        tipo: "lista",
        items: [
          "Aplicación de toxina botulínica.",
          "Bioestimuladores de colágeno.",
          "Diseño y armonización de labios con ácido hialurónico.",
          "Tratamientos regenerativos con exosomas y PDRN.",
          "Procedimientos de estética facial personalizados.",
        ],
      },
      { tipo: "subtitulo", texto: "Odontología" },
      {
        tipo: "lista",
        items: [
          "Odontología general.",
          "Prótesis fija y removible.",
          "Estética odontológica.",
          "Blanqueamiento dental.",
        ],
      },
      { tipo: "titulo", texto: "Su enfoque profesional" },
      {
        tipo: "parrafo",
        texto:
          "Cada tratamiento parte de una evaluación personalizada que permite comprender las necesidades y objetivos de cada paciente. Su enfoque busca integrar salud, función y estética, priorizando resultados armónicos, naturales y acordes a la identidad de cada persona.",
      },
    ],
  },
  // Dra. Laura Mansilla Federmann
  "laura-mansilla": {
    titulo: "Odontóloga",
    especialidad: "Especialista en Rehabilitación Oral Funcional y Estética.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Odontóloga egresada de la Universidad Nacional de Córdoba en 2016, cuenta con experiencia en odontología general y una formación especializada en rehabilitación oral. Su práctica profesional se caracteriza por una capacitación y actualización constante en distintas áreas de la odontología, incluyendo cirugía, prótesis, estética orofacial e implantología.",
      },
      {
        tipo: "parrafo",
        texto:
          "En AURIS trabaja desde una mirada integral, orientada a comprender las necesidades de cada paciente y diseñar alternativas de tratamiento personalizadas que permitan recuperar la función, la salud y la estética de la boca.",
      },
      { tipo: "titulo", texto: "Servicios en AURIS" },
      {
        tipo: "lista",
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
      { tipo: "titulo", texto: "Su enfoque profesional" },
      {
        tipo: "parrafo",
        texto:
          "Cada tratamiento comienza con una escucha atenta de las necesidades y expectativas del paciente. A partir de un diagnóstico preciso, desarrolla un plan personalizado que busca recuperar no solo la sonrisa, sino también la función oral y el bienestar cotidiano.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su objetivo es que cada persona pueda volver a sonreír, comer y hablar con comodidad, confianza y naturalidad.",
      },
    ],
  },
  // Lic. Eugenia Leiva
  "eugenia-leiva": {
    titulo: "Licenciada en Kinesiología y Fisioterapia | Cosmetóloga",
    especialidad: "Especialista en Estética Avanzada",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Licenciada en Kinesiología y Fisioterapia egresada de la Universidad Nacional de Córdoba. Cosmetóloga. Cuenta con más de 25 años de trayectoria profesional dedicada a la estética, bienestar y formación profesional.",
      },
      {
        tipo: "parrafo",
        texto:
          "Fue fundadora y directora de la firma Estética Mediterránea y Mediterránea Group, Estética & Rejuvenecimiento, proyectos que desarrolló durante 10 años. También fue organizadora del Congreso Estética Mediterránea, evento líder de Argentina en los rubros Estética Interdisciplinaria, Medicina Estética y Spa durante 10 años consecutivos.",
      },
      {
        tipo: "parrafo",
        texto:
          "Es creadora y directora de la revista científica Identidad Estética, con 20 ediciones publicadas.",
      },
      {
        tipo: "parrafo",
        texto:
          "Cuenta con una amplia trayectoria como capacitadora y disertante a nivel nacional e internacional, siendo invitada a participar en congresos, brindar seminarios, cursos tanto en Argentina como en el extranjero.",
      },
      {
        tipo: "parrafo",
        texto:
          "Además, es Coach Ontológico Profesional certificada por la Escuela Argentina de PNL y Coaching y cuenta con acreditación ACTP (Accredited Coach Training Program) de la International Coaching Federation.",
      },
      { tipo: "titulo", texto: "Su enfoque profesional" },
      {
        tipo: "parrafo",
        texto:
          "Entiende la estética como un equilibrio entre ciencia, salud y bienestar. Su experiencia y su formación continua en las últimas tecnologías le permiten desarrollar tratamientos de vanguardia, adaptados a las necesidades de cada persona.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su abordaje parte de una evaluación individual y busca acompañar cada proceso utilizando protocolos y tecnologías de vanguardia no invasivas orientadas al cuidado de la piel, el bienestar y una mejor calidad de vida.",
      },
      { tipo: "titulo", texto: "Servicios en AURIS" },
      {
        tipo: "lista",
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
      {
        tipo: "parrafo",
        texto:
          "Su filosofía es que cada persona pueda verse y sentirse bien en cada etapa de su vida. La salud de la piel comienza con una observación atenta.",
      },
    ],
  },
  // Lic. Romina Tchakerian
  "romina-tchakerian": {
    titulo: "Licenciada en Fonoaudiología",
    especialidad:
      "M.P. 7894 | Especialista en trastornos del lenguaje y la voz",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Licenciada en Fonoaudiología y Diploma de Honor de la Universidad Nacional de Córdoba (UNC), cuenta con más de 15 años de trayectoria profesional y más de una década de experiencia en reconocidas instituciones de salud.",
      },
      {
        tipo: "parrafo",
        texto:
          "A lo largo de su carrera se ha especializado en la evaluación, diagnóstico y tratamiento de dificultades relacionadas con el habla, el lenguaje, la comunicación y la voz en niños, adolescentes y adultos.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su práctica profesional también incluye el abordaje de la armonización orofacial, orientado a favorecer funciones esenciales como la respiración, la deglución y la masticación.",
      },
      { tipo: "titulo", texto: "Trayectoria profesional" },
      {
        tipo: "lista",
        items: [
          "Más de 15 años de experiencia en el ejercicio de la Fonoaudiología, desde 2007.",
          "Más de 10 años de trayectoria en instituciones de salud de reconocida trayectoria, entre ellas el Centro Argentino Cubano y el Sanatorio de la Cañada.",
          "Actualmente desarrolla también su actividad profesional en fundaciones como Veci.",
        ],
      },
      { tipo: "titulo", texto: "Su enfoque" },
      {
        tipo: "parrafo",
        texto:
          "Brinda una atención profesional, personalizada y centrada en las necesidades de cada persona, acompañando también a sus familias durante el proceso terapéutico.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su objetivo es favorecer el desarrollo y la recuperación de las funciones comunicativas y orofaciales, contribuyendo a mejorar la calidad de vida de cada paciente.",
      },
    ],
  },
  // Lic. Eugenia Villalobos
  "eugenia-villalobos": {
    titulo: "Licenciada en Fonoaudiología",
    especialidad:
      "Especialista en comunicación, lenguaje y estimulación cognitiva en adultos mayores.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Con una sólida trayectoria en el ámbito de la neurorehabilitación y la atención fonoaudiológica, Eugenia acompaña a adultos mayores promoviendo el bienestar comunicacional, la participación activa y el mantenimiento de sus capacidades cognitivas y lingüísticas.",
      },
      { tipo: "titulo", texto: "Formación y trayectoria profesional" },
      {
        tipo: "lista",
        items: [
          "Adscripción concluida a la Cátedra de Neurolingüística de la Facultad de Fonoaudiología de la Universidad Nacional de Córdoba.",
          "Ex pasante del Servicio de Fonoaudiología del Centro de Rehabilitación para Adultos FLENI, sede Escobar, Buenos Aires.",
          "Ex integrante del Servicio de Neurorehabilitación CNR del Sanatorio Allende.",
          "Ex integrante del Servicio de Fonoaudiología del Hospital Nacional de Clínicas.",
          "Tallerista dedicada a la comunicación y el lenguaje en adultos mayores en diferentes municipios de la provincia de Córdoba.",
        ],
      },
      { tipo: "titulo", texto: "Atención especializada en adultos mayores" },
      {
        tipo: "parrafo",
        texto:
          "En AURIS desarrolla propuestas orientadas a fortalecer la comunicación, la memoria y la participación social:",
      },
      {
        tipo: "lista",
        items: ["Taller de Conversación.", "Taller de Memoria Auditiva."],
      },
    ],
  },
  // Dr. Santiago Tomás Rodríguez
  "santiago-rodriguez": {
    titulo: "Odontólogo",
    especialidad:
      "Odontología General | Cirugía | Alineadores | Formación en Ortodoncia y Ortopedia.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Odontólogo egresado de la Universidad Católica de Córdoba, actualmente se encuentra realizando su formación de especialización en Ortodoncia y Ortopedia.",
      },
      {
        tipo: "parrafo",
        texto:
          "Se desempeña en el área de odontología general, con especial orientación a la cirugía odontológica, y participa activamente en el área de odontología digital de AURIS, donde trabaja en el diseño y preparación de tratamientos con alineadores.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su práctica combina una formación clínica integral con la incorporación de nuevas tecnologías aplicadas al diagnóstico y planificación odontológica, buscando ofrecer tratamientos personalizados y adaptados a las necesidades de cada paciente.",
      },
      { tipo: "titulo", texto: "Áreas de atención en AURIS" },
      {
        tipo: "lista",
        items: [
          "Odontología general.",
          "Cirugía odontológica.",
          "Tratamientos con alineadores.",
          "Diseño y planificación digital de alineadores.",
          "Evaluación y seguimiento de tratamientos de ortodoncia.",
        ],
      },
    ],
  },
  // Dra. María Daniela Giansetto
  "daniela-giansetto": {
    titulo: "Odontóloga",
    especialidad:
      "Especialista en Ortopedia y Ortodoncia de los Maxilares en niños, adolescentes y adultos.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Con casi 20 años de trayectoria dedicada a la Ortodoncia y la Ortopedia de los Maxilares, la Dra. María Daniela Giansetto desarrolla su práctica profesional desde una mirada integral de la salud bucal y el desarrollo funcional de cada paciente.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su abordaje contempla las necesidades particulares de cada etapa de la vida, acompañando a niños, adolescentes y adultos en tratamientos orientados a mejorar la función, la salud y la armonía de la sonrisa.",
      },
      {
        tipo: "parrafo",
        texto:
          "En AURIS trabaja de manera interdisciplinaria junto al equipo de profesionales, integrando conocimientos y distintas especialidades para lograr diagnósticos más completos y tratamientos personalizados.",
      },
      { tipo: "titulo", texto: "Su enfoque profesional" },
      {
        tipo: "parrafo",
        texto:
          "El trabajo conjunto entre especialidades es uno de los pilares de AURIS. Por eso, cada caso se aborda contemplando al paciente de manera integral, buscando comprender las causas y necesidades que intervienen en su salud bucal.",
      },
      {
        tipo: "parrafo",
        texto:
          "Porque una sonrisa saludable comienza con un diagnóstico que mira más allá de los dientes.",
      },
    ],
  },
  // Dra. Rocío Matteucci
  "rocio-matteucci": {
    titulo: "Odontóloga",
    especialidad: "Odontología general – Especializada en Rehabilitación Oral.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Odontóloga graduada de la Universidad Católica de Córdoba. Actualmente realizando la especialidad en rehabilitación oral, prótesis fija, removible e implantología en la Universidad Nacional de Córdoba.",
      },
      {
        tipo: "parrafo",
        texto:
          "Cuenta además con formación en cirugía dentomaxilar, ortodoncia y flujo digital aplicado a la odontología.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su práctica se caracteriza por un enfoque centrado en el paciente, la planificación integral de los tratamientos y la búsqueda constante de actualización y perfeccionamiento profesional.",
      },
      { tipo: "titulo", texto: "Servicios en AURIS" },
      {
        tipo: "lista",
        items: [
          "Atención odontológica integral.",
          "Evaluación, diagnóstico y planificación de tratamientos.",
          "Operatoria dental y tratamientos restauradores.",
          "Estética dental y blanqueamiento.",
          "Rehabilitación oral y tratamientos protésicos.",
          "Cirugía dentomaxilar.",
        ],
      },
      // Estos dos párrafos son suyos y están escritos en primera persona, tal
      // como los mandó. No se pasan a tercera para no ponerle palabras que no
      // dijo: la ficha los muestra donde esa voz se lee natural, en el bloque
      // de enfoque.
      {
        tipo: "parrafo",
        texto:
          "Además de mi práctica clínica, me desempeño como docente en la cátedra de Operatoria Dental de la Facultad de Ciencias de la Salud de la Universidad Católica de Córdoba. La actividad académica forma parte de mi desarrollo profesional y me permite mantener una actualización constante, integrando la práctica clínica con la formación y el intercambio de conocimientos.",
      },
      {
        tipo: "parrafo",
        texto:
          "Mi objetivo es brindar a cada paciente una atención personalizada, basada en una evaluación integral, una planificación cuidadosa y tratamientos orientados a lograr resultados funcionales y estéticos.",
      },
    ],
    // Todavía no pasó un número propio: queda el del centro.
  },
  // Lic. Soledad Di Martino
  "soledad-di-martino": {
    titulo: "Licenciada y Profesora en Psicología",
    especialidad:
      "Especialista en Psicodiagnóstico y actualización en Psicopatología Clínica.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Con más de 20 años de experiencia profesional, la Lic. Soledad Di Martino desarrolla su práctica en consultorio privado y centros de rehabilitación, acompañando a niños, adolescentes y adultos en sus diferentes procesos terapéuticos.",
      },
      {
        tipo: "parrafo",
        texto:
          "Es Licenciada y Profesora en Psicología, cuenta con formación de posgrado en Psicodiagnóstico y Actualización en Psicopatología Clínica, y actualmente cursa la Especialización en Psicología Clínica en la Universidad Nacional de Córdoba.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su trayectoria también incluye la docencia y la participación en proyectos comunitarios, espacios desde los cuales promueve la construcción de herramientas para el bienestar emocional y el desarrollo integral de las personas.",
      },
      {
        tipo: "parrafo",
        texto:
          "Su enfoque se basa en brindar un acompañamiento cálido, profesional y respetuoso, adaptado a las necesidades particulares de cada paciente.",
      },
      { tipo: "titulo", texto: "Servicios en AURIS" },
      {
        tipo: "lista",
        items: [
          "Atención clínica individual para niños, adolescentes y adultos.",
          "Evaluaciones psicodiagnósticas.",
          "Orientación psicológica.",
          "Intervenciones grupales.",
          "Talleres de bienestar emocional y habilidades sociales.",
          "Orientación vocacional y profesional.",
          "Aptos psicológicos.",
        ],
      },
      { tipo: "titulo", texto: "Su enfoque profesional" },
      {
        tipo: "parrafo",
        texto:
          "Cada proceso terapéutico es un espacio de escucha, acompañamiento y construcción conjunta. Su objetivo es favorecer el bienestar emocional y brindar herramientas que permitan a cada persona afrontar sus desafíos y desarrollar sus recursos personales.",
      },
    ],
  },
} satisfies Record<string, Trayectoria>;
