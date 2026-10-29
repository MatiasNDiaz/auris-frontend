/**
 * Calidad de las fotos de personas: profesionales, recepción, equipo.
 *
 * 82 y no 92. Medido sobre el retrato de Ariel a 1080px: 92 pesa 141 KB y 82
 * pesa 77 KB, con una diferencia de 1,13 niveles de gris sobre 255 (PSNR
 * 42,7 dB, cuando por encima de 40 dB la diferencia no se distingue en una
 * foto). Son 45% menos de bytes por nada.
 *
 * Los banners y las portadas van a 88 y no a 82: tienen grano —sobre todo los
 * nocturnos— y ahí 82 sí baja de los 40 dB.
 *
 * Con el loader propio este número no viaja a ningún lado: la compresión ya
 * viene hecha en el archivo que generó `optimize-images.mjs`. Se sigue pasando
 * para que el componente y el pipeline digan lo mismo, y porque las imágenes
 * remotas —si alguna vez se renderiza una— sí pasan por el optimizador.
 *
 * Cada valor que se use tiene que estar declarado en `images.qualities` de
 * `next.config.ts`, o Next 16 devuelve un error al pedir la imagen.
 */
export const CALIDAD_FOTO = 82;

/** Calidad de banners, portadas de servicio, hero e instalaciones. */
export const CALIDAD_BANNER = 88;
