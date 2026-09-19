# PROMPT TÉCNICO — RECREACIÓN DEL RECORRIDO INTERACTIVO DE INSTALACIONES

## Objetivo

Recrear dentro del sitio web el recorrido fotográfico de las instalaciones utilizando las nuevas imágenes disponibles en:

```text
raw/instalaciones/
```

La experiencia debe sentirse como un recorrido físico por el establecimiento, inspirado en la lógica de navegación de Google Maps / Street View, **pero sin implementar una vista 360°**.

El usuario debe poder:

1. Avanzar entre distintos sectores mediante círculos/hotspots interactivos.
2. Entrar a un consultorio o ambiente.
3. Recorrer las fotografías de ese ambiente mediante flechas laterales.
4. Volver al recorrido principal mediante hotspots de salida.
5. Navegar de manera fluida y visualmente coherente.
6. Usar el recorrido correctamente tanto en desktop como en mobile.

---

# 1. FUENTE DE VERDAD

La carpeta:

```text
raw/instalaciones/
```

es la fuente principal de imágenes para este recorrido.

**Antes de modificar código:**

- Inspeccionar toda la estructura de `raw/instalaciones/`.
- Revisar todas las subcarpetas.
- Identificar todas las imágenes disponibles.
- Respetar los nombres reales de archivos.
- Determinar visualmente qué imagen corresponde a cada sector.
- Comparar las imágenes con el plano proporcionado.
- No inventar rutas ni relaciones entre imágenes sin verificar primero la estructura real.

## Regla de la primera imagen

La primera imagen que corresponda al inicio de un ambiente debe ser la **imagen inicial de ese ambiente**.

Una vez dentro de ese ambiente, las demás fotografías se recorren mediante las flechas laterales.

No convertir cada fotografía en un nodo independiente del recorrido principal salvo que el plano o las reglas específicas indiquen lo contrario.

---

# 2. NOMENCLATURA DE CONSULTORIOS

Hay una aclaración importante sobre el plano anterior:

- `C1` = Consultorio 1.
- `C2` = Consultorio 2.
- `C3` = Consultorio 3.
- `C5` = el equivalente al `C4` del plano/recorrido anterior.

Por lo tanto, **no crear dos destinos distintos para C4 y C5 si físicamente representan el mismo ambiente**.

La nomenclatura actual de carpetas/archivos debe considerarse la fuente técnica actual, mientras que la equivalencia C5 = antiguo C4 debe respetarse al reconstruir el recorrido.

---

# 3. DOS NIVELES DE NAVEGACIÓN

La implementación debe separar conceptualmente dos tipos de navegación.

## Nivel A — Recorrido

Sirve para moverse físicamente entre sectores.

Ejemplo:

```text
Pasillo
   ↓
Consultorio 1
   ↓
Pasillo
   ↓
Consultorio 2
```

La navegación se realiza mediante **hotspots/círculos interactivos sobre la fotografía**.

## Nivel B — Navegación interna del ambiente

Una vez que el usuario entra a un ambiente, por ejemplo:

```text
Consultorio 1
```

debe poder visualizar:

```text
consultorio1/01.webp
consultorio1/02.webp
consultorio1/03.webp
consultorio1/04.webp
```

mediante:

```text
←                           →
```

No mostrar miniaturas debajo del visor.

---

# 4. IMPORTANTE — NO USAR MINIATURAS

Eliminar de la experiencia cualquier concepto de:

- thumbnails;
- subcuadrados;
- miniaturas debajo de la fotografía;
- tira horizontal de imágenes;
- previews inferiores del mismo ambiente.

### Ejemplo

Si estamos viendo:

```text
Consultorio 1 / imagen 01
```

NO debe aparecer debajo:

```text
[imagen 02] [imagen 03] [imagen 04]
```

En cambio, debe existir:

```text
                    ←       →
```

sobre los laterales del visor.

El usuario va recorriendo las fotografías una por una.

Esto debe hacer que la experiencia se sienta como un recorrido y no como una galería fotográfica convencional.

---

# 5. FLECHAS LATERALES

Implementar dos controles laterales:

```text
←                                      →
```

## Flecha izquierda

Muestra la fotografía anterior del ambiente actual.

## Flecha derecha

Muestra la fotografía siguiente del ambiente actual.

## Primera imagen

Si estamos en la primera imagen:

```text
01.webp
```

