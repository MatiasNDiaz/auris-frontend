import type { AreaSlug } from "./data/areas";

/**
 * Tipos del contenido del sitio.
 *
 * `Service`, `Professional` y `FAQ` son contenido estático y viven en
 * `/lib/data`. `Testimonial` hoy también es mock, pero
 * su forma refleja las tablas de Supabase (`blog_posts`, `testimonials`) para
 * que la migración sea un cambio de origen de datos y nada más.
 */

export type Service = {
  slug: string;
  name: string;
  /** Clave del ícono de lucide-react, resuelta en `@/lib/icons`. */
  icon: string;
  /**
   * Logo propio del servicio, cuando tiene submarca. Reemplaza al ícono en la
   * tarjeta y en el detalle. Solo lo usa Alineadores, con Smile Now.
   */
  iconImage?: string;
  /**
   * Si aparece en las grillas y listados. Los que no se listan siguen
   * teniendo su página y se puede llegar desde otro servicio.
   */
  listed?: boolean;
  shortDescription: string;
  /** Frase de una línea, usada en el carousel del hero. */
  tagline: string;
  /** Titular y bajada que muestra el hero cuando este servicio está activo. */
  heroTitle: string;
  heroSubtitle: string;
  fullDescription: string;
  imageUrl: string;
  /**
   * Qué parte de la foto conserva la franja del encabezado, como
   * `object-position`. Por defecto el 15% de arriba, que es donde está la
   * gente en casi todas. Se cambia cuando lo que importa está más abajo —una
   * foto del consultorio, por ejemplo—.
   */
  heroFoco?: string;
  features: string[];
  /**
   * Ramas del servicio, cuando tiene varias con entidad propia. Solo las lleva
   * odontología, que es el área central del centro; el detalle suma un bloque
   * con ellas y el resto de los servicios no cambia.
   */
  branches?: {
    /** Clave del ícono, resuelta en la página de detalle. */
    icon: string;
    name: string;
    description: string;
  }[];
};

export type Professional = {
  slug: string;
  /** Define la paleta de su ficha: rosada o verde agua de consultorio. */
  gender: "female" | "male";
  name: string;
  /** Su título profesional, con el género que corresponde: "Odontóloga". */
  specialty: string;
  /**
   * La rama en la que trabaja, de `areas.ts`. Es lo que se muestra arriba de
   * su nombre en cada tarjeta y por lo que filtra el listado del equipo.
   */
  areaSlug: AreaSlug;
  /** El servicio del sitio al que se la asocia, para enlazar a su página. */
  serviceSlug: string;
  photoUrl: string;
  /**
   * Su imagen 2. Es la que aparece al pasar el cursor por su tarjeta, cruzada
   * con la 1. Sin ella, la tarjeta se queda con una sola foto.
   */
  photoHoverUrl?: string;
  /** Encuadre de esa imagen 2, para cuando no está centrada en su cuadro. */
  fotoHoverFoco?: string;
  /**
   * Encuadre de su foto 1 (`object-position`) para cuando el recuadro es más
   * ancho que alto y hay que recortarla a lo alto: es lo que pasa en la
   * tarjeta del equipo al pasar el cursor, que se ensancha. Un porcentaje
   * bajo muestra más de la parte de arriba, así no se corta la cabeza.
   */
  fotoFoco?: string;
  bio: string;
  /** Frase profesional o personal, en primera persona. */
  motto: string;
  /** Títulos y certificaciones, con institución y año. */
  credentials: { title: string; institution: string; year: string }[];
  education: string[];
  certifications: string[];
  /**
   * WhatsApp al que va el botón "Solicitar turno con…" de su ficha, solo
   * dígitos y con 549 adelante. Quien todavía no pasó su número usa el del
   * centro.
   */
  whatsapp: string;
  /**
   * Su historia profesional, tal como la escribió el centro. Si no está, la
   * ficha avisa que la información está en actualización.
   */
  trayectoria?: Trayectoria;
  /** El dueño del centro: va primero en cualquier listado del equipo. */
  owner?: boolean;
};

/** Un tramo del texto de trayectoria, en el orden en que se lee. */
export type BloqueTrayectoria =
  | { tipo: "parrafo"; texto: string }
  /** Encabezado de un apartado, como "Servicios en AURIS". */
  | { tipo: "titulo"; texto: string }
  /** Agrupador dentro de un apartado, como "Odontología" en una lista de servicios. */
  | { tipo: "subtitulo"; texto: string }
  | { tipo: "lista"; items: string[] };

export type Trayectoria = {
  /** Título profesional: "Doctor en Odontología", "Licenciada en Fonoaudiología". */
  titulo: string;
  /** La línea que va debajo del título. */
  especialidad: string;
  bloques: BloqueTrayectoria[];
  contactos: {
    tipo: "telefono" | "whatsapp";
    etiqueta: string;
    /** Tal como lo escribió el centro, para mostrarlo. */
    numero: string;
    /** `tel:` o `https://wa.me/`, ya normalizado. */
    href: string;
  }[];
};

/**
 * Ícono de un hito de la línea de tiempo de la ficha. Es una clave y no un
 * componente para que los datos no dependan de la librería de íconos.
 */
