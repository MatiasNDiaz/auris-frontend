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
 * Miniatura borrosa de una foto, como data URL.
 *
 * Es el cartel de "todavía estoy cargando" que `next/image` pinta mientras baja
 * la imagen de verdad. Antes era un PNG genérico verde salvia igual para todas,
 * y en la transición de una tarjeta a la ficha —que pide otra variante de la
 * misma foto y por lo tanto no la tiene en caché— lo que se veía era ese
 * rectángulo verde en lugar de la persona. Sacada de la propia foto, lo que se
 * ve durante la espera es la foto desenfocada: la imagen nunca desaparece.
 *
 * 12 píxeles de ancho: entra en ~200 bytes y, ampliada y con el desenfoque que
 * le aplica `next/image`, alcanza para reconocer el encuadre y los colores.
 *
 * @param {import("sharp").default} sharp
 * @param {string} archivo
 */
async function miniaturaBorrosa(sharp, archivo) {
  const buf = await sharp(archivo)
    .resize(12, null, { fit: "inside" })
    .webp({ quality: 45 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

/**
 * Ruta estable de una foto, sin el number de versión: es la clave del mapa de
 * miniaturas. El componente que las consume la deduce de su `src` quitándole el
 * prefijo `/imagenes/v/<versión>/`.
 *
 * @param {string} carpeta
 * @param {string} slug
 * @param {string} base
 * @param {number} numero
 */
function clave(carpeta, slug, base, numero) {
  const dir = path.join(RAIZ, "public", "images", carpeta, slug);
  const extension = EXTENSIONES.find((ext) =>
    existsSync(path.join(dir, `${base}-${numero}.${ext}`)),
  );
  return extension
    ? `${carpeta}/${slug}/${base}-${numero}.${extension}`
    : undefined;
}

/**
 * @param {string} carpeta  subcarpeta dentro de `public/images/`
 * @param {Record<string, string>} prefijos  slug -> prefijo de sus archivos
 * @param {string} salida  nombre del JSON generado
 * @param {import("sharp").default} sharp
 * @param {Record<string, string>} borrosas  mapa acumulado de miniaturas
 */
async function generar(carpeta, prefijos, salida, sharp, borrosas) {
  /** @type {Record<string, { hero: string, hover?: string }>} */
  const manifiesto = {};

  for (const [slug, prefijo] of Object.entries(prefijos)) {
    const base = prefijo.toLowerCase();
    const hero = url(carpeta, slug, base, 1);
    if (hero) manifiesto[slug] = { hero, hover: url(carpeta, slug, base, 2) };

    // Las dos que se cruzan en la tarjeta y en el hero de la ficha. Las otras
    // cuatro no llevan placeholder, así que no necesitan miniatura.
    for (const numero of [1, 2]) {
      const k = clave(carpeta, slug, base, numero);
      if (!k) continue;
      borrosas[k] = await miniaturaBorrosa(
        sharp,
        path.join(RAIZ, "public", "images", k),
      );
    }
  }

  writeFileSync(
    path.join(RAIZ, "src", "lib", "data", salida),
    `${JSON.stringify(manifiesto, null, 2)}\n`,
  );
  return Object.keys(manifiesto).length;
}

const { default: sharp } = await import("sharp");

/** @type {Record<string, string>} */
const borrosas = {};

const conFotos = await generar(
  "profesionales",
  PREFIJO_FOTO,
  "fotos-profesionales.generated.json",
  sharp,
  borrosas,
);
const recepcion = await generar(
  "recepcionistas",
  PREFIJO_FOTO_RECEPCION,
  "fotos-recepcionistas.generated.json",
  sharp,
  borrosas,
);

writeFileSync(
  path.join(RAIZ, "src", "lib", "data", "blur-fotos.generated.json"),
  `${JSON.stringify(borrosas, null, 2)}\n`,
);

console.log(
  `fotos · ${conFotos} profesionales y ${recepcion} de recepción con foto 1 · ${Object.keys(borrosas).length} miniaturas borrosas`,
);
