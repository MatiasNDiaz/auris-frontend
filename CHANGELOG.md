# Changelog

## 2026-10-12 — La capa blanca de la carga en celular

### La página entera se servía al 40% de opacidad

- **Qué pasaba.** `app/template.tsx` envuelve todo el contenido en un
  `motion.div` con `initial={{ opacity: 0.4, y: 8 }}` para el fundido de
  entrada entre páginas. Framer serializa ese `initial` como estilo en línea en
  el HTML del servidor, así que el documento salía con
  `<div style="opacity:0.4">` alrededor de la página entera, y recién llegaba a
  opaca cuando bajaba el bundle y Framer hidrataba. Eso es la "capa blanca
  semitransparente que cubre toda la pantalla": no era un overlay ni un loader,
  era la página misma atenuada.
- **Medido** en un teléfono simulado con la CPU a 1/4 y 1,6 Mbps: el primer
  pintado ocurría a los 2,4 s y el contenido seguía al 40% hasta los 5,6–6,4 s
  (tres corridas). Casi cuatro segundos de página lavada después de que ya
  estaba todo dibujado.
- **Arreglo.** El template distingue la carga inicial de una navegación interna
  con una bandera de módulo: en la primera no anima —no hay nada de dónde venir
  y el JS todavía no llegó—, y de ahí en más el fundido queda igual que
  siempre. Verificado: el HTML ya no contiene ningún `opacity:0.4`, el
  envoltorio no existe en las cinco corridas, y en una navegación interna sigue
  apareciendo (0,4 → 0,57 → 1). Capturas de la carga a 2,5/3,2/4/6 s: la página
  se ve completa y opaca desde la primera.

### La fuente de los titulares pedía dos ejes que nadie usa

- `Fraunces` se cargaba con `axes: ["SOFT", "WONK"]`, pero ninguna regla del
  proyecto declara `font-variation-settings` —`getComputedStyle` devuelve
  `normal` en los titulares—, así que esos ejes viajaban sin dibujar nada. Es
  una fuente precargada, o sea peso directo sobre el camino crítico.
- Sin ellos: **60,6 KB → 35,7 KB**; el total de fuentes precargadas baja de
  85 KB a 60 KB. Tipografía idéntica, verificada en el hero.

### Encontrado y medido, pero NO modificado

- **El HTML de la portada pesa 757 KB** (320 KB de payload RSC, 243 KB de SVG
  en línea repartidos en 288 elementos, 193 KB de marcado). Se probó servir la
  página sin las hojas decorativas, sin las estrellas y sin el payload RSC: la
  diferencia de FCP quedó dentro del ruido de medición de esta máquina
  (±400 ms), e incluso la versión más liviana midió peor en una corrida. **No
  se refactorizó nada por esto**: no hay una ganancia que se pueda demostrar.
- **Ninguna imagen está sobredimensionada para celular.** Auditadas las 28 de
  la portada en 390 px con DPR 3 comparando el ancho dibujado contra el
  servido: 0 KB en variantes de más. Varias se sirven por debajo de lo que
  pediría la pantalla, que es el límite del archivo de origen, no un problema
  de carga.
- **La portada descarga 862 KB de imágenes** en total, el grueso del peso. El
  hero dibuja una foto apaisada de 1918 px dentro de una caja vertical de
  390 px: se baja entera y se ve menos de un quinto de su ancho. Un recorte
  propio para celular lo bajaría bastante, pero son archivos nuevos y eso se
  avisa antes de generarlos.
- **TBT de 1694 ms**, con una tarea de 678 ms al hidratar. Reducirlo de verdad
  implica sacar Framer Motion de secciones que hoy dependen de él, que es
  rediseñar. `dynamic()` sobre las secciones de abajo no ayudaría: con SSR
  activo React necesita igual ese código para hidratar.
- **`RatingStars` es un componente cliente sin necesitarlo** (solo usa `useId`
  para el degradé) y abre 23 fronteras de hidratación. No se cambió porque no
  se pudo medir una mejora que lo justifique.
- Las animaciones decorativas en reposo ya están bien resueltas: con la página
  quieta solo quedan 2 corriendo, gracias al `data-offscreen` que ya existía.
- CLS 0,000 en todas las corridas, antes y después.

## 2026-10-08 (4) — El banner de Eugenia Leiva: la foto entera, sin recorte

Tercer intento sobre lo mismo, ahora sí con la cara completa y en un tamaño
más chico, pero sin el recuadro que se había rechazado.

- **Por qué los intentos anteriores no podían funcionar.** Llenando la franja
  con `object-cover`, en 1920px solo entra un tercio del alto de la foto: no
  hay `bannerFoco` que alcance, siempre queda media cara afuera. Y achicarla
  con `scale` dejaba un canto recto contra el violeta, que es el "recuadro"
  que no se quería. Las dos cosas son consecuencia de forzar una toma cerrada
  y vertical a cubrir una franja mucho más ancha que alta.
- **`bannerEntera`**, un campo nuevo de la ficha. Con él la caja de la foto
  deja de ocupar el 62% y toma la proporción de un retrato (`aspect-3/4`): su
  ancho sale del alto de la franja y se apoya contra el borde derecho. La foto
  la llena sin recortarse, así que se ve entera y, al ser la caja más angosta,
  bastante más chica.
- **Por qué no se ve ningún borde.** Arriba y abajo la caja sangra contra la
  sección, así que ahí no hay canto que mostrar, y los dos costados los apaga
  la máscara —la misma técnica que ya usaba el banner, pero fundiendo las dos
  puntas y en un tramo más corto, porque acá tiene que borrar el borde mismo
  de la foto y no media franja—.
- **Queda con aire contra el borde derecho** (`right: 9%`), repartida entre el
  texto y la punta de la pantalla en vez de pegada contra ella. El valor es
  porcentual para que ese aire acompañe al ancho de la ventana.
- `bannerCorrimiento` no se aplica en este modo: la caja ya está contra el
  borde. De `lg` para abajo no cambia nada —ahí la foto va de fondo bajo el
  tinte, igual que la de todo el equipo—.
- Verificado en 390, 768, 1440, 1920 y 2560px, y que Ariel y Claudia siguen
  exactamente iguales.

## 2026-10-08 (3) — El banner de Eugenia Leiva, sin el recuadro

Se revirtió el `bannerZoom` + fondo desenfocado de la entrega anterior.
Reportado como que se veía "encerrada en un rectángulo", con un pedido
puntual: que quede igual que la de Ariel —la foto a pantalla completa en el
contenedor violeta, sin ningún subcontenedor.

