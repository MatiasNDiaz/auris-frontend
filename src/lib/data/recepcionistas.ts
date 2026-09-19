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
  {
    slug: "leticia-loza",
    name: "Leticia Loza",
    // Vertical y de cuerpo entero: sin correr el recorte hacia arriba, la
    // tarjeta le deja demasiada pared por encima de la cabeza.
    fotoFoco: "center 30%",
    fotoHoverFoco: "center 30%",
  },
  {
    slug: "soledad-lluch",
    name: "Soledad Lluch",
    // La única con la toma apaisada: la tarjeta es vertical, así que acá lo
    // que se recorta son los costados y lo que hay que elegir es el eje
    // horizontal. En el centro queda corrida contra el borde derecho.
    fotoFoco: "65% center",
    fotoHoverFoco: "65% center",
  },
  {
    slug: "yanina-solari",
    name: "Yanina Solari",
    // Está más lejos de la cámara que las otras dos: bajando el recorte se la
    // ve del mismo tamaño en la tarjeta.
    fotoFoco: "center 55%",
    fotoHoverFoco: "center 55%",
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
