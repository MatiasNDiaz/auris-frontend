// @ts-check
/**
 * Prefijo de archivo de fotos de cada profesional: el nombre que va antes del
 * guion bajo en `[Nombre]_[número].webp` (ver
 * `docs/modus-operandi-imagenes-profesionales.md`).
 *
 * Se arma a mano, no automáticamente: nombre de pila, sin tildes. Cuando dos
 * profesionales comparten nombre de pila —hoy pasa con "Eugenia"— se le suma
 * la inicial del apellido para que sus fotos no se pisen (`EugeniaL` para
 * Leiva, `EugeniaV` para Villalobos).
 *
 * Al sumar un profesional nuevo: agregar su fila acá con la misma regla —
 * nombre de pila solo si es único en el equipo, o nombre + inicial de
 * apellido si ya hay alguien con ese mismo nombre de pila—.
 *
 * Es un archivo `.mjs` (no `.ts`) para que lo pueda importar tal cual tanto el
 * código de Next (`fotos-profesional.ts`) como el script de Node que arma el
 * manifiesto de fotos antes de `dev`/`build` (`scripts/fotos-profesionales.mjs`),
 * sin pasar por el compilador de TypeScript.
 *
 * @type {Record<string, string>} slug del profesional → prefijo de sus fotos
 */
export const PREFIJO_FOTO = {
  "ariel-vidal": "Ariel",
  "carla-fernandez": "Carla",
  "claudia-tomasi": "Claudia",
  "laura-mansilla": "Laura",
  "eugenia-leiva": "EugeniaL",
  "romina-tchakerian": "Romina",
  "eugenia-villalobos": "EugeniaV",
  "tomas-garcia": "Tomas",
  "daniela-giansetto": "Daniela",
  "rocio-matteucci": "Rocio",
  "santiago-rodriguez": "Santiago",
  "soledad-di-martino": "Soledad",
};
