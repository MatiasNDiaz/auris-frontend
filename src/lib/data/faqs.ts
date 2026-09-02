import type { FAQ } from "@/lib/types";

export const faqs: FAQ[] = [
  {
    category: "Turnos y consultas",
    question: "¿Cómo saco un turno?",
    answer:
      "Podés solicitarlo por WhatsApp desde cualquier botón de 'Solicitar turno' del sitio, o llamándonos por teléfono en nuestro horario de atención. Te respondemos con la disponibilidad del profesional y coordinamos día y horario.",
  },
  {
    category: "Turnos y consultas",
    question: "¿Necesito derivación médica para atenderme?",
    answer:
      "Para la mayoría de los servicios no hace falta. En fonoaudiología suele solicitarse una orden médica cuando el tratamiento se cubre por obra social; si vas a abonar de forma particular, no es necesaria.",
  },
  {
    category: "Turnos y consultas",
    question: "¿Qué pasa si no puedo asistir a mi turno?",
    answer:
      "Te pedimos avisarnos con al menos 24 horas de anticipación para poder reasignar el espacio. Podés cancelar o reprogramar escribiéndonos por WhatsApp.",
  },
  {
    category: "Turnos y consultas",
    question: "¿Atienden por videollamada?",
    answer:
      "Sí. Psicología y fonoaudiología ofrecen sesiones online con la misma modalidad y duración que las presenciales. El resto de los servicios requiere atención presencial.",
  },
  {
    category: "Servicios y tratamientos",
    question: "¿Cuánto dura una primera consulta?",
    answer:
      "La primera entrevista suele durar entre 45 y 60 minutos, según el servicio. Es un encuentro de evaluación donde definimos objetivos y te explicamos el plan de trabajo propuesto.",
  },
  {
    category: "Servicios y tratamientos",
    question: "¿Puedo atenderme en más de una especialidad?",
    answer:
      "Sí, y en muchos casos lo recomendamos. Nuestro equipo trabaja de forma interdisciplinaria: si tu tratamiento se beneficia del aporte de otra especialidad, te lo proponemos y coordinamos internamente.",
  },
  {
    category: "Servicios y tratamientos",
    question: "¿Atienden niños y adolescentes?",
    answer:
      "Sí. Psicología, fonoaudiología y odontología atienden pacientes pediátricos y adolescentes, siempre con acompañamiento de un adulto responsable en la primera entrevista.",
  },
  {
    category: "Pagos y cobertura",
    question: "¿Trabajan con obras sociales y prepagas?",
    answer:
      "Trabajamos con las principales coberturas del país, y la cobertura varía según el servicio. Consultanos por WhatsApp indicando tu obra social y la especialidad para confirmarte el detalle actualizado.",
  },
  {
    category: "Pagos y cobertura",
    question: "¿Qué medios de pago aceptan?",
    answer:
      "Aceptamos efectivo, transferencia bancaria, débito y tarjetas de crédito. En tratamientos de varias sesiones ofrecemos planes de pago; consultanos las opciones vigentes.",
  },
  {
    category: "El centro",
    question: "¿El centro es accesible?",
    answer:
      "Sí. El acceso al edificio y todos los consultorios de planta baja están adaptados para personas con movilidad reducida, y contamos con baño accesible.",
  },
  {
    category: "El centro",
    question: "¿Hay estacionamiento cerca?",
    answer:
      "Contamos con estacionamiento en la zona y varias líneas de colectivo a menos de dos cuadras. En la sección de contacto vas a encontrar el mapa con indicaciones para llegar.",
  },
];

/** Agrupa las preguntas por temática, preservando el orden de aparición. */
export function getFaqsByCategory() {
  return faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});
}
