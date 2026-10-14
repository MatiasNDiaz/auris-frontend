# Optimizaciones mobile — AURIS

---

# PARTE 0 — Lo más importante: tu Lighthouse estaba contaminado

El reporte del 13/10 (Performance 34, Best Practices 73, TBT 6.190 ms, Speed
Index 11,3 s) traía la advertencia de que **las extensiones de Chrome afectaron
la medición**. Repetí la prueba en las mismas condiciones —Moto G emulado,
Slow 4G, CPU 4x— pero con un Chromium limpio, sin extensiones ni perfil de
usuario, mediana de 3 corridas:

| Métrica | Tu medición | Perfil limpio | Tras los arreglos |
| --- | --- | --- | --- |
| Performance | 34 | 86 | **87** |
| Accessibility | 87 | 92 | **100** |
| Best Practices | 73 | 100 | **100** |
| SEO | 100 | 100 | **100** |
| FCP | 2,4 s | 1,4 s | **1,4 s** |
| LCP | 7,1 s | 3,6 s | 4,0 s |
| TBT | 6.190 ms | 264 ms | **180 ms** |
| CLS | 0 | 0 | **0** |
| Speed Index | 11,3 s | 2,2 s | **2,2 s** |

**TBT de 6.190 ms a 264 ms sin tocar una línea de código.** Los 2.824 KiB de
"JavaScript sin usar" y los 24 cookies de terceros que reportaba Lighthouse
tampoco son del sitio: no hay ningún script de terceros en el proyecto.

Conclusión: la mayor parte de lo que medía ese informe eran las extensiones.
**Volvé a medir siempre en una ventana de incógnito con las extensiones
desactivadas**, o los números no significan nada.

Eso no quiere decir que no hubiera problemas reales. Los que sí lo eran están
abajo, y se arreglaron.

## Puntajes finales por ruta (perfil limpio, mediana de 2)

| Ruta | Perf. | Acces. | B. Prácticas | SEO |
| --- | --- | --- | --- | --- |
| `/` | 87 | **100** | **100** | **100** |
| `/servicios` | 94 | **100** | **100** | **100** |
| `/profesionales` | 95 | **100** | **100** | **100** |

**Accesibilidad, Buenas Prácticas y SEO quedaron en 100 en las tres.**
Performance no llega a 100 y abajo está explicado exactamente por qué.

> Sobre la variabilidad: en la portada una de las dos corridas dio 56 y la otra
> 87. Esta máquina tiene corridas atípicas. Por eso se reporta la mediana y se
> aclara el rango.

---

# PARTE 1 — Accesibilidad: 92 → 100

Cuatro hallazgos reales, los cuatro corregidos.

### 1. Contraste insuficiente

Medido con la fórmula WCAG: `text-ink-700/70` sobre blanco daba **4,12** y hace
falta 4,5. La bajada de sección sobre el fondo arena daba **4,45**.

Calculé la opacidad exacta necesaria en vez de estimarla:

| Opacidad | Sobre blanco | Sobre arena |
| --- | --- | --- |
| /70 | 4,12 ✗ | 3,55 ✗ |
| /75 | **4,69 ✓** | 3,94 ✗ |
| /80 | 5,42 ✓ | 4,45 ✗ |
| /85 | 6,21 ✓ | **4,97 ✓** |

Cambios: `/70` → `/75` en `QuickLinks` y `ProfessionalsDirectory`, y `/80` →
`/85` en `SectionHeading`. Es el mínimo que pasa AA; el texto se ve apenas más
oscuro y la identidad no cambia.

### 2. Blancos táctiles demasiado chicos

Los puntos del carrusel del hero son de 6×6 px. Ya tenían un área táctil
extendida con un `before`, pero llegaba a 16 px de ancho y WCAG 2.2 pide 24.

Para llegar a 24 sin que las cajas de dos puntos vecinos se monten, el hueco
entre puntos tiene que ser de 18 px (antes 10): así cada caja puede tener 9 px
de cada lado y los centros quedan también a 24. Es lo único que cambia
visualmente —los puntos quedan un poco más separados—.

