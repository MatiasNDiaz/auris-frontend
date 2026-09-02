import { professionals } from "./professionals";
import { services } from "./services";

/**
 * Franja de confianza de la Home.
 *
 * Punto único de edición de las cuatro cifras. Dos se calculan solas a partir
 * del contenido del sitio, así que no pueden quedar desfasadas de lo que el
 * visitante ya vio más arriba; las otras dos son datos del centro y se
 * escriben a mano acá.
 */
export type Stat = {
  key: string;
  /** Clave del ícono; se resuelve en `StatsBand`. */
  icon: "calendar" | "heart" | "stethoscope" | "layers";
  value: number;
  /** Va pegado al número, sin espacio. */
  suffix?: string;
  label: string;
  /** Lo que se lee en el dorso de la tarjeta, al darla vuelta. */
  summary: string;
};

export const stats: Stat[] = [
  {
    key: "anios",
    icon: "calendar",
    value: 5,
    suffix: "+",
    label: "años de trayectoria",
    summary:
      "Todo ese tiempo en el mismo lugar del Cerro de las Rosas, sosteniendo la forma de trabajar que nos define.",
  },
  {
    key: "pacientes",
    icon: "heart",
    value: 250,
    suffix: "+",
    label: "pacientes atendidos",
    summary:
      "Cada uno con su plan y sus controles: acá el tratamiento no termina cuando termina la sesión.",
  },
  {
    key: "profesionales",
    icon: "stethoscope",
    // Sale del listado del equipo en vez de escribirse a mano: la cifra que
    // muestra la franja es exactamente la cantidad de fichas que puede contar
    // alguien en /profesionales, y se corrige sola cuando cambie el equipo.
    value: professionals.length,
    label: "profesionales especializados",
    summary:
      "Cada uno con su matrícula y su especialidad, y una mirada compartida cuando el caso lo pide.",
  },
  {
    key: "servicios",
    icon: "layers",
    /** Ídem: es el largo de la grilla de servicios. */
    value: services.length,
    label: "especialidades",
    summary:
      "Odontología, estética, psicología, kinesiología, fonoaudiología y el taller de adultos mayores, en un mismo lugar.",
  },
];
