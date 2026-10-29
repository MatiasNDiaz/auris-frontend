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
import { rename, stat, unlink, writeFile } from "node:fs/promises";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
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
/** Dónde queda la lista de variantes que lee el loader de `next/image`. */
const MANIFIESTO_WEB = path.join(RAIZ, "src", "generated", "image-manifest.json");

/** Calidad WebP, de 1 a 100. 88 mantiene la piel y el pelo sin artefactos. */
const CALIDAD = Number(process.env.IMG_QUALITY ?? 88);

/**
 * Calidad de las fotos de personas, más baja que la del resto.
 *
 * Medido sobre el retrato de Ariel a 1080px: 92 pesa 141 KB, 82 pesa 77 KB y
 * la diferencia es de 1,13 niveles sobre 255 (PSNR 42,7 dB; por encima de 40
 * no se distingue). Los banners se quedan en 88 porque tienen grano —los
 * nocturnos sobre todo— y ahí 82 sí baja de los 40 dB.
 *
 * Tiene que coincidir con `CALIDAD_FOTO` de `src/lib/calidad-foto.ts`.
 */
const CALIDAD_PERSONAS = Number(process.env.IMG_QUALITY_PERSONAS ?? 82);

/** Carpetas cuyas fotos son de personas. */
const CARPETAS_PERSONAS = new Set(["profesionales", "recepcionistas"]);

/**
 * Los anchos a los que se pregenera cada foto.
 *
 * Es la misma lista que `imageSizes` + `deviceSizes` en `next.config.ts`, y no
 * es casualidad: `next/image` arma el `srcset` con esa lista, así que cualquier
 * ancho que esté allá y no acá terminaría apuntando a un archivo que no existe.
 * Si se toca una, hay que tocar la otra.
 *
 * Nunca se agranda: de cada foto sólo salen los escalones más chicos que ella.
 */
const ESCALERA = [384, 640, 1080, 1920];

/**
 * El escalón de 128 es sólo para el recorrido virtual, que muestra miniaturas
 * de 64px. Para el resto del sitio sobra: la foto más chica que se dibuja en
 * cualquier otro lado son los 360px del abanico de servicios.
 */
