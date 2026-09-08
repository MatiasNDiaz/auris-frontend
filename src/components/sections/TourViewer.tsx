"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import {
  TOUR_START,
  getTourNode,
  tourNodes,
  type TourHotspot,
} from "@/lib/data/tour";
import { cn } from "@/lib/utils";

/**
 * Cuánto se agranda la foto respecto del ancho de la ventana. El sobrante es
 * el que permite mirar a los costados sin que asome el borde.
 */
const OVERSCAN = 1.14;

/** Cuánto acompaña el encuadre al puntero, en px sobre el eje más largo. */
const LOOK_X = 26;
const LOOK_Y = 90;

/**
 * Visor del recorrido virtual.
 *
 * Las fotos del centro son verticales, 9:16, y un visor tipo 360 es apaisado.
 * En vez de recortarlas —que se comía el techo y el piso, justo donde están
 * las puertas—, la foto entra más grande que la ventana y el encuadre se mueve
 * con el puntero: se mira alrededor igual que en un visor 360, y el formato
 * vertical pasa a ser material de sobra para explorar en vez de un problema.
 *
 * Los hotspots viven dentro de la misma capa que se desplaza, así que quedan
 * pegados a su puerta mientras se mira alrededor. Si estuvieran fuera habría
 * que recalcular su posición en cada cuadro.
 */
