// @ts-check
/**
 * Optimiza los videos nuevos del centro.
 *
 *   assets/raw/videos/**   originales, tal como llegan (no van al repo)
 *   public/videos/**       MP4 H.264 + poster WebP, listos para el código
 *
 * Uso:
 *   npm run optimize:videos
 *   npm run optimize:videos -- --force     rehace todo
 *   VIDEO_CRF=24 npm run optimize:videos   más calidad (y más peso)
 *   VIDEO_AUDIO=0 npm run optimize:videos  sin audio, para fondos en loop
 *
 * Necesita `ffmpeg` y `ffprobe` instalados en el sistema: no son paquetes de
 * npm sino programas aparte. Si no están en el PATH se pueden indicar con
 * FFMPEG_PATH y FFPROBE_PATH.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { rename, stat, unlink } from "node:fs/promises";
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

const ENTRADA = path.join(RAIZ, "assets", "raw", "videos");
const SALIDA = path.join(RAIZ, "public", "videos");

const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH ?? "ffprobe";

/**
 * Calidad constante de x264: más bajo es mejor y más pesado. 23 es el
 * "visualmente sin pérdida" de referencia y 28 ya empieza a mostrar bloques en
 * degradés suaves —las paredes lisas de un consultorio son justo eso—. 26 es
 * el punto medio.
 */
const CRF = Number(process.env.VIDEO_CRF ?? 26);
/** Tope de cuadros por segundo. Un video de 60 fps pesa casi el doble y en una web no se nota. */
const MAX_FPS = Number(process.env.VIDEO_MAX_FPS ?? 30);
const CON_AUDIO = process.env.VIDEO_AUDIO !== "0";
/** Calidad del poster, igual que las imágenes. */
const CALIDAD_POSTER = Number(process.env.IMG_QUALITY ?? 80);

const EXTENSIONES = new Set([".mp4", ".mov", ".m4v", ".webm", ".mkv", ".avi"]);

/** @param {string} bin */
function disponible(bin) {
  const r = spawnSync(bin, ["-version"], { encoding: "utf8" });
  return r.status === 0;
}

/**
 * @param {string} archivo
 * @returns {{ ancho: number, alto: number, fps: number, duracion: number, hdr: boolean, audio: boolean, codec: string, transferencia: string, primarios: string, matriz: string }}
 */