const CARPETAS_MINIATURA = new Set(["instalaciones", "recorrido"]);

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
 *   cabeza  cuánto recortarle por arriba. Sirve para sacarle el techo o la
 *           pared de más a una toma abierta, que en una franja apaisada deja a
 *           la persona chica y perdida en el medio. Se aplica antes que
 *           `arriba`, así que también sirve para limpiar la primera fila de
 *           píxeles cuando tiene algo colgado —un aplique, un estante— que al
 *           estirarse dejaría un chorreado vertical
 *   arriba  cuánto fondo agregarle por encima, estirando la fila de píxeles
 *           de más arriba (en estas tomas, pared lisa)
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
  /*
   * FOTOS 1 DE PROFESIONAL: misma proporción y la cabeza a la misma altura.
   *
   * La foto 1 es la que va en el acordeón de la home, y ahí el panel cambia de
   * forma: arranca angosto y al pasar el cursor se ensancha. Con `object-cover`
   * eso tiene dos consecuencias, y las dos dependen de la foto, no del CSS.
   *
   * 1. El zoom del hover es emergente. La escala es
   *    `max(anchoPanel/anchoFoto, altoPanel/altoFoto)`: mientras manda el alto,
   *    la foto se dibuja de `altoPanel x proporción` de ancho y ensanchar el
   *    panel sólo recorta a los costados; recién cuando el panel supera ese
   *    ancho pasa a mandar el ancho y la foto crece. Con 0,562 ese cruce cae
   *    dentro del recorrido del hover y la foto se agranda; con una foto casi
   *    cuadrada el cruce no llega nunca y se queda quieta. Por eso todas
   *    terminan en 0,562: es lo que hace que el efecto sea el mismo para todas.
   *
   * 2. La cabeza queda donde diga la foto. Con `object-position` en el 50%, el
   *    panel ancho muestra la franja del 25% al 75% de la foto y a quien tenga
   *    la cabeza más arriba se la corta. La solución no es mover el foco de a
   *    una —eso cambia con el ancho de la pantalla—, sino dejar todas las
   *    cabezas en la misma fracción del alto: el 27%. Con eso, y con el foco
   *    en ese mismo 27% en el acordeón, la cabeza cae siempre en el 27% del
   *    panel, esté colapsado, expandido o en la pantalla que sea.
   *
   * De las once, ocho ya venían en 0,562 y con la cabeza entre el 26,4% y el
   * 27,9%: ésas no se tocan. Acá están las que se iban de ahí.
   */
  // Cabeza en el 22,6%: es la más alta de todas y la que primero se cortaba.
  // El aire de arriba la baja al 27% y el recorte de abajo —la misma
  // fracción— le devuelve la proporción, así que el tamaño no cambia.
  "profesionales/ariel-vidal/ARIEL-1": { arriba: 0.044, abajo: 0.044 },
  // Lo mismo, desde el 23,3%.
  "profesionales/santiago-rodriguez/santiago-1": {
    arriba: 0.037,
    abajo: 0.037,
  },
  // Al revés: con la cabeza en el 29,6% sobraba pared por encima. Se le corta
  // esa franja y los costados en la misma proporción, que es lo que mantiene
  // el 0,562.
  "profesionales/carla-fernandez/carla-1": { cabeza: 0.036, ancho: 0.964 },
  // De cuerpo entero y sin aire arriba: se le suma cielo y se le cortan las
  // piernas para que quede del mismo tamaño que las demás del equipo. El
  // recorte de los costados es el que sostiene el 0,562.
  "profesionales/claudia-tomasi/claudia-1": {
    arriba: 0.14,
    abajo: 0.41,
    ancho: 0.616,
  },
  // También con la cabeza pegada al borde de arriba, y con un plano más
  // cerrado que el resto. El aire la baja al 27%; el recorte de abajo es el
  // que la deja en 0,562, porque su toma viene más angosta (0,667).
  "profesionales/romina-tchakerian/romina-1": { arriba: 0.237, abajo: 0.052 },
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
  // Yanina sí está cerca del centro del cuadro (58% del ancho), así que acá no
  // hace falta recorte: sin él, de cuerpo entero, la tarjeta ya la muestra
  // igual que a Leticia y Soledad. La foto que tenía antes de ella —con otro
  // encuadre, más lejos— sí lo necesitaba; a esta un recorte angosto (0,56) la
  // dejaba con un aspecto tan alto y angosto que la tarjeta, al cubrir su
  // caja 4:5, terminaba mostrando sólo el busto.
  // Su foto 1 es la única apaisada del equipo (1600x1200) y es la que no se
  // agrandaba en el hover: quedaba en 0,994, casi cuadrada, y el panel nunca
  // llegaba a ensancharla. El recorte de los costados la lleva a 0,562 y el
  // aire de arriba le baja la cabeza al 27%, como a las demás.
  //
  // El `cabeza` no recorta nada que importe: se come los 48 píxeles de arriba,
  // donde asoma el aplique de la pared. Va primero, así lo que se estira para
  // hacer el aire es pared lisa y no ese caño, que dejaba un chorreado
  // vertical sobre su hombro.
  //
  // `centroX` porque la ventana es angosta y ella está apenas corrida a la
  // izquierda del cuadro.
  "profesionales/eugenia-villalobos/EugeniaV-1": {
    cabeza: 0.04,
    arriba: 0.302,
    ancho: 0.533,
    centroX: 0.47,
  },
  // La 2 es la del cruce al pasar el cursor en el listado, y viene de otra
  // toma (896x1189). Con este encuadre ya queda en 0,562 y con la cabeza en el
  // 26,5%, que es donde está la 1: por eso lleva números propios y no los de
  // arriba.
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

  // El alto real es el de después de aplicar la orientación EXIF, y con una
  // foto de teléfono eso puede significar el ancho: `metadata()` describe el
  // archivo, no lo que se va a ver.
  const info = await sharp(original, { failOn: "none" }).metadata();
  const acostada = (info.orientation ?? 1) >= 5;
  const width = (acostada ? info.height : info.width) ?? 0;
  const height = (acostada ? info.width : info.height) ?? 0;

  const sumar = Math.round(height * arriba);
  const cortar = Math.round(height * abajo);
  const quitar = Math.round(height * cabeza);

  // El recorte de arriba va en esta misma cadena y no en un paso aparte: cada
  // `toBuffer()` intermedio vuelve a comprimir la foto y le suma una
  // generación de pérdida.
  //
  // Va antes de agregar el aire, así lo que se estira es la primera fila que
  // queda y no la original. Es la diferencia entre copiar pared lisa y copiar
  // lo que estuviera colgado en el borde de la toma.
  const base = sharp(original, { failOn: "none" }).rotate();
  const recortada = quitar
    ? base.extract({ left: 0, top: quitar, width, height: height - quitar })
    : base;

  const conAire = await (sumar
    ? recortada.extend({ top: sumar, extendWith: "copy" })
    : recortada
  ).toBuffer();

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
      top: 0,
      width: anchoFinal,
      height: height + sumar - cortar - quitar,
    })
    .toBuffer();
}

