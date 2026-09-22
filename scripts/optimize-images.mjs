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
/** @type {Record<string, keyof typeof PRESETS>} */
const PRESET_POR_CARPETA = {
  profesionales: "retrato",
  historia: "tarjeta",
  /*
   * Los banners de sección se dibujan más anchos que la pantalla.
   *
   * Son fotos apaisadas dentro de una franja todavía más apaisada, así que se
   * ajustan por el alto y desbordan de costado: en un monitor de 1440 el de
   * preguntas frecuentes se dibuja a 1798px, y en una pantalla retina eso son
   * 3596 píxeles reales. Con el tope de 1920 de `grande` llegaban al 53%
   * —bajaban el archivo entero y aun así no alcanzaba—. Los originales son de
   * 6192px, así que hay de dónde sacar.
   */
  "banners-secciones": "panoramica",
  // `servicios` no va acá a propósito: esas fotos además de la tarjeta son el
  // banner a pantalla completa del detalle del servicio, y necesitan `grande`.
};
const PRESET_POR_DEFECTO = "grande";

const EXTENSIONES = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".tif",
  ".tiff",
]);
/**
 * Formatos que se reconocen pero no se pueden leer. Las fotos de iPhone salen
 * en HEIC, y el `sharp` precompilado no trae el decodificador HEVC —por
 * patentes, no por descuido—. Mejor avisar con nombre y apellido que dejar el
 * archivo ignorado en silencio.
 */
const NO_SOPORTADOS = new Set([".heic", ".heif"]);

/**
 * Reencuadre de fotos sueltas, en fracciones de su alto original.
 *
 *   arriba  cuánto fondo agregarle por encima, estirando la fila de píxeles
 *           de más arriba (en estas tomas, pared lisa)
 *   cabeza  cuánto recortarle por arriba. Lo contrario de `arriba`: sirve para
 *           sacarle el techo o la pared de más a una toma abierta, que en una
 *           franja apaisada deja a la persona chica y perdida en el medio
 *   abajo   cuánto recortarle por debajo
 *   ancho   qué fracción del ancho conservar
 *   centroX en qué punto del ancho original queda centrada esa fracción; 0,5
 *           —el centro— si no se dice otra cosa. Es para las tomas donde la
 *           gente está cargada a un lado y lo que sobra es pared: recortando
 *           del lado vacío quedan centradas. La ventana no se sale de la foto.
 *
 * Es para las fotos que vienen con otro encuadre que el resto: una de cuerpo
 * entero con la cabeza pegada al borde deja a esa persona chica y más arriba
 * que las demás en la grilla del equipo. Se resuelve acá, en el archivo, y no
 * con un `zoom` por CSS en el componente: al expandirse la tarjeta en el
 * hover, una imagen escalada por `transform` tiembla, porque su punto de
 * origen se mueve con el ancho en cada cuadro.
 *
 * La clave es la ruta dentro de `assets/raw/images/`, sin extensión.
 *
 * @type {Record<string, { arriba?: number, cabeza?: number, abajo?: number, ancho?: number, centroX?: number }>}
 */
