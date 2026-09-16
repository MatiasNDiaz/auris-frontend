This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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

**Imágenes** → WebP calidad 80. El lado más largo se limita según la carpeta:

| Carpeta | Lado máximo | Para |
|---|---|---|
| `profesionales/` | 1000 px | fichas del equipo |
| `historia/` | 1200 px | tarjetas de la línea de tiempo |
| cualquier otra | 1920 px | hero, galería, recorrido, servicios |

Nunca agranda una imagen más chica que ese máximo.

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
- **Ajustes por variable de entorno:** `IMG_QUALITY` (80), `VIDEO_CRF` (26, más
  bajo = más calidad y más peso), `VIDEO_MAX_FPS` (30), `VIDEO_AUDIO=0` para
  sacar el audio.
- **Corre solo antes de cada build** (`prebuild`). Con `assets/raw/` vacía —el
  caso normal en Vercel— termina al instante y no demora el deploy.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
