/**
 * Prefijo de los archivos de foto de cada persona de recepción.
 *
 * Misma convención que `prefijo-foto.mjs` para los profesionales: los archivos
 * se llaman `<prefijo>-1.jpg` y `<prefijo>-2.jpg` dentro de
 * `assets/raw/images/recepcionistas/<slug>/`, y el optimizador los deja en
 * `public/images/recepcionistas/<slug>/` en minúscula.
 *
 * Acá alcanza con dos fotos por persona: la 1 para la tarjeta y la 2 para el
 * cruce al pasar el cursor. No tienen ficha propia, así que no se usan las
 * seis que sí lleva un profesional.
 *
 * Va en `.mjs` y no en `.ts` porque también lo lee el script de Node que
 * genera el manifiesto, antes de que exista cualquier compilación.
 */
export const PREFIJO_FOTO_RECEPCION = {
  "leticia-loza": "Leticia",
  "soledad-lluch": "Soledad",
  "yanina-solari": "Yanina",
};
