"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  type TargetAndTransition,
} from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Image from "next/image";
import {
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
 * Cuánto más grande que la ventana se dibuja una foto que la cubre.
 *
 * De ese sobrante sale el paneo del cursor. Con 1.06 queda holgura para mirar
 * alrededor —que es el efecto— y la foto se dibuja bastante cerca de su tamaño
 * real, sin la blandura que traía agrandarla más.
 */
const OVERSCAN = 1.06;

/**
 * Hasta qué desproporción una foto se estira para llenar la ventana.
 *
 * Una foto apenas más alta que la ventana se puede recortar sin perder nada:
 * lo que se va son unos centímetros de piso y de techo. Una foto de teléfono
 * —9:16— en una ventana apaisada es otra cosa: para llenarla hay que agrandarla
 * casi tres veces, de la foto se ve un tercio y ese tercio se dibuja al triple
 * de su tamaño, así que sale recortada *y* borrosa. Por debajo de este umbral
 * la foto se muestra entera, con la altura de la ventana, y a los costados
 * queda la misma foto ampliada y desenfocada.
 */
const LIMITE_RECORTE = 0.8;

/** Cuánto acompaña el encuadre al puntero, en px sobre cada eje. */
const LOOK_X = 26;
const LOOK_Y = 90;

const acotar = (valor: number, tope: number) =>
  Math.max(-tope, Math.min(tope, valor));

/**
 * Cuánto va a medir la foto en pantalla, que es lo que el navegador usa para
 * elegir qué variante baja.
 *
 * Una foto apaisada cubre la ventana y además se dibuja OVERSCAN veces más
 * grande: en un teléfono, donde tiene que cubrir por alto, termina midiendo
 * el doble del ancho de la pantalla. Una vertical se muestra entera y ocupa
 * apenas un tercio del ancho de la ventana, así que pedir lo mismo sería bajar
 * cinco veces los píxeles que se van a ver.
 */
const medidas = (aspect: number) =>
  aspect > 1
    ? "(max-width: 1024px) 200vw, 1350px"
    : "(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 420px";

/**
 * Cómo se llegó a la foto que se está viendo. Define la transición: entrar a
 * un ambiente empuja hacia adelante, volver se aleja, y pasar fotos del mismo
 * ambiente corre de costado.
 */
type Move = "enter" | "back" | "next" | "prev";

/**
 * La transición de cada caso.
 *
 * Todas son de baja intensidad a propósito: el protagonista es la foto, no el
 * efecto. El zoom de entrar es apenas un 6% —lo justo para leerse como un paso
 * hacia adelante— y el de pasar fotos es un corrimiento de 28px con fundido,
 * que es lo que hace que se sienta una secuencia y no un cambio de diapositiva.
 */
const TRANSICIONES: Record<
  Move,
  { entra: TargetAndTransition; sale: TargetAndTransition }
> = {
  enter: {
    entra: { opacity: 0, scale: 1.06 },
    sale: { opacity: 0, scale: 1.1 },
  },
  back: {
    entra: { opacity: 0, scale: 0.95 },
    sale: { opacity: 0, scale: 1.04 },
  },
  next: { entra: { opacity: 0, x: 28 }, sale: { opacity: 0, x: -22 } },
  prev: { entra: { opacity: 0, x: -28 }, sale: { opacity: 0, x: 22 } },
};

/**
 * Visor del recorrido virtual.
 *
 * Hay dos navegaciones distintas y conviene no confundirlas al leer el código:
 *
 *   - Los **círculos** sobre la foto cambian de ambiente (`nodeId`).
 *   - Las **flechas** laterales pasan las fotos del ambiente actual (`foto`).
 *
 * Las fotos del centro son verticales y un visor tipo 360 es apaisado. En vez
 * de recortarlas —que se comía el techo y el piso, justo donde están las
 * puertas—, la foto entra más grande que la ventana y el encuadre acompaña al
 * puntero: se mira alrededor sin necesidad de un 360 real.
 *
 * Los círculos viven dentro de la misma capa que se desplaza, así que quedan
 * pegados a su puerta mientras se mira alrededor.
 */
export function TourViewer() {
  const [nodeId, setNodeId] = useState(TOUR_START);
  const [foto, setFoto] = useState(0);
  /** Desde dónde arranca el zoom de la próxima transición, en % de la foto. */
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [move, setMove] = useState<Move>("enter");

  const frameRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });

  const reduceMotion = useReducedMotion() ?? false;
  // Sin hover no hay forma de descubrir a dónde lleva cada punto: en pantallas
  // táctiles los globos se muestran siempre.
  const coarsePointer = useMediaQuery("(hover: none)");

  const node = getTourNode(nodeId) ?? tourNodes[0];
  const photo = node.photos[Math.min(foto, node.photos.length - 1)];
  // Los círculos solo van sobre la primera foto: es la que está tomada desde
  // la puerta y la que se corresponde con el recorrido. Las demás son el
  // detalle de adentro y no tienen a dónde llevar.
  const showHotspots = foto === 0;

  const hayAnterior = foto > 0;
  const haySiguiente = foto < node.photos.length - 1;

  /**
   * Dónde se centra el encuadre en reposo, en % de la foto y por eje.
   *
   * En la vista navegable, sobre el promedio de los círculos: así las puertas
   * quedan a la vista sin tener que buscarlas. En una foto de detalle, en el
   * medio a lo ancho y donde lo diga la propia foto a lo alto —y si no dice
   * nada, un poco por encima de la mitad: en una foto de interior el motivo
   * casi nunca está en el centro exacto—.
   */
  const promedio = (eje: "x" | "y") =>
    node.hotspots.reduce((sum, h) => sum + h[eje], 0) / node.hotspots.length;

  const navegable = showHotspots && node.hotspots.length > 0;
  // El `focoX` de la foto manda sobre el promedio: es lo que mantiene el punto
  // de fuga del pasillo en la misma columna al encadenar sus cuatro tomas.
  const focusX = photo.focoX ?? (navegable ? promedio("x") : 50);
  const focusY = navegable ? promedio("y") : (photo.focus ?? 42);

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
   * Tamaño de la capa que lleva la foto, en píxeles.
   *
   * Va en píxeles y no con `aspect-ratio` en CSS porque depende de la ventana
   * medida. Y sale de la foto que se está mirando, no del ambiente: dentro de
   * un mismo ambiente conviven fotos verticales y apaisadas, y dimensionar con
   * una sola recortaba las otras.
   *
   * Dos modos, según cuánto habría que recortar (ver `LIMITE_RECORTE`):
   * **cubrir** llena la ventana y deja sobrante para el paneo; **contener**
   * muestra la foto entera, tan alta como la ventana.
   */
  const entera = photo.aspect < (frame.w / frame.h) * LIMITE_RECORTE;

  const layer = entera
    ? { width: frame.h * photo.aspect, height: frame.h }
    : (() => {
        const width = Math.max(frame.w, frame.h * photo.aspect) * OVERSCAN;
        return { width, height: width / photo.aspect };
      })();

  const slack = {
    x: Math.max(0, (layer.width - frame.w) / 2),
    y: Math.max(0, (layer.height - frame.h) / 2),
  };

  /**
   * El desplazamiento de reposo de cada eje, ya acotado al sobrante.
   *
   * Corriendo la capa `(50 − foco)%` del sobrante ×2, un punto que está al
   * `f%` de la foto queda al `f%` de la ventana. Eso es lo que garantiza que
   * un círculo siempre se pueda tocar: el de "Ir al pasillo" está al 78% del
   * ancho de la foto de recepción, y sin corrimiento horizontal quedaba fuera
   * de la ventana del teléfono —donde de una foto apaisada se ve apenas el
   * 40% central del ancho— y el recorrido se cortaba ahí.
   */
  const restX = acotar(((50 - focusX) / 100) * slack.x * 2, slack.x);
  const restY = acotar(((50 - focusY) / 100) * slack.y * 2, slack.y);

  useEffect(() => {
    // Al cambiar de foto el encuadre salta al reposo de la nueva: animar ese
    // salto se lee como un temblor encima de la transición.
    panX.jump(restX);
    panY.jump(restY);
  }, [nodeId, foto, restX, restY, panX, panY]);

  // Sin `useCallback`: el React Compiler memoriza solo, y escrito a mano acá
  // se daba por vencido —no puede probar que `slack` y `restX`, que salen de
  // la medición de la ventana, no cambien después— y dejaba de optimizar el
  // componente entero.
  const look = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !frameRef.current) return;
    const box = frameRef.current.getBoundingClientRect();
    const nx = (event.clientX - box.left) / box.width - 0.5;
    const ny = (event.clientY - box.top) / box.height - 0.5;

    panX.set(acotar(restX - nx * LOOK_X, slack.x));
    panY.set(acotar(restY - ny * LOOK_Y, slack.y));
  };

  const rest = () => {
    panX.set(restX);
    panY.set(restY);
  };

  /** Cambiar de ambiente. Siempre abre en su primera foto. */
  const ir = (
    to: string,
    desde: TourHotspot | null,
    direccion: "enter" | "back",
  ) => {
    setOrigin(desde ? { x: desde.x, y: desde.y } : { x: 50, y: 55 });
    setMove(direccion);
    setFoto(0);
    setNodeId(to);
  };

  /** Pasar fotos dentro del ambiente actual. */
  const pasar = (delta: 1 | -1) => {
    const proxima = foto + delta;
    if (proxima < 0 || proxima > node.photos.length - 1) return;
    setMove(delta === 1 ? "next" : "prev");
    setOrigin({ x: 50, y: 50 });
    setFoto(proxima);
  };

  const transicion = TRANSICIONES[move];
  const vecinas = [node.photos[foto - 1], node.photos[foto + 1]].filter(
    Boolean,
  );

  const pistas = [
    !coarsePointer && "Mové el cursor para mirar alrededor",
    showHotspots &&
      node.hotspots.length > 0 &&
      (coarsePointer
        ? "Tocá los puntos para entrar"
        : "Click en los puntos para entrar"),
    node.photos.length > 1 && "Las flechas pasan las fotos",
  ].filter((pista): pista is string => typeof pista === "string");

  return (
    <div className="mx-auto max-w-6xl">
      {/* Encabezado mínimo: dónde estoy. El recorrido se navega sobre la foto,
          así que no hace falta más. */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-primary-700 uppercase">
            Recorrido virtual
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
            onClick={() => ir(TOUR_START, null, "back")}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          >
            <RotateCcw className="size-4" aria-hidden />
            Volver al ingreso
          </button>
        )}
      </div>

      {/* Las flechas del teclado pasan las fotos, pero solo con el foco acá
          adentro: un listener global se llevaría puestas las flechas del resto
          de la página. El `onKeyDown` del contenedor alcanza porque los botones
          de adentro burbujean hasta él. */}
      <div
        ref={frameRef}
        tabIndex={0}
        role="group"
        aria-label={`Recorrido virtual: ${node.title}`}
        onPointerMove={look}
        onPointerLeave={rest}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") pasar(1);
          if (event.key === "ArrowLeft") pasar(-1);
        }}
        // La ventana va apaisada también en el teléfono. Antes era 3:4, de
        // cuando las tomas del pasillo eran verticales; ahora casi todas son
        // panorámicas (2:1) y en una ventana vertical se veía un tercio del
        // ancho, con los círculos de las puertas fuera de cuadro.
        className="relative aspect-4/3 touch-pan-y overflow-hidden rounded-3xl bg-ink-900 shadow-xl focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:outline-none sm:aspect-3/2 lg:aspect-16/10"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={`${node.id}-${foto}`}
            initial={reduceMotion ? { opacity: 0 } : transicion.entra}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : transicion.sale}
            transition={{
              duration: reduceMotion ? 0.18 : 0.42,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            // El zoom sale del círculo que se tocó, no del centro: es lo que
            // da la sensación de avanzar hacia esa puerta.
            style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
            className="absolute inset-0"
          >
            {/* Cuando la foto se muestra entera queda aire a los costados. Lo
                llena la misma foto ampliada y desenfocada, que es lo que hace
                que se lea como una decisión y no como un error de tamaño. Pide
                una variante de 64px: va a salir borrosa de todos modos. */}
            {entera && (
              <Image
                src={photo.src}
                alt=""
                aria-hidden
                fill
                sizes="64px"
                className="scale-110 object-cover opacity-40 blur-2xl"
              />
            )}

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
                sizes={medidas(photo.aspect)}
                priority={node.id === TOUR_START}
                className="object-cover"
                draggable={false}
              />

              {showHotspots &&
                node.hotspots.map((hotspot) => (
                  <Hotspot
                    key={hotspot.to}
                    hotspot={hotspot}
                    alwaysOpen={coarsePointer}
                    onClick={() => ir(hotspot.to, hotspot, "enter")}
                  />
                ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Flechas laterales: pasan las fotos de este ambiente y nada más.
            Se ocultan en los extremos en vez de quedar deshabilitadas, que
            sobre una foto se lee como un borrón sin sentido. El área de toque
            es de 48px aunque el círculo se vea de 40. */}
        {hayAnterior && (
          <FlechaFoto
            lado="izquierda"
            onClick={() => pasar(-1)}
            reduceMotion={reduceMotion}
          />
        )}
        {haySiguiente && (
          <FlechaFoto
            lado="derecha"
            onClick={() => pasar(1)}
            reduceMotion={reduceMotion}
          />
        )}

        {/* Volver y el contador comparten una fila y no dos esquinas: el texto
            del botón crece con el nombre de la parada ("Volver a Pasillo —
            primer tramo") y en un teléfono se montaba encima del contador.
            Todo esto va fuera de la capa que se desplaza: son acciones, no
            lugares de la foto, y tienen que quedarse quietas. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex flex-wrap items-center justify-center gap-2 px-16">
          {node.back && (
            <motion.button
              key={`back-${node.id}`}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.3, duration: 0.3 }}
              onClick={() => ir(node.back as string, null, "back")}
              className="group pointer-events-auto rounded-full focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/70 bg-ink-900/35 px-4 py-2 text-sm font-medium text-cream-50 backdrop-blur-md transition-colors duration-300 group-hover:bg-cream-50 group-hover:text-ink-900">
                <RotateCcw className="size-3.5" aria-hidden />
                Volver a {getTourNode(node.back)?.title}
              </span>
            </motion.button>
          )}

          {/* En qué foto del ambiente estoy. Solo cuando hay más de una. */}
          {node.photos.length > 1 && (
            <p className="rounded-full bg-ink-900/40 px-3 py-1.5 text-xs font-medium tabular-nums text-cream-50/90 backdrop-blur-md">
              {foto + 1} / {node.photos.length}
            </p>
          )}
        </div>

        {/* Cómo se usa. Se arma con lo que esta parada realmente ofrece: en un
            consultorio no hay puntos que tocar y en una foto única no hay
            flechas, así que anunciarlos sería mentir. */}
        {pistas.length > 0 && (
          <p className="pointer-events-none absolute top-4 left-1/2 z-20 max-w-[min(30rem,calc(100%-2rem))] -translate-x-1/2 rounded-full bg-ink-900/40 px-3.5 py-1.5 text-center text-[0.6875rem] tracking-wide text-balance text-cream-50/90 backdrop-blur-md">
            {pistas.join(" · ")}
          </p>
        )}
      </div>

      {/* Precarga de las fotos vecinas: al tocar una flecha, la que sigue ya
          está en el navegador y no hay parpadeo. Van invisibles y sin ocupar
          lugar; el `sizes` es el mismo que el del visor, que es lo que decide
          qué variante baja el navegador. */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 size-px overflow-hidden opacity-0"
      >
        {vecinas.map((vecina) => (
          <Image
            key={vecina.src}
            src={vecina.src}
            alt=""
            width={8}
            height={8}
            sizes={medidas(vecina.aspect)}
          />
        ))}
      </div>
    </div>
  );
}

type FlechaFotoProps = {
  lado: "izquierda" | "derecha";
  onClick: () => void;
  reduceMotion: boolean;
};

/**
 * Flecha para pasar las fotos del ambiente actual.
 *
 * Entra con un fundido corto para que no aparezca de golpe al llegar a una
 * parada con varias fotos.
 */
function FlechaFoto({ lado, onClick, reduceMotion }: FlechaFotoProps) {
  const izquierda = lado === "izquierda";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      aria-label={izquierda ? "Ver la foto anterior" : "Ver la foto siguiente"}
      className={cn(
        "group absolute top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none",
        izquierda ? "left-2 sm:left-3" : "right-2 sm:right-3",
      )}
    >
      <span className="grid size-10 place-items-center rounded-full border border-cream-50/60 bg-ink-900/35 text-cream-50 backdrop-blur-md transition-colors duration-300 group-hover:bg-cream-50 group-hover:text-ink-900">
        {izquierda ? (
          <ChevronLeft className="size-5" aria-hidden />
        ) : (
          <ChevronRight className="size-5" aria-hidden />
        )}
      </span>
    </motion.button>
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
      transition={{ delay: 0.3, duration: 0.28 }}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      aria-label={hotspot.label}
      className="group absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none"
    >
      {/* El círculo: sin relleno en reposo, se llena de blanco al activarse.
          El halo exterior no es decoración: sobre una pared clara —la de
          recepción, sin ir más lejos— un aro blanco fino desaparece, y hay que
          buscar el punto en vez de verlo. El halo lo despega del fondo sea
          claro u oscuro. */}
      <span
        aria-hidden
        className="pointer-events-none relative grid size-8 place-items-center rounded-full border-2 border-cream-50 shadow-[0_0_0_5px_rgba(20,24,22,0.28),0_3px_14px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] duration-300 group-hover:scale-110 group-focus-visible:scale-110"
      >
        <span
          className={cn(
            "block size-full scale-50 rounded-full bg-cream-50 opacity-0 transition-[opacity,transform] duration-300 ease-out",
            "group-hover:scale-100 group-hover:opacity-100",
            "group-focus-visible:scale-100 group-focus-visible:opacity-100",
          )}
        />
        {/* Latido sutil, para que el punto se note sobre la foto. */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full border-2 border-cream-50/60 animation-duration-[2.6s]" />
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
            "absolute top-full size-2 -translate-y-1 rotate-45 rounded-xs bg-ink-900/90",
            edge === "left" && "left-3",
            edge === "right" && "right-3",
            edge === "center" && "left-1/2 -translate-x-1/2",
          )}
        />
      </span>
    </motion.button>
  );
}
