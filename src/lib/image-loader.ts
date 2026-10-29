"use client";

import manifiesto from "@/generated/image-manifest.json";

/**
 * De dónde saca `next/image` la dirección de cada foto.
 *
 * Por defecto Next le pide la foto a su propio optimizador —en producción, al
 * servicio de imágenes de Vercel—, que la convierte en el momento en que
 * alguien la pide. Esa conversión tarda entre 300 y 1400 ms por cada
 * combinación de foto y ancho, y es la razón por la que las imágenes
 * aparecían dos o tres segundos después que el texto.
 *
 * Acá el trabajo ya está hecho: `scripts/optimize-images.mjs` deja cada foto
 * en los anchos que el sitio usa (`nombre-w640.webp` y compañía) y este
 * archivo se limita a elegir cuál corresponde. Lo que llega al navegador es un
 * archivo estático del CDN, sin conversión ni espera, y sin gastar el cupo de
 * transformaciones del plan.
 *
 * Qué NO hace, y es a propósito:
 *
 *   - No elige formato. Un loader devuelve una sola dirección y no ve la
 *     cabecera `Accept`, así que no hay forma de mandarle AVIF a quien lo
 *     soporta y WebP al resto. Por eso todo es WebP.
 *   - No usa `quality`. La compresión viene decidida desde el archivo: 82 para
 *     fotos de personas, 88 para banners y portadas. El `quality` de los
 *     componentes queda sólo para que el código diga lo mismo que el pipeline.
 */

type Escalones = { w: number; h: number; v: number[] };

const FOTOS = manifiesto as Record<string, Escalones>;

/** Las que ya se avisaron, para no repetir el mismo aviso en cada render. */
const avisadas = new Set<string>();

/**
 * La clave con la que esta foto figura en el manifiesto: su ruta dentro de
 * `public/images`.
 *
 * Las fotos del equipo se piden como `/imagenes/v/<fecha>/...`, que un rewrite
 * de `next.config.ts` traduce a `/images/...`. Ese número cambia cuando se
 * reemplaza el archivo y es lo que permite cachear para siempre, así que se
 * conserva en la dirección final y sólo se lo quita para buscar.
 */
function claveDe(src: string) {
  return src.replace(/^\/imagenes\/v\/\d+\//, "").replace(/^\/images\//, "");
}

export default function cargadorDeImagen({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Remotas: se devuelven tal cual. Hoy no se renderiza ninguna —las URLs de
  // Unsplash de `professionals.ts` las pisa la foto real—, pero si mañana se
  // carga a alguien sin fotos, su tarjeta tiene que seguir funcionando.
  if (/^https?:\/\//.test(src)) return src;

  const foto = FOTOS[claveDe(src)];

  if (!foto) {
    if (process.env.NODE_ENV !== "production" && !avisadas.has(src)) {
      avisadas.add(src);
      console.warn(
        `[imágenes] ${src} no está en el manifiesto: se sirve entera, sin variante. ` +
          `Si es una foto del sitio, falta correr "npm run optimize:images".`,
      );
    }
    return src;
  }

  // El escalón más chico que alcance. Si piden más de lo que hay —el banner a
  // pantalla completa en un monitor grande—, va la foto entera, que es el
  // tope disponible.
  const escalon = foto.v.find((disponible) => disponible >= width);
  return escalon === undefined
    ? src
    : src.replace(/\.webp$/, `-w${escalon}.webp`);
}
