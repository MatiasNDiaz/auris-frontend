import { CALIDAD_FOTO } from "./calidad-foto";

/**
 * El `sizes` de la foto grande de la ficha de un profesional.
 *
 * Vive acá y no en el componente porque lo necesitan dos lugares a la vez: la
 * ficha, para pedir la imagen, y las tarjetas que llevan a ella, para precargar
 * exactamente la misma variante. Si cada uno declarara el suyo, el navegador
 * elegiría anchos distintos y la precarga no serviría de nada —que es
 * justamente el problema que esto viene a arreglar—.
 */
export const SIZES_FOTO_FICHA = "(max-width: 1024px) 100vw, 960px";

/**
 * Los anchos que `next/image` ofrece en el `srcset`: `imageSizes` seguido de
 * `deviceSizes`, tal como están en `next.config.ts`. Si algún día se tocan
 * allá, esta lista queda vieja y la precarga deja de acertar la variante —no
 * se rompe nada, simplemente deja de ahorrar la descarga—.
 */
const ANCHOS = [128, 384, 640, 1080, 1920];

/**
 * Empieza a bajar la foto que va a usar la ficha, antes de navegar hacia ella.
 *
 * El problema que resuelve: la tarjeta del listado y la ficha muestran la misma
 * foto pero a tamaños distintos, así que `next/image` pide dos variantes
 * distintas —`w=640` en la tarjeta, `w=828` en la ficha—. Son URLs diferentes,
 * de modo que lo ya descargado para la tarjeta no le sirve a la ficha y la foto
 * se baja entera de nuevo recién cuando la ficha termina de montar. Durante esa
 * espera se ve el placeholder.
 *
 * No se fuerza un ancho a mano: se le da al navegador el mismo `srcset` y el
 * mismo `sizes` que va a tener la ficha y que elija él. Así la variante
 * coincide con la que pedirá después y la encuentra en caché.
 *
 * Se dispara al apuntar o tocar la tarjeta, no al montarla: precargar las doce
 * del carrusel competiría con la carga de la página por una foto que quizá
 * nadie abra.
 */
export function precargarFotoDeFicha(src: string) {
  if (typeof window === "undefined" || !src) return;

  const img = new window.Image();
  img.sizes = SIZES_FOTO_FICHA;
  img.srcset = ANCHOS.map(
    (w) =>
      `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${CALIDAD_FOTO} ${w}w`,
  ).join(", ");
}
