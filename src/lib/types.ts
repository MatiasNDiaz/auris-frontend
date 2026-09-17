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
  specialty: string;
  serviceSlug: string;
  photoUrl: string;
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
