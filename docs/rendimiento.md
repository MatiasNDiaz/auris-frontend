# Rendimiento, medios y responsive

Decisiones técnicas del sitio y el porqué de cada una. No describe lo obvio:
está para que quien venga después no tenga que volver a descubrir por qué algo
está hecho de una forma que a primera vista parece rara.

---

## Imágenes

### El pipeline

Los originales van a `assets/raw/images/` (fuera del repo) y
`npm run optimize:images` los deja en `public/images/` como WebP calidad 88,
con el lado más largo acotado por carpeta. El detalle de uso está en el README.

**Por qué 88 y no 75.** En los retratos del equipo —piel, pelo, paredes lisas—
por debajo de 85 aparecen bloques en los degradés suaves. 88 es donde deja de
notarse a simple vista contra el original.

### Reencuadre en el archivo, no por CSS

El mapa `ENCUADRE` de `scripts/optimize-images.mjs` recorta o agrega aire a
fotos puntuales. Opciones: `arriba` (suma fondo estirando la fila superior),
`cabeza` (recorta por arriba), `abajo`, `ancho` y `centroX`.

Se hace en el archivo y **no** con un `zoom` por CSS por dos motivos:

1. Una imagen escalada con `transform` dentro de una tarjeta que cambia de
   ancho en el hover tiembla, porque el punto de origen se mueve en cada cuadro.
2. El carrusel de la home tiene un efecto de zoom que **no es una animación**:
   es `object-cover` cruzando el punto donde pasa de recortar a lo alto a
   recortar a lo ancho. Ese punto depende de la proporción de la foto. Por eso
   todas las fotos 1 del equipo se llevan a **0,562** (9:16): con una foto casi
   cuadrada el punto nunca llega y esa tarjeta se queda quieta mientras el resto
   se agranda.

### `sizes`: la regla

`sizes` no describe la imagen sino **cuánto ancho de pantalla ocupa**. Está mal
puesto cuando el navegador baja una variante mucho más grande (peso de más) o
mucho más chica (se ve pixelada) que el hueco real.

| Uso | `sizes` | Por qué |
|---|---|---|
| Hero y banners a sangre | `(max-width: 1600px) 100vw, 1600px` | ocupan el ancho completo; pasado 1600 no ganan detalle |
| Hero de la ficha de profesional | `(max-width: 1024px) 100vw, 960px` | una foto apaisada recortada en vertical muestra la mitad: con 460 el navegador bajaba 640px y la tarjeta los estiraba al doble |
| Tarjetas del listado | `(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px` | una columna en mobile, dos en tablet, cuatro en escritorio |
| Miniaturas del abanico | `160px` | tamaño fijo |

### `priority` y `loading`

`priority` solo en la imagen que compite por ser el LCP de cada página: la
primera del hero, el banner de cada encabezado, la foto que abre una ficha. No
se usa en nada más, porque `priority` inyecta un `<link rel=preload>` y varios
a la vez se pelean el ancho de banda con el que importa.

El resto queda con el `loading="lazy"` que `next/image` pone por defecto.

**Cuidado con una trampa:** `loading="lazy"` difiere lo que está **abajo del
pliegue**, no lo que está invisible. El hero tenía las ocho fotos de los
servicios montadas con `absolute inset-0` y siete en `opacity: 0`; el navegador
las considera dentro del viewport y las bajaba **todas** al entrar. Hoy el hero
monta una sola y agrega la siguiente 1,2 s después del primer pintado
(`PRECARGA_MS` en `Hero.tsx`): llega con tiempo antes del cambio a los 4 s y no
le compite al LCP.

### Formatos

`next.config.ts` pide `["image/avif", "image/webp"]`. Sobre este material AVIF
pesa entre 20% y 30% menos que WebP a igual calidad percibida, y quien no lo
soporta recibe WebP. El costo es que la primera conversión de cada tamaño tarda
más; en Vercel queda cacheada.

### Caché y reemplazo de fotos

Las fotos del equipo se piden como `/imagenes/v/<fecha>/profesionales/...` y un
`rewrite` las resuelve contra `public/images/`. Ese número es la fecha de
modificación del archivo: al reemplazar una foto cambia sola, la dirección pasa
a ser otra y ni el navegador ni la caché de Next siguen mostrando la anterior.

Va en la ruta y no como `?v=` porque `next/image` rechaza query strings en
imágenes locales salvo que se declaren en `images.localPatterns`.

