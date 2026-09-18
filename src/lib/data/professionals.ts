import type { Professional } from "@/lib/types";
import fotosGeneradas from "./fotos-profesionales.generated.json";
import { trayectorias } from "./trayectorias";

/**
 * Equipo real de AURIS, según el cartel de la recepción.
 *
 * Los nombres son los del cartel, letra por letra —ni de más ni de menos—,
 * aunque alguna bio (`trayectorias.ts`) mencione el nombre completo de esa
 * persona: ese texto es una cita literal del centro y no se toca.
 *
 * Las fotos siguen siendo las que había antes de este cambio: todavía no
 * están asociadas a cada persona real, así que quedan como estaban hasta que
 * lleguen los retratos del equipo. Lo que cambió acá es el texto —nombre,
 * área y todo lo que antes describía a un profesional de ejemplo—.
 *
 * La historia real de cada uno vive en `trayectoria` (ver `trayectorias.ts`)
 * y es la que se muestra en su ficha. Quien no la tiene todavía aparece con
 * la información en actualización.
 *
 * `motto`, `bio` y `credentials` siguen con texto genérico: en vez de inventar
 * universidades, años de egreso o números de matrícula para personas reales
 * —la ficha los muestra como "Documentación verificada"—, dicen solo el área
 * y que forman parte del equipo de AURIS.
 */

/** WhatsApp del centro, para quien todavía no pasó su número. */
const WHATSAPP_CENTRO = "5493512177788";

