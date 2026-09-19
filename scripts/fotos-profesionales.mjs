// @ts-check
/**
 * Genera los manifiestos de fotos que consumen las tarjetas:
 *
 *   src/lib/data/fotos-profesionales.generated.json
 *   src/lib/data/fotos-recepcionistas.generated.json
 *
 * En los dos casos son las imágenes 1 y 2 de cada persona: la 1 como foto de
 * la tarjeta y la 2 para el cruce al pasar el cursor. Hacen falta porque las
 * tarjetas son componentes de cliente y no pueden leer el disco. La ficha de
 * un profesional no depende de esto: lee las fotos directo del disco.
 *
 * Corre solo antes de `npm run dev` y de `npm run build`.
 */
import { existsSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PREFIJO_FOTO } from "../src/lib/data/prefijo-foto.mjs";
import { PREFIJO_FOTO_RECEPCION } from "../src/lib/data/prefijo-foto-recepcion.mjs";

const RAIZ = process.cwd();
const EXTENSIONES = ["webp", "avif", "jpg", "jpeg", "png"];

/**
 * URL de una foto por número, con la fecha del archivo en la ruta: si cambia
 * la foto cambia la dirección, así que nadie se queda con la anterior en
 * caché. Es la misma forma que arma `fotos-profesional.ts`.
 *
 * @param {string} carpeta
 * @param {string} slug
 * @param {string} base
 * @param {number} numero
 */
function url(carpeta, slug, base, numero) {
  const dir = path.join(RAIZ, "public", "images", carpeta, slug);
  const extension = EXTENSIONES.find((ext) =>
    existsSync(path.join(dir, `${base}-${numero}.${ext}`)),
  );
  if (!extension) return undefined;

  const archivo = path.join(dir, `${base}-${numero}.${extension}`);
  const version = Math.round(statSync(archivo).mtimeMs);
  return `/imagenes/v/${version}/${carpeta}/${slug}/${base}-${numero}.${extension}`;
}

/**
 * @param {string} carpeta  subcarpeta dentro de `public/images/`
 * @param {Record<string, string>} prefijos  slug -> prefijo de sus archivos
 * @param {string} salida  nombre del JSON generado
 */
function generar(carpeta, prefijos, salida) {
  /** @type {Record<string, { hero: string, hover?: string }>} */
  const manifiesto = {};

  for (const [slug, prefijo] of Object.entries(prefijos)) {
    const base = prefijo.toLowerCase();
    const hero = url(carpeta, slug, base, 1);
    if (hero) manifiesto[slug] = { hero, hover: url(carpeta, slug, base, 2) };
  }

  writeFileSync(
    path.join(RAIZ, "src", "lib", "data", salida),
    `${JSON.stringify(manifiesto, null, 2)}\n`,
  );
  return Object.keys(manifiesto).length;
}

const conFotos = generar(
  "profesionales",
  PREFIJO_FOTO,
  "fotos-profesionales.generated.json",
);
const recepcion = generar(
  "recepcionistas",
  PREFIJO_FOTO_RECEPCION,
  "fotos-recepcionistas.generated.json",
);

console.log(
  `fotos · ${conFotos} profesionales y ${recepcion} de recepción con foto 1`,
);
