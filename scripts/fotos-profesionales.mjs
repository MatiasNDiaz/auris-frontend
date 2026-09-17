// @ts-check
/**
 * Genera `src/lib/data/fotos-profesionales.generated.json`: qué profesionales
 * tienen su imagen 1 (`<prefijo>-1.*`, ver `prefijo-foto.mjs`) en
 * `public/images/profesionales/<slug>/`.
 *
 * Lo usan las tarjetas del equipo (componentes de cliente, que no pueden leer
 * el disco) para mostrar la misma foto que el hero de la ficha. La ficha en sí
 * no depende de este archivo: lee las fotos directo del disco.
 *
 * Corre solo antes de `npm run dev` y de `npm run build`.
 */
import { existsSync, writeFileSync } from "node:fs";
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

/** @type {Record<string, { hero: string }>} */
const manifiesto = {};

for (const [slug, prefijo] of Object.entries(PREFIJO_FOTO)) {
  const base = prefijo.toLowerCase();
  const extension = EXTENSIONES.find((ext) =>
    existsSync(path.join(CARPETA, slug, `${base}-1.${ext}`)),
  );
  if (extension) {
    manifiesto[slug] = {
      hero: `/images/profesionales/${slug}/${base}-1.${extension}`,
    };
  }
}

writeFileSync(SALIDA, `${JSON.stringify(manifiesto, null, 2)}\n`);
console.log(
  `fotos-profesionales · ${Object.keys(manifiesto).length} con foto 1 (imagen por defecto)`,
);