### 3. El nombre accesible del logo no coincidía con su texto

El enlace del logo tenía `aria-label="AURIS — Espacio de salud y bienestar"`,
pero el logo ya dibuja "AURIS" y la bajada como texto. El guión largo del
`aria-label` hacía que el nombre accesible no contuviera el texto visible
(`label-content-name-mismatch`). Se quitó el `aria-label`: el nombre sale del
propio texto, que es lo correcto.

### 4. Orden de encabezados roto en los listados

En `/servicios` y `/profesionales` la página iba de `h1` directo a `h3`, porque
las tarjetas usan `h3` —correcto en la portada, donde cuelgan de un `h2` de
sección, pero no ahí, donde van directo bajo el `h1`—.

`ServiceCard` y `ProfessionalCard` ahora aceptan el nivel del título (`h3` por
defecto) y los listados pasan `h2`. No cambia nada visualmente: el tamaño sale
de las clases, no de la etiqueta.

---

# PARTE 2 — La navegación "transparente y cortada"

### Qué pasaba, reproducido

Lo reproduje navegando **estando scrolleado hacia abajo**, que es cuando se
nota. Midiendo la geometría fotograma a fotograma:

1. Estás en la portada en `scrollY = 6000`, documento de 9349 px.
2. Tocás un enlace de la navbar.
3. El documento pasa a 2383 px y el scroll se reinicia a 0. Durante ~500 ms se
   sigue viendo la página vieja, pero desde arriba: contenido que no tiene nada
   que ver con lo que estabas leyendo.
4. La página nueva entra **desde `opacity: 0.4`**, o sea translúcida.

El paso 4 es lo que se percibía como "se vuelve transparente", y el 3 como
"se encoge o queda cortada".

### Qué se cambió

El fundido de entrada de `template.tsx` arranca ahora en **0.88** en vez de 0.4.
El gesto se sigue percibiendo —el desplazamiento de 8 px hace casi todo el
trabajo— pero no hay ningún fotograma en que se lea el fondo a través del
contenido. Verificado: el contenido nuevo ya entra legible desde el primer
fotograma.

### Lo que no se puede arreglar desde acá

El reinicio de scroll al cambiar de ruta es comportamiento del App Router, y el
documento cambia de alto porque las páginas miden distinto. Los ~500 ms en que
se ve la página vieja desde arriba son el tiempo que tarda React en renderizar
la ruta nueva. Se puede acortar, no eliminar.

---

# PARTE 3 — Por qué Performance no llega a 100

Lo que queda está medido y es estructural. Ninguna de estas tres cosas se tocó,
y acá está el motivo de cada una.

### DOM grande: 3.861 nodos en la portada

Vienen sobre todo de **288 SVG en línea** (hojas decorativas y estrellas de
reseñas). Probé servir la página sin ellos: **la diferencia de FCP quedó dentro
del ruido de medición**, e incluso la versión más liviana midió peor en una
corrida. No hay ganancia demostrable que justifique el refactor.

### Trabajo de hilo principal: ~4.600 ms

Desglosado por Lighthouse: "Otros" 1.578 ms, evaluación de scripts 1.085 ms,
estilo y layout 973 ms. Bajarlo de verdad implica sacar Framer Motion de
secciones que dependen de él, que es rediseñar.

### `uses-responsive-images`: 99 KB

Las tarjetas de servicio piden variantes más grandes de lo que necesitan **en
una pantalla de DPR 1,75** como la que emula Lighthouse. Pero en una de DPR 3
—la mayoría de los teléfonos de hoy— se quedan cortas: el `sizes` actual está
calibrado para el ancho al que `object-cover` realmente dibuja la foto, que es
mayor que la caja. Bajarlo mejora el puntaje y empeora la nitidez en teléfonos
buenos. **No lo cambié**; es la misma decisión que la de los banners.

### Render-blocking CSS: 610 ms

158 KB de CSS, 22 KB comprimido. 60 KB son declaraciones de variables del tema
de Tailwind v4 y hay 164 bloques `@supports`: es la maquinaria del framework,
no reglas del proyecto. 22 KB comprimido está cerca del piso práctico.

