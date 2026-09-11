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
  experience: string;
  certifications: string[];
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