no debe existir una navegación anterior válida.

La flecha izquierda puede ocultarse o mostrarse deshabilitada de forma elegante.

## Última imagen

Si estamos en la última:

```text
04.webp
```

la flecha derecha debe ocultarse o quedar deshabilitada.

## Importante

Las flechas deben navegar **únicamente dentro del ambiente actual**.

No deben llevar automáticamente al siguiente consultorio.

El cambio de ambiente se realiza mediante hotspots del recorrido.

---

# 6. ANIMACIONES

La experiencia debe sentirse:

- suave;
- moderna;
- premium;
- fluida;
- interactiva;
- natural.

La referencia conceptual es la sensación de navegación de Google Maps / Street View, **sin 360°**.

## Evitar

No utilizar:

- rebotes exagerados;
- zooms agresivos;
- animaciones largas;
- transiciones tipo presentación de PowerPoint;
- efectos innecesarios;
- movimientos que distraigan de las fotografías.

## Recomendado

Para cambiar de imagen:

- crossfade;
- fade + pequeño desplazamiento;
- slide extremadamente sutil;
- transición combinada de baja intensidad.

La animación debe ser suficientemente rápida para no hacer sentir al usuario que la interfaz está esperando.

---

# 7. HOTSPOTS / CÍRCULOS INTERACTIVOS

Los círculos sobre las fotografías representan puntos de navegación.

No deben verse como botones tradicionales.

Deben integrarse visualmente con la fotografía.

## Comportamiento

Un hotspot puede tener:

- posición X;
- posición Y;
- etiqueta;
- destino;
- tipo de navegación;
- estado hover;
- estado activo/focus.

## Posicionamiento

Utilizar posiciones relativas al contenedor.

Preferentemente:

```text
x: 72%
y: 48%
```

y no:

```text
left: 731px;
top: 284px;
```

Esto es importante para responsive.

La posición debe mantenerse correctamente cuando cambia:

- tamaño de pantalla;
- resolución;
- ancho del contenedor;
- orientación del dispositivo.

---

# 8. CASO ESPECIAL — entrada3.webp

La imagen:

```text
entrada3.webp
```

es un punto de bifurcación.

Debe contener exactamente dos círculos.

## Hotspot izquierdo

Ubicación:

```text
izquierda
```

Destino:

```text
entrada4.webp
```

Conceptualmente:

```text
entrada3.webp
      ↓
   izquierda
      ↓
entrada4.webp
```

Este camino corresponde a la **sala de espera**.

## Hotspot derecho

Ubicación:

```text
derecha
```

Destino:

```text
entrada5.webp
```

Conceptualmente:

```text
entrada3.webp
      ↓
    derecha
      ↓
entrada5.webp
```

Este camino corresponde a la **recepción**.

## Requisito visual

Los dos hotspots deben ser claramente distinguibles.

No utilizar botones rectangulares tradicionales.

Deben sentirse como puntos de navegación dentro del espacio.

---

# 9. CASO ESPECIAL — BAÑO

En:

```text
pasillo-01.webp
```

debe existir un hotspot en la parte derecha.

La etiqueta debe decir:

```text
Baño
```

## Flujo obligatorio

Al hacer click:

```text
pasillo-01.webp
        ↓
      Baño
        ↓
pasillo-1.5baños.webp
        ↓
carpeta baño
```

La primera imagen que debe aparecer al seleccionar el baño es:

```text
pasillo-1.5baños.webp
```

**No saltarse esta imagen.**

Después de `pasillo-1.5baños.webp`, deben aparecer las imágenes de:

```text
raw/instalaciones/baño/
```

respetando su orden numérico/natural.

Ejemplo conceptual:

```text
pasillo-1.5baños.webp
        ↓
baño/01.webp
        ↓
baño/02.webp
        ↓
baño/03.webp
        ↓
...
```

Estas fotografías deben utilizar las mismas flechas laterales que el resto de ambientes.

---

# 10. CASO ESPECIAL — SALIDA DE KINESIOLOGÍA C3

El Consultorio 3 corresponde a Kinesiología.

Cuando el usuario esté dentro de este consultorio y presione el hotspot/círculo de volver, **NO debe regresar directamente a `pasillo-01.webp`**.

Debe seguir obligatoriamente:

```text
Consultorio 3 — Kinesiología
              ↓
       círculo de volver
              ↓
        pasillovolver
              ↓
      hotspot del pasillo
              ↓
        pasillo-01.webp
```

