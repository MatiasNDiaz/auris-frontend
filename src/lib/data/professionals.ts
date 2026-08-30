import type { Professional } from "@/lib/types";

/** Datos ficticios de demostración: reemplazar por el equipo real del centro. */
export const professionals: Professional[] = [
  {
    slug: "lucia-fernandez",
    name: "Lic. Lucía Fernández",
    specialty: "Psicología clínica",
    serviceSlug: "psicologia",
    photoUrl:
      "https://images.unsplash.com/photo-1659353888906-adb3e0041693?q=80&w=800&auto=format&fit=crop",
    bio: "Acompaña procesos terapéuticos con adolescentes y adultos desde un enfoque integrador. Se especializa en trastornos de ansiedad y en el trabajo sobre autoestima y vínculos, con especial atención al momento vital de cada consultante.",
    education: [
      "Licenciatura en Psicología — Universidad de Buenos Aires",
      "Especialización en Terapia Cognitivo Conductual — Fundación Aiglé",
    ],
    experience: "12 años de práctica clínica en consultorio e instituciones de salud mental.",
    certifications: [
      "Matrícula Nacional MN 45.221",
      "Formación en Terapia Focalizada en la Emoción",
    ],
  },
  {
    slug: "martin-oliveri",
    name: "Lic. Martín Oliveri",
    specialty: "Psicología — pareja y familia",
    serviceSlug: "psicologia",
    photoUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
    bio: "Coordina espacios de terapia de pareja y orientación familiar. Trabaja sobre la comunicación, los acuerdos y las transiciones familiares, y coordina además los encuentros grupales del centro.",
    education: [
      "Licenciatura en Psicología — Universidad Nacional de La Plata",
      "Posgrado en Terapia Sistémica — Escuela Sistémica Argentina",
    ],
    experience: "9 años acompañando parejas y familias en contextos clínicos y comunitarios.",
    certifications: [
      "Matrícula Nacional MN 51.870",
      "Formación en coordinación de grupos terapéuticos",
    ],
  },
  {
    slug: "carolina-benitez",
    name: "Dra. Carolina Benítez",
    specialty: "Odontología general y estética",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
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
    name: "Sofía Méndez",
    specialty: "Cosmetología y estética integral",
    serviceSlug: "estetica-facial-y-corporal",
    photoUrl:
      "https://images.unsplash.com/photo-1673865641073-4479f93a7776?q=80&w=800&auto=format&fit=crop",
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
    name: "Lic. Julián Rossi",
    specialty: "Nutrición clínica y deportiva",
    serviceSlug: "nutricion",
    photoUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    bio: "Trabaja el cambio de hábitos alimentarios desde una mirada realista y sin restricciones innecesarias. Acompaña objetivos de salud, composición corporal y rendimiento deportivo.",
    education: [
      "Licenciatura en Nutrición — Universidad de Buenos Aires",
      "Posgrado en Nutrición Deportiva — ISAK / CENARD",
    ],
    experience: "10 años en consultorio y asesoramiento a equipos deportivos amateurs.",
    certifications: [
      "Matrícula Nacional MN 8.412",
      "Antropometrista certificado ISAK Nivel 2",
    ],
  },
  {
    slug: "valentina-aguirre",
    name: "Lic. Valentina Aguirre",
    specialty: "Nutrición y trastornos alimentarios",
    serviceSlug: "nutricion",
    photoUrl:
      "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?q=80&w=800&auto=format&fit=crop",
    bio: "Aborda la alimentación desde una perspectiva integral y no restrictiva, en articulación con el equipo de psicología del centro. Se especializa en la relación con la comida y en patologías digestivas.",
    education: [
      "Licenciatura en Nutrición — Universidad Nacional de Rosario",
      "Formación en Alimentación Consciente y conducta alimentaria",
    ],
    experience: "7 años de trabajo interdisciplinario en salud.",
    certifications: [
      "Matrícula Nacional MN 9.336",
      "Formación en abordaje de patologías digestivas",
    ],
  },
  {
    slug: "diego-navarro",
    name: "Lic. Diego Navarro",
    specialty: "Kinesiología y rehabilitación deportiva",
    serviceSlug: "kinesiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop",
    bio: "Combina terapia manual y ejercicio terapéutico para tratar el dolor y recuperar la función. Se especializa en rehabilitación post quirúrgica de rodilla y hombro, y en prevención de lesiones deportivas.",
    education: [
      "Licenciatura en Kinesiología y Fisiatría — Universidad Favaloro",
      "Especialización en Kinesiología Deportiva — AKD",
    ],
    experience: "11 años en rehabilitación traumatológica y deportiva.",
    certifications: [
      "Matrícula Nacional MN 14.298",
      "Certificación en Punción Seca y Terapia Manual Ortopédica",
    ],
  },
  {
    slug: "paula-vidal",
    name: "Lic. Paula Vidal",
    specialty: "Fonoaudiología",
    serviceSlug: "fonoaudiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1589784294954-2904f68cb673?q=80&w=800&auto=format&fit=crop",
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
    name: "Lic. Gabriel Ferrari",
    specialty: "Coordinación de talleres para adultos mayores",
    serviceSlug: "taller-de-adultos-mayores",
    photoUrl:
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=800&auto=format&fit=crop",
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
    name: "Dra. Florencia Arias",
    specialty: "Odontopediatría",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1623854766464-c3645e6841d8?q=80&w=800&auto=format&fit=crop",
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
    name: "Lic. Tomás Linares",
    specialty: "Kinesiología y reeducación postural",
    serviceSlug: "kinesiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1642975967602-653d378f3b5b?q=80&w=800&auto=format&fit=crop",
    bio: "Se orienta al tratamiento del dolor crónico de columna y a la reeducación postural en personas con trabajo de oficina. Combina terapia manual con planes de ejercicio domiciliario.",
    education: [
      "Licenciatura en Kinesiología y Fisiatría — Universidad de Buenos Aires",
      "Formación en Reeducación Postural Global (RPG)",
    ],
    experience: "7 años en consultorio y programas de salud laboral.",
    certifications: [
      "Matrícula Nacional MN 16.845",
      "Certificación en Ejercicio Terapéutico para Dolor Crónico",
    ],
  },
  {
    slug: "camila-duarte",
    name: "Camila Duarte",
    specialty: "Estética corporal y aparatología",
    serviceSlug: "estetica-facial-y-corporal",
    photoUrl:
      "https://images.unsplash.com/photo-1618294454352-eb84462415b0?q=80&w=800&auto=format&fit=crop",
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