export type IconoHito =
  /** Birrete: estudios universitarios. */
  | "formacion"
  /** Persona: el ejercicio de la profesión. */
  | "experiencia"
  /** Cruz: posgrados, diplomaturas y especialidades. */
  | "especializacion"
  /** Microscopio: tecnología y diagnóstico. */
  | "tecnologia"
  /** Edificio: hospitales, sanatorios, fundaciones. */
  | "institucion"
  /** Pizarra: docencia, cursos y congresos. */
  | "docencia"
  /** Libro: publicaciones. */
  | "publicacion"
  /** Maletín: proyectos y empresas propias. */
  | "proyecto"
  /** Medalla: certificaciones. */
  | "certificacion"
  /** Personas: trabajo con otras disciplinas. */
  | "equipo"
  /** Manos: acompañamiento de pacientes y familias. */
  | "acompanamiento";

/**
 * Contenido de la ficha extendida de un profesional: la línea de tiempo con
 * su grilla de fotos, el banner de su enfoque y las cifras.
 *
 * Todo lo que es texto de la bio (`texto`, `frase`, los ítems de servicios…)
 * se toma literal de su `Trayectoria` y se comprueba al compilar. Los rótulos
 * —título de cada hito, etiquetas, títulos de apartado— pueden ser un
 * encabezado de la bio o un rótulo de la interfaz; las etiquetas de las cifras
 * y la tarjeta flotante son siempre de la interfaz.
 */
export type Ficha = {
  /**
   * Quien todavía no tiene bio: la ficha mantiene la estructura completa pero
   * cada texto dice que la información está en actualización.
   */
  enActualizacion?: boolean;
  /** Rótulo de la sección de trayectoria, si la bio trae uno propio. */
  trayectoriaTitulo?: string;
  /**
   * Qué parte de la foto del banner tiene que quedar a la vista, en formato
   * `object-position` ("center 40%" por defecto).
   *
   * El banner es una franja baja y las fotos son verticales, así que solo se
   * ve una tira horizontal: el porcentaje es la altura de la cara dentro de la
   * foto. Alguien parado suele estar cerca del 35%, alguien sentado, del 50%.
   */
  bannerFoco?: string;
  /**
   * Cuánto se corre la foto del banner hacia la derecha ("14%" por defecto).
   *
   * No alcanza con `bannerFoco` para esto: la foto es vertical y entra entera
   * a lo ancho de su franja, así que no hay recorte horizontal que mover. Este
   * corrimiento la empuja, y el hueco que deja a la izquierda cae donde el
   * degradé ya la desvanece, así que no se nota. Solo se aplica en pantallas
   * anchas, que es donde la foto convive con el texto.
   */
  bannerCorrimiento?: string;
  /**
   * Encuadre de las fotos del hero (`object-position`), para cuando la persona
   * no está en el centro del cuadro o la foto es apaisada y hay que recortarla
   * a vertical. Por defecto, el centro.
   */
  heroFoco?: string;
  /** Lo mismo para la foto 2, la que alterna en el hero. */
  heroHoverFoco?: string;
  /**
   * Encuadre de las fotos 3, 4 y 5 en el mosaico, en ese orden. Las celdas son
   * más anchas que altas y las fotos verticales, así que de cada una se ve una
   * franja: esto elige cuál. Un porcentaje alto baja el recorte —sirve para
   * que entre el escritorio o lo que la rodea—.
   */
  grillaFoco?: (string | undefined)[];
  /**
   * Acercamiento de la foto de la sección de cifras, desde el centro. Para las
   * tomas de lejos, que en ese recuadro alto dejan a la persona chica. 1 —o
   * nada— es la foto tal cual.
   */
  cifrasZoom?: number;
  /** Sección "Formación y trayectoria". */
  hitos: {
    icono: IconoHito;
    /** Dato corto arriba del título: un año, una institución. */
    marca?: string;
    titulo: string;
    /** Frases literales de la bio. */
    texto: string[];
  }[];
  /** Tarjeta que flota sobre la grilla de fotos. */
  destacado?: { titulo: string; texto: string };
  /** Banner con la foto de fondo. */
  enfoque: {
    /** Rótulo del banner, literal de la bio: "Su enfoque profesional". */
    etiqueta: string;
    /** La frase grande. Literal de la bio. */
    frase: string;
    /** Lo que sigue a la frase, también literal. */
    texto: string[];
  };
  /**
   * Sección de cifras. Solo con números que estén en la bio: si no hay
   * ninguno, se omite y esa sección muestra servicios y contacto.
   */
  cifras?: {
    /** Texto manuscrito sobre la foto. */
    firma?: string;
    items: {
      valor: number;
      prefijo?: string;
      sufijo?: string;
      /** Los años no cuentan desde cero ni llevan separador de miles. */
      anio?: boolean;
      etiqueta: string;
    }[];
  };
  /** Los servicios que ofrece en el centro, literales de la bio. */
  servicios?: {
    titulo: string;
    /** Párrafos de la bio que presentan el apartado. */
    intro?: string[];
    grupos: { titulo?: string; items: string[] }[];
    /** Párrafos de la bio que cierran el apartado. */
    cierre?: string[];
  };
};

export type Testimonial = {
  authorName: string;
  content: string;
  rating: number;
};

export type FAQ = {
  category: string;
  question: string;
  answer: string;
};
