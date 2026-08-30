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
  fullDescription: string;
  imageUrl: string;
  features: string[];
};

export type Professional = {
  slug: string;
  name: string;
  specialty: string;
  serviceSlug: string;
  photoUrl: string;
  bio: string;
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
