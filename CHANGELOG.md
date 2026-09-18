# Changelog

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