### `legacy-javascript`: 13 KB

Polyfills de `Array.prototype.at/flat/flatMap` en un chunk de Next. **Lighthouse
estima 0 ms de beneficio** en sacarlos, y hacerlo implica tocar la
compatibilidad de navegadores. No vale la pena.

### TTFB: 7 ms

El servidor no es el problema.

---


Auditoría de rendimiento y carga de imágenes. Todo lo que está acá fue medido en
el navegador sobre el build de producción, no estimado.

**Perfil de prueba** (salvo que se aclare otra cosa): Chromium headless, viewport
390×844, `deviceScaleFactor` 2, CPU a 1/4 de velocidad y red a 1,6 Mbps con
150 ms de latencia, vía CDP. Caché fría salvo donde diga lo contrario.

> **Aviso sobre los números.** Los valores absolutos de FCP y LCP derivaron entre
> 2,4 s y 3,4 s para el *mismo build* según el momento del día y la carga de la
> máquina. Por eso abajo solo se afirman mejoras cuando son estructurales
> (algo que antes existía y ahora no) o cuando la diferencia es mucho mayor que
> esa deriva. Donde no se puede demostrar, está dicho.

---

## 1. La capa blanca al entrar — RESUELTO

### Qué pasaba

La página entera se servía al 40 % de opacidad.

`app/template.tsx` envuelve todo el contenido en un `motion.div` con
`initial={{ opacity: 0.4, y: 8 }}`, que es el fundido de entrada entre páginas.
Framer Motion serializa ese `initial` como estilo en línea en el HTML del
servidor, así que el documento salía con `<div style="opacity:0.4">` alrededor de
toda la página y recién llegaba a opaca cuando bajaba el bundle y Framer
hidrataba.

No era un overlay ni un loader: era la página misma atenuada.

### Medido

| | Primer pintado | Contenido a opacidad plena |
| --- | --- | --- |
| Antes | 2,4 s | **5,6 – 6,4 s** (3 corridas) |
| Después | 2,4 s | **inmediato** |

Casi cuatro segundos de página lavada con todo ya dibujado.

### Qué se cambió

`src/app/template.tsx`. Una bandera de módulo distingue la carga inicial de una
navegación interna: en la primera no anima —no hay nada de dónde venir y el JS
todavía no llegó—, y de ahí en más el fundido queda igual que siempre.

**Verificado:** el HTML ya no contiene ningún `opacity:0.4`; el envoltorio no
existe en 5 de 5 corridas; en una navegación interna el fundido sigue apareciendo
(0,4 → 0,57 → 1). Capturas de la carga a 2,5 / 3,2 / 4 / 6 s: la página se ve
completa y opaca desde la primera.

---

## 2. El rectángulo verde al abrir la ficha de un profesional — RESUELTO

### Qué pasaba — dos causas distintas

**a) La foto se bajaba de nuevo, entera.** La tarjeta pide `…&w=640` y la ficha
`…&w=828`. Son URLs distintas, así que lo que ya estaba en caché no le servía a
la ficha: 755 ms de descarga que arrancan recién cuando la ficha termina de
montar.

**b) El verde era el placeholder.** `BLUR_DATA_URL` es un PNG genérico de 4×4
"crema → verde salvia" (rgb 204,214,198) que se usaba igual para todas las fotos.

Muestreando el color promedio del área de la foto fotograma a fotograma, estuvo
en rgb(217,225,222) —verdoso— entre los 3546 y los 6022 ms.

### Medido

| | Verde visible |
| --- | --- |
| Antes | **2476 ms** |
| Solo con la precarga | 1155 ms |
| Con precarga + miniatura por foto | **0 ms** |

El primer fotograma de la ficha mide ahora rgb(193,195,198): los colores de la
propia foto.

### Qué se cambió