Por lo tanto:

```text
C3 → pasillovolver → pasillo-01.webp
```

pero siempre pasando visualmente por:

```text
pasillovolver
```

---

# 11. CASO ESPECIAL — SALIDA DE PSICOLOGÍA C5

El Consultorio 5 corresponde a Psicología.

Cuando el usuario esté dentro de este consultorio y presione el hotspot/círculo de volver, aplicar exactamente la misma lógica:

```text
Consultorio 5 — Psicología
              ↓
       círculo de volver
              ↓
        pasillovolver
              ↓
      hotspot del pasillo
              ↓
        pasillo-01.webp
```

Nunca hacer:

```text
C5 → pasillo-01.webp
```

sin mostrar previamente:

```text
pasillovolver
```

---

# 12. pasillovolver

`pasillovolver` debe funcionar como un **nodo de transición específico**.

Desde esta imagen debe existir el hotspot necesario para regresar a:

```text
pasillo-01.webp
```

Por lo tanto:

```text
pasillovolver
      ↓
hotspot del pasillo
      ↓
pasillo-01.webp
```

Este comportamiento debe estar implementado explícitamente.

---

# 13. CONSULTORIOS

Cada consultorio debe funcionar como un ambiente independiente.

Al seleccionar el hotspot de un consultorio:

1. Entrar en el consultorio.
2. Mostrar su primera fotografía.
3. Permitir navegar las demás fotografías mediante flechas laterales.
4. Mostrar el hotspot de volver cuando corresponda.
5. Respetar las reglas especiales de salida.

Ejemplo:

```text
Pasillo
  ↓
[Hotspot Consultorio 1]
  ↓
C1 / imagen 01
  ↓
← C1 / imagen anterior
→ C1 / imagen siguiente
```

No mostrar thumbnails.

---

# 14. ARQUITECTURA RECOMENDADA

No implementar todo mediante una enorme cantidad de:

```ts
if (...)
else if (...)
else if (...)
```

La navegación debería estar representada mediante datos.

Conceptualmente:

```ts
type TourImage = {
  id: string
  src: string
  hotspots?: Hotspot[]
}

type Hotspot = {
  id: string
  x: number
  y: number
  label?: string
  target: string
  type: "room" | "transition" | "back"
}
```

Y cada ambiente podría definirse conceptualmente como:

```ts
const tourRooms = {
  consultorio1: {
    images: [
      "01.webp",
      "02.webp",
      "03.webp"
    ]
  },

  consultorio2: {
    images: [
      "01.webp",
      "02.webp"
    ]
  }
}
```

La estructura exacta puede adaptarse a la arquitectura existente del proyecto.

La idea fundamental es:

> **El recorrido debe ser declarativo y mantenible.**

Modificar el orden o agregar una fotografía no debería requerir reescribir toda la lógica del componente.

---

# 15. ESTADO DE LA INTERFAZ

El sistema debería distinguir al menos:

```text
currentLocation
currentImageIndex
```

Ejemplo conceptual:

```ts
currentLocation = "consultorio1"
currentImageIndex = 0
```

Si se presiona la flecha derecha:

```ts
currentImageIndex++
```

Si se presiona la izquierda:

```ts
currentImageIndex--
```

Si se selecciona un hotspot:

```ts
currentLocation = target
currentImageIndex = 0
```

Esto garantiza que al entrar a un nuevo ambiente siempre se muestre su primera imagen.

---

# 16. PRELOAD DE IMÁGENES

Como las fotografías son el elemento principal del recorrido, evaluar precargar al menos:

- imagen actual;
- imagen siguiente;
- imagen anterior.

Esto puede ayudar a evitar flashes o pantallas vacías durante la navegación.

No bloquear la interfaz esperando cargar toda la carpeta si no es necesario.

Priorizar una experiencia fluida.

---

# 17. RESPONSIVE

El recorrido debe funcionar correctamente en:

- desktop;
- notebook;
- tablet;
- mobile vertical;
- mobile horizontal.

## Hotspots

Las posiciones deben ser relativas.

## Flechas

Deben tener un área táctil suficientemente grande.

No hacer que el usuario tenga que tocar un píxel exacto.

## Fotografía

El visor debe adaptarse al tamaño disponible sin deformar las imágenes.

No estirar imágenes artificialmente.

