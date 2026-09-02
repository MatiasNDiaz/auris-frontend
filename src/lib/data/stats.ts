/**
 * Franja de confianza de la Home.
 *
 * Punto único de edición: cuando lleguen los números reales se reemplaza el
 * `null` de `value` por la cifra y no hay que tocar el componente. Mientras
 * `value` sea `null` la franja muestra el token de `placeholder` tal cual, así
 * queda a la vista lo que falta completar y nadie lo confunde con un dato real.
 * En cuanto hay número, el conteo ascendente arranca solo.
 */
export type Stat = {
  key: string;
  /** Clave del ícono; se resuelve en `StatsBand`. */
  icon: "calendar" | "heart" | "stethoscope" | "layers";
  /** El número real. `null` mientras no lo tengamos. */
  value: number | null;
  /** Token que se muestra —y que hay que reemplazar— mientras no haya número. */
  placeholder: string;
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
    value: null,
    placeholder: "[[PLACEHOLDER_ANIOS]]",
    suffix: "+",
    label: "años de trayectoria",
    summary:
      "Todo ese tiempo en el mismo lugar del Cerro de las Rosas, sosteniendo la forma de trabajar que nos define.",
  },
  {
    key: "pacientes",
    icon: "heart",
    value: null,
    placeholder: "[[PLACEHOLDER_PACIENTES]]",
    suffix: "+",
    label: "pacientes atendidos",
    summary:
      "Cada uno con su plan y sus controles: acá el tratamiento no termina cuando termina la sesión.",
  },
  {
    key: "profesionales",
    icon: "stethoscope",
    value: null,
    placeholder: "[[PLACEHOLDER_PROFESIONALES]]",
    label: "profesionales especializados",
    summary:
      "Cada uno con su matrícula y su especialidad, y una mirada compartida cuando el caso lo pide.",
  },
  {
    key: "servicios",
    icon: "layers",
    value: null,
    placeholder: "[[PLACEHOLDER_SERVICIOS]]",
    label: "especialidades",
    summary:
      "Odontología, estética, psicología, kinesiología, fonoaudiología y el taller de adultos mayores, en un mismo lugar.",
  },
];