- Sacado por completo: el campo `bannerZoom` (de `types.ts`, de
  `encuadreBanner` en `fichas.ts` y de la entrada de Eugenia), la capa de
  fondo desenfocado en `ProfessionalFicha.tsx`, y las clases
  `lg:scale-(--foco-zoom)` / `lg:group-hover:scale-[calc(...)]`. El `<Image>`
  del banner volvió a su forma de siempre: `object-cover`, `group-hover:scale-105`
  en todos los anchos, sin escala de reposo distinta de 1. Hoy nadie usa ese
  mecanismo —no quedó como opción sin usar, se borró entero—.
- `bannerFoco: "center 25%"` se mantuvo: sigue siendo el valor que muestra la
  cara entera de esta foto en particular.
- **Queda anotado el límite real, sin ocultarlo**: la foto 6 de Eugenia es un
  primer plano de cara (959×1280), más cerrada que las tomas del resto del
  equipo, que son de cuerpo o al menos de hombros para arriba con algo de
  aire. A pantalla completa eso significa que, en monitores muy anchos
  (verificado en 2560px), la nariz y la boca terminan ocupando buena parte de
  la franja —más cerca que cualquier otro banner del equipo—. Es la foto que
  hay, mostrada igual que la de todos; una toma con más aire alrededor seguiría
  siendo la solución de fondo.
- Verificado en 1440, 1920 y 2560px, y que Ariel y Claudia —que nunca
  necesitaron el mecanismo— siguen exactamente iguales.

## 2026-10-08 (2) — El banner de Eugenia Leiva y la foto de contacto, de vuelta

Dos ajustes sobre los cambios recién hechos, los dos reportados como que
todavía no quedaban bien.

- **El banner violeta de Eugenia Leiva se veía como un rectángulo recortado
  flotando en el vacío.** El `bannerZoom: 0.6` de la entrega anterior resolvía
  que la cara no ocupara toda la franja, pero al encogerla dejaba un borde neto
  contra el violeta sólido alrededor, y encima a 1920/2560px —donde esta
  sección crece de ancho pero no de alto, porque no tiene un `min-height` en
  `vw` como el resto de los banners— la foto volvía a ocupar casi toda la
  franja igual. Dos cambios:
  - Mismo recurso que ya usa el visor del recorrido para una foto vertical que
    no llena su marco: una copia de la misma foto, ampliada y desenfocada,
    detrás de la nítida. El margen que deja el achique ahora se lee como un
    degradé hacia el violeta, no como un corte.
  - `bannerZoom` bajó de 0.6 a 0.4. Medido en el navegador en 1440, 1920 y
    2560px: con 0.4 queda aire visible en los tres anchos; con 0.6 a partir de
    ~1900px la foto volvía a tocar los bordes de arriba y abajo.
  - Sigue siendo la foto de origen la limitante real: es un primer plano de
    cara (959×1280, vertical), no la toma horizontal con contexto que pide la
    convención para esta posición (`docs/modus-operandi-imagenes-profesionales.md`,
    foto 6). Con el desenfoque de fondo el resultado ya es prolijo, pero una
    foto pensada para este lugar seguiría siendo mejor que cualquier CSS.
- **La foto de contacto no mostraba la taza ni la notebook.** Bajar el
  `fotoFoco` a 40% arregló que no le cortara la cabeza, pero la franja de esta
  página sólo llega a mostrar ~53% del alto de la foto, y entre las cejas y el
  borde de la taza hay 52 puntos de foto —casi el límite exacto de lo que
  entra—. Medido con una grilla de porcentaje superpuesta sobre el original
  (no a ojo: la primera estimación visual erró por varios puntos y ninguna
  franja mostraba la taza). En `center 70%` la ventana corre lo justo para
  sumar la taza y las manos tecleando sin perder la cara —se pierde algo de
  pelo arriba, no la cara—. Verificado en 390, 1440, 1920 y 2560px: en las
  cuatro se ve la cara, las manos escribiendo y la taza.

### Encontrado y no modificado

- A partir de cierto ancho de pantalla, ni la foto de contacto ni la de
  Eugenia Leiva pueden mostrar el cuadro completo (cara entera + contexto) al
  mismo tiempo: la franja es más ancha que alta y las fotos no tienen tanto
  margen vertical. Se priorizó el contexto (taza/manos en un caso, cara
  completa en el otro) sobre mostrar absolutamente todo; es una decisión de
  encuadre, no algo que se pueda arreglar sin recortar nada.

## 2026-10-08 — Banners de recorrido y contacto, Yanina, Eugenia Leiva en dos servicios, encuadres

- **Eugenia Leiva ahora también aparece en el equipo de "Estética facial y
  corporal"**, sin perder su lugar en Kinesiología. El modelo de datos solo
  admitía un `serviceSlug` por profesional —el que decide a qué página enlaza
  su ficha—, así que se sumó `serviciosAdicionales?: string[]`: entra en el
  listado de equipo de esos servicios también, pero su ficha sigue enlazando a
  Kinesiología. Verificado: su tarjeta aparece en ambos servicios y el chip de
  su ficha sigue yendo a `/servicios/kinesiologia`.
- **Banners de "Recorrido" y "Contacto" actualizados** con las fotos nuevas.
  La de recorrido mantenía una composición parecida (tres personas en
  recepción) y su encuadre seguía andando bien tal cual. La de contacto es una
  escena completamente distinta —antes alguien en el mostrador, ahora alguien
  escribiendo desde un sillón—, así que el `fotoAlt`, que describía el
  mostrador, se actualizó para no nombrar un lugar que la foto ya no muestra.
- **El banner de contacto le cortaba la cabeza en monitores anchos.** El
  `fotoFoco` venía en `center 90%`, calibrado para la foto vieja. Con la nueva,
  a 1440px se veía bien, pero la franja crece con el ancho de pantalla
  (`clamp` en `vw`) y a partir de ~1800px ese 90% empujaba el recorte tan abajo
  que la cabeza entera quedaba afuera —el caso que se reportó, en una pantalla
  de ese orden—. Se bajó a `center 40%`, verificado en 390, 1024, 1440, 1920 y
  2560px: cara y cabeza completas en todo el rango.
