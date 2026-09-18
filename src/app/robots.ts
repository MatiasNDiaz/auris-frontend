import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Todo el sitio es público y se quiere indexar, así que no hay reglas de
 * exclusión. Lo que sí importa es declarar el sitemap: sin esta línea los
 * buscadores tienen que descubrir las fichas de servicios y profesionales
 * siguiendo enlaces, y varias cuelgan de un filtro que se arma en el cliente.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