Utilizar la estrategia de `object-fit` adecuada según el diseño actual.

---

# 18. ACCESIBILIDAD

Los hotspots y controles deben ser elementos interactivos reales.

Agregar labels accesibles.

Ejemplos:

```text
"Ir a recepción"
"Ir a sala de espera"
"Ir al baño"
"Ver imagen anterior"
"Ver imagen siguiente"
"Volver al pasillo"
```

No depender exclusivamente de:

```text
hover
```

porque en dispositivos táctiles no existe hover convencional.

---

# 19. EXPERIENCIA VISUAL

El recorrido debe integrarse con el diseño existente del sitio.

No crear una interfaz que parezca un proyecto separado.

Debe existir coherencia en:

- bordes;
- sombras;
- radios;
- tipografía;
- botones;
- animaciones;
- colores;
- espaciados.

Sin embargo, el visor debe seguir siendo el protagonista.

Evitar sobrecargarlo con:

- textos;
- paneles;
- controles innecesarios;
- información duplicada.

---

# 20. NO HACER

No hacer ninguna de estas cosas:

- ❌ No implementar 360°.
- ❌ No mostrar thumbnails debajo del visor.
- ❌ No mostrar las imágenes del mismo consultorio como subcuadrados.
- ❌ No alterar arbitrariamente el orden de imágenes.
- ❌ No saltarse `pasillo-1.5baños.webp`.
- ❌ No saltarse `pasillovolver`.
- ❌ No hacer que C3 o C5 vuelvan directamente a `pasillo-01.webp`.
- ❌ No crear C4 y C5 como dos ambientes si representan el mismo espacio según la aclaración dada.
- ❌ No usar posiciones de hotspots rígidas en píxeles si pueden romperse en responsive.
- ❌ No llenar la interfaz de botones tradicionales.
- ❌ No utilizar animaciones exageradas.
- ❌ No inventar imágenes que no estén en `raw/instalaciones`.
- ❌ No modificar nombres de archivos sin necesidad.

---

# 21. PROCEDIMIENTO DE IMPLEMENTACIÓN

## Paso 1 — Inspeccionar archivos

Analizar:

```text
raw/instalaciones/
```

y todas sus subcarpetas.

Generar mentalmente/internamente un inventario:

```text
carpeta
 ├── imagen 1
 ├── imagen 2
 ├── imagen 3
 └── ...
```

## Paso 2 — Analizar el plano

Comparar las imágenes con el plano proporcionado.

Determinar:

- dónde comienza el recorrido;
- qué imágenes corresponden al pasillo;
- qué imágenes corresponden a recepción;
- qué imágenes corresponden a sala de espera;
- qué imágenes corresponden a cada consultorio;
- dónde está el baño;
- cómo se conectan los ambientes.

## Paso 3 — Crear el mapa de navegación

Definir:

```text
imagen actual
    ↓
hotspot
    ↓
imagen destino
```

## Paso 4 — Crear estructura de datos

Separar:

```text
nodos del recorrido
```

de:

```text
imágenes internas de cada nodo
```

## Paso 5 — Implementar navegación

Implementar:

- hotspots;
- flechas;
- volver;
- cambios de ambiente;
- índice de imagen.

## Paso 6 — Implementar excepciones

Comprobar específicamente:

```text
entrada3 → entrada4
entrada3 → entrada5
```

```text
pasillo-01 → pasillo-1.5baños → baño
```

```text
C3 → pasillovolver → pasillo-01
```

```text
C5 → pasillovolver → pasillo-01
```

## Paso 7 — Animaciones

Agregar transiciones suaves después de tener correcta la lógica.

Primero:

> lógica correcta

Después:

> animaciones

No invertir ese orden.

## Paso 8 — Responsive

Probar en distintos tamaños.

## Paso 9 — QA completo

Recorrer manualmente todo el sistema.

---

# 22. CRITERIOS DE ACEPTACIÓN

El trabajo se considera correctamente implementado cuando se cumplen todas estas condiciones:

### Estructura

- [ ] Se analizaron todas las carpetas de `raw/instalaciones`.
- [ ] Se respetan las imágenes existentes.
- [ ] El orden de las fotografías es correcto.
- [ ] Cada ambiente comienza con su fotografía correspondiente.

### Navegación

