# Cómo se nombran y usan las fotos de cada profesional

Cada profesional de AURIS necesita **6 fotos**. Cada una tiene un lugar fijo
en su página de detalle: si falta alguna, ese lugar muestra un bloque de color
con sus iniciales en vez de romperse o quedar vacío. Apenas subís la foto con
el nombre correcto, aparece sola — no hace falta pedir ningún cambio de código.

## 1. Cómo nombrar los archivos

**Patrón:** `[Nombre]_[número].webp` — por ejemplo `Ariel_1.webp`, `Ariel_2.webp`,
... hasta `Ariel_6.webp`.

- `[Nombre]` es el nombre de pila, **sin tildes** (ver la tabla de la sección 3
  para el de cada uno).
- `[número]` va del 1 al 6, siempre con ese mismo orden (ver la tabla de la
  sección 2).
- Podés entregarlas en cualquier formato común (JPG, PNG, HEIC, WebP): el
  pipeline las convierte. Lo que importa es el nombre.

**Regla para nombres repetidos:** hoy hay dos "Eugenia" en el equipo (Leiva y
Villalobos). Para que sus fotos no se confundan, a las dos se les agrega la
inicial del apellido:

- Eugenia **Leiva** → `EugeniaL_1.webp` … `EugeniaL_6.webp`
- Eugenia **Villalobos** → `EugeniaV_1.webp` … `EugeniaV_6.webp`

Al resto, que tiene nombre de pila único en el equipo, le alcanza con el
nombre solo (`Carla_1.webp`, `Tomas_1.webp`, etc.).

**Si en el futuro se suma alguien con un nombre que ya existe** en el equipo,
se aplica la misma regla: nombre + inicial del apellido para los dos. Avisame
cuando pase y actualizo la lista de la sección 3.

## 2. Qué es cada una de las 6 imágenes

| # | Qué mostrar | Dónde se usa | Encuadre recomendado |
|---|---|---|---|
| **1** | La foto oficial — la imagen de presentación del profesional | **En todo el sitio**: la grilla de "Nuestro equipo" de la portada, las tarjetas de "profesionales asociados" en cada página de servicio, la foto del hero (arriba de todo) en su propia ficha, **y** la foto de la sección de cifras (al final de la ficha, no le pedimos una foto aparte para eso: reutiliza esta) | Vertical, retrato, 4:5 (por ejemplo 800×1000) |
| **2** | Una segunda foto para el hero de su ficha | Solo en el hero (sección 1) de su propia página: alterna con la imagen 1 automáticamente, ver el comportamiento abajo | Vertical, mismo encuadre que la 1 (misma pose o una variación natural) |
| **3** | Foto "en acción" — atendiendo, trabajando | La foto **grande** del mosaico de "Formación y trayectoria" (sección 2 de su ficha) | Vertical, aprox. 3:4 |
| **4** | Foto "en acción" — atendiendo, trabajando | Una de las dos fotos **chicas** del mosaico de "Formación y trayectoria" | Casi cuadrada |
| **5** | Foto "en acción" — atendiendo, trabajando | La otra foto **chica** del mosaico de "Formación y trayectoria" | Casi cuadrada |
| **6** | Una foto para el fondo del banner con frase destacada (sección 3 de su ficha) | Fondo del banner oscuro (azul o rosa según el profesional) | Horizontal, bien ancha (ej. 1920×1080). **Importante:** que la persona quede centrada verticalmente pero corrida hacia la **derecha** del encuadre — el lado izquierdo del banner lo tapa el texto, así que si la persona queda muy a la izquierda, el texto le tapa la cara |

### El comportamiento especial de las imágenes 1 y 2 (hero)

En la parte de arriba de la ficha del profesional, la foto no queda fija: cada
3 segundos alterna suavemente (con un fundido, nunca un corte brusco) entre la
imagen 1 y la imagen 2, en loop todo el tiempo que la página esté abierta. Si
alguien pasa el mouse por encima de la foto, se queda mostrando la imagen 2
mientras el cursor esté ahí, y en cuanto lo saca vuelve a alternar sola.

Por eso conviene que la imagen 2 sea una variación de la 1 — otra expresión,
otro ángulo suave, con bata o sin ella — más que una foto completamente
distinta: da la sensación de "cobrar vida", no de un cambio brusco de persona.

## 3. Nombre de archivo de cada profesional

| Profesional | Nombre en el archivo | Carpeta (`assets/raw/` y `public/`) |
|---|---|---|
| Dr. Ariel Vidal | `Ariel` | `ariel-vidal/` |
| Dra. Carla Fernández | `Carla` | `carla-fernandez/` |
| Dra. Claudia Tomasi | `Claudia` | `claudia-tomasi/` |
| Dra. Laura Mansilla | `Laura` | `laura-mansilla/` |
| Lic. Eugenia Leiva | `EugeniaL` | `eugenia-leiva/` |
| Lic. Romina Tchakerian | `Romina` | `romina-tchakerian/` |
| Lic. Eugenia Villalobos | `EugeniaV` | `eugenia-villalobos/` |
| Dra. Daniela Giansetto | `Daniela` | `daniela-giansetto/` |
| Dra. Rocío Matteucci | `Rocio` | `rocio-matteucci/` |
| Dr. Santiago Rodriguez | `Santiago` | `santiago-rodriguez/` |
| Lic. Soledad Di Martino | `Soledad` | `soledad-di-martino/` |

## 4. Dónde poner los archivos

Las fotos **originales** (las que salen de la cámara o el teléfono, tal cual)
van en:

```
assets/raw/images/profesionales/<carpeta-del-profesional>/
```

Por ejemplo, las 6 fotos de Carla Fernández:

```
assets/raw/images/profesionales/carla-fernandez/
  Carla_1.webp   (o .jpg, .png, .heic...)
  Carla_2.webp
  Carla_3.webp
  Carla_4.webp
  Carla_5.webp
  Carla_6.webp
```

Después corré (una sola vez, para todas las fotos nuevas que hayas dejado):

```bash
npm run optimize:images
```

Esto las procesa y las deja listas en `public/images/profesionales/<carpeta>/`,
que es de donde las lee el sitio. **No subas nada directo a `public/`** — el
pipeline es el que arma esa carpeta.

## 5. Cuándo se ven en el sitio

- **La ficha del profesional** (sección 2, 3 y 4, y la imagen 2 del hero): en
  cuanto corriste `npm run optimize:images`, se ven al recargar la página —no
  hace falta reiniciar nada más.
- **La foto 1 en las tarjetas** (portada, listados de servicio) y en la imagen
  por defecto del hero: se toman en un paso que corre solo antes de
  `npm run dev` y de `npm run build`. Si el servidor de desarrollo ya estaba
  corriendo cuando subiste la foto, hace falta reiniciarlo (`Ctrl+C` y de
  nuevo `npm run dev`) para que la tome.
- En el deploy no hay nada extra que hacer: `npm run build` hace todo junto.

## 6. Mientras falta alguna foto

Ningún lugar queda roto ni vacío: se ve un bloque de color (azul para
varones, rosa para mujeres) con las iniciales del profesional, del mismo
tamaño y forma que tendría la foto. Se puede ir subiendo de a una — no hace
falta tener las 6 para empezar a ver resultados.
