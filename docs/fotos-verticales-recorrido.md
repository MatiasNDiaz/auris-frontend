# Fotos verticales del recorrido

Las 9 fotos del recorrido tomadas con el teléfono en vertical, por qué se veían
mal y cuáles conviene volver a sacar.

## Por qué se veían mal

No era el archivo: era el recorte. El visor estiraba cada foto hasta llenar la
ventana, que es apaisada. Una foto vertical de teléfono es 9:16; para llenar una
ventana 16:10 hay que agrandarla casi tres veces. De ahí salían los dos
problemas al mismo tiempo:

- **Se veía un tercio de la foto.** Desaparecían el techo y el piso, que es
  justo donde están las puertas y los carteles. En el pasillo daba la sensación
  de estar mirando agachado.
- **Ese tercio se dibujaba al triple de su tamaño**, así que además salía
  borroso.

Desde ahora, una foto que habría que agrandar demasiado se muestra **entera**,
con la altura de la ventana, y a los costados va la misma foto ampliada y
desenfocada. En una pantalla de 1152px de ancho la foto pasa de dibujarse a
1358px de ancho (agrandada) a 405px (achicada): se ve completa y nítida.

## Las fotos

Medida de referencia: en el visor estas fotos se muestran a **405 px de ancho**
en una pantalla de escritorio. Para que se vean bien en una pantalla retina
conviene que el archivo tenga al menos el doble, unos 810 px.

| Foto | Dónde aparece | Archivo | Margen |
| --- | --- | --- | --- |
| `pasillo/pasillo-01.webp` | Pasillo (boca) | 1080×1920 | 2,7× — sobra |
| `pasillo/pasillo-02.webp` | Pasillo, primer tramo | 1080×1920 | 2,7× — sobra |
| `pasillo/pasillo-1-5banos.webp` | Baño (primera foto) | 1080×1920 | 2,7× — sobra |
| `consultorio-5-entrevista/psicologia1.webp` | Consultorio 5 | 900×1600 | 2,2× — bien |
| `consultorio-5-entrevista/psicologia2.webp` | Consultorio 5 | 900×1600 | 2,2× — bien |
| `consultorio-3/kinesiologia1.webp` | Consultorio 3 | 720×1280 | 1,8× — bien |
| **`pasillo/pasillo-03.webp`** | **Pasillo, segundo tramo** | **447×797** | **1,1× — justo** |
| **`pasillo/pasillo-04.webp`** | **Final del pasillo** | **445×793** | **1,1× — justo** |
| **`pasillo/pasillo-05.webp`** | **Final del pasillo (2ª foto)** | **442×791** | **1,1× — justo** |

## Las tres que conviene volver a sacar

`pasillo-03`, `pasillo-04` y `pasillo-05` son las únicas del lote por debajo de
1000 px de ancho, y son así **de origen**: el archivo en `assets/raw/` tiene
exactamente la misma medida que el de la web, así que no hay nada que recuperar
volviendo a procesarlas. Probablemente salieron de una captura de pantalla o de
un reenvío por mensajería, que es lo que suele achicar una foto a ~450 px.

Con el cambio de encuadre ya se ven aceptables en una pantalla común, pero en
una pantalla retina van a seguir viéndose blandas. **Sacarlas de nuevo con la
cámara del teléfono, en vertical, y pasarlas sin comprimir** (por ejemplo por
Drive o por cable, no por WhatsApp) las deja como las demás.

Las otras seis están bien y no hace falta tocarlas.

## Si se reemplaza alguna

1. Dejar el archivo nuevo en `assets/raw/images/instalaciones/<carpeta>/`, con
   el mismo nombre.
2. Correr `npm run optimize:images`.
3. Actualizar el `aspect` de esa foto en `src/lib/data/tour.ts` si cambió la
   proporción. El visor lo usa para dimensionar la capa; si no coincide con el
   archivo, la foto se deforma.