function sondear(archivo) {
  const r = spawnSync(
    FFPROBE,
    ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", archivo],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );
  if (r.status !== 0) throw new Error(`ffprobe no pudo leerlo: ${r.stderr.trim()}`);
  const datos = JSON.parse(r.stdout);
  const video = datos.streams.find((s) => s.codec_type === "video");
  if (!video) throw new Error("no tiene pista de video");

  // Los teléfonos guardan el video vertical acostado y con una matriz de
  // giro aparte. ffmpeg lo endereza solo al convertir, pero para informar las
  // medidas reales hay que cruzar ancho y alto a mano.
  const giro = Math.abs(
    Number(
      video.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ??
        video.tags?.rotate ??
        0,
    ),
  );
  const acostado = giro === 90 || giro === 270;
  const [num, den] = String(video.r_frame_rate ?? "30/1").split("/").map(Number);

  return {
    ancho: acostado ? video.height : video.width,
    alto: acostado ? video.width : video.height,
    fps: den ? num / den : num,
    duracion: Number(datos.format?.duration ?? video.duration ?? 0),
    // HLG (iPhone, la mayoría de los Android) y PQ (HDR10).
    hdr: ["arib-std-b67", "smpte2084"].includes(video.color_transfer),
    audio: datos.streams.some((s) => s.codec_type === "audio"),
    codec: video.codec_name ?? "",
    transferencia: video.color_transfer ?? "",
    primarios: video.color_primaries ?? "bt2020",
    matriz: video.color_space ?? "bt2020nc",
  };
}

/** @param {ReturnType<typeof sondear>} v */
function filtros(v) {
  const cadena = [];

  if (v.hdr) {
    // HDR → SDR. Sin esto, un video HDR convertido a H.264 de 8 bits se ve
    // lavado y gris: los colores están codificados para otro rango de brillo.
    // Se pasa a luz lineal, se comprime el rango con un mapeo de tonos y se
    // vuelve a BT.709.
    //
    // `npl=203` y no 100: por norma (ITU-R BT.2408) el blanco de referencia de
    // un video HDR —una pared, un guardapolvo— está a 203 nits. Con 100 ese
    // blanco quedaba al doble de lo esperado y el mapeo lo comprimía como si
    // fuera un reflejo.
    //
    // `mobius` y no `hable`, que es lo que más se recomienda. Medido contra un
    // clip HLG de prueba armado según esa norma:
    //   hable   con npl=203   brillo -34%   error medio 53
    //   hable   con npl=100   brillo -17%   error medio 28
    //   reinhard              brillo -12%   error medio 23
    //   mobius                brillo  -5%   error medio 14
    // mobius deja intactos los medios tonos y el blanco, y solo comprime lo
    // que se pasa de ahí; hable oscurece la imagen entera.
    cadena.push(
      `zscale=tin=${v.transferencia}:pin=${v.primarios}:min=${v.matriz}:t=linear:npl=203`,
      "format=gbrpf32le",
      "zscale=p=bt709",
      "tonemap=tonemap=mobius:desat=0",
      "zscale=t=bt709:m=bt709:r=tv",
    );
  }

  if (v.fps > MAX_FPS + 0.5) cadena.push(`fps=${MAX_FPS}`);

  // Tope de 1080p que respeta la orientación: un apaisado entra en 1920×1080
  // y un vertical en 1080×1920. `min` contra las medidas propias evita
  // agrandar un video más chico, y `force_divisible_by=2` es porque H.264 con
  // yuv420p no acepta medidas impares.
  //
  // `out_color_matrix` convierte de verdad a BT.709 lo que venga en otra
  // matriz —un Android viejo en BT.601, o el RGB que deja el mapeo de tonos—,
  // en vez de solo cambiarle la etiqueta y correr los colores.
  cadena.push(
    "scale=w='if(gte(iw,ih),min(iw,1920),min(iw,1080))'" +
      ":h='if(gte(iw,ih),min(ih,1080),min(ih,1920))'" +
      ":force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos" +
      ":out_color_matrix=bt709:out_range=tv",
    "format=yuv420p",
    // Etiqueta el resultado como SDR BT.709. Tiene que ir acá y no con
    // `-color_primaries` / `-color_trc` en la línea de comando: en ffmpeg 7
    // esas opciones no se aplican —mandan las propiedades que traen los
    // cuadros desde los filtros— y el MP4 salía con el color "unknown". Un
    // video sin etiquetar cada navegador lo interpreta a su manera.
    "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv",
  );
  return cadena.join(",");
}

/**
 * Corre ffmpeg y va mostrando el avance en la misma línea.
 * @param {string[]} args
 * @param {number} duracion segundos, para calcular el porcentaje
 */
function codificar(args, duracion) {
  return new Promise((resolver, rechazar) => {
    const proceso = spawn(FFMPEG, [...args], { stdio: ["ignore", "pipe", "pipe"] });
    let errores = "";
    const enConsola = process.stdout.isTTY;

    proceso.stdout.on("data", (trozo) => {
      if (!enConsola || !duracion) return;
      // `out_time_us` viene en microsegundos pese a lo que sugiere el nombre
      // de su hermano `out_time_ms`.
      const m = String(trozo).match(/out_time_us=(\d+)/g);
      if (!m) return;
      const us = Number(m[m.length - 1].split("=")[1]);
      const pct = Math.min(100, (us / 1e6 / duracion) * 100);
      process.stdout.write(`\r    codificando… ${pct.toFixed(0).padStart(3)}%`);
    });
    proceso.stderr.on("data", (t) => (errores += t));
    proceso.on("error", rechazar);
    proceso.on("close", (codigo) => {
      if (enConsola && duracion) process.stdout.write("\r" + " ".repeat(28) + "\r");
      if (codigo === 0) resolver(undefined);
      else rechazar(new Error(errores.trim().split("\n").slice(-3).join(" | ")));
    });
  });
}

/**
 * Fotograma para el poster, sacado del video ya optimizado para que las
 * medidas coincidan exacto. No es el primero —casi siempre es negro o un
 * barrido de cámara—: se salta al 10% del video y el filtro `thumbnail` elige,
 * de los treinta cuadros siguientes, el más parecido al promedio, que suele
 * ser el más nítido y el menos movido.
 *
 * @param {string} video
 * @param {number} duracion
 * @returns {Buffer}
 */
function fotograma(video, duracion) {
  const desde = duracion > 2 ? Math.min(1, duracion * 0.1) : 0;
  const r = spawnSync(
    FFMPEG,
    [
      "-hide_banner", "-loglevel", "error",
      "-ss", String(desde), "-i", video,
      "-vf", "thumbnail=30", "-frames:v", "1",
      "-f", "image2pipe", "-c:v", "png", "pipe:1",
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  );
  if (r.status !== 0 || !r.stdout?.length) {
    throw new Error(`no se pudo sacar el poster: ${String(r.stderr).trim()}`);
  }
  return r.stdout;
}

/** @param {number} s */
function reloj(s) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.round(s % 60)).padStart(2, "0")}`;
}

async function main() {
  const { validos, otros } = await recorrer(ENTRADA, EXTENSIONES);
  for (const o of otros) console.warn(`⚠ ${relativa(o)}: no es un video soportado, se ignora.`);

  // El caso normal en Vercel: la carpeta no existe porque no está en el repo.
  // Sale antes de buscar ffmpeg, que en Vercel no está instalado.
  if (!validos.length) {
    console.log("optimize:videos · nada que procesar en assets/raw/videos");
    return;
  }

  if (!disponible(FFMPEG) || !disponible(FFPROBE)) {
    console.error(
      [
        "✗ optimize:videos necesita ffmpeg y ffprobe, y no los encuentra.",
        "  Son programas del sistema, no paquetes de npm. Para instalarlos:",
        "    Windows   winget install Gyan.FFmpeg",
        "    macOS     brew install ffmpeg",
        "    Linux     sudo apt install ffmpeg",
        "  Después cerrá y abrí la terminal. Si están instalados en otro lado,",
        "  indicalos con FFMPEG_PATH y FFPROBE_PATH.",
      ].join("\n"),
    );
    process.exitCode = 1;
    return;
  }

  const { default: sharp } = await import("sharp");
  const { force } = flags();
  const manifiesto = abrirManifiesto("videos");
  const totales = { procesados: 0, salteados: 0, errores: 0, antes: 0, despues: 0 };
  const ajustes = `h264:crf${CRF}:1080p:fps${MAX_FPS}:audio${CON_AUDIO ? 1 : 0}:posterq${CALIDAD_POSTER}`;
  const destinos = new Map();

  console.log(
    `optimize:videos · ${validos.length} ${validos.length === 1 ? "video" : "videos"} · CRF ${CRF} · hasta ${MAX_FPS} fps · ${CON_AUDIO ? "con" : "sin"} audio\n`,
  );

  for (const original of validos) {
    const clave = relativa(original);
    const destino = rutaDeSalida(original, ENTRADA, SALIDA, ".mp4");
    const poster = rutaDeSalida(original, ENTRADA, SALIDA, "-poster.webp");
    const destinoRel = relativa(destino);
    const posterRel = relativa(poster);
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

    const ajenos = [destinoRel, posterRel].filter(
      (r) => existsSync(path.join(RAIZ, r)) && !manifiesto.esNuestra(r),
    );
    if (ajenos.length && !force) {
      console.warn(
        `⚠ ${clave}: ${ajenos.join(" y ")} ya existe y no lo generó este script. No se toca; renombrá el original o usá --force.`,
      );
      totales.errores++;
      continue;
    }

    try {
      const v = sondear(original);
      console.log(`✓ ${clave}`);
      console.log(
        `    original ${reloj(v.duracion)} · ${v.ancho}×${v.alto} · ${Math.round(v.fps)} fps` +
          `${v.hdr ? " · HDR → se convierte a SDR" : ""}${v.audio ? "" : " · sin audio"}`,
      );

      mkdirSync(path.dirname(destino), { recursive: true });
      const temporal = destino.replace(/\.mp4$/, ".part.mp4");
      const audio =
        CON_AUDIO && v.audio
          ? ["-map", "0:a:0", "-c:a", "aac", "-b:a", "128k", "-ac", "2"]
          : ["-an"];

      await codificar(
        [
          "-y", "-hide_banner", "-loglevel", "error",
          "-i", original,
          "-map", "0:v:0",
          "-vf", filtros(v),
          "-c:v", "libx264", "-preset", "slow", "-crf", String(CRF),
          "-profile:v", "high", "-pix_fmt", "yuv420p",
          ...audio,
          // El índice va al principio del archivo: el navegador puede empezar
          // a reproducir antes de bajar el video entero.
          "-movflags", "+faststart",
          "-map_metadata", "-1",
          "-progress", "pipe:1", "-nostats",
          temporal,
        ],
        v.duracion,
      );
      await unlink(destino).catch(() => {});
      await rename(temporal, destino);

      const salida = sondear(destino);
      const antes = info.size;
      const despues = await tamano(destino);
      console.log(
        `    → ${destinoRel}  ${salida.ancho}×${salida.alto} · ${Math.round(salida.fps)} fps`,
      );
      console.log(`    ${peso(antes)} → ${peso(despues)}  (${reduccion(antes, despues)})`);
      if (despues > antes && v.codec === "hevc") {
        // No es un error. HEVC comprime más que H.264, pero Chrome y Firefox
        // no lo reproducen en todas las plataformas: un MP4 que pesa un poco
        // más y anda en todos lados le gana a uno liviano que no se ve.
        console.log(
          "    (pesa más que el original porque este venía en HEVC, que Chrome y Firefox no reproducen en todos lados)",
        );
      }

      const salidas = [destinoRel];
      try {
        await sharp(fotograma(destino, salida.duracion))
          .webp({ quality: CALIDAD_POSTER, effort: 6 })
          .toFile(poster);
        console.log(`    poster → ${posterRel}  (${peso(await tamano(poster))})`);
        salidas.push(posterRel);
      } catch (error) {
        // Sin poster el video igual sirve: se avisa y se sigue.
        console.warn(`    ⚠ ${error instanceof Error ? error.message : error}`);
      }

      manifiesto.anotar(clave, info, ajustes, salidas);
      totales.procesados++;
      totales.antes += antes;
      totales.despues += despues;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error(`✗ ${clave}: ${mensaje}`);
      await unlink(destino.replace(/\.mp4$/, ".part.mp4")).catch(() => {});
      totales.errores++;
    }
  }

  manifiesto.guardar();
  imprimirResumen("optimize:videos", totales);
  if (totales.errores) process.exitCode = 1;
}

await main();