Como cada dirección es inmutable, `minimumCacheTTL` está en un año.

### Calidad conocida a mejorar

`public/ChicaTratamiento.webp` mide 1584×672 y se usa a pantalla completa
(`StickyTreatment`). En un monitor de 1080 de alto el navegador la agranda
alrededor de un 60%, y eso se nota. **No tiene original en `assets/raw/`**, así
que no se puede regenerar más grande: hace falta pedir el archivo original.
Bajarle la resolución no arreglaría nada y subirle la calidad tampoco: el
problema es que falta información, no compresión.

---

## Video

Hay uno solo: `public/videos/video-equipo-auris.mp4`, en la sección "Sobre el
centro" de la home.

| | |
|---|---|
| Formato | MP4 H.264, 464×832 (vertical), 30 fps |
| Peso | 5,6 MB |
| Póster | `video-equipo-auris-poster.webp`, 19 KB |
| Audio | sí, pero arranca silenciado |

**Estrategia de carga.** `preload="none"` y el `src` recién se asigna cuando un
`IntersectionObserver` avisa que la sección está a 400px de entrar en pantalla.
Sin eso el archivo empezaba a bajar apenas cargaba la página aunque esté muy
por debajo del pliegue: son megas compitiendo con el contenido de arriba y, en
un teléfono con datos, plata de alguien que tal vez nunca llegue ahí. Mientras
tanto se ve el póster.

**Por qué arranca mudo.** No es cortesía: los navegadores bloquean el autoplay
con sonido. Si arrancara con audio quedaría congelado en el póster. El botón de
sonido lo enciende después, que es cuando hay un gesto del usuario.

El `muted` se maneja como **propiedad del elemento** vía `ref`, no como atributo
de React: React no lo actualiza después del primer render y el video se
quedaría mudo para siempre por más que el botón cambie de estado.

**Contenedor.** El recuadro lleva la proporción exacta del video
(`aspect-464/832`) en vez de meterlo en uno apaisado, y no pasa de 416px de
ancho: el original mide 464, así que estirarlo más sería agrandar píxeles.

Con `prefers-reduced-motion` no arranca solo: queda en el póster con el botón de
reproducir.

---

## Animaciones

### Qué hay

| Dónde | Con qué | Qué anima |
|---|---|---|
| Entradas al hacer scroll | CSS + `IntersectionObserver` (`RevealScript`) | `opacity` y `translateY` |
| Transición de página | Framer Motion (`template.tsx`) | `opacity` y `y` |
| Crossfade del hero | Framer Motion | `opacity` |
| Hover de tarjetas | CSS | `transform` y `opacity` |
| Ondas, hojas, contadores | CSS / canvas / rAF | `transform`, `opacity` |
| Morph de foto entre páginas | View Transitions API nativa | el navegador interpola |

Todo lo que se anima en bucle o durante el scroll usa `transform` y `opacity`,
que no disparan layout. Los cambios de tamaño de las tarjetas del carrusel son
la excepción deliberada: animan `width` porque el efecto **es** el cambio de
ancho, y se compensan con `will-change`.

### Decisiones que parecen raras

**El reveal no usa Framer.** `RevealScript` es un script inline que corre antes
de la hidratación: pone la clase, arma el observer y dispara la primera tanda de
forma síncrona. Si esperara a React, el contenido de la primera pantalla
quedaría en `opacity: 0` unos cuadros y el LCP mediría ese blanco.

**El template se queda quieto en las navegaciones con View Transition.** Su
`translateY` es un transform sobre un ancestro del elemento compartido y
desplaza la geometría que captura el navegador, que es justo el salto que la
transición viene a evitar.

**El canvas de hojas se desmonta.** `LeafGust` solo existe mientras la sección
está pegada, y su `requestAnimationFrame` corta solo al terminar la ráfaga: no
queda un bucle vivo.

### `prefers-reduced-motion`

Se respeta en los dos lados: en CSS (`globals.css`) y en JS con
`useReducedMotion` de Framer. Con la preferencia activada no hay autoplay del
carrusel ni del video, no hay parallax y las transiciones de página se saltean.
No se elimina *toda* transición: los cambios de color y foco se mantienen,
porque son los que dan la señal de que algo respondió.

---

## Responsive

Breakpoints de Tailwind por defecto. `lg` (1024px) es el corte principal: abajo
todo va en una columna.

### Alturas que crecen con el ancho

