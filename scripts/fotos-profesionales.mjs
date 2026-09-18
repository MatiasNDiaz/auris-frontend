// @ts-check
/**
 * Genera `src/lib/data/fotos-profesionales.generated.json`: qué profesionales
 * tienen sus imágenes 1 y 2 (`<prefijo>-1.*` y `-2.*`, ver `prefijo-foto.mjs`)
 * en `public/images/profesionales/<slug>/`.
 *
 * Lo usan las tarjetas del equipo (componentes de cliente, que no pueden leer
 * el disco): la 1 como foto de la tarjeta y la 2 para el cruce al pasar el
 * cursor. La ficha en sí no depende de este archivo: lee las fotos directo del
 * disco.
 *
 * Corre solo antes de `npm run dev` y de `npm run build`.
 */
import { existsSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PREFIJO_FOTO } from "../src/lib/data/prefijo-foto.mjs";

const RAIZ = process.cwd();
const CARPETA = path.join(RAIZ, "public", "images", "profesionales");
const SALIDA = path.join(
  RAIZ,
  "src",
  "lib",
  "data",
  "fotos-profesionales.generated.json",
);
const EXTENSIONES = ["webp", "avif", "jpg", "jpeg", "png"];

/** @type {Record<string, { hero: string, hover?: string }>} */
const manifiesto = {};

/**
 * URL de una foto por número, con la fecha del archivo en la ruta: si cambia
 * la foto cambia la dirección, así que nadie se queda con la anterior en
 * caché. Es la misma forma que arma `fotos-profesional.ts`.
 */
function url(slug, base, numero) {
  const extension = EXTENSIONES.find((ext) =>
    existsSync(path.join(CARPETA, slug, `${base}-${numero}.${ext}`)),
  );
  if (!extension) return undefined;

  const archivo = path.join(CARPETA, slug, `${base}-${numero}.${extension}`);
  const version = Math.round(statSync(archivo).mtimeMs);
  return `/imagenes/v/${version}/profesionales/${slug}/${base}-${numero}.${extension}`;
}

for (const [slug, prefijo] of Object.entries(PREFIJO_FOTO)) {
  const base = prefijo.toLowerCase();
  const hero = url(slug, base, 1);
  if (hero) manifiesto[slug] = { hero, hover: url(slug, base, 2) };
}

writeFileSync(SALIDA, `${JSON.stringify(manifiesto, null, 2)}\n`);
console.log(
  `fotos-profesionales · ${Object.keys(manifiesto).length} con foto 1 (imagen por defecto)`,
);
