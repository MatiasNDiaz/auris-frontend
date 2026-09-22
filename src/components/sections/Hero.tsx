"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ServiceFan } from "./ServiceFan";
import { ShineButton } from "@/components/shared/ShineButton";
import { WaveDivider } from "@/components/shared/WaveDivider";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { siteConfig } from "@/config/site";
import { heroServices as services } from "@/lib/data/services";
import { renderServiceIcon } from "@/lib/icons";

const AUTOPLAY_MS = 4000;

/**
 * Cuánto espera la foto siguiente antes de empezar a bajar. Lo suficiente para
 * no pelearle el ancho de banda a la primera, y bastante menos que
 * `AUTOPLAY_MS`, así llega entera antes de que le toque aparecer.
 */
const PRECARGA_MS = 1200;

/**
 * Escalonado de la entrada, replicando el `staggerChildren` que antes hacía
 * Framer: 0.1s de arranque y 0.11s entre elementos. Se aplica como
 * `--rise-delay` sobre la clase `auris-rise` de `globals.css`.
 */
const RISE_DELAY = { eyebrow: "0.1s", cta: "0.21s" };

/**
 * Hero por capas: la foto del servicio activo ocupa toda la sección, un
 * degradé oscuro sostiene la legibilidad del texto y el abanico de cards de
 * abajo a la derecha es el que decide qué foto se ve.
 */
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  /**
   * Qué fotos de fondo están en el DOM.
   *
   * Las ocho ocupan la pantalla entera con `absolute inset-0`, así que aunque
   * siete estén en `opacity: 0` el navegador las considera dentro del viewport
   * y las descarga todas al entrar —`loading="lazy"` solo difiere lo que está
   * abajo del pliegue, no lo invisible—. Eran más de un mega compitiendo con
   * el LCP. Montándolas de a una, la portada baja una sola foto.
   */
  const [montadas, setMontadas] = useState<number[]>([0]);

  const montar = useCallback((indice: number) => {
    setMontadas((antes) =>
      antes.includes(indice) ? antes : [...antes, indice],
    );
  }, []);

  const step = useCallback(
    (delta: number) => {
      setActive((current) => {
        const siguiente = (current + delta + services.length) % services.length;
        montar(siguiente);
        return siguiente;
      });
    },
    [montar],
  );

  // La que sigue se monta un rato después del primer pintado, no junto con
  // ella: así no compite con el LCP y llega igual antes del primer cambio.
  useEffect(() => {
    if (reduceMotion) return;
    const espera = setTimeout(
      () => montar((active + 1) % services.length),
      PRECARGA_MS,
    );
    return () => clearTimeout(espera);
  }, [active, montar, reduceMotion]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => step(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, step]);

  return (
    <section
      // El alto crece con el ancho de la pantalla: la foto se escala con el
      // ancho, así que con un alto fijo cuanto más grande el monitor más se
      // recortaba la imagen.
      className="relative isolate flex min-h-184 flex-col overflow-hidden lg:min-h-[clamp(43rem,40.6vw,54rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* Capa 1 — fondo full-bleed con crossfade entre servicios. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-ink-900">
        {services.map((service, index) =>
          !montadas.includes(index) ? null : (
            <motion.div
              key={service.slug}
              initial={false}
              animate={{ opacity: index === active ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
            >
              <Image
                // La foto propia de la portada si la tiene; si no, la del
                // catálogo. Odontología sigue con la suya de siempre.
                src={service.landingImageUrl ?? service.imageUrl}
                alt=""
                fill
                /*
                 * `sizes` tiene que declarar el ancho al que se DIBUJA la foto,
                 * que acá no es el ancho de la pantalla.
                 *
                 * La sección mide 736px de alto y en un teléfono la caja queda
                 * vertical (390×736), mientras que las fotos son apaisadas
                 * (entre 1.50 y 2.34). Con `object-cover`, para tapar una caja
                 * vertical con una foto apaisada manda el alto: la foto se
                 * dibuja a 1105–1722px de ancho, no a 390. Declarando `100vw`
                 * el navegador bajaba la variante de 828px para dibujarla a
                 * 1722: cuatro veces estirada, y de ahí la pixelación.
                 *
                 * El cruce está en 1225px de ancho de pantalla, que es donde la
                 * caja se vuelve más apaisada que la foto y el ancho pasa a
                 * mandar. Por debajo de 1024 la caja mide 736 de alto; entre
                 * 1024 y 1225 el `clamp` la fija en 688, así que el ancho
                 * dibujado es constante.
                 */
                sizes="(min-width: 1225px) 100vw, (min-width: 1024px) 1225px, 1310px"
                // 88 y no el 75 por defecto, igual que los banners de sección.
                // La foto del hero se agranda siempre —nunca se achica—, y al
                // 75 un archivo de 1918px quedaba en 36 KB: a ese nivel de
                // compresión el agrandado saca a la luz los artefactos.
                quality={88}
                priority={index === 0}
                // En mobile la caja del hero es casi el doble de alta que
                // ancha, y de una foto apaisada entra apenas un quinto del
                // ancho: el encuadre de cada foto dice dónde cae ese quinto,
                // para que sea el profesional y no el fondo. Sin encuadre
                // propio, el 25% de arriba centrado, que es donde está la
                // gente en las fotos del catálogo.
                style={{ objectPosition: service.landingFoco ?? "center 25%" }}
                className="object-cover"
              />
            </motion.div>
          ),
        )}
      </div>

      {/* Capa 2 — degradés neutros: el tinte verde ensuciaba el color de las
          fotos, así que el oscurecido va en negro y no altera los tonos. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-black/42 via-black/18 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/32 via-transparent to-black/12"
      />

      <div className="container-auris relative flex flex-1 flex-col justify-center gap-12 pt-16 pb-28 lg:gap-0 lg:pt-20 lg:pb-36">
        {/* Capa 3 — contenido, en claro sobre el overlay. */}
        <div className="max-w-2xl">
          <p
            style={{ "--rise-delay": RISE_DELAY.eyebrow } as CSSProperties}
            className="auris-rise inline-flex items-center gap-2 rounded-full border border-cream-50/35 bg-cream-50/10 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-cream-50 uppercase backdrop-blur-sm"
          >
            <Leaf className="size-3.5" strokeWidth={2} aria-hidden />
            Bienvenidos a {siteConfig.name}
          </p>

          {/* Titular y bajada del servicio activo. Se remontan con `key`, así
              cada cambio entra desde abajo en vez de reemplazarse de golpe. */}
          {/* Sin `mode="wait"`: esperar la salida del titular anterior lo dejaba
              un paso atrás del fondo. Entrada y salida corren a la vez.

              Los dos van en la misma celda del grid, uno encima del otro. Antes
              el saliente se sacaba del flujo con un `position: absolute` dentro
              de `exit`, pero Framer recién lo aplica un fotograma después de
              montar el entrante: en ese fotograma los dos titulares quedaban
              apilados en el flujo, el hero pasaba de 688 a 910 px y el navegador
              corregía el scroll 222 px y lo devolvía. Cada 4 segundos, que es lo
              que tarda el carrusel en girar. Se veía como un tirón hacia arriba
              y, de paso, la navbar leía ese retroceso como "el usuario subió" y
              se destapaba sola. Apilados en grid el alto es el mayor de los dos
              y nunca la suma, así que no hay fotograma intermedio que corregir. */}
          <div className="relative mt-7 grid min-h-56 sm:min-h-60 lg:min-h-64">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -18 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="[grid-area:1/1] self-start"
              >
                {/* El nombre del servicio. Antes iba en verde claro suelto
                    sobre la foto y contra un consultorio blanco desaparecía;
                    en pastilla llena gana fondo propio y queda una jerarquía
                    clara con el saludo de arriba, que va en contorno.

                    El relleno es un degradé y no un plano: en plano la
                    pastilla se leía como una etiqueta pegada. El degradé de
                    claro a oscuro, el filete de luz de un píxel en el borde
                    superior y el aro interior le dan el volumen que le
                    faltaba. El ícono del servicio, en disco crema, la ancla
                    a lo que está mostrando el carrusel. */}
                <p className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-linear-to-b from-primary-500 to-primary-700 py-1.5 pr-4 pl-1.5 text-xs font-semibold tracking-[0.16em] text-cream-50 uppercase shadow-lg shadow-primary-900/35 ring-1 ring-cream-50/30 ring-inset">
                  <span
                    aria-hidden
                    // Se apaga hacia las puntas: a lo ancho completo se leía
                    // como una línea dibujada y no como un reflejo.
                    className="absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-cream-50/55 to-transparent"
                  />
                  <span
                    aria-hidden
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cream-50 text-primary-700 shadow-sm shadow-primary-900/25"
                  >
                    {renderServiceIcon(services[active].icon, {
                      className: "size-3.5",
                      strokeWidth: 2,
                    })}
                  </span>
                  {services[active].name}
                </p>
                {/* La sombra de texto sostiene la lectura sobre las zonas
                    claras de la foto sin tener que oscurecer el overlay, que
                    apagaría la imagen entera. */}
                <h1 className="mt-5 font-serif text-4xl leading-[1.08] text-balance text-cream-50 [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
                  {services[active].heroTitle}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-cream-50/95 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
                  {services[active].heroSubtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            style={{ "--rise-delay": RISE_DELAY.cta } as CSSProperties}
            className="auris-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ShineButton href="/servicios" tone="primary" effect="shine">
              Conocé nuestros servicios
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </ShineButton>
            <WhatsAppButton label="Contactanos por WhatsApp" variant="onDark" />
          </div>

          {/* Acotado a max-w-xl para no quedar debajo del abanico en desktop. */}
        </div>

        {/* Capa 4 — abanico de servicios. */}
        <div
          style={
            {
              "--rise-delay": "0.5s",
              "--rise-duration": "0.8s",
              "--rise-y": "30px",
            } as CSSProperties
          }
          // Por encima del alto de la onda, para que la curva no le muerda el
          // pie a las cards. Los controles pasaron a dos filas —flechas y
          // puntos— así que el abanico sube lo que crecieron.
          className="auris-rise lg:absolute lg:right-12 lg:bottom-40"
        >
          <ServiceFan
            active={active}
            onSelect={setActive}
            onStep={step}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>

      {/*
        Cierre curvo del hero: el color es el de la sección que sigue.

        Una sola capa a propósito. Se probó un apilado de tres ondas y no
        funciona: el relieve entre capas solo se percibe si hay diferencia de
        valor, y en tonos neutros esa diferencia no existe, así que las curvas
        se empastan en una sola mancha. Con color sí se leen, pero el pie del
        hero termina pesando más que el titular.
      */}
      {/* El filete verde va también acá: es el mismo remate que llevan los
          banners de todas las secciones de la navbar, y al hero le faltaba.
          Mismos colores que `PageHeader` para que se lea como la misma pieza. */}
      <WaveDivider
        variant="hero"
        className="text-surface-base"
        underlineClassName="text-surface-sand"
        lineaClassName="text-primary-600"
      />
    </section>
  );
}