- **Yanina Solari (recepción) quedó en cuerpo entero, como Leticia y Soledad.**
  Sus fotos nuevas traían el mismo recorte angosto (`ancho: 0.56`) calibrado
  para las anteriores. Ese recorte no toca el alto, pero al dejar la imagen
  mucho más angosta que alta, la tarjeta —que es un recuadro 4:5— termina
  mostrando solo una tira muy acotada en el centro: de ahí que se viera apenas
  el busto. Simulado contra la caja real de la tarjeta antes de decidir: sin
  ningún recorte (ella ya está cerca del centro del encuadre original) el
  resultado ya queda igual de cuerpo entero que sus compañeras, así que se
  sacó el ajuste en vez de calibrar uno nuevo.
- **La foto 6 de Eugenia Leiva (banner violeta) le cortaba los ojos.** Cambió
  de una toma de escritorio a un primer plano de cara; con el `bannerFoco` de
  la anterior (52%) solo entraban boca y cuello. Se bajó a 25%, con lo que la
  cara entra entera —pero a esa escala seguía viéndose más cerca que el resto
  del equipo, porque `object-cover` igual la agranda al forzarla a cubrir una
  franja mucho más ancha que alta—. Se agregó `bannerZoom` (mismo mecanismo
  que `cifrasZoom`, pero para achicar en vez de agrandar): a 0.6 la foto pasa a
  verse como una composición con banner alrededor, no un primer plano a
  pantalla completa. Solo corre en `lg`, igual que `bannerCorrimiento`: en
  mobile la foto ya queda semitransparente bajo un tinte parejo, y encogerla
  ahí no acerca ni aleja nada, solo dibuja un rectángulo que se nota contra el
  tinte. Confirmado que el resto de las fichas no cambia (`bannerZoom` por
  defecto es 1, foto tal cual).

### Encontrado y no modificado

- **Las fotos de Eugenia Leiva ya traían un salto de calidad entre sí** (la 2 y
  la 4, de una sesión anterior, se ven algo más blandas en pantallas de alta
  densidad que el resto de su set) — ya estaba anotado, sigue igual.

## 2026-09-28 — Eugenia Leiva: fotos nuevas y renumeradas

- **Se descartó su foto 1** (de pie, brazos cruzados, gesto neutro) y **la 2 pasó
  a ser la 1**: es la misma toma pero sonriendo. Como la sección de cifras
  —la última de la ficha— reusa la foto 1, esa cara nueva aparece ahí sola, que
  es lo que se pedía; no hizo falta tocar nada para eso.
- **`eugenia_leiva2.jpg` es ahora su foto 2**: sentada al escritorio, apoyada en
  la mano. Es la que alterna con la 1 cada 3 segundos en el hero de su ficha y
  la que sale al pasar el cursor.
- **`eugenia_leiva4.jpg` reemplaza a su foto 4**, una de las dos chicas del
  mosaico de trayectoria.
- **3, 5 y 6 quedaron como estaban.** El banner de su frase sigue con la 6.
- Las dos descartadas quedaron guardadas fuera del proyecto antes de borrarlas,
  por si hacen falta.

### Encontrado y no modificado

- **Las dos fotos nuevas vienen bastante más chicas que el resto**: 930×1600 y
  766×1280, contra los 3480×6192 de las demás. Se sirven enteras, sin agrandar,
  así que rinden bien hasta pantalla retina común y quedan algo más blandas en
  un teléfono de densidad alta. Si existen los originales en grande, conviene
  reemplazarlas.
- **La 1 y la 2 ya no son la misma toma.** Antes eran la misma pose con otro
  gesto y el cruce del hero se leía como que la foto cobraba vida; ahora una
  está de pie en la sala y la otra sentada al escritorio, así que el cambio se
  nota más. Es consecuencia de lo pedido, no un error.

## 2026-09-28 — Auditoría de mobile: contenido cortado, tarjeta del mosaico, hero y navbar

### 1. La ficha del profesional se cortaba contra el borde derecho

- **Qué pasaba.** En 320–412 px, el título, el rótulo "EQUIPO AURIS", las
  etiquetas y la foto del hero quedaban corridos a la derecha y cortados. No
  había scroll horizontal: la sección lleva `overflow-hidden`, así que lo que
  sobraba desaparecía en vez de poder alcanzarse.
- **Causa, medida.** El CTA "Solicitar turno con \<nombre completo\>" llevaba
  `whitespace-nowrap`. Un botón que no puede cortar su texto tiene un ancho
  mínimo igual al de su etiqueta entera —368 px en Romina Tchakerian, 339 en
  Claudia Tomasi, 299 en Ariel Vidal— y las celdas de un grid no bajan de su
  contenido mínimo. La columna se estiraba a ese ancho dentro de un contenedor
  de 280, y todo lo que colgaba de ella se iba con ella. Afectaba a **todas**
  las fichas: hasta la etiqueta más corta pedía 299 px en una pantalla de 320.
- **Arreglo.** `ShineButton` deja de llevar `whitespace-nowrap` y gana
  `max-w-full`; el alto fijo pasa a ser mínimo (`h-13` → `min-h-13`) para que un
  texto en dos renglones no se salga de la pastilla. En una sola línea el alto
  es el de siempre.
- **Efecto lateral, corregido.** Con el texto pudiendo cortarse, cuatro botones
  de la portada pasaban a dos renglones a 320 px por tres píxeles de diferencia
  ("Conocé nuestros servicios" pedía 283 dentro de 280). El relleno lateral cede
  en pantallas angostas (`px-5 sm:px-7`, y `px-4 sm:px-5` en el compacto) y el
  banner de cierre bajó su `px-7` a `px-5`. Con eso el único que sigue en dos
  renglones es el CTA de la ficha, que con el nombre completo no entra de otra
  forma en un teléfono.

### 2. La tarjeta blanca del mosaico ya no tapa las fotos

- En escritorio estaba en `absolute bottom-0` y se apoyaba sobre las dos fotos
  de abajo. Ahora cuelga del mosaico: va debajo del grid, con el mismo ancho
  corto y pegada al borde izquierdo de la columna.
- De `lg` para abajo no se muestra (`hidden lg:block`): es justo donde la ficha
  deja de ser dos columnas. Verificado en siete anchos —`display: none`, 0 px de
  alto y 0 de ancho hasta 768; 272×129 y en el flujo desde 1024—.

### 3. Hero de la portada: el alto ya no se mueve en mobile

- En 320, 360 y 375 px el alto del hero variaba 38–39 px en cada giro del
  carrusel y arrastraba el scroll de toda la página. El piso `min-h-56` (224 px)
  quedaba corto: ahí cada servicio parte en distinta cantidad de renglones y la
  caja iba de 246 a 314 px según el texto.
