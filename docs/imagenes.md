# Cómo agregar fotos al sitio

Esta guía es para no volver a poner el sitio lento sin querer. Se lee en cinco
minutos y cubre todo lo que hace falta saber.

## La idea en una frase

Las fotos del sitio **no se convierten en el servidor**. Todo el trabajo —
achicar, comprimir, generar los distintos tamaños — se hace una sola vez, en tu
máquina, con un comando. Vercel se limita a entregar archivos que ya están
listos.

Si alguna vez una foto aparece sin pasar por ese comando, el sitio la va a
mostrar igual, pero entera: una foto de dos megas viajando a un teléfono.

---

## 1. Agregar una foto nueva, paso a paso

### Paso 1 — Poner el original donde va

Los originales viven en `assets/raw/images/`, en la subcarpeta que corresponda:

```
assets/raw/images/
  profesionales/<nombre-apellido>/   fotos del equipo
  recepcionistas/<nombre-apellido>/  fotos de recepción
  banners-secciones/                 franja de arriba de cada sección
  servicios/portada/                 portada de cada servicio
  instalaciones/<ambiente>/          recorrido virtual
  historia/                          fotos de archivo
```

Poné el archivo tal como salió de la cámara o del teléfono. **No lo achiques ni
lo comprimas vos**: el script lo hace mejor y necesita todos los píxeles para
partir de ahí.

Formatos que entiende: `.jpg`, `.jpeg`, `.png`, `.webp`. **HEIC no**, que es lo
que sale por defecto de un iPhone. Si te pasa, en el teléfono andá a
Ajustes › Cámara › Formatos › "Más compatible", o exportá la foto como JPG.

La subcarpeta decide sola el tamaño máximo y la calidad. No hay que configurar
nada.

### Paso 2 — Correr el comando

```bash
npm run optimize:images
```

Procesa solamente lo que cambió. Si no tocaste nada, no escribe ni un byte.

Por cada foto deja, en `public/images/`:

- el archivo principal, por ejemplo `ariel-7.webp`
- una variante por cada ancho que el sitio usa: `ariel-7-w384.webp`,
  `ariel-7-w640.webp`, `ariel-7-w1080.webp`

Al final te muestra cuántas procesó, cuántas salteó y cuánto peso ahorró.

> Si una foto no aparece en el resultado, fijate que la extensión esté en la
> lista de arriba y que el nombre no choque con otro archivo de la misma
> carpeta.

### Paso 3 — Commitear

Van al repositorio:

- `public/images/**` — el archivo principal **y todas sus variantes**
- `src/generated/image-manifest.json` — la lista de qué variantes existen
- `src/lib/data/*.generated.json` — si se tocaron fotos de personas

**No va** `assets/raw/`. Los originales no están en git (ver el último punto).

### Paso 4 — Usarla en un componente

Siempre con `next/image`, nunca con `<img>`:

```tsx
import Image from "next/image";
import { CALIDAD_BANNER } from "@/lib/calidad-foto";
import { miniaturaDe } from "@/lib/miniatura";

<div className="relative aspect-4/3 overflow-hidden rounded-3xl">
  <Image
    src="/images/servicios/portada/mi-foto.webp"
    alt="Qué se ve en la foto"
    fill
    sizes="(max-width: 1024px) 90vw, 520px"
    quality={CALIDAD_BANNER}
    placeholder="blur"
    blurDataURL={miniaturaDe("/images/servicios/portada/mi-foto.webp")}
    className="object-cover"
  />
</div>
```

Las fotos de profesionales no se escriben a mano: se agregan siguiendo la
convención de nombres que explica
[`modus-operandi-imagenes-profesionales.md`](./modus-operandi-imagenes-profesionales.md)
y el sitio las encuentra solo.

---

## 2. Qué calidad va en cada foto

Ya está decidido y el script la aplica solo según la carpeta. En el componente
alcanza con que el `quality` diga lo mismo:

| Tipo de foto | Calidad | Constante |
|---|---|---|
| Personas: profesionales, recepción, equipo | 82 | `CALIDAD_FOTO` |
| Banners, portadas de servicio, instalaciones, hero | 88 | `CALIDAD_BANNER` |

Las dos viven en `src/lib/calidad-foto.ts`.

**Por qué las personas van más bajo:** la piel perdona la compresión mucho
mejor que el grano de una toma nocturna. Medido sobre un retrato a 1080px, la
calidad 92 pesa 141 KB y la 82 pesa 77 KB, con una diferencia de 1,13 niveles
de gris sobre 255. No se distingue ni mirándolas pegadas.

Si alguna vez hace falta otro valor, hay que agregarlo también a
`images.qualities` en `next.config.ts`, o Next rechaza el pedido.

---

## 3. Cuándo usar `priority`

`priority` le dice al navegador "esta foto es la más importante de la página,
bajala antes que nada".

**Va en una sola foto por página**: la grande de arriba de todo, la que se ve
antes de hacer scroll. En el sitio hoy son el hero de la portada, la franja de
cada sección, la foto grande de la ficha de profesional y la portada de cada
servicio.

**No va** en las fotos de una grilla, de un listado ni de un carrusel, aunque
se vean al entrar. Si todas son prioritarias, ninguna lo es: compiten entre sí
y la que de verdad importa llega más tarde.

---

## 4. Qué no hacer

- **No uses `<img>`.** Sin `next/image` no hay variantes por tamaño ni
  `placeholder`, y la foto viaja entera.
- **No pongas fotos sueltas en `public/`** salteándote el pipeline. No tienen
  variantes y se sirven completas. (Había cinco así y se borraron.)
- **No pongas una foto de fondo con CSS** (`background-image`) si se puede
  resolver con `next/image` y `object-cover`. El CSS no se optimiza.
- **No le pongas `priority` a todo.**
- **No inventes un `sizes` al voleo.** Tiene que declarar el ancho al que la
  foto *se dibuja*, no el de la pantalla. Cuando la caja es más vertical que la
  foto, `object-cover` la ajusta por el alto y la dibuja bastante más ancha que
  la caja: ahí `100vw` pide una variante demasiado chica y se ve estirada. Si
  tenés dudas, medila en el navegador con `img.getBoundingClientRect()`.
- **No agregues anchos nuevos a mano.** La escalera es 128, 384, 640, 1080 y
  1920, y está en dos lugares que tienen que decir lo mismo:
  `ESCALERA` en `scripts/optimize-images.mjs` e `imageSizes` + `deviceSizes` en
  `next.config.ts`. Si se tocan, hay que tocar los dos y volver a correr el
  script.
- **No borres `src/generated/image-manifest.json`.** Sin él, el loader sirve
  todas las fotos enteras.

---

## 5. Los originales no están en git

`assets/raw/` está fuera del repositorio: son 163 MB que no tiene sentido
versionar. **Viven solamente en la máquina donde se procesaron.**

Eso significa que **si se pierde esa carpeta, se pierden los originales**. Lo
que queda en el repo son las versiones ya comprimidas y recortadas, que no se
pueden volver atrás.

Hacé copia de seguridad de `assets/raw/` en algún lado que no sea esa máquina.

---

## Si algo sale mal

**Una foto se ve borrosa.** Revisá el `sizes`: probablemente declara menos
ancho del que la foto ocupa de verdad. También puede ser que el original sea
chico — fijate las medidas en `src/generated/image-manifest.json`.

**Una foto no aparece.** Abrí la consola del navegador en desarrollo: si dice
`[imágenes] ... no está en el manifiesto`, falta correr
`npm run optimize:images` y commitear el resultado.

**Cambié una foto y sigue saliendo la vieja.** Las fotos de profesionales y los
banners llevan la fecha del archivo en la dirección, así que eso no debería
pasar. Las portadas de servicio no la llevan: ahí sí puede quedar la anterior
en el caché del navegador, y se resuelve recargando con Ctrl+Shift+R.