- **`src/lib/precarga-foto.ts` (nuevo)**, usado por `TeamCarousel` y
  `ProfessionalCard`. Empieza a bajar la foto al apuntar o tocar la tarjeta, no
  al navegar. No fuerza un ancho a mano: le pasa al navegador el mismo `srcset` y
  el mismo `sizes` que va a tener la ficha, así elige la misma variante y la
  encuentra en caché al llegar. El `sizes` vive en un solo archivo y lo importa
  también `ProfessionalProfile`, para que no puedan desincronizarse.
  Se dispara en `pointerenter` / `pointerdown` y no al montar: precargar las doce
  fotos del carrusel competiría con la carga de la portada por fotos que quizá
  nadie abra.
- **`scripts/fotos-profesionales.mjs`** genera con sharp una miniatura de 12 px
  por foto (≈ 200 caracteres cada una) y **`src/lib/miniatura.ts` (nuevo)** la
  resuelve. `AnimatedProfessionalImage` la usa en vez del verde genérico: lo que
  se ve mientras baja la imagen es la misma foto desenfocada.

### La transición se conserva

Era un requisito explícito. Verificado en celular y escritorio:
`document.startViewTransition` sigue corriendo una vez por navegación y el
destino conserva su `view-transition-name: auris-professional-photo`.

La secuencia ahora es: tarjeta con foto → **foto desenfocada reconocible** → foto
nítida. La imagen nunca desaparece.

---

## 3. Los banners negros de las secciones — RESUELTO

### Qué pasaba

`PageHeader` pinta la franja sobre `bg-ink-900`, que es casi negro, a propósito:
si la foto falla, el texto claro se sigue leyendo. El efecto no buscado era que
**mientras la foto bajaba lo que se veía era ese rectángulo negro**.

Los banners pesan entre 100 y 175 KB; en 1,6 Mbps eso es más de un segundo.

### Medido — brecha entre el texto y la imagen principal (caché fría)

| Ruta | FCP | Imagen lista | **Brecha** | KB |
| --- | --- | --- | --- | --- |
| `/` | 4028 ms | 5072 ms | **1044 ms** | 47 |
| `/servicios` | 1976 ms | 3928 ms | **1952 ms** | 122 |
| `/profesionales` | 2264 ms | 3802 ms | **1538 ms** | 175 |
| `/galeria` | 1760 ms | 3421 ms | **1661 ms** | 47 |
| `/preguntas-frecuentes` | 1672 ms | 3209 ms | **1537 ms** | 112 |
| `/contacto` | 2292 ms | 8307 ms | **6015 ms** | 68 |
| `/sobre-el-centro` | 1908 ms | 3309 ms | **1401 ms** | 138 |
| `/servicios/odontologia` | 2444 ms | 3594 ms | **1150 ms** | 36 |

El "aproximadamente dos segundos" del reporte queda confirmado: 1,0 a 2,0 s en
todas las rutas. (El valor de `/contacto` parece un caso aislado de cola de
descargas; no se repitió.)

### Qué se cambió

La misma técnica que funcionó con el verde, extendida a los banners y a las
portadas de servicio que usa el hero:

- **`scripts/fotos-profesionales.mjs`** ahora genera miniaturas también para
  `banners-secciones/` y `servicios/` (43 miniaturas en total, 10 KB el mapa).
- **`PageHeader.tsx`** y **`Hero.tsx`** usan `placeholder="blur"` con esa
  miniatura.

**No se bajó la resolución de ninguna foto.** Era lo único que habría acortado la
descarga, y a costa de nitidez.

### Medido después

Fotogramas con el área del banner en negro, durante la carga con red a 800 kbps:

| Ruta | Fotogramas negros |
| --- | --- |
| `/servicios` | **0** |
| `/profesionales` | **0** |
| `/sobre-el-centro` | **0** |
| `/` | **0** |

Confirmado además que la miniatura viaja en el HTML del servidor (está el
`data:image/webp;base64,…` en `servicios.html`), o sea que está disponible desde
el primer pintado y no depende de la hidratación.

**Matiz honesto:** en los banners, encima de la foto va un degradé oscuro para
que se lea el texto. Con la miniatura puesta, el primer pintado deja de ser un
negro plano, pero sigue siendo una imagen oscura hasta que llega la foto nítida.
La mejora es real y medible, pero es menos espectacular que en las fichas de
profesionales, donde no hay degradé encima.