- Ahora la celda lleva, sin verse, una copia de los cinco titulares, así que
  mide siempre lo que el más largo, en cualquier ancho y sin números a mano. El
  bloque se extrajo a `TitularServicio` para no tener dos markups que se
  desincronicen.
- Verificado 22 segundos por ancho en 320/360/375/390/412/430: **variación 0 px
  y ningún salto de scroll**.

### 4. La navbar responde antes

- `HIDE_AFTER` pasa de 120 px a 80, el alto de la propia navbar: se va justo
  cuando igual estaría por salir de pantalla. `DELTA_THRESHOLD`, de 6 a 4.
- Sigue quieta cerca del tope: con un temblor de ±6 px no se mueve, y bajando
  3000 px seguidos no parpadea. Al subir 30 px vuelve enseguida.

### Encontrado y no modificado

- **Lo que queda "fuera de cuadro" es intencional**: el zoom del recuadro de
  cifras, el corrimiento de la foto del banner, la marquesina de testimonios, el
  acordeón de equipo, el riel horizontal de "Nuestra historia" y el recorte con
  aire del visor del recorrido. Todos recortan a propósito y el contenido se
  alcanza deslizando o no es contenido.
- **En 768 px la caja del titular varía 2 px entre servicios.** Sin efecto sobre
  el scroll; ya estaba anotado.

## 2026-09-28 — Claudia Tomasi: se dieron vuelta sus fotos 2 y 6

- **Los archivos ya venían intercambiados desde el centro**, así que no hubo
  nada que cablear: la 2 y la 6 se resuelven por nombre de archivo. Alcanzó con
  `npm run optimize:images` —reprocesó esas dos y nada más— y regenerar el
  manifiesto. La 6 salió por el preset panorámico (2560) y la 2 por retrato
  (2000), como corresponde a cada puesto.
- **La que ahora es la 2** —sentada, con los brazos apoyados— es la que alterna
  con la 1 cada 3 segundos en el hero de su ficha y la que aparece al pasar el
  cursor, ahí y en las tarjetas del listado. Verificado en las dos.
- **La que ahora es la 6** —apoyada en la mano— es el fondo del banner de su
  frase.
- **Se recalibró el encuadre del banner.** El `bannerFoco` estaba en 50% para la
  foto anterior, que la tenía más lejos y con pared vacía arriba; la nueva está
  más cerca y más alta, y con ese valor la franja le cortaba el pelo. Medido
  contra siete valores en el navegador: en 43% la cabeza entra entera y la mano
  sigue dentro del recorte. El `bannerCorrimiento` (19%) no hizo falta tocarlo.

## 2026-09-22 — El tirón de scroll cada 4 segundos en la portada

- **La portada daba un salto de scroll cada 4 segundos.** Se reportó como algo
  de la sección de profesionales, pero no era de ahí: medido en el navegador,
  la sección de equipo no mueve el scroll ni al pasar el cursor, ni al tabular,
  ni al bajar con la rueda. El salto viene del carrusel del hero y se nota en
  cualquier punto de la página, porque el hero está arriba de todo.
- **Causa.** Los dos titulares del hero —el que sale y el que entra— se cruzan
  a la vez, y al que salía se lo sacaba del flujo con un `position: absolute`
  puesto dentro de `exit`. Framer recién aplica esa propiedad un fotograma
  después de montar el entrante, así que durante ese fotograma los dos quedaban
  apilados en el flujo: la caja del titular pasaba de 268 a 536 px, el hero de
  688 a 910 y el documento crecía 222 px. El navegador corregía el scroll para
  no mover lo que se estaba viendo y lo devolvía al fotograma siguiente.
- **De paso, la navbar se destapaba sola.** Se esconde al bajar y reaparece al
  subir; ese retroceso de 222 px lo leía como que el usuario había subido.
- **Arreglo.** Los dos titulares van apilados en la misma celda de un grid, así
  el alto de la caja es el mayor de los dos y nunca la suma. El `exit` ya no
  toca `position`, con lo cual no depende de cuándo lo aplique Framer.
- **Verificado en el navegador**, 24 segundos —seis vueltas del carrusel— en
  1440, 768 y 390 px: ningún movimiento de scroll, un solo alto de documento, y
  la navbar escondida en las 90 muestras de 18 segundos. Antes el salto salía
  puntual a los 4, 8, 12, 16 y 20 segundos.

### Encontrado y no modificado

- **En 768 px la caja del titular varía 2 px entre servicios** (240 contra 242),
  porque el piso `sm:min-h-60` cae justo en el límite. No mueve el scroll —el
  navegador no reajusta por 3 px— y subir el piso cambiaría el reposo en el
  resto de los anchos, así que se deja.

## 2026-09-22 — Foto nueva de alineadores y texto del video

- **La tarjeta y el banner de "Alineadores y ortodoncia" usan la foto nueva**
  (`servicios/alineadores.png`, la mano con el alineador y la sonrisa), en vez
  de la anterior. `imageUrl` es el único campo que alimenta ambos lugares —la
  tarjeta del listado y el banner de su página—, así que un solo cambio bastó.
  Se borró el archivo viejo, que quedó sin ninguna referencia.
- **Foto cuadrada (851×851) con un solo `heroFoco`.** En la tarjeta (16:10) y en
  el banner (bastante más apaisado en escritorio, casi cuadrado en mobile) la
  caja siempre es igual o más ancha que 1:1, así que lo único que se recorta es
  arriba y abajo, nunca los costados. Medido con el mismo método de simulación
  de recorte que vengo usando: `center 37%` deja la sonrisa y el alineador
  enteros tanto en la ventana angosta de la tarjeta como en la más ajustada del
  banner de escritorio. Verificado en el navegador en los tres casos.
