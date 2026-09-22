/**
 * Las áreas en las que trabaja cada profesional del equipo.
 *
 * No son los servicios del sitio (`services.ts`): esos son tratamientos que se
 * ofrecen —alineadores, bruxismo, blanqueamiento— y varios profesionales
 * comparten el mismo. Esto es la rama en la que se especializa la persona, que
 * es lo que se muestra en su tarjeta y por lo que se filtra el listado del
 * equipo.
 *
 * El orden es el que se ve en los botones del filtro: primero las tres ramas
 * de odontología, que son la mayor parte del equipo, y después el resto.
 */
export type Area = {
  slug: string;
  /** Como se lee en la tarjeta y en el botón del filtro. */
  name: string;
};

export const areas = [
  { slug: "odontologia", name: "Odontología" },
  { slug: "odontopediatria", name: "Odontopediatría" },
  { slug: "odontologia-estetica", name: "Odontología estética" },
  { slug: "kinesiologia-estetica", name: "Kinesiología y estética avanzada" },
  { slug: "fonoaudiologia", name: "Fonoaudiología" },
  { slug: "psicologia", name: "Psicología" },
  // Área propia y no "fonoaudiología": es el único lugar del centro donde
  // trabaja quien la tiene a cargo, y mezclarla con las fonoaudiólogas de
  // consultorio la mostraba en un filtro donde no atiende.
  { slug: "taller-adultos-mayores", name: "Taller de adultos mayores" },
] as const satisfies readonly Area[];

export type AreaSlug = (typeof areas)[number]["slug"];

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((area) => area.slug === slug);
}
