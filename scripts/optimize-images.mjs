// @ts-check
/**
 * Optimiza las imágenes nuevas del centro.
 *
 *   assets/raw/images/**   originales, tal como llegan (no van al repo)
 *   public/images/**       WebP listo para usar en el código
 *
 * Uso:
 *   npm run optimize:images
 *   npm run optimize:images -- --force           rehace todo
 *   npm run optimize:images -- --preset=retrato  un preset para todo el lote
 *   IMG_QUALITY=85 npm run optimize:images       otra calidad
 *
 * Cada subcarpeta mantiene su lugar: `assets/raw/images/profesionales/x.jpg`
 * sale como `public/images/profesionales/x.webp`.
 */
import { rename, stat, unlink } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  RAIZ,
  abrirManifiesto,
  flags,
  imprimirResumen,
  peso,
  recorrer,
  reduccion,
  relativa,
  rutaDeSalida,
  tamano,
} from "./lib/media.mjs";

const ENTRADA = path.join(RAIZ, "assets", "raw", "images");
const SALIDA = path.join(RAIZ, "public", "images");

/** Calidad WebP, de 1 a 100. 88 mantiene la piel y el pelo sin artefactos. */
const CALIDAD = Number(process.env.IMG_QUALITY ?? 88);

/**
 * Presets de tamaño: el lado más largo nunca pasa de `max`. Una imagen más
 * chica que eso se deja en su tamaño —agrandar no agrega detalle, solo peso—.
 */
const PRESETS = {
  /** Hero, galería, recorrido virtual: se ven a pantalla completa. */
  grande: { max: 1920 },
  /** Tarjetas de la línea de tiempo: media pantalla como mucho. */
  tarjeta: { max: 1200 },
  /**
   * Fotos de profesionales. 2000 en el lado largo y no 1000: una foto de
   * teléfono es 9:16, así que con 1000 de alto quedaba en 562 de ancho —menos
   * de lo que la ficha dibuja en una pantalla retina, donde el hero pide unos
   * 920px—. Con 2000 de lado largo esa misma foto sale 1125 de ancho y entra
   * nítida en todos lados.
   */
  retrato: { max: 2000 },
  /**
   * Banner de la ficha: ocupa el ancho completo de la pantalla. Como suele ser
   * una foto vertical, el lado largo es el alto, y hace falta pasarse de 1920
   * para que el ancho llegue a cubrir un monitor grande.
   */
  panoramica: { max: 2560 },
};

/**
 * Qué preset usa cada subcarpeta. Se busca en cualquier nivel de la ruta, así
 * que `equipo/profesionales/ana.jpg` también sale como retrato. Lo que no
 * coincide con ninguna va como `grande`, que es el caso de más calidad: si una
 * carpeta nueva queda sin mapear, se equivoca para el lado seguro.
 */
const PRESET_POR_CARPETA = {
  profesionales: "retrato",
  historia: "tarjeta",
  // `servicios` no va acá a propósito: esas fotos además de la tarjeta son el
  // banner a pantalla completa del detalle del servicio, y necesitan `grande`.
};
const PRESET_POR_DEFECTO = "grande";

const EXTENSIONES = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
/**
 * Formatos que se reconocen pero no se pueden leer. Las fotos de iPhone salen
 * en HEIC, y el `sharp` precompilado no trae el decodificador HEVC —por
 * patentes, no por descuido—. Mejor avisar con nombre y apellido que dejar el
 * archivo ignorado en silencio.
 */
const NO_SOPORTADOS = new Set([".heic", ".heif"]);

/** @param {string} original */
function presetDe(original) {
  const forzado = flags().preset;
  if (forzado) {
    if (!(forzado in PRESETS)) {
      console.error(
        `✗ preset "${forzado}" no existe. Opciones: ${Object.keys(PRESETS).join(", ")}`,
      );
      process.exit(1);
    }
    return /** @type {keyof typeof PRESETS} */ (forzado);
  }
  const carpetas = path.relative(ENTRADA, path.dirname(original)).split(path.sep);
  // La imagen 6 de un profesional (`Nombre_6` o `Nombre-6`) es el fondo del
  // banner de su ficha, que ocupa todo el ancho de la pantalla y necesita más
  // resolución que un retrato. Ver docs/modus-operandi-imagenes-profesionales.md.
  if (
    carpetas.some((carpeta) => carpeta.toLowerCase() === "profesionales") &&
    /[_-]6$/.test(path.parse(original).name)
  ) {
    return "panoramica";
  }
  for (const carpeta of carpetas) {
    const p = PRESET_POR_CARPETA[carpeta.toLowerCase()];
    if (p) return /** @type {keyof typeof PRESETS} */ (p);
  }
  return PRESET_POR_DEFECTO;
}