- **Texto del video de "Sobre el centro" reemplazado.** Decía "Más que un
  consultorio, un equipo que se lleva bien" —la palabra pedida fuera—. Ahora
  dice "Cuidar a otros empieza por un equipo que disfruta estar juntos", una
  versión acortada de la frase que pidió el centro ("Porque cuidar a otros
  también empieza por construir un equipo que disfruta de estar juntos"): la
  frase entera no entraba cómoda en el cuadro del video. Verificado en
  escritorio (dos líneas) y en mobile (tres), sin chocar con el botón de sonido.

### Encontrado y no modificado

- **La foto de alineadores se ve algo blanda en el banner de escritorio.** El
  archivo mide 851×851 y ya se sirve entero; en una pantalla grande el banner
  pide más ancho del que ese archivo tiene. Es el mismo tipo de límite que el
  banner de "Nuestra historia": hace falta el original en mayor resolución.

## 2026-09-22 — Banners de sección y la foto 2 de Daniela, más nítidos

- **Los banners de sección salían a 1920px pero se dibujan más anchos.** Son
  fotos apaisadas dentro de una franja todavía más apaisada, así que se ajustan
  por el alto y desbordan de costado: en un monitor de 1440 el de preguntas
  frecuentes se dibuja a 1801px, y en pantalla retina eso son 3602 píxeles
  reales. Ya bajaban el archivo entero y aun así no alcanzaba. Los originales
  son de 6192px, así que ahora salen por el preset `panoramica` (2560).
  `optimize-images.mjs`

  | Sección | Antes | Ahora |
  | --- | --- | --- |
  | Equipo | 57% | **75%** |
  | Recorrido | 67% | **89%** |
  | Contacto | 67% | **89%** |
  | Preguntas frecuentes | 53% | **71%** |

  El navegador recibe 175 KB en AVIF por banner: la mejora no se paga con peso.

- **La foto 2 de Daniela Giansetto se recorta en el archivo, no por CSS.** Era
  la única apaisada de las que van en tarjeta: en una tarjeta vertical se
  dibujaba al doble de ancho que la tarjeta y en un teléfono pedía 1965px de una
  foto que solo tiene 1536. Recortada a 4:5 —lo que se descarta es la pared
  vacía de la izquierda— ya no hay que agrandar nada: **de 104% a 149% en
  escritorio y de 55% a 78% en mobile**. Con esto tampoco hace falta su
  `fotoHoverFoco`, que existía para ir a buscarla al borde derecho.

### Encontrado y no modificado

- **El banner de "Nuestra historia" sigue en 58%.** Su original mide 1672×940 y
  ya se sirve entero: no hay de dónde sacar más. Hace falta la foto en grande.
- **La foto 2 de Daniela toca su techo en 78% en un teléfono de alta densidad.**
  El original mide 1536×1024, y recortado a la forma de la tarjeta quedan
  822×1024, que es todo lo que esa foto puede dar.

## 2026-09-22 — Eugenia Villalobos y el taller de adultos mayores

- **Bio ampliada** con lo que mandó el centro: disertante en la II Jornada de
  Actualización Científica del Hospital Nacional de Clínicas 2026, el posgrado
  en neurociencias cognitivas de la Universidad Favaloro, y el cierre sobre el
  lugar de la comunicación en el envejecimiento saludable. Su especialidad pasa
  a ser "Comunicación y Lenguaje de adultos mayores".
- **Sin teléfono**, como pidió el centro. Verificado: el número no aparece en
  ninguna parte de su página.
- **Área propia: "Taller de adultos mayores"**, y no fonoaudiología. En AURIS
  trabaja solo ahí, y el filtro del listado del equipo es por área: estaba
  apareciendo entre las fonoaudiólogas de consultorio, en un apartado donde no
  atiende. `areas.ts`
- **Tercera foto**: un collage de los talleres. Va a la grilla de su ficha, no
  al banner —que recorta una tira angosta y dejaría un mosaico de fotos
  cortadas—. El banner sigue con su foto 2.
- **El servicio del taller toma el texto del centro**: los Talleres de
  Conversación y de Memoria Auditiva, y el programa con su nombre propio,
  "Activos y Protagonistas". Antes describía actividades genéricas —actividad
  física suave, articulación con el médico tratante— que no son lo que se
  ofrece. `services.ts`

### Encontrado y no modificado

- Su ficha muestra dos recuadros vacíos donde irían sus fotos 4 y 5. Es el
  comportamiento normal de la plantilla para quien todavía no las mandó; se
  llenan solos cuando aparezcan.

## 2026-09-22 — Las tarjetas se veían borrosas: `sizes` otra vez

- **Las fotos de las tarjetas de servicio llegaban al 68% de densidad.** La
  caja es 16:10 pero varias fotos son panorámicas (2.35), y una foto más ancha
  que su caja se ajusta por el alto: se dibuja desbordada de costado. Medido en
  el navegador, una tarjeta de 377px dibujaba esas fotos a **554px**, pero
  `sizes` declaraba 360 y el navegador bajaba una variante de 750 para pintar
  1108 píxeles reales. Ahora declara una vez y media el ancho de la tarjeta.
  **De 68% a 109–125%** en escritorio y mobile. `ServiceCard.tsx`
- **Calidad 88 en vez de 75** en esas tarjetas: es la misma foto que el banner
  del servicio, que ya iba en 88, y en la tarjeta se recorta todavía más.
- **Lo mismo en las tarjetas del equipo.** Ahí la mayoría estaba bien —las fotos
  de retrato son más verticales que la tarjeta y se ajustan por el ancho— pero
  las pocas que tienen la segunda foto apaisada caían al 55–62% al pasar el
  cursor. `ProfessionalsDirectory.tsx`, `servicios/[slug]/page.tsx`
- **Peso verificado**: 0,56 MB de imágenes en `/servicios` en mobile y 0,31 MB
  en escritorio. Las variantes grandes que ahora se piden son AVIF de 47–108 KB.
- **Taller de adultos mayores** pasa a usar también la foto de la portada, que
  era el que faltaba de la tanda anterior.
- **El hero de la portada suma el filete verde** sobre la franja arena, el mismo
  remate que ya llevaban los banners de todas las secciones de la navbar.
  `Hero.tsx`
- **Los botones "Ver más servicios" y "Ver todo el equipo" dejan de ser
  planos.** Los dos viven sobre fondos verde o beige y, sin sombra ni relieve,
  se confundían con la sección. Ahora llevan degradé de arriba abajo, sombra
  apoyada y un filete de luz por dentro del borde —el mismo recurso que la
  pastilla del servicio en el hero—, y la sombra crece al pasar el cursor.
  `ShineButton.tsx`, tonos `outlinePrimary` y `soft`
- **Consultorio 4**: la primera foto cambió por una panorámica (1920×720, antes
  era vertical). Se actualizó su proporción y su descripción.

## 2026-09-22 — "Equipo" en la navbar y fotos unificadas con la portada

- **El enlace de la navbar dice "Equipo"** y no "Equipos". Sale de `mainNav` en
  `site.ts`, así que cambia a la vez en la barra de escritorio, el menú de
  mobile y el footer. La URL sigue siendo `/profesionales`.
- **Fonoaudiología, psicología y estética pasan a usar la misma foto que el
  carrusel de la portada**, en la tarjeta del listado y en el banner de su
  página. Quien entra desde la portada reconoce el servicio.
- **Odontología ya usaba la misma**: su `imageUrl` es la que muestra el hero, no
  hubo nada que cambiar.
- **`landingImageUrl` desaparece de esas tres**: al quedar igual que `imageUrl`,
  el hero la toma por defecto y el campo sobraba.
- **Encuadre propio para el banner del servicio** (`heroFoco`), distinto del de
  la portada. La caja del banner es bastante más apaisada que la del hero y
  recorta distinto: en psicología, el 55% que en el hero deja ver el escritorio
  acá le pegaba la cabeza al techo, así que va 30%. Verificado en escritorio y
  en mobile.

### Encontrado y no modificado

- **Taller de adultos mayores** sigue con fotos distintas entre la portada
  (`portada/taller-de-adultos-mayores.webp`) y su página (`/TallerAdultos.webp`).
  No estaba en el pedido.
- Quedaron sin referencia `/EsteticaCorporal.webp`, `/Piscologia.webp` y
  `/images/servicios/fonoaudiologia.webp`. No se borraron.

## 2026-09-22 — Los consultorios corren un lugar y entra el 3

Faltaba un consultorio en el recorrido. El primero de la izquierda no está
dentro del pasillo sino en su boca, y al no estar mapeado toda la numeración
quedaba corrida.

- **La boca del pasillo pasa a tener tres círculos**: consultorio 1 a la
  izquierda, seguir por el pasillo al centro y el baño a la derecha.
- **Los consultorios corren un lugar hacia atrás**. Odontología (1) pasa del
  primer tramo a la boca; odontopediatría (2), del segundo tramo al primero; el
  segundo tramo queda para el consultorio 3 nuevo.
- **Consultorio 3 — Odontología**, cuatro fotos nuevas.
  `assets/raw/images/instalaciones/consultorio-03/`
- **Kinesiología y estética pasa de 3 a 4**, con sus fotos movidas a
  `consultorio-4-estetica/`. Se borró la carpeta `consultorio-3/` de `public`,
  que quedaba con las fotos viejas sin referenciar.
- **El encuadre de la boca del pasillo va anclado al borde izquierdo**
  (`focoX: 0`), que es lo más lejos que el visor puede correrlo sin destapar la
  foto. Lo que se pierde por la derecha es el mostrador, que no lleva círculo.

### Verificado

Los 17 círculos y los "volver" apuntan a un nodo real; las 40 fotos existen y no
sobra ninguna. Recorrido completo caminado en el navegador: boca → consultorio 1
→ tramo 1 → tramo 2 → consultorio 3 → final → consultorio 4. Círculos dentro de
cuadro en 390, 768 y 1152px.

### Encontrado y no resuelto

**La puerta del consultorio 1 no llega a verse en pantallas anchas.** Asoma en
el filo de `pasillo-01`, del 0% al 3,5% del ancho, y en escritorio el recorte
empieza recién en el 4,8%: queda 74px afuera aun con el encuadre en su tope. El
círculo está en el 8% —el punto más pegado al borde que se puede tocar, contando
que el paneo del cursor lo corre hasta 13px más— así que señala hacia la puerta
pero no se apoya sobre ella. Se arregla con una toma que deje esa puerta más
adentro del cuadro.

## 2026-09-21 — Los dos carruseles de la portada se deslizan de a uno

- **Equipo.** La fila ya tenía anclaje, pero le faltaba `scroll-snap-stop:
  always`: sin eso el anclaje solo decide *dónde* frena la inercia, no *cuánto*
  recorre, así que un envión se llevaba media lista por delante. Con esa
  propiedad el navegador tiene que frenar en el siguiente punto, y un
  deslizamiento avanza una tarjeta.
- **La tarjeta queda centrada**, no pegada al borde: `snap-start` pasa a
  `snap-center`. Para que la primera y la última también puedan centrarse hace
  falta espacio antes y después —si no, el navegador no tiene a dónde
  desplazarse—, así que el relleno lateral pasa a medir lo que sobra de pantalla
  al costado de una tarjeta, partido dos. `TeamCarousel.tsx`
- **Reseñas.** Eran una cinta en bucle automático: una animación sobre
  `transform`, que no se puede agarrar ni frenar con el dedo —no hay puntero que
  la pause— y obligaba a perseguir la reseña para terminar de leerla. Hasta `md`
  pasa a ser scroll real con el mismo anclaje que el equipo; de `md` para arriba
  queda igual que siempre. `globals.css`, `TestimonialsSlider.tsx`
- **Las dos copias extra de las reseñas se ocultan en mobile.** Existen para que
  el bucle no tenga costura; deslizando a mano solo harían pasar tres veces por
  las mismas ocho.
- **Los degradados de los bordes salieron de la cinta.** Al volverse la cinta el
  elemento que se desplaza, un `absolute` adentro viaja con el contenido: se
  habrían despegado del borde al deslizar.

### Verificado

Estilos calculados en 390px: anclaje `x mandatory` en los dos carriles, `center`
y `always` en cada tarjeta, relleno de 67px (equipo) y 43px (reseñas) —
exactamente la mitad de lo que sobra—, y la animación de la cinta apagada con
solo 8 reseñas. En 1280px la cinta sigue animando con sus 24 tarjetas y sin
anclaje. Al desplazar, la tarjeta queda centrada con 0px de desvío.

### No verificado

El envión con inercia de un dedo real no se puede sintetizar en un navegador sin
pantalla: el arrastre se reproduce, la inercia no. Lo que sí está comprobado es
que `scroll-snap-stop: always` está aplicado en todas las tarjetas, que es la
propiedad que la limita. Conviene confirmarlo en un teléfono.

## 2026-09-21 — El pasillo del recorrido, ahora panorámico

- **Cuatro tomas nuevas del pasillo**, todas 2:1, reemplazan a las verticales.
  Se quitó la quinta. `pasillo-01` a `pasillo-04`
- **La ventana del visor pasa a ser apaisada también en el teléfono**
  (`aspect-4/3 sm:aspect-3/2`, antes `3/4 sm:4/3`). Era vertical de cuando las
  tomas lo eran; con una foto 2:1 adentro se veía un tercio del ancho y los
  círculos de las puertas quedaban fuera de cuadro. Ahora las panorámicas
  **cubren el contenedor** en los tres tamaños —63%, 71% y 75% del ancho a la
  vista, con el alto completo, techo incluido— y ninguna queda con barras. Las
  únicas dos que siguen mostrándose enteras son las que de verdad son
  verticales: la puerta del baño y la primera de kinesiología.
- **El pasillo se camina derecho.** Las cuatro tomas están hechas desde el mismo
  eje, así que el punto de fuga cae siempre en el mismo sitio de la foto. Se
  agregó `focoX` a `TourPhoto` para fijar ahí el encuadre en vez de usar el
  promedio de los círculos, que cambia en cada tramo según cuántas puertas haya
  y hacía saltar el fondo de costado al avanzar. Verificado: el fondo cae en el
  **44,0% del ancho de la pantalla en los tres tramos y en los tres tamaños**.
- **Círculos recolocados** sobre las puertas reales de las tomas nuevas: el baño
  sobre la hoja negra y la boca del pasillo a la izquierda en la primera; los
  consultorios y el laboratorio en las demás. Los dos de la primera toma van más
  juntos de lo que pediría la foto: cuanto más separados, menos entran juntos en
  la ventana de un teléfono.
- **Dos fotos nuevas en el consultorio de psicología**, en el orden pedido.
- Se actualizaron los pies que describían el encuadre viejo.

### Verificado

Las 37 fotos existen, las proporciones declaradas coinciden con las reales y no
sobra ninguna. Los círculos entran todos en 390×293, 768×512 y 1152×720.

## 2026-09-21 — Fuera el teléfono del pie de cada ficha

- **Se eliminó el bloque "Turnos y consultas"** del final de la ficha de cada
  profesional, para todo el equipo. No queda ningún teléfono en esas páginas:
  el único que sigue apareciendo es el del footer del sitio, que es el fijo del
  centro y va en todas las páginas por igual.
- Se borró el dato de los doce profesionales (`trayectorias.ts`), el campo
  `contactos` del tipo `Trayectoria` y el bloque que lo dibujaba en
  `ProfessionalFicha.tsx`, para que no quede el hueco esperando un dato que ya
  no va a existir.
- **El botón "Solicitar turno con…" no se tocó**: sigue en su lugar y sigue
  yendo al WhatsApp del centro.

## 2026-09-21 — Fotos propias para el carrusel de la portada

- **Cuatro fotos nuevas solo para el hero de la portada**: psicología,
  fonoaudiología, taller de adultos mayores y estética. Odontología queda con
  la suya. `public/images/servicios/portada/`
- **Campos nuevos `landingImageUrl` y `landingFoco`**, y no un reemplazo de
  `imageUrl`, porque el cambio era solo para la portada: la tarjeta del
  servicio y el banner de su página siguen con la foto del catálogo.
  Verificado: las cuatro páginas de servicio sirven su imagen de siempre.
- **Encuadre por foto, medido y no a ojo.** En mobile la caja del hero es
  390×894 —casi el doble de alta que ancha—, así que de una foto apaisada 2.34
  entra apenas el **18,8% del ancho**. Centradas, en estética y fonoaudiología
  se veía la camilla y el fondo en vez de la profesional, que están al 30% y al
  33% del ancho. Los valores salen de simular el recorte real en 1920×780 y en
  390×894. En escritorio la caja es más apaisada que la foto, así que se ve el
  ancho completo y el eje X no cambia nada: el encuadre trabaja solo en mobile.
- **La miniatura del abanico usa la misma foto y el mismo encuadre**: es
  vertical y recorta igual de fuerte, y con fotos distintas la tarjeta y el
  fondo no se leían como el mismo servicio.
- **Las fuentes se movieron** de `assets/raw/images/profesionales/Slider-HERO/`
  a `assets/raw/images/servicios/portada/`, con el nombre del slug. En la
  carpeta anterior el optimizador las tomaba como retrato de profesional —el
  preset se elige por carpeta, en cualquier nivel de la ruta— y además las
  mayúsculas de `Slider-HERO` quedaban en la URL. 6,4 MB → 637 KB.

- **Psicología sube a `37% 55%`** para que entre el escritorio con los papeles.
  Con el 22% anterior la foto se cortaba justo debajo de sus manos. Solo afecta
  a escritorio: en mobile la caja es tan vertical que de esta foto se ve el alto
  completo y el eje Y no cambia nada.

### Controles del carrusel: se podían tocar mal

- **Los puntitos medían 6×6 px.** Ahora el punto se sigue dibujando de 6px pero
  lo que se toca es un `::before` invisible: **15×45 px** los inactivos y 33×45
  el activo. El hueco entre puntos pasó de 6 a 10px para poder darles 5 de cada
  lado —la caja no puede pasarse de la mitad del hueco o se montan entre sí y el
  de al lado se queda sin poder tocar—. Verificado: los cinco llevan a su slide.
- **Las flechas pasan de 40 a 44px**, el mínimo con el que un dedo acierta sin
  apuntar.

### Encontrado y no modificado

- **En un teléfono los controles caen justo en el pliegue**: en 390×844 quedan
  en y=845, un píxel por debajo del borde. Es consecuencia de que el hero mida
  894px de alto; moverlos sería cambiar la composición de la portada.
- **En escritorio el texto se apoya sobre la profesional** en psicología y
  fonoaudiología: en esas tomas está en el tercio izquierdo, que es donde va el
  bloque de texto. No se puede corregir con `object-position` —en un monitor de
  1920 la foto entra entera y el encuadre no tiene margen para correrla—. El
  degradé y la sombra del texto sostienen la lectura, igual que en odontología.

## 2026-09-21 — Hero: la onda cortada y el carrusel de 8 a 5

- **La franja de la onda salía rebanada en el pico de la derecha.** Las tiras de
  color no son trazos, son copias del mismo relleno corridas hacia arriba; sin
  aire por encima de la curva, lo que estaba cerca del techo del lienzo se iba
  afuera y el navegador lo cortaba al ras. La curva `hero` sube hasta **11,6
  unidades del techo en x≈1072 de 1440** —el pico del lado derecho—, y su franja,
  corrida 30 unidades, terminaba en **−18**. `alta` y `extra` ya reservaban ese
  aire; `normal`, que es la que usa el hero, no. Ahora lo reserva en cuanto hay
  tiras. `WaveDivider.tsx`
- **La curva no cambió de tamaño ni de lugar**: el lienzo pasa de 160 a 220
  unidades y la altura en pantalla acompaña ×1,375 (66 / 88 / 132px contra
  48 / 64 / 96). Verificado en los tres breakpoints: misma escala, 0,6px por
  unidad, igual que antes.
- **El carrusel del hero pasa de 8 servicios a 5**: Odontología, Psicología,
  Fonoaudiología, Taller de adultos mayores y Estética facial y corporal, en ese
  orden. El listado completo sigue en la página de servicios.
- **Va en una lista propia (`heroServices`) y no en un recorte de
  `listedServices`**, porque ese mismo arreglo alimenta el menú, el footer, la
  grilla y el contador de servicios de las cifras: recortarlo ahí habría
  encogido las cuatro cosas. Además el orden lo manda el centro, no el catálogo.
  `services.ts`
- **Descripciones del hero reescritas** para esos cinco, más cercanas y
  concretas. `heroTitle` y `heroSubtitle` solo los usa el hero, así que no
  afectan a las páginas de servicio.
- **El abanico no necesitó cambios**: ya repartía las tarjetas por distancia al
  activo, así que con cinco muestra cuatro en escritorio y tres en mobile, y la
  quinta sale por la izquierda.

## 2026-09-21 — Auditoría de imágenes: `sizes` declaraba el ancho equivocado

Un mismo error repetido en seis componentes, y la causa de que las fotos se
vieran pixeladas en mobile y bien en escritorio.

- **El problema.** `sizes` tiene que declarar el ancho al que se **dibuja** la
  foto, no el ancho del contenedor. Cuando una foto apaisada llena con
  `object-cover` una caja más vertical que ella, el que manda es el alto: la
  foto se dibuja mucho más ancha que la caja y se sale por los costados. Todos
  estos componentes declaraban `100vw`, así que el navegador bajaba una variante
  del ancho de la pantalla y la estiraba.
- **Medido en un teléfono de 390px con pantalla retina**, antes → después:

  | Componente | Se dibuja a | Declaraba | Estiraba |
  | --- | --- | --- | --- |
  | `StickyTreatment` | ~1992px | 390px | 4,8× |
  | `Hero` (portada) | 1105–1722px | 390px | 4,2× |
  | `PageHeader` | 715–1258px | 390px | 2,4× |
  | `ServiceFan` | ~356px | 160px | 1,9× |
  | Hero de servicio | 640–936px | 390px | 1,7× |
  | `HistoryTimeline` | ~768px | 512px | 1,4× |

- **La densidad del hero** —píxeles servidos sobre píxeles necesarios— pasa de
  24–37% a 52–83% según el servicio, sin crear ningún archivo nuevo ni cambiar
  el diseño.
- **No se crearon variantes mobile.** Se simuló el recorte real de las nueve
  fotos del hero en 390×736: las caras entran enteras en todas y el
  `object-position: center 25%` funciona. El problema era de resolución, no de
  composición, así que una variante mobile no habría arreglado nada.
- **`ServiceCard`, `ProfessionalCard`, `TeamCarousel` y `ProfessionalFicha` no
  se tocaron**: su `sizes` ya era correcto. En las tarjetas de profesional
  porque las fotos 1 y 2 son todas más verticales que el `aspect-4/5` de la
  tarjeta, así que ahí manda el ancho.

### Encontrado y no modificado

- **`public/ChicaTratamiento.webp`** (1584×672, 38 KB) se dibuja a ~2000px de
  ancho y no tiene original en `assets/raw/`. Es el único caso que no se puede
  arreglar sin un archivo nuevo.
- **Tres fotos del hero están sueltas en la raíz de `public/`**, fuera del
  pipeline de optimización: `EsteticaCorporal.webp`, `Piscologia.webp` (nombre
  mal escrito) y `TallerAdultos.webp`.
- **`bruxismo-y-disfunciones` usa un banner de sección como hero**
  (`banner-servicios.webp`). Tiene original de 6192×3962, pero el pipeline topa
  en 1920.
- **`fonoaudiologia.webp`** es la más chica del hero: 1264×842, y su original
  mide lo mismo.
- **El abanico de servicios monta las ocho fotos** en el área del hero. Llevan
  `loading="lazy"`, que no difiere lo que está dentro del viewport.

## 2026-09-19 — Las fotos verticales del recorrido se muestran enteras

- **Las fotos verticales ya no se recortan.** El visor estiraba cada foto hasta
  llenar la ventana apaisada; de una foto 9:16 eso mostraba un tercio, sin techo
  ni piso —justo donde están las puertas y los carteles—, y ese tercio se
  dibujaba al triple de su tamaño, así que salía recortada *y* borrosa. Ahora,
  cuando habría que agrandarla más de lo razonable, la foto se muestra completa
  con la altura de la ventana. En escritorio pasa de dibujarse a 1358px de ancho
  a 405px: entra entera y nítida. `LIMITE_RECORTE` en `TourViewer.tsx`
- **Los costados los llena la misma foto ampliada y desenfocada**, en una
  variante de 64px —va a salir borrosa igual—, para que se lea como una decisión
  y no como un error de tamaño.
- **Las fotos apaisadas no cambian**: siguen llenando la ventana y con el paneo
  del cursor, que es como estaban.
- **`sizes` por modo.** Una vertical ahora ocupa un tercio del ancho de la
  ventana: pedir lo mismo que antes bajaba cinco veces los píxeles que se ven.
- **El círculo "Ir al pasillo" estaba en el lugar equivocado**: apuntaba a la
  pared de la derecha de recepción, sobre el cartel de profesionales. El pasillo
  es el hueco del extremo izquierdo. Se corrigió y se reubicaron también los de
  `pasillo`, `pasillo-2` y `pasillo-3`, que estaban sobre el marco de la puerta
  en vez de sobre la abertura.
- **Los círculos se ven más.** Pasaron de 28 a 32px y llevan un halo oscuro
  detrás: un aro blanco fino sobre la pared clara de recepción desaparecía.
- **Salida rápida desde el pasillo de vuelta.** Al volver del consultorio 3 o
  del 5 se llegaba a una parada con una sola salida, a la boca del pasillo: ver
  el otro consultorio obligaba a recorrerlo entero de nuevo. Ahora hay dos
  círculos, "Ir a recepción" y "Seguir por el pasillo" —que devuelve al final,
  donde están los dos consultorios—.
- **Sin `useCallback` en el visor.** El React Compiler no podía probar que los
  valores medidos de la ventana no cambiaran después y abandonaba la
  optimización del componente entero (`react-hooks/preserve-manual-memoization`).
- `docs/fotos-verticales-recorrido.md` (nuevo) — las 9 fotos verticales con su
  resolución y cuáles conviene volver a sacar.

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
