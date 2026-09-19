# Changelog

## 2026-09-19 — Recorrido virtual rehecho con las fotos nuevas

- **38 fotos nuevas** de las instalaciones, en 10 ambientes, reemplazan por
  completo el recorrido anterior. `public/images/instalaciones/`
- **Dos niveles de navegación**, que es la idea que sostiene el rediseño: los
  **círculos** sobre las puertas cambian de ambiente; las **flechas laterales**
  pasan las fotos de ese mismo ambiente. Por eso los círculos van solo sobre la
  primera foto de cada parada —la tomada desde la puerta, la que "encaja" con
  el recorrido—: las demás son el detalle de adentro y no llevan a ningún lado.
- **La tira de miniaturas se eliminó.** Era la forma anterior de ver las fotos
  de un ambiente y competía con el recorrido: se reemplazó por las flechas.
  `src/components/sections/TourViewer.tsx`
- **Transiciones más suaves y distintas según cómo se llegó.** Entrar a un
  ambiente empuja hacia adelante (zoom del 6% desde el círculo que se tocó),
  volver se aleja, y pasar fotos corre de costado 28px con fundido. Antes todo
  entraba con un zoom del 28% y salía al 150%, que sobre una foto de interior
  se leía como un salto.
- **Modelo de datos**: el nodo pasó de `{ image, alt, aspect, extras[] }` a
  `{ photos: TourPhoto[] }`. Un ambiente ya no tiene una foto principal y
  agregados, tiene una lista ordenada. `src/lib/data/tour.ts`
- **Encuadre horizontal, además del vertical.** El encuadre ya se centraba en
  el promedio de las `y` de los círculos; ahora hace lo mismo con las `x`.
  Corriendo la capa `(50 − foco)%` del sobrante ×2, un punto que está al `f%`
  de la foto queda al `f%` de la ventana. Sin eso, el círculo "Ir al pasillo"
  —al 78% del ancho de la foto de recepción— quedaba **fuera de la ventana en
  un teléfono**, donde de una foto apaisada se ve apenas el 40% central del
  ancho, y el recorrido no se podía continuar. Verificado por simulación en
  360×480, 768×576 y 1152×720: los 16 círculos caen dentro del marco con
  espacio para su área táctil de 44px (margen mínimo, 31px).
- **Precarga de la foto anterior y la siguiente**, con el mismo `sizes` que usa
  el visor —que es lo que decide qué variante baja el navegador—, así la
  flecha no muestra un hueco. No se precarga la carpeta entera.
- **Tres reglas del centro** que no se pueden inferir de las fotos y que quedan
  escritas en el encabezado de `tour.ts`: al baño se entra viendo primero el
  pasillo frente a su puerta; volver desde el consultorio 3 o el 5 pasa por la
  vista del pasillo hacia la salida y no vuelve directo; y el consultorio 5 es
  el que el plano viejo llamaba 4, no son dos ambientes.
- **El pie de ayuda se arma con lo que la parada realmente ofrece**: en un
  consultorio no hay círculos y en una foto única no hay flechas, así que
  anunciarlos sería mentir.
- **Teclado**: las flechas pasan las fotos, pero solo con el foco dentro del
  visor. Un listener global se llevaría puestas las flechas del resto de la
  página.
- **Nota de copia**: la parada de vuelta se titula "Pasillo", igual que la de
  ida. Es el mismo lugar mirado al revés, y el botón de volver arma su texto
  con ese título: con un nombre propio quedaba "Volver a De vuelta por el
  pasillo". Lo que distingue a las dos paradas es el pie.

### Verificado

`npx tsc --noEmit` · `npm run lint` · `npx next build` — sin errores. Las 38
fotos referenciadas existen en disco, las proporciones declaradas coinciden con
las reales y no quedó ninguna sin usar.

### Encontrado y no modificado

- **`public/images/recorrido/`** (2,1 MB, 24 archivos) quedó sin una sola
  referencia en el código: son las fotos del recorrido anterior. No se borró.
- **`pasillo-03`, `pasillo-04` y `pasillo-05`** vienen en 447×797, 445×793 y
  442×791: son las únicas fotos del lote por debajo de 1000px y se agrandan
  bastante en pantalla. Convendría volver a exportarlas del original.

