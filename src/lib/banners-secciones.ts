import { existsSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Foto de fondo del encabezado de cada sección de la navegación.
 *
 * Los originales van en `assets/raw/images/banners-secciones/` con el nombre
 * `banner-<sección>.jpg` —el mismo nombre que el slug de la página— y
 * `npm run optimize:images` los deja en `public/images/banners-secciones/`
 * como `.webp`. Quien no tiene foto devuelve `undefined` y su encabezado
 * queda con el fondo de color de siempre.
 *
 * Solo corre en el servidor. La fecha del archivo va en la ruta —igual que en
 * las fotos de los profesionales— para que al reemplazar una imagen por otra
 * con el mismo nombre cambie la dirección y no siga saliendo la vieja del
 * caché del navegador ni del de Next. `next.config.ts` traduce
 * `/imagenes/v/<n>/...` a la ruta real dentro de `public/`.
 */
export function bannerDeSeccion(seccion: string): string | undefined {
  const archivo = `banner-${seccion}.webp`;
  const ruta = path.join(
    process.cwd(),
    "public",
    "images",
    "banners-secciones",
    archivo,
  );
  if (!existsSync(ruta)) return undefined;

  const version = Math.round(statSync(ruta).mtimeMs);
  return `/imagenes/v/${version}/banners-secciones/${archivo}`;
}
