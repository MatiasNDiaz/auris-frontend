/**
 * Calidad con la que Next vuelve a comprimir las fotos del equipo al servirlas.
 *
 * Su valor por defecto es 75, que en un retrato grande se nota: la piel se
 * empasta y el pelo se llena de ruido. 92 lo resuelve y sigue pesando bastante
 * menos que el original.
 *
 * Cada valor que se use tiene que estar declarado en `images.qualities` de
 * `next.config.ts`, o Next 16 devuelve un error al pedir la imagen.
 */
export const CALIDAD_FOTO = 92;
