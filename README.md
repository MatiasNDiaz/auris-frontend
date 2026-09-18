# AURIS — Espacio de salud y bienestar

Sitio del centro AURIS (Cerro de las Rosas, Córdoba). Next.js 16 con App
Router, React 19, TypeScript y Tailwind v4.

## Arranque

```bash
npm install
npm run dev     # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | desarrollo (antes regenera el manifiesto de fotos) |
| `npm run build` | build de producción (antes optimiza medios y regenera el manifiesto) |
| `npm run start` | sirve el build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | chequeo de tipos |
| `npm run optimize:media` | convierte los originales de `assets/raw/` |

No hace falta ninguna variable de entorno: todo el contenido vive en el
repositorio y no hay servicios externos con credenciales. Los datos del centro
—teléfonos, dirección, horarios— están en `src/config/site.ts`.

Las fuentes son **Fraunces** (títulos) y **Manrope** (texto), servidas por
`next/font/google`, que las autoaloja y evita el pedido a Google en runtime.

## Documentación

- [`docs/rendimiento.md`](docs/rendimiento.md) — decisiones de performance,
  imágenes, video, animaciones, responsive y despliegue.
- [`docs/modus-operandi-imagenes-profesionales.md`](docs/modus-operandi-imagenes-profesionales.md)
  — convención de las 6 fotos por profesional.
- [`CHANGELOG.md`](CHANGELOG.md) — historial de cambios.

## Imágenes y videos nuevos

Los originales **no van a `public/`**: se dejan en `assets/raw/` y un script los
convierte a una versión liviana. `assets/raw/` está en el `.gitignore`, así que
al repo solo sube el resultado optimizado.

**1. Dejá los archivos tal como llegan**

```
assets/raw/images/   fotos (JPG, PNG, WebP, AVIF, TIFF)
assets/raw/videos/   videos (MP4, MOV, M4V, WebM, MKV, AVI)
```

Se pueden armar subcarpetas: la estructura se respeta en la salida.

**2. Corré**

```bash
npm run optimize:media     # imágenes y videos
npm run optimize:images    # solo imágenes
npm run optimize:videos    # solo videos
```

**3. Usá el resultado**

| Original | Queda en |
|---|---|
| `assets/raw/images/profesionales/Ana Pérez.jpg` | `public/images/profesionales/ana-perez.webp` |
| `assets/raw/videos/recorrido/Hall.MOV` | `public/videos/recorrido/hall.mp4` + `hall-poster.webp` |

En el código la ruta empieza en `/`: `src="/images/profesionales/ana-perez.webp"`.
Los nombres se normalizan (minúsculas, sin tildes ni espacios) para que no
terminen como `%20` en las URLs.

### Qué hace con cada tipo

**Imágenes** → WebP calidad 88. El lado más largo se limita según la carpeta:

| Carpeta | Lado máximo | Para |
|---|---|---|
| `profesionales/` | 2000 px | fichas del equipo |
| `historia/` | 1200 px | tarjetas de la línea de tiempo |
| cualquier otra | 1920 px | hero, galería, recorrido, servicios, banners |

Nunca agranda una imagen más chica que ese máximo. Algunas fotos llevan además
un reencuadre propio (recorte o aire agregado) definido en el mapa `ENCUADRE`
del script; está explicado en [`docs/rendimiento.md`](docs/rendimiento.md).

**Videos** → MP4 H.264, hasta 1080p y 30 fps, más un poster WebP para mostrar
mientras carga. Los videos HDR de teléfono se pasan a SDR; si no, en la web se
ven lavados.

### Detalles a tener en cuenta

- **Videos: hace falta `ffmpeg`.** No es un paquete de npm, se instala aparte:
  `winget install Gyan.FFmpeg` (Windows) · `brew install ffmpeg` (macOS) ·
  `sudo apt install ffmpeg` (Linux).
- **Fotos de iPhone en HEIC no se pueden leer.** En el iPhone: Ajustes › Cámara
  › Formatos › "Más compatible", o exportarlas como JPG.
- **No reprocesa lo que ya hizo.** Correrlo de nuevo solo toca archivos nuevos o
  modificados. Para rehacer todo: `npm run optimize:media -- --force`.
- **No pisa imágenes que ya usa el sitio.** Si un original terminaría en un
  archivo de `public/` que no generó este script, avisa y lo saltea.
- **Ajustes por variable de entorno:** `IMG_QUALITY` (88), `VIDEO_CRF` (26, más
  bajo = más calidad y más peso), `VIDEO_MAX_FPS` (30), `VIDEO_AUDIO=0` para
  sacar el audio. Son de uso puntual al correr el script a mano; no hay que
  configurarlas en Vercel.
- **Corre solo antes de cada build** (`prebuild`). Con `assets/raw/` vacía —el
  caso normal en Vercel— termina al instante y no demora el deploy.

## Fotos de cada profesional

Cada ficha usa 6 fotos por profesional, nombradas `[Nombre]_[número].webp`
(ej. `Ariel_1.webp` a `Ariel_6.webp`) en
`assets/raw/images/profesionales/<slug>/`. Mientras una falta, la ficha
muestra un bloque de color en su lugar. La convención completa —qué es cada
número, la regla para nombres repetidos y el slug de cada profesional— está en
[`docs/modus-operandi-imagenes-profesionales.md`](docs/modus-operandi-imagenes-profesionales.md).

## Despliegue

Vercel con la configuración por defecto de Next.js: no hay `vercel.json` ni
variables de entorno que cargar. Las 32 rutas se generan estáticas en el build.

El detalle —qué corre en el `prebuild`, por qué las fotos llevan la fecha en la
ruta y qué mirar si algo falla en producción— está en
[`docs/rendimiento.md`](docs/rendimiento.md#despliegue-en-vercel).
