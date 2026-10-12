import { BLUR_DATA_URL } from "./blur";
import miniaturas from "./data/blur-fotos.generated.json";

/**
 * La miniatura borrosa de una foto, para el `blurDataURL` de `next/image`.
 *
 * Las genera `scripts/fotos-profesionales.mjs` con sharp: 12 px de ancho, unos
 * 200 caracteres cada una. Son lo que se ve mientras la foto de verdad baja.
 *
 * Por qué importa: las fotos grandes se dibujan sobre fondos de color —el
 * `bg-ink-900` casi negro de los banners y del hero, el degradé de la paleta en
 * las fichas—, así que mientras cargaban lo que se veía era un rectángulo negro
 * o verde. Un banner pesa entre 100 y 175 KB y en 1,6 Mbps eso es más de un
 * segundo de bloque de color. Con la miniatura, desde el primer pintado se ve
 * la foto: borrosa primero y nítida después, pero nunca un rectángulo liso.
 *
 * La clave del mapa es la ruta dentro de `public/images/`. Las URL del sitio
 * llevan delante `/imagenes/v/<versión>/`, que cambia cada vez que se reemplaza
 * el archivo, así que se lo quitamos antes de buscar. Una foto que no pasó por
 * el generador cae en el placeholder genérico, que es el comportamiento que
 * tenía todo antes.
 */
export function miniaturaDe(src: string) {
  const ruta = src.replace(/^\/imagenes\/v\/\d+\//, "").replace(/^\/images\//, "");
  return (miniaturas as Record<string, string>)[ruta] ?? BLUR_DATA_URL;
}
