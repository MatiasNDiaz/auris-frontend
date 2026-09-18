import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { professionals } from "@/lib/data/professionals";
import { services } from "@/lib/data/services";

/**
 * Mapa del sitio, armado desde los mismos datos que generan las páginas.
 *
 * No hay una lista de URLs escrita a mano a propósito: las fichas de servicios
 * y de profesionales salen de `services.ts` y `professionals.ts`, que son los
 * que alimentan `generateStaticParams`. Si mañana se suma o se saca a alguien,
 * el sitemap acompaña solo y no queda apuntando a una página que ya no existe.
 *
 * `priority` no es una promesa al buscador sino una jerarquía interna: la
 * portada primero, después las secciones y por último el detalle.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const ahora = new Date();

  const secciones = [
    "",
    "/servicios",
    "/profesionales",
    "/sobre-el-centro",
    "/galeria",
    "/preguntas-frecuentes",
    "/contacto",
  ];

  return [
    ...secciones.map((ruta) => ({
      url: `${base}${ruta}`,
      lastModified: ahora,
      changeFrequency: "monthly" as const,
      priority: ruta === "" ? 1 : 0.8,
    })),
    ...services.map((servicio) => ({
      url: `${base}/servicios/${servicio.slug}`,
      lastModified: ahora,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...professionals.map((profesional) => ({
      url: `${base}/profesionales/${profesional.slug}`,
      lastModified: ahora,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