const equipo: Professional[] = [
  {
    slug: "ariel-vidal",
    motto:
      "Cada paciente merece un plan pensado para su caso, no una receta estándar.",
    credentials: [
      {
        title: "Odontología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "male",
    name: "Dr. Ariel Vidal",
    specialty: "Odontólogo",
    areaSlug: "odontologia",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Integra el equipo de Odontología de AURIS y sostiene un enfoque preventivo, centrado en la persona.",
    education: ["Formación en Odontología"],
    certifications: [],
    owner: true,
    whatsapp: "5493512177788",
    trayectoria: trayectorias["ariel-vidal"],
  },
  {
    slug: "carla-fernandez",
    motto: "Prefiero explicar cada paso antes de empezar un tratamiento.",
    credentials: [
      {
        title: "Odontología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Dra. Carla Fernández",
    specialty: "Odontopediatra",
    areaSlug: "odontopediatria",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1736289173074-df6009da27c9?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Forma parte del equipo de Odontología de AURIS, con un enfoque preventivo y centrado en explicar cada paso del tratamiento antes de empezarlo.",
    education: ["Formación en Odontología"],
    certifications: [],
    whatsapp: "5493516075681",
    trayectoria: trayectorias["carla-fernandez"],
  },
  {
    slug: "daniela-giansetto",
    motto: "La prevención es la mejor herramienta que tenemos.",
    credentials: [
      {
        title: "Odontología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Dra. Daniela Giansetto",
    // Su foto 2 es apaisada y ella está sobre el borde derecho: el recorte
    // vertical de las tarjetas y del hero tiene que ir a buscarla ahí. Pasado
    // del 50% el recorte se corre hacia la derecha, que es donde está.
    fotoHoverFoco: "86% center",
    specialty: "Odontopediatra",
    areaSlug: "odontopediatria",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Integra el equipo de Odontología de AURIS, acompañando a cada paciente con un abordaje preventivo y personalizado.",
    education: ["Formación en Odontología"],
    certifications: [],
    whatsapp: "5493517031002",
    trayectoria: trayectorias["daniela-giansetto"],
  },
  {
    slug: "rocio-matteucci",
    motto:
      "Cada consulta empieza con una escucha atenta, no con un diagnóstico apurado.",
    credentials: [
      {
        title: "Odontología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Dra. Rocío Matteucci",
    specialty: "Odontóloga",
    areaSlug: "odontologia",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1683348858689-f4e10994804d?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Es parte del equipo de Odontología de AURIS y sostiene un enfoque de atención integral, con foco en la prevención.",
    education: ["Formación en Odontología"],
    certifications: [],
    // Todavía sin número propio: el botón va al WhatsApp del centro.
    whatsapp: WHATSAPP_CENTRO,
    trayectoria: trayectorias["rocio-matteucci"],
  },
  {
    slug: "laura-mansilla",
    motto:
      "Cuidar la boca es también cuidar la confianza de quien nos consulta.",
    credentials: [
      {
        title: "Odontología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Dra. Laura Mansilla",
    specialty: "Odontóloga",
    areaSlug: "odontologia",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1673865641073-4479f93a7776?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Integra el equipo de Odontología de AURIS, priorizando la prevención y el acompañamiento en cada etapa del tratamiento.",
    education: ["Formación en Odontología"],
    certifications: [],
    whatsapp: "5493512177788",
    trayectoria: trayectorias["laura-mansilla"],
  },
  {
    slug: "claudia-tomasi",
    motto:
      "La odontología moderna tiene que doler lo menos posible, en todos los sentidos.",
    credentials: [
      {
        title: "Odontología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Dra. Claudia Tomasi",
    // Su foto 1 es de cuerpo entero y sin aire arriba: el reencuadre que la
    // deja como el resto del equipo se hace en el archivo, no acá (ver
    // `ENCUADRE` en `scripts/optimize-images.mjs`).
    //
    // Al pasar el cursor la tarjeta se ensancha y la foto pasa a recortarse a
    // lo alto: sin esto el recorte arranca por debajo de su cabeza.
    fotoFoco: "center 40%",
    specialty: "Odontóloga estética",
    areaSlug: "odontologia-estetica",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1734002886107-168181bcd6a1?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Es parte del equipo de Odontología de AURIS, con un enfoque centrado en la persona y en la prevención.",
    education: ["Formación en Odontología"],
    certifications: [],
    whatsapp: "5493512177788",
    trayectoria: trayectorias["claudia-tomasi"],
  },
  {
    slug: "santiago-rodriguez",
    motto: "Explicar bien evita más sustos que cualquier anestesia.",
    credentials: [
      {
        title: "Odontología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "male",
    name: "Dr. Santiago Rodriguez",
    specialty: "Odontólogo",
    areaSlug: "odontologia",
    serviceSlug: "odontologia",
    photoUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Forma parte del equipo de Odontología de AURIS, acompañando cada tratamiento con información clara y un enfoque preventivo.",
    education: ["Formación en Odontología"],
    certifications: [],
    whatsapp: "5493544583449",
    trayectoria: trayectorias["santiago-rodriguez"],
  },
  {
    slug: "eugenia-leiva",
    motto: "El cuerpo también necesita tiempo para recuperarse bien.",
    credentials: [
      {
        title: "Kinesiología y Fisioterapia",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Lic. Eugenia Leiva",
    specialty: "Lic. en Kinesiología · Cosmetóloga",
    areaSlug: "kinesiologia-estetica",
    serviceSlug: "kinesiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1730597842283-943c7986ee2c?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Forma parte del equipo de Kinesiología y Fisioterapia de AURIS, acompañando procesos de recuperación y bienestar físico.",
    education: ["Formación en Kinesiología y Fisioterapia"],
    certifications: [],
    whatsapp: "5493516991150",
    trayectoria: trayectorias["eugenia-leiva"],
  },
  {
    slug: "soledad-di-martino",
    motto: "Cada proceso terapéutico tiene su propio tiempo.",
    credentials: [
      {
        title: "Psicología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Lic. Soledad Di Martino",
    specialty: "Lic. en Psicología",
    areaSlug: "psicologia",
    serviceSlug: "psicologia",
    photoUrl:
      "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Forma parte del equipo de Psicología de AURIS, acompañando procesos personales con escucha y respeto por el tiempo de cada consultante.",
    education: ["Formación en Psicología"],
    certifications: [],
    whatsapp: "5493517598062",
    trayectoria: trayectorias["soledad-di-martino"],
  },
  {
    slug: "romina-tchakerian",
    motto: "Comunicarse bien cambia la forma de estar en el mundo.",
    credentials: [
      {
        title: "Fonoaudiología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Lic. Romina Tchakerian",
    specialty: "Lic. en Fonoaudiología",
    areaSlug: "fonoaudiologia",
    serviceSlug: "fonoaudiologia",
    photoUrl:
      "https://images.unsplash.com/photo-1736289154383-435d94804522?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Forma parte del equipo de Fonoaudiología de AURIS, acompañando el desarrollo del lenguaje y la comunicación.",
    education: ["Formación en Fonoaudiología"],
    certifications: [],
    whatsapp: "5493513725125",
    trayectoria: trayectorias["romina-tchakerian"],
  },
  {
    slug: "eugenia-villalobos",
    motto: "Cada avance en el lenguaje abre una puerta distinta.",
    credentials: [
      {
        title: "Fonoaudiología",
        institution: "Equipo AURIS",
        year: "",
      },
    ],
    gender: "female",
    name: "Lic. Eugenia Villalobos",
    specialty: "Lic. en Fonoaudiología",
    areaSlug: "fonoaudiologia",
    // Su área sigue siendo fonoaudiología, pero el servicio al que se la
    // asocia es el taller: es quien lo tiene a cargo, y hasta ahora esa página
    // no mostraba a nadie.
    serviceSlug: "taller-de-adultos-mayores",
    photoUrl:
      "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?q=80&w=800&h=1000&fit=crop&crop=faces&auto=format",
    bio: "Integra el equipo de Fonoaudiología de AURIS, trabajando sobre el lenguaje, la voz y la comunicación.",
    education: ["Formación en Fonoaudiología"],
    certifications: [],
    whatsapp: "5493516539545",
    trayectoria: trayectorias["eugenia-villalobos"],
  },
];

/**
 * Quiénes van al final de cualquier listado, después del resto del equipo.
 * Hoy son los que todavía no tienen sus fotos propias.
 */
const AL_FINAL = new Set(["eugenia-villalobos"]);

/**
 * El equipo en el orden en que se muestra: el Dr. Ariel Vidal, dueño del
 * centro, siempre primero y los de `AL_FINAL` últimos —en /profesionales, en
 * el carrusel de la home y en el equipo de cada servicio—.
 *
 * Se ordena acá y no confiando en la posición dentro del array, para que
 * agregar a alguien arriba de todo no lo corra del primer lugar. `sort` es
 * estable, así que el resto conserva el orden en que está cargado.
 */
export const professionals: Professional[] = [...equipo]
  .sort((a, b) => Number(Boolean(b.owner)) - Number(Boolean(a.owner)))
  .sort((a, b) => Number(AL_FINAL.has(a.slug)) - Number(AL_FINAL.has(b.slug)))
  // Si ya subieron su imagen 1 (`<prefijo>-1.*`), esa foto reemplaza a la
  // provisoria en todo el sitio: ficha, tarjetas y carrusel. Ver
  // `docs/modus-operandi-imagenes-profesionales.md`.
  .map((professional) => {
    const fotos = (
      fotosGeneradas as Record<string, { hero?: string; hover?: string }>
    )[professional.slug];

    if (!fotos?.hero) return professional;

    return {
      ...professional,
      photoUrl: fotos.hero,
      photoHoverUrl: fotos.hover,
    };
  });

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