const ENCUADRE = {
  /*
   * Su foto 2 es la única apaisada de las que van en tarjeta.
   *
   * La tarjeta es vertical (4:5), así que una foto 3:2 se ajusta por el alto y
   * se dibuja casi el doble de ancha que la tarjeta: en un teléfono pedía
   * 1965px de una foto que solo tiene 1536, y se veía blanda. Recortándola acá
   * a la forma de la tarjeta, lo que se descarta es la pared vacía de la
   * izquierda —ella ocupa del 45% al 85% del ancho— y ya no hay que agrandar
   * nada. Con esto tampoco hace falta `fotoHoverFoco` en `professionals.ts`.
   */
  // La clave es la ruta del archivo original tal cual está escrita, con su
  // mayúscula: acá el nombre es `Daniela-2.png`, no `daniela-2.png`.
  "profesionales/daniela-giansetto/Daniela-2": { ancho: 0.535, centroX: 0.65 },
  // Las tres del mostrador ocupan del 14% al 72% del ancho: el resto es
  // pared vacía a la derecha. El banner muestra la foto entera a lo ancho
  // —es más angosta que la franja—, así que la única forma de centrarlas es
  // sacarle ese sobrante acá. Con esta ventana el grupo queda en el medio.
  "banners-secciones/banner-recorrido": { ancho: 0.84, centroX: 0.43 },
  // Lo mismo: ella está en el 44% del ancho y del 82% para la derecha no hay
  // más que mostrador vacío. Sacándole ese borde queda centrada y la notebook
  // y las flores le siguen haciendo peso del otro lado.
  "banners-secciones/banner-contacto": { ancho: 0.88, centroX: 0.44 },
  // Toma abierta, con un tercio de pared y cartel por encima de ella. En la
  // franja apaisada eso la dejaba chica y hundida abajo. Sacándole ese techo
  // la foto queda más apaisada que la franja, así que pasa a recortarse de los
  // costados: ella se ve más cerca y entera, y el cartel sigue entrando.
  "banners-secciones/banner-preguntas-frecuentes": { cabeza: 0.32 },
  // La toma va de techo a piso y el equipo ocupa del 22% —donde arranca el
  // logo de la pared— al 88%. Sacándole el techo y un poco de piso, lo que
  // importa entra en un banner bastante más bajo, que es lo que permite que
  // el texto quede a la misma altura que en las otras secciones.
  // El recorte de arriba llega justo hasta el spot del techo: un pelo más y
  // le come la punta al logo de la pared, que arranca cinco píxeles debajo.
  "banners-secciones/banner-profesionales": { cabeza: 0.215, abajo: 0.05 },
  // De cuerpo entero y sin aire arriba: se le suma cielo y se le cortan las
  // piernas para que quede como las demás del equipo.
  //
  // El recorte de los costados la deja con la misma forma vertical que el
  // resto (0,562). No es un capricho: en el carrusel de la home el panel
  // muestra la foto a lo alto, y al expandirse llega un punto en que pasa a
  // recortarla a lo ancho y ahí se agranda sola. Ese es el efecto de hover de
  // todas las tarjetas. Con la foto casi cuadrada ese punto nunca llegaba y la
  // suya se quedaba quieta. Cortando de los lados —y no de arriba y abajo— el
  // tamaño al que se la ve no cambia.
  "profesionales/claudia-tomasi/claudia-1": {
    arriba: 0.16,
    abajo: 0.43,
    ancho: 0.616,
  },
  // También con la cabeza pegada al borde de arriba, y con un plano más
  // cerrado que el resto. El aire de arriba resuelve las dos cosas a la vez:
  // la baja hasta la altura de las demás y, al hacer la foto más alta, la deja
  // del mismo tamaño en la tarjeta.
  "profesionales/romina-tchakerian/romina-1": { arriba: 0.303 },
  // Recepción: las tres están paradas contra la pared del logo pero ninguna en
  // el centro del cuadro, y la tarjeta del listado es vertical. En las dos
  // tomas verticales la tarjeta muestra el ancho completo, así que no hay
  // `object-position` que las centre: el recorte tiene que hacerse acá. A
  // Soledad, además, la toma apaisada la dejaba ocupando un quinto del cuadro.
  //
  // Las dos fotos de cada una llevan el mismo recorte: la 2 es la del cruce al
  // pasar el cursor y con otro encuadre el cambio daba un salto.
  "recepcionistas/leticia-loza/Leticia-1": { ancho: 0.78, centroX: 0.61 },
  "recepcionistas/leticia-loza/Leticia-2": { ancho: 0.78, centroX: 0.61 },
  "recepcionistas/soledad-lluch/Soledad-1": { ancho: 0.38, centroX: 0.475 },
  "recepcionistas/soledad-lluch/Soledad-2": { ancho: 0.38, centroX: 0.475 },
  "recepcionistas/yanina-solari/Yanina-1": { ancho: 0.56, centroX: 0.715 },
  "recepcionistas/yanina-solari/Yanina-2": { ancho: 0.56, centroX: 0.715 },
  // Sus dos fotos vienen en 0,754 y con poco aire arriba: queda más chica y
  // más alta que el resto del equipo. El aire la baja a la altura de las
  // demás y el recorte de los costados la deja en 0,562, la proporción del
  // resto. Las dos llevan el mismo encuadre: la 2 es la que aparece en el
  // hover, y con otro recorte el cruce entre una y otra daba un salto.
  "profesionales/eugenia-villalobos/EugeniaV-1": { arriba: 0.2, ancho: 0.895 },
  "profesionales/eugenia-villalobos/EugeniaV-2": { arriba: 0.2, ancho: 0.895 },
};

