// @ts-check
/**
 * Piezas compartidas por `optimize-images.mjs` y `optimize-videos.mjs`.
 *
 * Los dos scripts hacen lo mismo con distinto motor: recorren una carpeta de
 * originales en `assets/raw/`, deciden qué hace falta procesar, escriben la
 * versión liviana en `public/` y dejan constancia en un manifiesto para no
 * repetir trabajo. Todo lo que no depende del motor vive acá.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Raíz del proyecto, resuelta desde este archivo y no desde el cwd. */
export const RAIZ = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

/** Ruta relativa a la raíz y con barras normales, para los logs. */
export function relativa(absoluta) {
  return path.relative(RAIZ, absoluta).split(path.sep).join("/");
}

/**
 * Lista recursiva de archivos cuya extensión esté en `extensiones`.
 *
 * Los que empiezan con punto se saltean: son el `.gitkeep` que mantiene la
 * carpeta en el repo y los manifiestos del propio pipeline.
 *
 * @param {string} carpeta
 * @param {Set<string>} extensiones en minúscula y con punto
 * @returns {Promise<{ validos: string[], otros: string[] }>}
 */
export async function recorrer(carpeta, extensiones) {
  const validos = [];
  const otros = [];
  if (!existsSync(carpeta)) return { validos, otros };

  const pendientes = [carpeta];
  while (pendientes.length) {
    const actual = /** @type {string} */ (pendientes.pop());
    for (const entrada of await readdir(actual, { withFileTypes: true })) {
      if (entrada.name.startsWith(".")) continue;
      const ruta = path.join(actual, entrada.name);
      if (entrada.isDirectory()) pendientes.push(ruta);
      else if (extensiones.has(path.extname(entrada.name).toLowerCase()))
        validos.push(ruta);
      else otros.push(ruta);
    }
  }
  validos.sort();
  otros.sort();
  return { validos, otros };
}

/**
 * Nombre de archivo apto para una URL: sin tildes, sin espacios, en minúscula.
 *
 * El material llega como sale del teléfono o de WhatsApp —"Odontopediatría
 * funcional.png", "IMG_2044 (1).JPG"—, y un espacio o una tilde en una ruta
 * de `public/` terminan como `%20` y `%C3%AD` en el HTML. Solo se toca el
 * nombre del archivo; las carpetas se respetan tal cual para que la estructura
 * de salida sea la misma que la de entrada.
 *
 * @param {string} nombre sin extensión
 */
export function slug(nombre) {
  const limpio = nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return limpio || "archivo";
}

/**
 * Ruta de salida para un original: misma subcarpeta, nombre normalizado y la
 * extensión nueva.
 *
 * @param {string} original ruta absoluta dentro de `entrada`
 * @param {string} entrada carpeta raíz de originales
 * @param {string} salida carpeta raíz de destino
 * @param {string} sufijoYExtension por ejemplo ".webp" o "-poster.webp"
 */
export function rutaDeSalida(original, entrada, salida, sufijoYExtension) {
  const rel = path.relative(entrada, original);
  const base = slug(path.basename(rel, path.extname(rel)));
  return path.join(salida, path.dirname(rel), base + sufijoYExtension);
}

/**
 * Manifiesto de lo ya procesado.
 *
 * Vive dentro de `assets/raw/`, que está en el `.gitignore`, así que es
 * local: describe qué originales de esta máquina ya se convirtieron. Por cada
 * original guarda tamaño y fecha de modificación —si cambia cualquiera de los
 * dos, el archivo es otro— y los ajustes con los que se procesó —si se cambia
 * la calidad o un preset, hay que rehacerlo aunque el original sea el mismo—.
 *
 * @param {string} tipo "images" | "videos"
 */
export function abrirManifiesto(tipo) {
  const archivo = path.join(RAIZ, "assets", "raw", `.manifest-${tipo}.json`);
  /** @type {Record<string, { tam: number, mtime: number, ajustes: string, salidas: string[] }>} */
  let datos = {};
  if (existsSync(archivo)) {
    try {
      datos = JSON.parse(readFileSync(archivo, "utf8"));
    } catch {
      // Un manifiesto roto no puede frenar el pipeline: en el peor caso se
      // reprocesa todo una vez.
      datos = {};
    }
  }

  return {
    /**
     * ¿Ya está hecho, con estos ajustes, y la salida sigue en su lugar?
     * @param {string} clave
     * @param {import("node:fs").Stats} info
     * @param {string} ajustes
     */
    alDia(clave, info, ajustes) {
      const r = datos[clave];
      return Boolean(
        r &&
          r.tam === info.size &&
          r.mtime === Math.round(info.mtimeMs) &&
          r.ajustes === ajustes &&
          r.salidas.every((s) => existsSync(path.join(RAIZ, s))),
      );
    },
    /**
     * ¿Esta salida la escribió el pipeline? Sirve para no pisar un archivo
     * que ya estaba en `public/` y que alguien integró a mano.
     * @param {string} salidaRelativa
     */
    esNuestra(salidaRelativa) {
      return Object.values(datos).some((r) => r.salidas.includes(salidaRelativa));
    },
    /**
     * @param {string} clave
     * @param {import("node:fs").Stats} info
     * @param {string} ajustes
     * @param {string[]} salidas rutas relativas a la raíz
     */
    anotar(clave, info, ajustes, salidas) {
      datos[clave] = {
        tam: info.size,
        mtime: Math.round(info.mtimeMs),
        ajustes,
        salidas,
      };
    },
    guardar() {
      writeFileSync(archivo, JSON.stringify(datos, null, 2) + "\n");
    },
  };
}

/** @param {number} bytes */
export function peso(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Reducción en porcentaje, con signo. Negativa si el resultado quedó más
 * pesado, que puede pasar con un original ya muy comprimido.
 * @param {number} antes
 * @param {number} despues
 */
export function reduccion(antes, despues) {
  if (!antes) return "—";
  const p = (1 - despues / antes) * 100;
  return `${p >= 0 ? "-" : "+"}${Math.abs(p).toFixed(1)}%`;
}

/** @param {string} ruta */
export async function tamano(ruta) {
  return (await stat(ruta)).size;
}

/**
 * Flags de línea de comando.
 *   --force           reprocesa todo, aunque el manifiesto diga que está hecho
 *   --preset=retrato  (solo imágenes) fuerza un preset para todo el lote
 */
export function flags() {
  const args = process.argv.slice(2);
  const valor = (nombre) =>
    args.find((a) => a.startsWith(`--${nombre}=`))?.split("=")[1];
  return { force: args.includes("--force"), preset: valor("preset") };
}

/**
 * Resumen final: cuánto había, cuánto quedó, y qué se salteó.
 * @param {string} titulo
 * @param {{ procesados: number, salteados: number, errores: number, antes: number, despues: number }} t
 */
export function imprimirResumen(titulo, t) {
  const linea = "─".repeat(64);
  // El encabezado ya deja una línea en blanco; si no se procesó nada, no hay
  // bloques de archivos en el medio y una segunda sobra.
  console.log(t.procesados || t.errores ? `\n${linea}` : linea);
  console.log(`${titulo}`);
  console.log(
    `  procesados ${t.procesados} · sin cambios ${t.salteados}` +
      (t.errores ? ` · con error ${t.errores}` : ""),
  );
  if (t.procesados) {
    console.log(
      `  peso total ${peso(t.antes)} → ${peso(t.despues)}  (${reduccion(t.antes, t.despues)})`,
    );
  }
  console.log(linea);
}
