import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "psicologia",
    name: "Psicología",
    icon: "brain",
    shortDescription:
      "Acompañamiento terapéutico individual, de pareja y familiar en un espacio de escucha y confianza.",
    tagline: "Un espacio para pensarte con tiempo",
    fullDescription:
      "Nuestro equipo de psicología acompaña procesos de cambio personal desde un enfoque integrador, respetando el tiempo y la singularidad de cada persona. Trabajamos sobre ansiedad, estados de ánimo, duelos, vínculos y crisis vitales, tanto en formato individual como de pareja y familia. Cada proceso comienza con entrevistas de admisión donde definimos objetivos claros y elegimos juntos el encuadre más adecuado.",
    imageUrl:
      "https://images.unsplash.com/photo-1573495804664-b1c0849525af?q=80&w=1200&auto=format&fit=crop",
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
    tagline: "Prevención antes que tratamiento",
    fullDescription:
      "Cuidamos tu salud bucal con un enfoque preventivo y mínimamente invasivo. Desde el control periódico y la limpieza profesional hasta tratamientos restauradores y estética dental, cada plan se arma después de un diagnóstico completo que conversamos con vos antes de empezar. Contamos con equipamiento digital que reduce tiempos de consulta y hace más cómoda cada visita.",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop",
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
    tagline: "Resultados que se sostienen",
    fullDescription:
      "Diseñamos planes de tratamiento personalizados a partir de un diagnóstico de piel y de los objetivos de cada persona. Priorizamos procedimientos seguros, con evidencia y resultados sostenibles en el tiempo, evitando promesas desmedidas. El seguimiento posterior es parte del tratamiento: acompañamos con pautas de cuidado domiciliario para que los resultados se mantengan.",
    imageUrl:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
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
    tagline: "Hábitos que podés sostener",
    fullDescription:
      "Trabajamos la alimentación como un hábito que se construye, no como una dieta que se cumple. El primer encuentro incluye evaluación antropométrica, historia alimentaria y análisis de la rutina diaria, para diseñar un plan que puedas sostener. Acompañamos objetivos de salud, rendimiento deportivo, patologías específicas y cambios de hábitos a largo plazo.",
    imageUrl:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Evaluación antropométrica y de hábitos",
      "Planes personalizados y flexibles",
      "Acompañamiento en patologías específicas",
      "Nutrición deportiva y rendimiento",
    ],
  },
  {
    slug: "taller-de-adultos-mayores",
    name: "Taller de adultos mayores",
    icon: "users",
    shortDescription:
      "Encuentros grupales para sostener la autonomía, la memoria y el vínculo social.",
    tagline: "Seguir activo, en buena compañía",
    fullDescription:
      "Un espacio grupal pensado para personas mayores, coordinado por profesionales del equipo. Los encuentros combinan estimulación cognitiva, actividad física suave adaptada y dinámicas de participación que fortalecen el vínculo social. El objetivo es sostener la autonomía en la vida cotidiana y acompañar esta etapa desde el encuentro con otros, en grupos reducidos donde cada persona avanza a su ritmo.",
    imageUrl:
      "https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?q=80&w=1200&auto=format&fit=crop",
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
    icon: "activity",
    shortDescription:
      "Rehabilitación del movimiento, tratamiento del dolor y prevención de lesiones.",
    tagline: "Volver a moverte sin dolor",
    fullDescription:
      "Abordamos el dolor y la limitación funcional combinando terapia manual, ejercicio terapéutico y educación sobre la lesión. Cada tratamiento parte de una evaluación funcional completa y define objetivos medibles, con seguimiento en cada sesión. Trabajamos rehabilitación post quirúrgica, lesiones deportivas y dolores crónicos de columna.",
    imageUrl:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
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
    tagline: "Comunicarse mejor, a toda edad",
    fullDescription:
      "Atendemos a niños, adolescentes y adultos en dificultades del lenguaje, el habla, la voz, la audición y la deglución. El proceso comienza con una evaluación diagnóstica detallada y, cuando corresponde, se articula con la familia, la escuela o el equipo médico tratante. Los tratamientos se planifican en ciclos con revisión periódica de objetivos.",
    imageUrl:
      "https://images.unsplash.com/photo-1587323655395-b1c77a12c89a?q=80&w=1200&auto=format&fit=crop",
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