/** @param {string} original */
function encuadreDe(original) {
  const clave = path
    .relative(ENTRADA, original)
    .split(path.sep)
    .join("/")
    .replace(/\.[^.]+$/, "");
  return ENCUADRE[clave] ?? {};
}

/**
 * Devuelve la foto ya reencuadrada —con el aire de arriba agregado y el
 * recorte de abajo hecho—, lista para el resto del pipeline. Sin encuadre
 * definido devuelve la ruta original, sin tocar nada.
 *
 * `sharp` llega por parámetro: el script lo carga con un import dinámico
 * dentro de `main`, para no pagar su costo cuando no hay nada que procesar.
 *
 * @param {import("sharp").default} sharp
 * @param {string} original
 * @param {{ arriba?: number, cabeza?: number, abajo?: number, ancho?: number, centroX?: number }} encuadre
 * @returns {Promise<string | Buffer>}
 */
async function reencuadrar(sharp, original, encuadre) {
  const {
    arriba = 0,
    cabeza = 0,
    abajo = 0,
    ancho = 1,
    centroX = 0.5,
  } = encuadre;
  if (!arriba && !cabeza && !abajo && ancho === 1) return original;

  // `.rotate()` primero: con una foto de teléfono, el alto real es el de
  // después de aplicar la orientación EXIF.
  const derecha = await sharp(original, { failOn: "none" }).rotate().toBuffer();
  const { width = 0, height = 0 } = await sharp(derecha).metadata();
  const sumar = Math.round(height * arriba);
  const cortar = Math.round(height * abajo);

  const conAire = sumar
    ? await sharp(derecha).extend({ top: sumar, extendWith: "copy" }).toBuffer()
    : derecha;

  const quitar = Math.round(height * cabeza);
  const anchoFinal = Math.round(width * ancho);
  // La ventana se centra en `centroX`, pero sin salirse de la foto: contra el
  // borde se apoya y no deja una franja vacía.
  const izquierda = Math.min(
    Math.max(Math.round(width * centroX - anchoFinal / 2), 0),
    width - anchoFinal,
  );

  return sharp(conAire)
    .extract({
      left: izquierda,
      top: quitar,
      width: anchoFinal,
      height: height + sumar - cortar - quitar,
    })
    .toBuffer();
}

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
  const carpetas = path
    .relative(ENTRADA, path.dirname(original))
    .split(path.sep);
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
  const totales = {
    procesados: 0,
    salteados: 0,
    errores: 0,
    antes: 0,
    despues: 0,
  };
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
      const encuadre = encuadreDe(original);

      // El reencuadre va en su propia pasada, no encadenado con el resto:
      // sharp aplica sus operaciones en un orden fijo —recorta antes de
      // extender— sin importar cómo se las escriba, así que encadenarlo daba
      // un alto distinto del pedido.
      const entrada = await reencuadrar(sharp, original, encuadre);

      const resultado = await sharp(entrada, { failOn: "none" })
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
      console.log(
        `    ${peso(antes)} → ${peso(despues)}  (${reduccion(antes, despues)})`,
      );

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