/**
 * Las carpetas de `assets/raw/images` en las que cae este original.
 * @param {string} original
 */
function carpetasDe(original) {
  return path
    .relative(ENTRADA, path.dirname(original))
    .split(path.sep)
    .map((c) => c.toLowerCase());
}

/**
 * Con qué calidad se comprime esta foto. Las de personas van más bajas que el
 * resto: la piel perdona la compresión mucho mejor que el grano de una toma
 * nocturna.
 *
 * @param {string} original
 */
function calidadDe(original) {
  const carpetas = carpetasDe(original);
  return carpetas.some((c) => CARPETAS_PERSONAS.has(c))
    ? CALIDAD_PERSONAS
    : CALIDAD;
}

/**
 * Los escalones que se generan para esta foto: la escalera común, más el de
 * 128 si es del recorrido virtual, y siempre sin pasarse del ancho que la foto
 * tiene de verdad.
 *
 * @param {string} original
 * @param {number} anchoFinal ancho de la imagen ya optimizada
 */
function anchosDe(original, anchoFinal) {
  const carpetas = carpetasDe(original);
  const escalera = carpetas.some((c) => CARPETAS_MINIATURA.has(c))
    ? [128, ...ESCALERA]
    : ESCALERA;
  return escalera.filter((w) => w < anchoFinal);
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
    /** Archivos `-<ancho>.webp` escritos en esta corrida. */
    variantes: 0,
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
    // El encuadre entra en la huella: si se cambia un recorte acá adentro, el
    // original sigue pesando y midiendo lo mismo y sin esto la foto quedaba
    // como estaba hasta que alguien se acordara de borrar el `.webp` a mano.
    const encuadre = encuadreDe(original);
    const recorte = Object.keys(encuadre).length
      ? `:enc${JSON.stringify(encuadre)}`
      : "";
    const calidad = calidadDe(original);
    // La escalera también entra en la huella: si se agrega o se saca un
    // escalón, el original sigue igual y sin esto las fotos ya hechas se
    // quedarían sin la variante nueva.
    const ajustes = `webp:q${calidad}:max${max}${recorte}:esc${ESCALERA.join("-")}`;
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
        .webp({ quality: calidad, effort: 6, smartSubsample: true })
        .toFile(temporal);

      await unlink(destino).catch(() => {});
      await rename(temporal, destino);

      /*
       * Las variantes salen del mismo `entrada` que el archivo grande y no de
       * él: pasar un WebP por el compresor otra vez le suma una generación de
       * pérdida, y a 384px eso se nota.
       *
       * Se llaman `nombre-w<ancho>.webp` al lado del grande, así el rewrite
       * `/imagenes/v/:version/...` las alcanza igual que a él y conservan el
       * número de versión, que es lo que permite cachearlas para siempre.
       *
       * La `w` no es decorativa: las fotos de profesional se llaman
       * `ariel-1.webp`, `ariel-2.webp`… así que un sufijo de sólo números
       * haría que `ariel-1.webp` se leyera como "la variante de 1px de
       * ariel.webp".
       */
      const salidas = [destinoRel];
      let pesoVariantes = 0;
      const anchos = anchosDe(original, resultado.width);

      // Barrer las variantes de una escalera anterior: si no, un escalón que
      // se sacó de la lista queda en `public/` y se despliega para siempre.
      const nombreBase = path.basename(destino, ".webp");
      for (const vecino of readdirSync(path.dirname(destino))) {
        const suelta = vecino.match(/^(.+)-w(\d+)\.webp$/);
        if (!suelta || suelta[1] !== nombreBase) continue;
        if (anchos.includes(Number(suelta[2]))) continue;
        await unlink(path.join(path.dirname(destino), vecino)).catch(() => {});
      }

      for (const w of anchos) {
        const archivo = destino.replace(/\.webp$/, `-w${w}.webp`);
        const parcial = archivo + ".part";
        await sharp(entrada, { failOn: "none" })
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .sharpen({ sigma: 0.8, m1: 0.6, m2: 2.2 })
          .webp({ quality: calidad, effort: 6, smartSubsample: true })
          .toFile(parcial);
        await unlink(archivo).catch(() => {});
        await rename(parcial, archivo);
        salidas.push(relativa(archivo));
        pesoVariantes += await tamano(archivo);
        totales.variantes++;
      }

      const antes = info.size;
      const despues = (await tamano(destino)) + pesoVariantes;
      // `metadata` da las medidas antes de girar; si la orientación EXIF es
      // 5 a 8 la foto va de costado y ancho y alto están cruzados.
      const girada = (meta.orientation ?? 1) >= 5;
      const origW = girada ? meta.height : meta.width;
      const origH = girada ? meta.width : meta.height;
      const reescalada = resultado.width !== origW;

      console.log(`✓ ${clave}`);
      console.log(
        `    → ${destinoRel}  [${preset} ${max}px q${calidad}]  ${origW}×${origH}${reescalada ? ` → ${resultado.width}×${resultado.height}` : " (sin reescalar)"}`,
      );
      if (salidas.length > 1) {
        console.log(
          `    + ${salidas.length - 1} variantes (${anchos.join(", ")}px)  ${peso(pesoVariantes)}`,
        );
      }
      console.log(
        `    ${peso(antes)} → ${peso(despues)}  (${reduccion(antes, despues)})`,
      );

      manifiesto.anotar(clave, info, ajustes, salidas);
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
  await escribirManifiestoWeb(sharp);
  imprimirResumen("optimize:images", totales);
  console.log(`  variantes escritas ${totales.variantes}`);
  if (totales.errores) process.exitCode = 1;
}