## 2026-09-18 — Preguntas frecuentes con contenido real

- **Contenido reemplazado por completo.** El anterior (derivación médica,
  videollamada, accesibilidad, estacionamiento) era texto genérico sin
  respaldo. El nuevo son 8 preguntas extraídas de material gráfico ya
  publicado del centro, agrupadas en 4 categorías: "Sobre el centro", "Pagos
  y cobertura", "Taller de adultos mayores" y "Tratamientos estéticos".
  `src/lib/data/faqs.ts`
- **Teléfono, WhatsApp y dirección salen de `siteConfig`**, interpolados en
  el texto de la respuesta en vez de tipeados de nuevo: si el centro cambia
  un número, la respuesta lo sigue sola y no puede quedar desactualizada.
- **Acordeón modernizado.** El chevron pasó de dos íconos que se
  intercambiaban de golpe a uno solo que rota 180°, con la misma curva
  (`cubic-bezier(0.21, 0.47, 0.32, 0.98)`) que usa el `Reveal` de scroll en
  todo el sitio — mismo lenguaje de movimiento, no uno nuevo.
  `src/components/ui/accordion.tsx`
- **Cada categoría es una tarjeta** (borde, sombra suave, esquinas
  redondeadas) con ícono propio, en vez de una lista plana terminada en un
  borde suelto. Los íconos de "Taller de adultos mayores" y "Tratamientos
  estéticos" repiten los que ya identifican a esos servicios en
  `lib/icons.tsx`, para que se lean como la misma familia visual.
- **Nota:** la respuesta de "¿Qué servicios ofrece Auris?" dice "8 áreas" pero
  nombra 7 (pliega "alineadores y ortodoncia" como sub-ítem de Odontología),
  mientras que en el sitio esa es una página de servicio propia. Se dejó tal
  cual la escribió el centro, sin corregirla.

## 2026-09-18 — Equipo de recepción

- **Tres recepcionistas** (Leticia Loza, Soledad Lluch, Yanina Solari) con sus
  dos fotos cada una, optimizadas de 1,3–1,7 MB a 149–239 KB.
- **En el listado del equipo**, al final y con filtro propio "Recepción". Van
  en su propia grilla y no mezcladas: son tarjetas sin ficha detrás, y
  mezclarlas rompería la expectativa de que una tarjeta lleva a algún lado.
  `src/components/shared/RecepcionistaCard.tsx` (nuevo)
- **No aparecen en la home**: la sección quedó solo en el listado del equipo.
- **Centradas por recorte del archivo, no por `object-position`.** Ninguna de
  las tres está en el centro de su foto (Leticia al 61% del ancho, Soledad al
  47% ocupando un quinto del cuadro, Yanina al 71%). En una tarjeta vertical,
  de una foto vertical se muestra el ancho completo: no hay encuadre por CSS
  que las corra, hay que recortar el archivo. Va en `ENCUADRE` de
  `optimize-images.mjs`, con el mismo recorte para la foto 1 y la 2 —si
  difieren, el cruce del hover salta—.
- **No tienen página de detalle** ni transición de elemento compartido: esa
  animación existe para el morph de la foto al entrar a una ficha.
- **Tipo `Recepcionista` aparte** de `Professional`: no atienden pacientes, no
  tienen especialidad, área, trayectoria ni WhatsApp. Un `Professional` con
  esos campos vacíos habría arrastrado esa mentira por todo el código.
- **Encuadre por persona.** Soledad Lluch es la única con la toma apaisada: en
  una tarjeta vertical lo que se recorta son los costados, así que lleva foco
  horizontal (`65% center`) mientras las otras dos lo llevan vertical.
- **Navbar**: "Profesionales" pasa a **"Equipos"**. La URL sigue siendo
  `/profesionales` para no romper enlaces compartidos, el sitemap ni las fichas.
- **Teléfono de Claudia Tomasi**: `+54 9 3515 52-4109`. Antes mostraba el fijo y
  el WhatsApp del centro.

## 2026-09-18 — Auditoría de rendimiento y preparación para producción