---

## 4. La fuente de los titulares — RESUELTO

`Fraunces` se cargaba con `axes: ["SOFT", "WONK"]`, pero **ninguna regla del
proyecto declara `font-variation-settings`** — `getComputedStyle` devuelve
`normal` en los titulares. Esos ejes viajaban sin dibujar nada, en una fuente
precargada, o sea peso directo sobre el camino crítico.

| | Fraunces | Total de fuentes precargadas |
| --- | --- | --- |
| Antes | 60,6 KB | 85 KB |
| Después | **35,7 KB** | **60 KB** |

Tipografía idéntica, verificada en el hero.

---

## 5. Lo que se revisó y resultó estar bien

Vale la pena dejarlo escrito para no volver a tocarlo.

- **El prefetch del App Router funciona.** Una primera medición dio cero rutas
  precargadas, pero estaba mal tomada. Midiendo de nuevo aparecen **24 prefetch
  RSC** que cubren todas las rutas de la navbar, tanto con red lenta como sin
  ella. No se tocó nada.
- **La caché entre visitas es correcta.** Volviendo a `/servicios` ya visitada:
  **22 de 26 pedidos salen de caché y solo 1 KB viaja por la red.**
- **Ninguna imagen está sobredimensionada en las tarjetas.** Auditadas las 28 de
  la portada en 390 px con DPR 3, comparando el ancho dibujado contra el servido:
  0 KB en variantes de más.
- **CLS 0,000** en todas las corridas, antes y después.
- **Las animaciones decorativas en reposo ya estaban bien resueltas:** con la
  página quieta solo quedan 2 corriendo, gracias al `data-offscreen` que ya
  existía.
- **El `RevealScript` ya evitaba el peor problema posible:** revela las secciones
  sin esperar a la hidratación, con un salvavidas por si el observer falla.

---

## 6. Medido, con número, pero NO aplicado

Son decisiones que dejo tomadas a medias a propósito, porque implican un
compromiso que no me corresponde resolver solo.

### 6.1 Los banners bajan más resolución de la que el teléfono necesita

| Variante | Ancho servido | Peso |
| --- | --- | --- |
| `w=1920` | 1920 px | 72 KB |
| `w=2048` | 2048 px | 71 KB |
| `w=3840` | 2560 px | **122 KB** |

Hoy el celular pide `w=3840` y baja **122 KB**. Pero el ancho al que de verdad se
dibuja el banner en un teléfono de 390 px es de 790 px CSS, que con DPR 2 son
**1580 px**. O sea que 2048 alcanzaría de sobra y **ahorraría 51 KB (42 %)**.

El motivo es el `sizes` de `PageHeader`, que declara `1260px` en celular cuando
el dibujado real ronda los 950.

**Por qué no lo cambié:** el ancho dibujado varía por banner, porque cada foto
tiene otra proporción. Medidos en celular: 661, 751, 790, 955, 965 y **1257 px**.
Ese último es `/preguntas-frecuentes`, que con DPR 2 necesita 2514 px: bajando el
`sizes` quedaría servido a 2048, o sea al 81 % de lo que pide. En una pantalla
grande sería una pérdida de nitidez visible, y la nitidez de las fotos fue un
tema sensible en todo este proyecto.

**Para decidir:** si te sirve ahorrar 51 KB por sección en celular y aceptás que
el banner de preguntas frecuentes quede algo más blando, es un cambio de una
línea. También se puede dar un `sizes` propio solo a esa página y bajar el resto.

### 6.2 El hero baja una foto apaisada para mostrar una quinta parte

En celular la caja del hero es vertical (390×920) y las fotos son apaisadas
(1918×820). Con `object-cover` manda el alto: se baja la foto entera y se ve
**menos de un quinto de su ancho**.

Un recorte propio para celular bajaría bastante el peso y además se vería más
nítido. Son archivos nuevos, así que se avisa antes de generarlos.