Los banners de sección y los dos heros **no** tienen alto fijo:

```
hero de la home          clamp(43rem, 40.6vw, 54rem)
banner de sección        clamp(43rem, 40.6vw, 54rem)
banner de profesionales  clamp(52rem, 49vw, 64rem)
hero de servicio         clamp(35rem, 29.5vw, 44rem)
```

**Por qué.** Una foto a sangre se escala con el ancho de la pantalla. Con alto
fijo, cuanto más grande el monitor más se recorta: en una pantalla de 15" el
equipo aparecía sin techo y con el logo de la pared cortado, mientras que en una
más chica se veía bien. En `vw` el encuadre se mantiene igual en todas. Los
topes evitan que en un monitor muy ancho el banner se coma la pantalla entera.

El valor de `vw` sale de dividir el alto que se aprobó por el ancho donde se
aprobó, así que si se cambia uno hay que recalcular el otro.

### El texto de los banners no va centrado

Va apoyado arriba a distancia fija (`justify-start` + `lg:pt-48`). Centrado se
movía con el alto del bloque, y como los banners no miden todos igual, el
título saltaba de altura al pasar de una sección a otra.

### Foco de recorte

Las fotos con gente tienen a las personas en el tercio de arriba: centradas, la
franja les corta la cabeza. Por eso el hero de la home recorta desde el **25%**
y el de servicios desde el **15%**, valores verificados contra las ocho fotos.
Un servicio puede pisar el suyo con `heroFoco` — lo usa Bruxismo, cuya foto es
del consultorio y lo que importa está abajo (`center 70%`).

---

## Performance

### Server y Client Components

La mayoría de las páginas son Server Components y se generan estáticas: las 32
rutas son `Static` o `SSG`, no hay render en servidor por request ni llamadas a
APIs externas. Los `"use client"` están acotados a lo que necesita estado o
eventos (carrusel, menú, formulario, reproductor, filtros).

El patrón es **envolver, no contagiar**: `ProfessionalFicha` es servidor y solo
las piezas interactivas de adentro son cliente.

### Fuentes

Dos familias, cargadas con `next/font/google`, que las autoaloja: no hay pedido
a Google en runtime ni `@import` bloqueante. Van con `display: swap` y Next
inyecta el `preload` solo de los archivos que la página usa.

### Core Web Vitals

- **LCP** — es la foto del hero de cada página. Lleva `priority`, `sizes`
  acotado y ahora no compite con otras siete descargas.
- **CLS** — todas las imágenes usan `fill` dentro de un contenedor con
  proporción declarada, o `width`/`height`. El video también. Las entradas por
  scroll animan `opacity` y `transform`, que no mueven el layout.
- **INP** — el trabajo pesado del scroll está en `IntersectionObserver`, no en
  listeners de `scroll`. El único listener de scroll (`ScrollToTop`) es
  `{ passive: true }` y solo alterna una clase.

### Pesos

`public/` pesa unos 28 MB, casi todo fotos del recorrido virtual que se cargan
de a una. Los originales sin uso están en `assets/originales-fuera-de-uso/`,
fuera del deploy pero sin borrar.

---

## Despliegue en Vercel

Configuración por defecto de Next.js. **No hay `vercel.json` ni variables de
entorno**: el contenido vive en el repo y no hay servicios externos con
credenciales. `src/config/site.ts` tiene los datos del centro, todos públicos.

**El `prebuild` corre `optimize:media`.** Necesita `ffmpeg` para los videos,
que en Vercel no está. No rompe el build: `assets/raw/` está en el `.gitignore`,
así que en el servidor la carpeta llega vacía, el script no encuentra nada que
procesar y termina al instante. Los medios ya optimizados viajan en `public/`.

Si algún día se quisiera procesar medios en el CI habría que resolver `ffmpeg`
aparte; hoy la conversión se hace en la máquina de quien sube las fotos.

**Qué mirar si algo falla en producción:**

- Una foto que no aparece: revisar que el archivo esté en `public/` y no solo en
  `assets/raw/`, que está ignorada por git.
- Una foto vieja que persiste: no debería pasar por el versionado en la ruta;
  si pasa, es que esa imagen se referencia con una ruta directa a `/images/`
  en vez de pasar por `fotosDeProfesional()` o `bannerDeSeccion()`.
- `next/image` rechazando una URL: hay que declarar el dominio en
  `images.remotePatterns` y la calidad en `images.qualities`.