Auditoría completa del proyecto y optimización, sin cambios de diseño: no se
tocó la paleta, la tipografía, la estructura de las secciones ni la intención
visual de ninguna pantalla.

### Performance

- **El hero de la home descargaba las ocho fotos de los servicios en la primera
  carga.** Las ocho estaban montadas con `absolute inset-0` y siete en
  `opacity: 0`; el navegador las considera dentro del viewport y las baja todas
  —`loading="lazy"` difiere lo que está abajo del pliegue, no lo invisible—.
  Ahora monta una sola y precarga la siguiente 1,2 s después del primer pintado.
  Verificado sobre el HTML compilado: **de 8 imágenes a 1**.
  `src/components/sections/Hero.tsx`
- **El video de 5,6 MB empezaba a bajar al cargar la página** aunque está muy
  por debajo del pliegue. Ahora usa `preload="none"` y el `src` se asigna cuando
  un `IntersectionObserver` avisa que falta 400px para que entre en pantalla.
  `src/components/shared/VideoEnBucle.tsx`
- **AVIF activado** (`formats: ["image/avif", "image/webp"]`). Entre 20% y 30%
  menos de bytes a igual calidad percibida, con WebP de respaldo.
  `next.config.ts`
- **`minimumCacheTTL` a un año.** Las fotos llevan la fecha del archivo en la
  ruta, así que cada dirección es inmutable y no hay riesgo de servir una vieja.
  `next.config.ts`
- **~8,8 MB sacados de `public/`**: originales y descartes sin referenciar
  (cinco PNG sueltos en la raíz de 1,8 a 2,3 MB cada uno, tres fotos de
  profesionales de ejemplo, cuatro imágenes de la línea de tiempo ya
  reemplazadas y dos de servicios). **No se borraron**: se movieron a
  `assets/originales-fuera-de-uso/`, fuera del deploy. Cinco de ellos no tenían
  copia en `assets/raw/` — eran los originales.

### SEO

- **`sitemap.xml`** generado desde `services.ts` y `professionals.ts`, los
  mismos datos que alimentan `generateStaticParams`: no queda desactualizado al
  sumar o sacar a alguien. `src/app/sitemap.ts` (nuevo)
- **`robots.txt`** con la referencia al sitemap. Importa porque varias fichas
  cuelgan de un filtro que se arma en el cliente. `src/app/robots.ts` (nuevo)
- **Open Graph y Twitter Card con imagen.** La metadata no tenía ninguna, así
  que al compartir el enlace no salía miniatura. Usa la foto del equipo, con
  medidas declaradas. También se agregó el `canonical` de la home.
  `src/app/layout.tsx`

### Documentación

- `docs/rendimiento.md` (nuevo) — imágenes, video, animaciones, responsive,
  Core Web Vitals y despliegue, con el porqué de cada decisión.
- `README.md` — reemplazado el texto de `create-next-app` y corregidos datos
  obsoletos: decía que el proyecto usa la fuente **Geist** (usa Fraunces y
  Manrope), que las imágenes salen a **calidad 80** (son 88) y que las fotos de
  profesionales se limitan a **1000px** (son 2000).
- `CHANGELOG.md` (nuevo).

### Verificado

`npm run lint` · `npx tsc --noEmit` · `npx next build` — los tres sin errores
ni advertencias. 32 rutas, todas estáticas o SSG.

### Encontrado y no modificado

- **`public/ChicaTratamiento.webp`** (1584×672) se usa a pantalla completa y el
  navegador la agranda alrededor de un 60% en un monitor de 1080. No tiene
  original en `assets/raw/`: hace falta el archivo grande. Comprimir o recortar
  no lo arregla, falta información.
- **"Dr. Santiago Rodriguez"** figura sin tilde en `professionals.ts`. Los
  nombres se toman del cartel de recepción letra por letra, así que no se
  corrigió sin confirmarlo.
- **Framer Motion** se importa en 19 archivos. Migrar a `LazyMotion` con
  `domAnimation` bajaría el JavaScript del cliente, pero toca todos esos
  componentes: queda como recomendación, no se aplicó.