async function main() {
  const { validos, otros } = await recorrer(ENTRADA, EXTENSIONES);

  for (const o of otros) {
    const ext = path.extname(o).toLowerCase();
    console.warn(
      NO_SOPORTADOS.has(ext)
        ? `⚠ ${relativa(o)}: HEIC no se puede leer. En el iPhone: Ajustes › Cámara › Formatos › "Más compatible", o exportala como JPG.`
        : `⚠ ${relativa(o)}: no es una imagen soportada, se ignora.`,
    );
  }

  // El caso normal en Vercel: la carpeta no existe porque no está en el repo.
  // Sale antes de cargar `sharp` para no sumarle nada al build.
  if (!validos.length) {
    console.log("optimize:images · nada que procesar en assets/raw/images");
    return;
  }

  const { default: sharp } = await import("sharp");
  const { force } = flags();
  const manifiesto = abrirManifiesto("images");
  const totales = { procesados: 0, salteados: 0, errores: 0, antes: 0, despues: 0 };
  /** Para detectar dos originales que terminarían en el mismo archivo. */
  const destinos = new Map();

  console.log(
    `optimize:images · ${validos.length} ${validos.length === 1 ? "imagen" : "imágenes"} · calidad ${CALIDAD}\n`,
  );

  for (const original of validos) {
    const clave = relativa(original);
    const preset = presetDe(original);
    const { max } = PRESETS[preset];
    const destino = rutaDeSalida(original, ENTRADA, SALIDA, ".webp");
    const destinoRel = relativa(destino);
    const ajustes = `webp:q${CALIDAD}:max${max}`;
    const info = await stat(original);

    if (destinos.has(destinoRel)) {
      console.error(
        `✗ ${clave}: saldría como ${destinoRel}, igual que ${destinos.get(destinoRel)}. Renombrá uno de los dos.`,
      );
      totales.errores++;
      continue;
    }
    destinos.set(destinoRel, clave);

    if (!force && manifiesto.alDia(clave, info, ajustes)) {
      totales.salteados++;
      continue;
    }

    // No pisar algo que ya estaba en public/ y que no escribió el pipeline:
    // sería reemplazar en silencio una imagen que el sitio ya usa.
    if (existsSync(destino) && !manifiesto.esNuestra(destinoRel) && !force) {
      console.warn(
        `⚠ ${clave}: ${destinoRel} ya existe y no lo generó este script. No se toca; renombrá el original o usá --force.`,
      );
      totales.errores++;
      continue;
    }

    try {
      mkdirSync(path.dirname(destino), { recursive: true });
      const temporal = destino + ".part";
      const meta = await sharp(original).metadata();
      const resultado = await sharp(original, { failOn: "none" })
        // Aplica la orientación EXIF y la descarta: una foto de teléfono
        // sacada en vertical se guarda "acostada" con una marca que dice
        // cómo girarla, y al quitar los metadatos se perdería esa marca.
        .rotate()
        .resize({
          width: max,
          height: max,
          fit: "inside",
          withoutEnlargement: true,
        })
        // Achicar una foto siempre la ablanda: al promediar píxeles se pierde
        // el micro-contraste de los bordes. Este enfoque suave lo devuelve, y
        // es lo que hace que una foto de 6000px se siga viendo nítida en 2000.
        // Los valores son conservadores a propósito: más que esto empieza a
        // marcar halos en los contornos y a resaltar el ruido de la piel.
        .sharpen({ sigma: 0.8, m1: 0.6, m2: 2.2 })
        .webp({ quality: CALIDAD, effort: 6, smartSubsample: true })
        .toFile(temporal);

      await unlink(destino).catch(() => {});
      await rename(temporal, destino);

      const antes = info.size;
      const despues = await tamano(destino);
      // `metadata` da las medidas antes de girar; si la orientación EXIF es
      // 5 a 8 la foto va de costado y ancho y alto están cruzados.
      const girada = (meta.orientation ?? 1) >= 5;
      const origW = girada ? meta.height : meta.width;
      const origH = girada ? meta.width : meta.height;
      const reescalada = resultado.width !== origW;

      console.log(`✓ ${clave}`);
      console.log(
        `    → ${destinoRel}  [${preset} ${max}px]  ${origW}×${origH}${reescalada ? ` → ${resultado.width}×${resultado.height}` : " (sin reescalar)"}`,
      );
      console.log(`    ${peso(antes)} → ${peso(despues)}  (${reduccion(antes, despues)})`);

      manifiesto.anotar(clave, info, ajustes, [destinoRel]);
      totales.procesados++;
      totales.antes += antes;
      totales.despues += despues;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error(`✗ ${clave}: ${mensaje}`);
      totales.errores++;
    }
  }

  manifiesto.guardar();
  imprimirResumen("optimize:images", totales);
  if (totales.errores) process.exitCode = 1;
}

await main();