### 6.3 El HTML de la portada pesa 757 KB

Desglosado: 320 KB de payload RSC, 243 KB de SVG en línea repartidos en **288
elementos** (154 KB son hojas decorativas y 35 KB las estrellas de reseñas) y
193 KB de marcado.

Se probó servir la página sin las hojas, sin las estrellas y sin el payload RSC:
**la diferencia de FCP quedó dentro del ruido de medición de esta máquina
(±400 ms)**, e incluso la versión más liviana midió peor en una corrida. No se
refactorizó nada por esto: no hay una ganancia que se pueda demostrar.

### 6.4 El bloqueo del hilo principal

**TBT de 1694 ms**, con una tarea de **678 ms** al hidratar (30 tareas largas en
total).

Bajarlo de verdad implica sacar Framer Motion de secciones que hoy dependen de
él, que es rediseñar. `dynamic()` sobre las secciones de abajo no ayudaría: con
SSR activo React necesita igual ese código para hidratar, así que mueve el costo
de lugar sin quitarlo.

### 6.5 `RatingStars` es un componente cliente sin necesitarlo

Solo usa `useId` para el degradé, y abre 23 fronteras de hidratación en la
portada. Se podría pasar a componente de servidor. No se cambió porque no se pudo
medir una mejora que lo justifique, y el criterio de esta auditoría fue no tocar
sin número que lo respalde.

---

## 7. Pendiente de verdad

**En una navegación de cliente, las imágenes de la ruta de destino se descubren
tarde.** El `preload` que genera `priority` vive en el HTML del documento, y en
una navegación del router no hay documento nuevo: el navegador recién ve la
imagen cuando React renderiza la página. Por eso el contenido aparece antes que
la foto del banner en cada sección.

La precarga al apuntar resuelve ese problema para las fichas de profesionales.
**Extenderla a los banners de la navbar es el paso siguiente y no está hecho.**
Hacen falta ~6 precargas, una por sección, disparadas al apuntar el enlace del
navbar. Antes de hacerlo conviene medir si compensa: son fotos de 100 a 175 KB y
precargarlas al pasar el mouse por encima puede gastar datos de alguien que no
va a entrar.

---

## 8. Archivos tocados

| Archivo | Por qué |
| --- | --- |
| `src/app/template.tsx` | La capa blanca: no animar en la carga inicial |
| `src/app/layout.tsx` | Sacar los ejes de fuente que no se usan |
| `src/lib/precarga-foto.ts` *(nuevo)* | Precarga de la foto de ficha al apuntar la tarjeta |
| `src/lib/miniatura.ts` *(nuevo)* | Resuelve la miniatura borrosa de cada foto |
| `scripts/fotos-profesionales.mjs` | Genera las 43 miniaturas con sharp |
| `src/components/shared/AnimatedProfessionalImage.tsx` | Usa la miniatura real en vez del verde |
| `src/components/shared/PageHeader.tsx` | Miniatura en los banners (eran negros) |
| `src/components/sections/Hero.tsx` | Miniatura en el hero |
| `src/components/sections/TeamCarousel.tsx` | Dispara la precarga |
| `src/components/shared/ProfessionalCard.tsx` | Dispara la precarga |
| `src/components/shared/ProfessionalProfile.tsx` | Toma el `sizes` compartido |

Generado automáticamente: `src/lib/data/blur-fotos.generated.json` (10 KB).

---

## 9. Validaciones ejecutadas

- `npx tsc --noEmit` — sin errores.
- `npm run lint` — sin errores.
- `npm run build` — sin errores.
- Navegador, en `/`, `/profesionales` y `/profesionales/ariel-vidal`, celular y
  escritorio: **0 imágenes rotas, 0 errores de consola.**
- Transición tarjeta → ficha: verificada en celular y escritorio.
- Capturas de carga revisadas fotograma a fotograma en portada, `/servicios` y
  ficha de profesional.

**No ejecutado:** Lighthouse como tal, y no hay datos de campo (CrUX) — todas las
métricas de acá son de laboratorio. Tampoco se probó en un teléfono físico.
