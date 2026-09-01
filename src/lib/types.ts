/**
 * Tipos del contenido del sitio.
 *
 * `Service`, `Professional`, `FAQ` y `GalleryItem` son contenido estático y
 * viven en `/lib/data`. `BlogPost` y `Testimonial` hoy también son mock, pero
 * su forma refleja las tablas de Supabase (`blog_posts`, `testimonials`) para
 * que la migración sea un cambio de origen de datos y nada más.
 */

export type Service = {
  slug: string;
  name: string;
  /** Clave del ícono de lucide-react, resuelta en `@/lib/icons`. */
  icon: string;
  shortDescription: string;
  /** Frase de una línea, usada en el carousel del hero. */
  tagline: string;
  /** Titular y bajada que muestra el hero cuando este servicio está activo. */
  heroTitle: string;
  heroSubtitle: string;
  fullDescription: string;
  imageUrl: string;
  features: string[];
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

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown liviano: párrafos separados por línea en blanco, `## ` para subtítulos. */
  content: string;
  coverImageUrl: string;
  publishedAt: string;
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

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

/**
 * Una parada del recorrido guiado por el centro. `side` indica de qué lado del
 * pasillo queda el espacio: es lo que usa la planta del visor para ubicarlo.
 */
export type TourStop = {
  id: string;
  name: string;
  caption: string;
  side: "start" | "center" | "left" | "right" | "end";
  photos: { src: string; alt: string }[];
};
