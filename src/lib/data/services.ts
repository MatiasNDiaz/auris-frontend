import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "psicologia",
    name: "Psicología",
    icon: "brain",
    shortDescription:
      "Acompañamiento terapéutico individual, de pareja y familiar en un espacio de escucha y confianza.",
    fullDescription:
      "Nuestro equipo de psicología acompaña procesos de cambio personal desde un enfoque integrador, respetando el tiempo y la singularidad de cada persona. Trabajamos sobre ansiedad, estados de ánimo, duelos, vínculos y crisis vitales, tanto en formato individual como de pareja y familia. Cada proceso comienza con entrevistas de admisión donde definimos objetivos claros y elegimos juntos el encuadre más adecuado.",
    imageUrl: "/images/servicios/psicologia.jpg",
    features: [
      "Terapia individual para adolescentes y adultos",
      "Terapia de pareja y orientación familiar",
      "Abordaje de ansiedad, estrés y estados de ánimo",
      "Sesiones presenciales y por videollamada",
    ],
  },
  {
    slug: "odontologia",
    name: "Odontología",
    icon: "smile",
    shortDescription:
      "Salud bucal integral: prevención, tratamientos restauradores y estética dental.",
    fullDescription:
      "Cuidamos tu salud bucal con un enfoque preventivo y mínimamente invasivo. Desde el control periódico y la limpieza profesional hasta tratamientos restauradores y estética dental, cada plan se arma después de un diagnóstico completo que conversamos con vos antes de empezar. Contamos con equipamiento digital que reduce tiempos de consulta y hace más cómoda cada visita.",
    imageUrl: "/images/servicios/odontologia.jpg",
    features: [
      "Diagnóstico y control preventivo",
      "Limpieza y profilaxis profesional",
      "Restauraciones estéticas y endodoncia",
      "Blanqueamiento y estética dental",
    ],
  },
  {
    slug: "estetica-facial-y-corporal",
    name: "Estética facial y corporal",
    icon: "sparkles",
    shortDescription:
      "Tratamientos que cuidan la piel y el cuerpo con criterio profesional y resultados progresivos.",
    fullDescription:
      "Diseñamos planes de tratamiento personalizados a partir de un diagnóstico de piel y de los objetivos de cada persona. Priorizamos procedimientos seguros, con evidencia y resultados sostenibles en el tiempo, evitando promesas desmedidas. El seguimiento posterior es parte del tratamiento: acompañamos con pautas de cuidado domiciliario para que los resultados se mantengan.",
    imageUrl: "/images/servicios/estetica.jpg",
    features: [
      "Diagnóstico y limpieza facial profunda",
      "Tratamientos de hidratación y renovación cutánea",
      "Abordaje corporal y drenaje linfático",
      "Plan de cuidado domiciliario personalizado",
    ],
  },
  {
    slug: "nutricion",
    name: "Nutrición",
    icon: "apple",
    shortDescription:
      "Planes alimentarios reales y sostenibles, adaptados a tu rutina y tus objetivos.",
    fullDescription:
      "Trabajamos la alimentación como un hábito que se construye, no como una dieta que se cumple. El primer encuentro incluye evaluación antropométrica, historia alimentaria y análisis de la rutina diaria, para diseñar un plan que puedas sostener. Acompañamos objetivos de salud, rendimiento deportivo, patologías específicas y cambios de hábitos a largo plazo.",
    imageUrl: "/images/servicios/nutricion.jpg",
    features: [
      "Evaluación antropométrica y de hábitos",
      "Planes personalizados y flexibles",
      "Acompañamiento en patologías específicas",
      "Nutrición deportiva y rendimiento",
    ],
  },
  {
    slug: "taller-de-auto",
    name: "Taller de auto",
    icon: "users",
    shortDescription:
      "Encuentros grupales de autoconocimiento y desarrollo personal coordinados por profesionales.",
    fullDescription:
      "Un espacio grupal, coordinado por profesionales del equipo, para trabajar el autoconocimiento, la autoestima y el autocuidado. Los encuentros combinan dinámicas participativas, material de trabajo y puesta en común, en grupos reducidos que favorecen la confianza. No reemplaza un proceso terapéutico individual: lo complementa desde la experiencia compartida.",
    imageUrl: "/images/servicios/taller-de-auto.jpg",
    features: [
      "Grupos reducidos y coordinados",
      "Dinámicas de autoconocimiento y autoestima",
      "Encuentros semanales por ciclos",
      "Material de trabajo incluido",
    ],
  },
  {
    slug: "kinesiologia",
    name: "Kinesiología",
    icon: "activity",
    shortDescription:
      "Rehabilitación del movimiento, tratamiento del dolor y prevención de lesiones.",
    fullDescription:
      "Abordamos el dolor y la limitación funcional combinando terapia manual, ejercicio terapéutico y educación sobre la lesión. Cada tratamiento parte de una evaluación funcional completa y define objetivos medibles, con seguimiento en cada sesión. Trabajamos rehabilitación post quirúrgica, lesiones deportivas y dolores crónicos de columna.",
    imageUrl: "/images/servicios/kinesiologia.jpg",
    features: [
      "Evaluación funcional y plan de objetivos",
      "Terapia manual y ejercicio terapéutico",
      "Rehabilitación post quirúrgica y deportiva",
      "Prevención de lesiones y reeducación postural",
    ],
  },
  {
    slug: "fonoaudiologia",
    name: "Fonoaudiología",
    icon: "ear",
    shortDescription:
      "Evaluación y tratamiento del lenguaje, la voz, la audición y la deglución.",
    fullDescription:
      "Atendemos a niños, adolescentes y adultos en dificultades del lenguaje, el habla, la voz, la audición y la deglución. El proceso comienza con una evaluación diagnóstica detallada y, cuando corresponde, se articula con la familia, la escuela o el equipo médico tratante. Los tratamientos se planifican en ciclos con revisión periódica de objetivos.",
    imageUrl: "/images/servicios/fonoaudiologia.jpg",
    features: [
      "Evaluación del lenguaje y el habla",
      "Tratamiento de la voz profesional",
      "Estudios y abordaje auditivo",
      "Trabajo articulado con familia y escuela",
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
