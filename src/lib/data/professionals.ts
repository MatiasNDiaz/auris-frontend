import type { Professional } from "@/lib/types";

/** Datos ficticios de demostración: reemplazar por el equipo real del centro. */
export const professionals: Professional[] = [
  {
    slug: "lucia-fernandez",
    motto:
      "Nadie llega a una consulta solo por un síntoma; siempre hay una historia detrás.",
    credentials: [
      {
        title: "Licenciatura en Psicología",
        institution: "Universidad de Buenos Aires",
        year: "2009",
      },
      {
        title: "Especialización en Terapia Cognitivo Conductual",
        institution: "Fundación Aiglé",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 45.221",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Formación en Terapia Focalizada en la Emoción",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "female",
    name: "Lic. Lucía Fernández",
    specialty: "Psicología clínica",
    serviceSlug: "psicologia",
    photoUrl:
      "https://images.unsplash.com/photo-1683348858689-f4e10994804d?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Acompaña procesos terapéuticos con adolescentes y adultos desde un enfoque integrador. Se especializa en trastornos de ansiedad y en el trabajo sobre autoestima y vínculos, con especial atención al momento vital de cada consultante.",
    education: [
      "Licenciatura en Psicología — Universidad de Buenos Aires",
      "Especialización en Terapia Cognitivo Conductual — Fundación Aiglé",
    ],
    experience:
      "12 años de práctica clínica en consultorio e instituciones de salud mental.",
    certifications: [
      "Matrícula Nacional MN 45.221",
      "Formación en Terapia Focalizada en la Emoción",
    ],
  },
  {
    slug: "martin-oliveri",
    motto:
      "Los vínculos no se arreglan solos: se conversan, se acuerdan y se sostienen.",
    credentials: [
      {
        title: "Licenciatura en Psicología",
        institution: "Universidad Nacional de La Plata",
        year: "2009",
      },
      {
        title: "Posgrado en Terapia Sistémica",
        institution: "Escuela Sistémica Argentina",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 51.870",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Formación en coordinación de grupos terapéuticos",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "male",
    name: "Lic. Martín Oliveri",
    specialty: "Psicología — pareja y familia",
    serviceSlug: "psicologia",
    photoUrl:
      "https://images.unsplash.com/photo-1756699279298-c89cdef354ab?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Coordina espacios de terapia de pareja y orientación familiar. Trabaja sobre la comunicación, los acuerdos y las transiciones familiares, y coordina además los encuentros grupales del centro.",
    education: [
      "Licenciatura en Psicología — Universidad Nacional de La Plata",
      "Posgrado en Terapia Sistémica — Escuela Sistémica Argentina",
    ],
    experience:
      "9 años acompañando parejas y familias en contextos clínicos y comunitarios.",
    certifications: [
      "Matrícula Nacional MN 51.870",
      "Formación en coordinación de grupos terapéuticos",
    ],
  },
  {
    slug: "carolina-benitez",
    motto:
      "Prefiero explicar diez minutos de más antes que tocar un diente de menos.",
    credentials: [
      {
        title: "Odontología",
        institution: "Universidad de Buenos Aires",
        year: "2009",
      },
      {
        title: "Especialización en Odontología Restauradora",
        institution: "AOA",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 32.104",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Certificación en Odontología Digital y CAD/CAM",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "female",
    name: "Dra. Carolina Benítez",
    specialty: "Odontología general y estética",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1736289173074-df6009da27c9?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Orienta su práctica a la odontología preventiva y mínimamente invasiva. Realiza restauraciones estéticas y tratamientos de blanqueamiento, con foco en explicar cada paso antes de iniciarlo.",
    education: [
      "Odontología — Universidad de Buenos Aires",
      "Especialización en Odontología Restauradora — AOA",
    ],
    experience: "14 años de ejercicio profesional en consultorio privado.",
    certifications: [
      "Matrícula Nacional MN 32.104",
      "Certificación en Odontología Digital y CAD/CAM",
    ],
  },
  {
    slug: "sofia-mendez",
    motto: "La piel responde al cuidado sostenido, no a las promesas rápidas.",
    credentials: [
      {
        title: "Tecnicatura en Cosmetología",
        institution: "Instituto Superior de Estética",
        year: "2009",
      },
      {
        title: "Formación en Dermocosmiatría avanzada",
        institution: "Formación continua",
        year: "2012",
      },
      {
        title: "Certificación en Aparatología Estética",
        institution: "Formación de posgrado",
        year: "2016",
      },
      {
        title: "Formación en Drenaje Linfático Manual — Método Vodder",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "female",
    name: "Sofía Méndez",
    specialty: "Cosmetología y estética integral",
    serviceSlug: "estetica-facial-y-corporal",
    photoUrl:
      "https://images.unsplash.com/photo-1673865641073-4479f93a7776?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Diseña planes de tratamiento facial y corporal a partir de un diagnóstico de piel detallado. Prioriza resultados progresivos y sostenibles, acompañados de pautas claras de cuidado en casa.",
    education: [
      "Tecnicatura en Cosmetología — Instituto Superior de Estética",
      "Formación en Dermocosmiatría avanzada",
    ],
    experience: "8 años en centros de estética y dermatología.",
    certifications: [
      "Certificación en Aparatología Estética",
      "Formación en Drenaje Linfático Manual — Método Vodder",
    ],
  },
  {
    slug: "julian-rossi",
    motto:
      "A los 70 se puede empezar algo nuevo; lo que hace falta es que alguien te acompañe.",
    credentials: [
      {
        title: "Licenciatura en Terapia Ocupacional",
        institution: "Universidad Nacional de San Martín",
        year: "2009",
      },
      {
        title: "Posgrado en Gerontología Comunitaria",
        institution: "Universidad Maimónides",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 8.412",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Formación en Actividad Física Adaptada al Adulto Mayor",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "male",
    name: "Lic. Julián Rossi",
    specialty: "Terapia ocupacional y autonomía",
    serviceSlug: "taller-de-adultos-mayores",
    photoUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Trabaja sobre la autonomía en las actividades de la vida diaria y coordina el módulo de movimiento de los talleres. Adapta cada propuesta al ritmo real del grupo, sin exigencias que desalienten.",
    education: [
      "Licenciatura en Terapia Ocupacional — Universidad Nacional de San Martín",
      "Posgrado en Gerontología Comunitaria — Universidad Maimónides",
    ],
    experience:
      "10 años en centros de día y programas comunitarios para personas mayores.",
    certifications: [
      "Matrícula Nacional MN 8.412",
      "Formación en Actividad Física Adaptada al Adulto Mayor",
    ],
  },
  {
    slug: "valentina-aguirre",
    motto:
      "Cuando un chico empieza a hacerse entender, le cambia el humor antes que el lenguaje.",
    credentials: [
      {
        title: "Licenciatura en Fonoaudiología",
        institution: "Universidad Nacional de Rosario",
        year: "2009",
      },
      {
        title: "Formación en Trastornos del Lenguaje Infantil",
        institution: "Formación continua",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 9.336",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Formación en Comunicación Aumentativa y Alternativa",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "female",
    name: "Lic. Valentina Aguirre",
    specialty: "Fonoaudiología infantil",
    serviceSlug: "fonoaudiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1736289154383-435d94804522?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Atiende dificultades del lenguaje y del habla en primera infancia y edad escolar, en articulación con el equipo de psicología del centro. Trabaja con las familias para sostener el tratamiento en casa.",
    education: [
      "Licenciatura en Fonoaudiología — Universidad Nacional de Rosario",
      "Formación en Trastornos del Lenguaje Infantil",
    ],
    experience: "7 años de trabajo interdisciplinario en salud.",
    certifications: [
      "Matrícula Nacional MN 9.336",
      "Formación en Comunicación Aumentativa y Alternativa",
    ],
  },
  {
    slug: "diego-navarro",
    motto:
      "Un buen tratamiento estético se termina de definir en las semanas que siguen.",
    credentials: [
      {
        title: "Licenciatura en Kinesiología y Fisiatría",
        institution: "Universidad Favaloro",
        year: "2009",
      },
      {
        title: "Especialización en Drenaje Linfático Manual",
        institution: "Método Vodder",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 14.298",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Certificación en Kinesiología Aplicada a la Estética",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "male",
    name: "Lic. Diego Navarro",
    specialty: "Kinesiología estética y drenaje",
    serviceSlug: "kinesiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1730597842283-943c7986ee2c?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Acompaña la recuperación posterior a los tratamientos faciales y corporales del centro. Se especializa en drenaje linfático manual y en el seguimiento de la zona tratada durante las semanas en que el resultado termina de asentarse.",
    education: [
      "Licenciatura en Kinesiología y Fisiatría — Universidad Favaloro",
      "Especialización en Drenaje Linfático Manual — Método Vodder",
    ],
    experience: "11 años acompañando tratamientos estéticos faciales y corporales.",
    certifications: [
      "Matrícula Nacional MN 14.298",
      "Certificación en Kinesiología Aplicada a la Estética",
    ],
  },
  {
    slug: "paula-vidal",
    motto:
      "Comunicarse es mucho más que hablar: es poder participar del mundo.",
    credentials: [
      {
        title: "Licenciatura en Fonoaudiología",
        institution: "Universidad del Museo Social Argentino",
        year: "2009",
      },
      {
        title: "Especialización en Voz Profesional",
        institution: "Formación continua",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 7.905",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Formación en Rehabilitación de la Deglución",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "female",
    name: "Lic. Paula Vidal",
    specialty: "Fonoaudiología",
    serviceSlug: "fonoaudiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Evalúa y trata dificultades del lenguaje, la voz y la audición en pacientes de todas las edades. Sostiene un trabajo articulado con la familia y con las instituciones educativas cuando el tratamiento lo requiere.",
    education: [
      "Licenciatura en Fonoaudiología — Universidad del Museo Social Argentino",
      "Especialización en Voz Profesional",
    ],
    experience: "13 años de práctica clínica con niños y adultos.",
    certifications: [
      "Matrícula Nacional MN 7.905",
      "Formación en Rehabilitación de la Deglución",
    ],
  },
  {
    slug: "gabriel-ferrari",
    motto: "La autonomía se entrena, y se entrena mejor acompañado.",
    credentials: [
      {
        title: "Licenciatura en Psicología",
        institution: "Universidad de Belgrano",
        year: "2009",
      },
      {
        title: "Especialización en Psicogerontología",
        institution: "Universidad Maimónides",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 48.663",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Formación en Estimulación Cognitiva en el Adulto Mayor",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "male",
    name: "Lic. Gabriel Ferrari",
    specialty: "Coordinación de talleres para adultos mayores",
    serviceSlug: "taller-de-adultos-mayores",
    photoUrl:
      "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Coordina los talleres para adultos mayores del centro, orientados a la estimulación cognitiva, la autonomía y el vínculo social. Diseña las dinámicas de cada encuentro adaptándolas al ritmo del grupo.",
    education: [
      "Licenciatura en Psicología — Universidad de Belgrano",
      "Especialización en Psicogerontología — Universidad Maimónides",
    ],
    experience:
      "8 años coordinando espacios grupales con personas mayores en centros de día e instituciones.",
    certifications: [
      "Matrícula Nacional MN 48.663",
      "Formación en Estimulación Cognitiva en el Adulto Mayor",
    ],
  },
  {
    slug: "florencia-arias",
    motto:
      "Si la primera visita al dentista sale bien, las siguientes ya no dan miedo.",
    credentials: [
      {
        title: "Odontología",
        institution: "Universidad Nacional de Córdoba",
        year: "2009",
      },
      {
        title: "Especialización en Odontopediatría",
        institution: "Universidad Maimónides",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 36.720",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Formación en Manejo de Conducta Infantil en Odontología",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "female",
    name: "Dra. Florencia Arias",
    specialty: "Odontopediatría",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Atiende a niños y adolescentes con un enfoque centrado en que la primera experiencia odontológica sea buena. Trabaja la prevención junto a las familias desde la primera consulta.",
    education: [
      "Odontología — Universidad Nacional de Córdoba",
      "Especialización en Odontopediatría — Universidad Maimónides",
    ],
    experience: "9 años de atención odontológica pediátrica.",
    certifications: [
      "Matrícula Nacional MN 36.720",
      "Formación en Manejo de Conducta Infantil en Odontología",
    ],
  },
  {
    slug: "tomas-linares",
    motto:
      "La mandíbula acumula tensión en silencio; casi nadie llega diciendo que le duele ahí.",
    credentials: [
      {
        title: "Licenciatura en Kinesiología y Fisiatría",
        institution: "Universidad de Buenos Aires",
        year: "2009",
      },
      {
        title: "Formación en Abordaje de la Articulación Temporomandibular",
        institution: "Formación continua",
        year: "2012",
      },
      {
        title: "Matrícula Nacional MN 16.845",
        institution: "Ministerio de Salud de la Nación",
        year: "2016",
      },
      {
        title: "Certificación en Terapia Miofuncional Orofacial",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "male",
    name: "Lic. Tomás Linares",
    specialty: "Kinesiología orofacial y ATM",
    serviceSlug: "kinesiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Trabaja la articulación temporomandibular en pacientes con bruxismo o tensión mandibular, en articulación con el equipo de odontología. Acompaña además la recuperación posterior a intervenciones odontológicas.",
    education: [
      "Licenciatura en Kinesiología y Fisiatría — Universidad de Buenos Aires",
      "Formación en Abordaje de la Articulación Temporomandibular",
    ],
    experience: "7 años de trabajo conjunto con equipos de odontología.",
    certifications: [
      "Matrícula Nacional MN 16.845",
      "Certificación en Terapia Miofuncional Orofacial",
    ],
  },
  {
    slug: "camila-duarte",
    motto:
      "Cada piel tiene su tiempo; el tratamiento se adapta a ella, no al revés.",
    credentials: [
      {
        title: "Tecnicatura en Estética Integral",
        institution: "Instituto Argentino de Estética",
        year: "2009",
      },
      {
        title: "Formación en Aparatología Corporal Avanzada",
        institution: "Formación continua",
        year: "2012",
      },
      {
        title: "Certificación en Radiofrecuencia y Ultracavitación",
        institution: "Formación de posgrado",
        year: "2016",
      },
      {
        title: "Formación en Bioseguridad aplicada a la estética",
        institution: "Formación de posgrado",
        year: "2018",
      },
    ],
    gender: "female",
    name: "Camila Duarte",
    specialty: "Estética corporal y aparatología",
    serviceSlug: "estetica-facial-y-corporal",
    photoUrl:
      "https://images.unsplash.com/photo-1734002886107-168181bcd6a1?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Se especializa en tratamientos corporales y en el uso de aparatología estética. Arma planes por ciclos con evaluación de resultados en cada etapa, sin prometer cambios inmediatos.",
    education: [
      "Tecnicatura en Estética Integral — Instituto Argentino de Estética",
      "Formación en Aparatología Corporal Avanzada",
    ],
    experience: "6 años en centros de estética y bienestar.",
    certifications: [
      "Certificación en Radiofrecuencia y Ultracavitación",
      "Formación en Bioseguridad aplicada a la estética",
    ],
  },
];

/** Tope de tarjetas del carousel de la Home. */
export const CAROUSEL_LIMIT = 12;

export function getProfessionalBySlug(slug: string) {
  return professionals.find((professional) => professional.slug === slug);
}

export function getProfessionalsByService(serviceSlug: string) {
  return professionals.filter(
    (professional) => professional.serviceSlug === serviceSlug,
  );
}