/**
 * Deja en `src/generated/image-manifest.json` qué variantes existe de cada
 * foto. Es lo único que el loader de `next/image` tiene para saber a qué
 * archivo apuntar, porque en el navegador no hay forma de preguntar si una
 * ruta existe antes de pedirla.
 *
 * Se arma recorriendo `public/images` y no acumulando lo de esta corrida: así
 * sale bien igual cuando no se procesó nada —que es el caso normal— y se
 * entera si alguien borró una variante a mano.
 *
 * @param {import("sharp").default} sharp
 */
async function escribirManifiestoWeb(sharp) {
  /** @type {Record<string, { w: number, h: number, v: number[] }>} */
  const mapa = {};
  /** @type {Map<string, number[]>} ruta del archivo grande -> anchos sueltos */
  const variantes = new Map();
  /** @type {string[]} */
  const grandes = [];

  const recorrerCarpeta = (/** @type {string} */ dir) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entrada.name);
      if (entrada.isDirectory()) {
        recorrerCarpeta(p);
        continue;
      }
      if (!entrada.name.endsWith(".webp")) continue;
      const suelta = entrada.name.match(/^(.+)-w(\d+)\.webp$/);
      if (suelta) {
        const base = path.join(dir, `${suelta[1]}.webp`);
        const lista = variantes.get(base) ?? [];
        lista.push(Number(suelta[2]));
        variantes.set(base, lista);
      } else {
        grandes.push(p);
      }
    }
  };
  if (existsSync(SALIDA)) recorrerCarpeta(SALIDA);

  for (const grande of grandes.sort()) {
    const clave = path.relative(SALIDA, grande).split(path.sep).join("/");
    const meta = await sharp(grande).metadata();
    mapa[clave] = {
      w: meta.width ?? 0,
      h: meta.height ?? 0,
      v: (variantes.get(grande) ?? []).sort((a, b) => a - b),
    };
  }

  mkdirSync(path.dirname(MANIFIESTO_WEB), { recursive: true });
  // Una clave por línea: el archivo va al repo y un diff de una sola foto
  // tiene que leerse como una sola línea cambiada.
  const cuerpo = Object.entries(mapa)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
    .join(",\n");
  await writeFile(MANIFIESTO_WEB, `{\n${cuerpo}\n}\n`, "utf8");
  console.log(
    `  manifiesto ${relativa(MANIFIESTO_WEB)} · ${grandes.length} fotos`,
  );
}

await main();
