import { siteConfig } from "@/config/site";
import type { FAQ } from "@/lib/types";

/**
 * Contenido real, extraído del material gráfico ya publicado del centro
 * (carteles, historias de Instagram). No se agregan preguntas ni respuestas
 * sin ese respaldo: la lista se va a ir ampliando a medida que se apruebe
 * más contenido, y mientras tanto un servicio sin pregunta acá no significa
 * que no exista —tiene su propia página en `/servicios`—.
 *
 * El teléfono, el WhatsApp y la dirección salen de `siteConfig` y no de un
 * texto suelto: si el centro cambia un número, esta respuesta lo sigue solo.
 */
export const faqs: FAQ[] = [
  {
    category: "Sobre el centro",
    question: "¿Qué servicios ofrece Auris?",
    answer:
      "Auris es un espacio de salud y bienestar con 8 áreas: Odontología (rehabilitación oral, implantología, alineadores y ortodoncia), Odontopediatría funcional, Bruxismo y disfunciones, Estética facial y corporal, Psicología, Fonoaudiología y Taller de conversación para adultos mayores.",
  },
  {
    category: "Sobre el centro",
    question: "¿Dónde están ubicados?",
    answer: `Estamos en ${siteConfig.address.street}, en el barrio ${siteConfig.address.neighborhood}, ${siteConfig.address.city}.`,
  },
  {
    category: "Sobre el centro",
    question: "¿Cómo pido un turno?",
    answer: `Podés escribirnos por WhatsApp al ${siteConfig.whatsapp}, o llamarnos al ${siteConfig.phone} para info y turnos.`,
  },
  {
    category: "Pagos y cobertura",
    question: "¿Qué medios de pago aceptan?",
    answer: "Aceptamos efectivo, transferencia bancaria y tarjetas.",
  },
  {
    category: "Pagos y cobertura",
    question: "¿Trabajan con obras sociales?",
    answer:
      "Sí. Actualmente trabajamos con: Swiss Medical, OSDE, Medifé, Osmedica, Avalian, Osadef, CPCE, Caja de Abogados, Prevención Salud, Jerárquicos, PAMI, Mosaistas, Galeno, Poder Judicial, Medicus, DASPU y Caja Notarial. Si tu obra social no está en la lista, consultanos igual — trabajamos con otras adicionales.",
  },
  {
    category: "Taller de adultos mayores",
    question: "¿Qué incluye el Taller de conversación para adultos mayores?",
    answer:
      "Es un espacio guiado por la Lic. Eugenia Villalobos, pensado para compartir, ejercitar el lenguaje y disfrutar el encuentro. Trabajamos sobre 4 ejes: estimulación del lenguaje, la memoria y la atención; mejora de la comunicación; generación de nuevos vínculos; y fortalecimiento de la confianza.",
  },
  {
    category: "Tratamientos estéticos",
    question: "¿Qué es la toxina botulínica facial y para qué sirve?",
    answer:
      "Es un tratamiento estético que suaviza arrugas y líneas de expresión, previene la formación de arrugas nuevas y aporta un aspecto fresco y descansado al rostro.",
  },
  {
    category: "Tratamientos estéticos",
    question: "¿Qué otros tratamientos estéticos destacados tienen?",
    answer:
      "Full Face, Peeling Glow, Yoga Facial, Oxygeneo y Microneedling con exosomas y PDRN, además de la toxina botulínica facial.",
  },
];

/** Agrupa las preguntas por temática, preservando el orden de aparición. */
export function getFaqsByCategory() {
  return faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});
}