export function TourViewer() {
  const [nodeId, setNodeId] = useState(TOUR_START);
  const [photoIndex, setPhotoIndex] = useState(0);
  /** Desde dónde arranca el zoom de la próxima transición, en % de la foto. */
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  /** `forward` acerca hacia el hotspot; `back` se aleja. */
  const [way, setWay] = useState<"forward" | "back">("forward");

  const frameRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });

  const reduceMotion = useReducedMotion() ?? false;
  // Sin hover no hay forma de descubrir a dónde lleva cada punto: en pantallas
  // táctiles los globos se muestran siempre.
  const coarsePointer = useMediaQuery("(hover: none)");

  const node = getTourNode(nodeId) ?? tourNodes[0];
  // Cada foto viaja con su proporción. Las secundarias casi siempre son
  // verticales de teléfono, incluso cuando la principal del nodo es apaisada:
  // dimensionar la capa con la del nodo las recortaba hasta dejar un detalle.
  const photos = [
    { src: node.image, alt: node.alt, aspect: node.aspect },
    ...(node.extras ?? []).map((extra) => ({
      ...extra,
      aspect: extra.aspect ?? 9 / 16,
    })),
  ];
  const photo = photos[Math.min(photoIndex, photos.length - 1)];
  const showHotspots = photoIndex === 0;

  const stepNumber = tourNodes.findIndex((n) => n.id === node.id) + 1;

  /**
   * Dónde se centra el encuadre en reposo: sobre el promedio de los hotspots,
   * para que las puertas queden a la vista sin tener que buscarlas. Sin
   * hotspots, el centro de la foto.
   */
  const focusY = node.hotspots.length
    ? node.hotspots.reduce((sum, h) => sum + h.y, 0) / node.hotspots.length
    : 50;

  const panX = useSpring(0, { stiffness: 80, damping: 20, mass: 0.7 });
  const panY = useSpring(0, { stiffness: 80, damping: 20, mass: 0.7 });

  // La ventana se mide: su alto cambia por breakpoint y el sobrante depende de
  // eso, así que no se puede fijar en el código.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setFrame({ w: width, h: height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * Tamaño de la capa que lleva la foto.
   *
   * Se calcula en píxeles y no con `aspect-ratio` en CSS porque tiene que
   * cubrir la ventana en los dos ejes: una foto vertical sobra de alto y una
   * apaisada sobra de ancho, y en una ventana apaisada con una foto apaisada
   * hay que cubrir por alto o quedan franjas arriba y abajo. Sale de la foto
   * que se está mirando, no del nodo: dentro de un nodo conviven las dos
   * orientaciones.
   */
  const layer = (() => {
    const width = Math.max(frame.w, frame.h * photo.aspect) * OVERSCAN;
    return { width, height: width / photo.aspect };
  })();

  const slack = {
    x: Math.max(0, (layer.width - frame.w) / 2),
    y: Math.max(0, (layer.height - frame.h) / 2),
  };

  /** El desplazamiento de reposo, ya acotado al sobrante. */
  const restY = Math.max(
    -slack.y,
    Math.min(slack.y, ((50 - focusY) / 100) * slack.y * 2),
  );

  useEffect(() => {
    // Al cambiar de parada el encuadre salta al reposo del nodo nuevo: animar
    // ese salto se lee como un temblor encima del zoom de la transición.
    panX.jump(0);
    panY.jump(restY);
  }, [nodeId, photoIndex, restY, panX, panY]);

  const look = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion || !showHotspots || !frameRef.current) return;
      const box = frameRef.current.getBoundingClientRect();
      const nx = (event.clientX - box.left) / box.width - 0.5;
      const ny = (event.clientY - box.top) / box.height - 0.5;

      panX.set(Math.max(-slack.x, Math.min(slack.x, -nx * LOOK_X)));
      panY.set(Math.max(-slack.y, Math.min(slack.y, restY - ny * LOOK_Y)));
    },
    [panX, panY, reduceMotion, restY, showHotspots, slack.x, slack.y],
  );

  const rest = useCallback(() => {
    panX.set(0);
    panY.set(restY);
  }, [panX, panY, restY]);

  const go = useCallback(
    (to: string, from: TourHotspot | null, direction: "forward" | "back") => {
      setOrigin(from ? { x: from.x, y: from.y } : { x: 50, y: 55 });
      setWay(direction);
      setPhotoIndex(0);
      setNodeId(to);
    },
    [],
  );

  return (
    <div className="mx-auto max-w-6xl">
      {/* Encabezado mínimo: dónde estoy y cuántas paradas hay. El recorrido se
          navega sobre la foto, así que no hace falta más. */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-primary-700 uppercase">
            Parada {stepNumber} de {tourNodes.length}
          </p>
          <h3 className="mt-2 font-serif text-2xl text-ink-900 sm:text-3xl">
            {node.title}
          </h3>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-700/75">
            {node.caption}
          </p>
        </div>

        {node.id !== TOUR_START && (
          <button
            type="button"
            onClick={() => go(TOUR_START, null, "back")}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          >
            <RotateCcw className="size-4" aria-hidden />
            Volver al ingreso
          </button>
        )}
      </div>

      <div
        ref={frameRef}
        onPointerMove={look}
        onPointerLeave={rest}
        className="relative aspect-3/4 touch-pan-y overflow-hidden rounded-3xl bg-ink-900 shadow-xl sm:aspect-4/3 lg:aspect-16/10"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={`${node.id}-${photoIndex}`}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: way === "forward" ? 1.28 : 0.86 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: way === "forward" ? 1.5 : 0.82 }
            }
            transition={{
              duration: reduceMotion ? 0.2 : 0.62,
              ease: [0.32, 0.08, 0.24, 1],
            }}
            // El zoom sale del hotspot que se tocó, no del centro: es lo que
            // da la sensación de avanzar hacia esa puerta y no de un
            // fundido cualquiera.
            style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
            className="absolute inset-0"
          >
            {showHotspots ? (
              <motion.div
                style={{
                  x: panX,
                  y: panY,
                  width: layer.width,
                  height: layer.height,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  // La capa mide OVERSCAN veces el ancho de la ventana, no el
                  // ancho de la ventana: pidiendo menos, Next servía una
                  // imagen más chica que la que se dibuja y se veía blanda.
                  sizes="(max-width: 1024px) 115vw, 1350px"
                  priority={node.id === TOUR_START}
                  className="object-cover"
                  draggable={false}
                />

                {node.hotspots.map((hotspot) => (
                  <Hotspot
                    key={hotspot.to}
                    hotspot={hotspot}
                    alwaysOpen={coarsePointer}
                    onClick={() => go(hotspot.to, hotspot, "forward")}
                  />
                ))}
              </motion.div>
            ) : (
              // Las fotos de detalle van enteras, no recortadas por la ventana:
              // no son un lugar por el que se camina sino una foto que se
              // mira, y ahí lo que se quiere es verla completa.
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1150px"
                className="object-contain"
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Volver: fuera de la capa que se desplaza, porque no señala un lugar
            de la foto sino una acción, y tiene que quedarse quieto. */}
        {node.back && (
          <motion.button
            key={`back-${node.id}`}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.42, duration: 0.3 }}
            onClick={() => go(node.back as string, null, "back")}
            aria-label={`Volver a ${getTourNode(node.back)?.title ?? "la parada anterior"}`}
            className="group absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/70 bg-ink-900/35 px-4 py-2 text-sm font-medium text-cream-50 backdrop-blur-md transition-colors duration-300 group-hover:bg-cream-50 group-hover:text-ink-900">
              <RotateCcw className="size-3.5" aria-hidden />
              Volver a {getTourNode(node.back)?.title}
            </span>
          </motion.button>
        )}

        {/* Cómo se usa. Sobre una foto de detalle no aplica: ahí no hay ni
            puntos ni nada alrededor para mirar. */}
        <p
          className={cn(
            "pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink-900/40 px-3.5 py-1.5 text-[0.6875rem] tracking-wide text-cream-50/90 backdrop-blur-md",
            !showHotspots && "hidden",
          )}
        >
          {coarsePointer
            ? "Deslizá para mirar · Tocá los puntos"
            : "Mové el cursor para mirar alrededor · Hacé click en los puntos"}
        </p>
      </div>

      {/* Las demás fotos del espacio. Sin esto se perderían al sacar la grilla. */}
      {photos.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-3">
          {photos.map((item, index) => (
            <li key={item.src}>
              <button
                type="button"
                onClick={() => setPhotoIndex(index)}
                aria-current={index === photoIndex}
                aria-label={item.alt}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-xl ring-2 transition-[box-shadow,opacity] duration-200 focus-visible:outline-none sm:size-20",
                  index === photoIndex
                    ? "opacity-100 ring-primary-600"
                    : "opacity-70 ring-transparent hover:opacity-100",
                )}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type HotspotProps = {
  hotspot: TourHotspot;
  /** En pantallas táctiles el globo no puede depender del hover. */
  alwaysOpen: boolean;
  onClick: () => void;
};

/**
 * Punto de navegación sobre la foto.
 *
 * El área de toque es de 44px aunque el círculo se vea de 28: en un teléfono un
 * blanco de 28px se falla más de lo que se acierta.
 */
function Hotspot({ hotspot, alwaysOpen, onClick }: HotspotProps) {
  const edge =
    hotspot.x < 20 ? "left" : hotspot.x > 80 ? "right" : ("center" as const);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      // Entran después de que la foto ya se asentó, y en la salida se van
      // primero: si no, quedan flotando un instante sobre la foto nueva.
      transition={{ delay: 0.46, duration: 0.28 }}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      aria-label={hotspot.label}
      className="group absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none"
    >
      {/* El círculo: sin relleno en reposo, se llena de blanco al activarse. */}
      <span
        aria-hidden
        className="pointer-events-none relative grid size-7 place-items-center rounded-full border-2 border-cream-50/75 shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-[border-color,transform] duration-300 group-hover:border-cream-50 group-focus-visible:border-cream-50"
      >
        <span
          className={cn(
            "block size-full scale-50 rounded-full bg-cream-50 opacity-0 transition-[opacity,transform] duration-300 ease-out",
            "group-hover:scale-100 group-hover:opacity-100",
            "group-focus-visible:scale-100 group-focus-visible:opacity-100",
          )}
        />
        {/* Latido sutil, para que el punto se note sobre la foto. */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full border border-cream-50/40 [animation-duration:2.6s]" />
      </span>

      {/* Globo de diálogo, con el triangulito apuntando al círculo.
          Cerca de los bordes se ancla de un lado en vez de centrarse: la foto
          recorta lo que se sale, y un punto al 7% dejaba el globo cortado. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-full mb-2 rounded-xl bg-ink-900/90 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-cream-50 shadow-lg ring-1 ring-cream-50/20 backdrop-blur-sm",
          "transition-[opacity,transform] duration-300 ease-out",
          edge === "left" && "left-1/2",
          edge === "right" && "right-1/2",
          edge === "center" && "left-1/2 -translate-x-1/2",
          alwaysOpen
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        {hotspot.label}
        <span
          className={cn(
            "absolute top-full size-2 -translate-y-1 rotate-45 rounded-[2px] bg-ink-900/90",
            edge === "left" && "left-3",
            edge === "right" && "right-3",
            edge === "center" && "left-1/2 -translate-x-1/2",
          )}
        />
      </span>
    </motion.button>
  );
}
