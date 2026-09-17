import { existsSync } from "node:fs";
import path from "node:path";
import { PREFIJO_FOTO } from "./data/prefijo-foto.mjs";

/**
 * Las 6 fotos de la ficha de un profesional, por número.
 *
 * Cada una va en `public/images/profesionales/<slug>/`, nombrada
 * `<prefijo>-<número>.<extensión>` — por ejemplo `ariel-1.webp` para la
 * primera foto de Ariel Vidal. El prefijo de cada profesional está en
 * `./data/prefijo-foto.mjs`. La convención completa, con el propósito de cada
 * una de las 6, está documentada en
 * `docs/modus-operandi-imagenes-profesionales.md`.
 *
 * Se acepta cualquiera de estas extensiones, en este orden de preferencia. Lo
 * que no existe queda `undefined` y la ficha dibuja un placeholder en su lugar.
 *
 * Solo corre en el servidor. En desarrollo se lee en cada request, así que una
 * foto nueva aparece al recargar la ficha.
 */
export const EXTENSIONES_FOTO = ["webp", "avif", "jpg", "jpeg", "png"] as const;

export type FotosProfesional = {
  /** Imagen 1: la foto oficial, la que se ve en todo el sitio. */
  hero?: string;
  /**
   * Imagen 2: alterna con la 1 en el hero de la ficha, en loop, y se muestra
   * fija mientras dura el hover.
   */
  heroHover?: string;
  /** Imágenes 3, 4 y 5: la grande del mosaico y las dos chicas, en ese orden. */
  grilla: [string | undefined, string | undefined, string | undefined];
  /** Imagen 6: fondo del banner. */
  banner?: string;
  /**
   * La sección de cifras no tiene foto propia: reusa una de las 6. Por defecto
   * la 1, que ya viene en formato vertical; ver `FOTO_CIFRAS` para las
   * excepciones.
   */
  cifras?: string;
};

/**
 * Qué foto reusa la sección de cifras, para quien no quiera la 1.
 *
 * La 1 es la que abre la ficha, así que en algunas queda repetida; acá se
 * elige otra de las 6 —cualquiera sirve, el recuadro es vertical y recorta
 * sola—.
 */
const FOTO_CIFRAS: Record<string, number> = {
  "soledad-di-martino": 6,
};

function buscar(slug: string, base: string) {
  for (const extension of EXTENSIONES_FOTO) {
    const archivo = `${base}.${extension}`;
    const ruta = path.join(
      process.cwd(),
      "public",
      "images",
      "profesionales",
      slug,
      archivo,
    );
    if (existsSync(ruta)) return `/images/profesionales/${slug}/${archivo}`;
  }
  return undefined;
}

export function fotosDeProfesional(slug: string): FotosProfesional {
  const prefijo = (PREFIJO_FOTO as Record<string, string>)[slug];

  // Un slug sin prefijo asignado —alguien nuevo que todavía no se sumó a
  // `prefijo-foto.mjs`— no tiene de dónde leer sus fotos: todo placeholder.
  if (!prefijo) return { grilla: [undefined, undefined, undefined] };

  const base = prefijo.toLowerCase();
  const porNumero = (numero: number) => buscar(slug, `${base}-${numero}`);
  const imagen1 = porNumero(1);

  return {
    hero: imagen1,
    heroHover: porNumero(2),
    grilla: [porNumero(3), porNumero(4), porNumero(5)],
    banner: porNumero(6),
    cifras: porNumero(FOTO_CIFRAS[slug] ?? 1) ?? imagen1,
  };
}