- [ ] Los hotspots llevan al destino correcto.
- [ ] Las flechas recorren solamente el ambiente actual.
- [ ] No existen thumbnails debajo del visor.
- [ ] No existen subcuadrados con las imágenes del mismo ambiente.
- [ ] Las flechas funcionan correctamente en primera/última imagen.

### Entrada

- [ ] `entrada3.webp` tiene hotspot izquierdo.
- [ ] Izquierdo → `entrada4.webp`.
- [ ] `entrada3.webp` tiene hotspot derecho.
- [ ] Derecho → `entrada5.webp`.

### Baño

- [ ] `pasillo-01.webp` tiene hotspot a la derecha.
- [ ] El hotspot muestra “Baño”.
- [ ] Baño → `pasillo-1.5baños.webp`.
- [ ] Después se recorren las imágenes de la carpeta `baño`.
- [ ] Se respeta el orden de esas imágenes.

### Consultorios

- [ ] C1 funciona.
- [ ] C2 funciona.
- [ ] C3 funciona.
- [ ] C5 funciona.
- [ ] C5 representa correctamente el antiguo C4.
- [ ] Cada consultorio inicia en su primera imagen.
- [ ] Cada consultorio se recorre con flechas.

### Salidas especiales

- [ ] C3 → `pasillovolver`.
- [ ] `pasillovolver` → `pasillo-01.webp`.
- [ ] C5 → `pasillovolver`.
- [ ] `pasillovolver` → `pasillo-01.webp`.

### UX

- [ ] Las transiciones son suaves.
- [ ] Los hotspots son intuitivos.
- [ ] Las flechas son fáciles de utilizar.
- [ ] La interfaz no se siente como una galería convencional.
- [ ] No existe navegación 360°.
- [ ] La experiencia funciona en desktop.
- [ ] La experiencia funciona en mobile.
- [ ] Las posiciones de hotspots son responsive.

---

# 23. FLUJO CONCEPTUAL FINAL

El recorrido debe entenderse aproximadamente así:

```text
                    ┌───────────────┐
                    │  entrada3     │
                    └───────┬───────┘
                       ↙         ↘
                      ↓           ↓
               entrada4        entrada5
              Sala espera      Recepción
                                   │
                                   ↓
                             pasillo-01
                              /        \
                             /          \
                         Baño          Consultorios
                          ↓              ↓
                 pasillo-1.5baños       C1
                          ↓              C2
                     carpeta baño       C3
                                         C5
```

La estructura exacta de los demás nodos debe determinarse mediante la inspección de las imágenes y el plano real.

Para los casos especiales:

```text
C3 — Kinesiología
        ↓
   volver
        ↓
pasillovolver
        ↓
pasillo-01.webp
```

```text
C5 — Psicología
        ↓
   volver
        ↓
pasillovolver
        ↓
pasillo-01.webp
```

---

# 24. INSTRUCCIÓN FINAL PARA CLAUDE CODE

> **Antes de escribir código, inspeccioná completamente `raw/instalaciones` y verificá visualmente las fotografías contra el plano proporcionado.**
>
> No asumas la estructura del recorrido solamente por los nombres de los archivos.
>
> Una vez identificado el mapa real, implementá el recorrido como una estructura de datos mantenible donde cada imagen pueda tener hotspots y cada ambiente pueda tener una secuencia interna de fotografías.
>
> El usuario NO quiere thumbnails debajo del visor. Las fotografías pertenecientes al mismo ambiente deben recorrerse exclusivamente mediante flechas laterales izquierda/derecha.
>
> Respetá de forma exacta los casos especiales:
>
> ```text
> entrada3.webp
> ├── izquierda → entrada4.webp
> └── derecha → entrada5.webp
> ```
>
> ```text
> pasillo-01.webp
> └── Baño → pasillo-1.5baños.webp → carpeta baño
> ```
>
> ```text
> C3 → pasillovolver → pasillo-01.webp
> ```
>
> ```text
> C5 → pasillovolver → pasillo-01.webp
> ```
>
> El resultado debe sentirse como un recorrido fotográfico interactivo similar a la lógica de Google Maps, pero sin 360°. Debe ser suave, moderno, intuitivo, responsive y visualmente integrado con el sitio existente.
>
> **Primero resolvé correctamente el mapa y la navegación. Después implementá las animaciones y el refinamiento visual. Finalmente realizá un recorrido completo de QA para verificar que cada transición coincida con el plano y con las reglas especificadas en este documento.**
