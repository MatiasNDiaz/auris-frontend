import fotosGeneradas from "./fotos-recepcionistas.generated.json";
import type { Recepcionista } from "@/lib/types";

/**
 * El equipo de recepción.
 *
 * No son profesionales de la salud y no tienen ficha propia: aparecen en la
 * home y al final del listado del equipo, y nada más. Por eso este archivo es
 * mucho más corto que `professionals.ts` —sin especialidad, sin área, sin
 * trayectoria ni WhatsApp propio— y por eso el tipo `Recepcionista` es aparte
 * y no un `Professional` con campos vacíos.
 *
 * El orden es el que se muestra. Las fotos salen del manifiesto que arma
 * `scripts/fotos-profesionales.mjs`, con la fecha del archivo en la ruta para
 * que al reemplazar una no quede la anterior en caché.
 */
const fotos = fotosGeneradas as Record<
  string,
  { hero: string; hover?: string }
>;

const equipo: Omit<Recepcionista, "photoUrl" | "photoHoverUrl">[] = [
  // El centrado horizontal de las tres se resuelve recortando el archivo (ver
  // `ENCUADRE` en `scripts/optimize-images.mjs`): la tarjeta es vertical y de
  // una foto vertical muestra el ancho completo, así que no hay
  // `object-position` que las corra. Lo que queda acá es el eje vertical.
  {
    slug: "leticia-loza",
    name: "Leticia Loza",
    fotoFoco: "center 40%",
    fotoHoverFoco: "center 40%",
  },
  {
    slug: "soledad-lluch",
    name: "Soledad Lluch",
    // Su toma es apaisada: después del recorte queda casi cuadrada, así que el
    // margen vertical es poco y hay que dejarlo arriba, donde está su cara.
    fotoFoco: "center 25%",
    fotoHoverFoco: "center 25%",
  },
  {
    slug: "yanina-solari",
    name: "Yanina Solari",
    fotoFoco: "center 60%",
    fotoHoverFoco: "center 60%",
  },
];

/**
 * Quien todavía no tiene su foto 1 queda afuera del listado: su tarjeta no
 * tendría nada que mostrar. Con la carpeta vacía, la sección entera no se
 * dibuja.
 */
export const recepcionistas: Recepcionista[] = equipo.flatMap((persona) => {
  const foto = fotos[persona.slug];
  if (!foto?.hero) return [];
  return [{ ...persona, photoUrl: foto.hero, photoHoverUrl: foto.hover }];
});
