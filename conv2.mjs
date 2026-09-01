import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/Space/Downloads/Fotos Google-20260829T225253Z-1-001/Fotos Google";
const OUT = ".tour-work";

/** Carpeta -> prefijo de archivo. El orden es el del recorrido real. */
const spaces = [
  ["Fotos ingreso y recepción", "recepcion"],
  ["Fotos pasillo", "pasillo"],
  ["Consultorio 1 lado izquierdo", "consultorio-1"],
  ["Consultorio 2 lado izquierdo", "consultorio-2"],
  ["Consultorio 3 lado izquierdo", "consultorio-3"],
  ["Consultorio 4 lado izquierdo estética", "consultorio-4"],
  ["Foto laboratorio ubicación en el pasillo a la derecha", "laboratorio"],
  ["Consultorio 5 al fondo", "consultorio-5"],
];

await mkdir(OUT, { recursive: true });
let n = 0, before = 0, after = 0;

for (const [dir, slug] of spaces) {
  const files = (await readdir(path.join(SRC, dir)))
    .filter((f) => /\.(heic|jpe?g|png)$/i.test(f))
    .sort();
  let i = 0;
  for (const f of files) {
    const src = path.join(SRC, dir, f);
    const out = path.join(OUT, `${slug}-${String(++i).padStart(2, "0")}.webp`);
    before += (await stat(src)).size;
    await sharp(src)
      .rotate()                                   // respeta la orientación EXIF
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(out);
    after += (await stat(out)).size;
    n++;
  }
  console.log(`${slug.padEnd(15)} ${files.length} fotos`);
}
console.log(`\n${n} archivos  ${(before/1048576).toFixed(0)} MB -> ${(after/1048576).toFixed(1)} MB`);
