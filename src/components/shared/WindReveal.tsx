"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { isViewTransitionActive } from "@/components/providers/ViewTransitionProvider";
import { LeafShape, type LeafPalette } from "./leaf-art";
import { cn } from "@/lib/utils";

/**
 * Revelado por ráfaga de viento, solo en la primera visita.
 *
 * Cuando la sección entra en viewport, un grupo de hojas la cruza de izquierda
 * a derecha y el contenido se revela a su paso. En visitas posteriores el
 * contenido aparece directo: la decisión se guarda en `localStorage`.
 *
 * El contenido se renderiza VISIBLE en el servidor y solo se oculta una vez
 * montado en el cliente. Es a propósito: si el JS falla o tarda, la página se
 * lee igual. Por eso el componente se usa únicamente en secciones que están
 * por debajo del pliegue, donde ese primer fotograma visible cae fuera de
 * pantalla y nadie lo ve.
 */

const STORAGE_KEY = "auris_intro_seen";

/**
 * La ráfaga: cinco hojas a distintas alturas, tamaños y velocidades. Las
 * diferencias de `delay` y `duration` son las que hacen que se lea como viento
 * y no como un carrusel de cinco elementos saliendo juntos.
 */
const gust = [
  { top: "6%", width: 92, spin: 300, delay: 0, duration: 1.7, drift: [0, -26, 14, -6] },
  { top: "24%", width: 64, spin: -250, delay: 0.14, duration: 1.45, drift: [0, 20, -18, 8] },
  { top: "44%", width: 112, spin: 265, delay: 0.05, duration: 1.95, drift: [0, -18, 22, -4] },
  { top: "63%", width: 72, spin: -330, delay: 0.24, duration: 1.55, drift: [0, 16, -12, 6] },
  { top: "81%", width: 86, spin: 285, delay: 0.17, duration: 1.8, drift: [0, -22, 16, -10] },
];

/**
 * Decisión compartida por todas las secciones de la página. Se resuelve una
 * sola vez: si cada instancia leyera `localStorage` por su cuenta, la primera
 * en marcar la clave apagaría la animación de las de más abajo.
 */
let intro: "unknown" | "play" | "skip" = "unknown";

function shouldPlay() {
  if (intro === "unknown") {
    try {
      intro = localStorage.getItem(STORAGE_KEY) ? "skip" : "play";
    } catch {
      // Modo privado o storage bloqueado: no insistimos con la animación.
      intro = "skip";
    }
  }
  return intro === "play";
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* sin storage no hay nada que recordar */
  }
}

/** El valor no cambia durante la vida de la página: no hay a qué suscribirse. */
const noopSubscribe = () => () => {};

type WindRevealProps = {
  children: ReactNode;
  palette?: LeafPalette;
  className?: string;
};

export function WindReveal({
  children,
  palette = "green",
  className,
}: WindRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // `useSyncExternalStore` es la vía correcta para leer algo que solo existe en
  // el cliente: el snapshot del servidor es `false` —contenido visible— y React
  // recién consulta el del cliente después de hidratar, sin desajuste ni el
  // render en cascada que provoca un `setState` dentro de un efecto.
  const firstVisit = useSyncExternalStore(
    noopSubscribe,
    shouldPlay,
    () => false,
  );

  // Si esta sección monta en medio de una View Transition —volviendo de la
  // ficha de un profesional— la ráfaga no corre. Armarla dejaría el contenido
  // en `opacity:0` esperando al IntersectionObserver, y el navegador fotografía
  // el destino antes de que ese observer dispare: esa foto en blanco es el
  // salto que se ve al volver. Se lee una sola vez, en el montaje, igual que en
  // `app/template.tsx`.
  const [duringTransition] = useState(() => isViewTransitionActive());

  const armed = firstVisit && !reduceMotion && !duringTransition;

  const inView = useInView(ref, { once: true, margin: "-15%" });

  /**
   * Salvavidas: pasado el plazo el contenido se muestra sí o sí.
   *
   * `useInView` solo engancha su observer una vez, con el nodo que encuentre en
   * el ref en ese momento. Si por lo que sea no llega a observar, sin esto la
   * sección se queda en `opacity:0` para siempre — que es exactamente el bug
   * que dejó la landing en blanco en producción. El contenido nunca puede
   * depender de que un observer dispare.
   */
  const [rescued, setRescued] = useState(false);
  useEffect(() => {
    if (!armed || inView) return;
    const timer = setTimeout(() => setRescued(true), 1200);
    return () => clearTimeout(timer);
  }, [armed, inView]);

  const shown = inView || rescued;

  // La clave se escribe cuando la primera ráfaga ya se disparó.
  useEffect(() => {
    if (armed && shown) markSeen();
  }, [armed, shown]);

  // El `ref` va SIEMPRE en el mismo nodo, esté armada o no la ráfaga.
  //
  // Acá estaba el bug que dejaba la landing en blanco: con `armed` en false en
  // el primer render —el snapshot de servidor de `useSyncExternalStore`— este
  // div no existía y el ref quedaba en null. `useInView` engancha su observer
  // una sola vez, en su efecto de montaje, así que al pasar `armed` a true tras
  // hidratar ya no volvía a mirar: `inView` se quedaba en false para siempre y
  // el contenido, en `opacity:0`.
  //
  // Por eso las secciones aparecían recién al navegar desde la navbar: en una
  // navegación de cliente no hay snapshot de servidor, `armed` es true desde el
  // primer render y el ref existe cuando el efecto corre.
  return (
    <div ref={ref} className={cn(armed && "relative", className)}>
      {/* Capa de hojas: por encima del contenido mientras lo descubre, y fuera
          del flujo, así que no puede provocar layout shift. Solo existe cuando
          la ráfaga corre de verdad. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      >
        {armed &&
          inView &&
          gust.map((leaf, index) => (
            <motion.svg
              key={index}
              viewBox="0 0 120 56"
              fill="none"
              initial={{ x: "-25vw", y: 0, rotate: 0, opacity: 0 }}
              animate={{
                x: "115vw",
                y: leaf.drift,
                rotate: leaf.spin,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: leaf.duration,
                delay: leaf.delay,
                ease: [0.32, 0.12, 0.28, 1],
                opacity: { times: [0, 0.14, 0.72, 1] },
              }}
              style={{
                top: leaf.top,
                width: leaf.width,
                willChange: "transform, opacity",
              }}
              className="absolute left-0 h-auto"
            >
              <LeafShape palette={palette} gradientId={`gust-${index}`} />
            </motion.svg>
          ))}
      </div>

      {/* El contenido se revela detrás de la ráfaga, con el retardo justo para
          que las primeras hojas ya lo estén cruzando.

          `initial={false}` es deliberado: sin eso Framer graba `opacity:0` como
          estilo inline en el HTML del servidor y la sección llega invisible,
          esperando a que baje e hidrate todo el bundle. Con `false` el primer
          fotograma es el estado visible y la animación arranca recién cuando
          este componente ya está montado —que es justo cuando `armed` puede
          ser true—, así que visualmente el resultado es el mismo. */}
      <motion.div
        initial={false}
        animate={
          !armed || shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
        }
        transition={{ duration: 0.75, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
