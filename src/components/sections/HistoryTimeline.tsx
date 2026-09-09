"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LeafGust } from "@/components/shared/LeafGust";
import { milestones } from "@/lib/data/about";
import { cn } from "@/lib/utils";

/**
 * La historia como recorrido horizontal, solo para escritorio.
 *
 * Los hitos van de izquierda (pasado) a derecha (presente) sobre un eje, y
 * cada uno ramifica alternando arriba y abajo. La alternancia es únicamente
 * vertical: el orden temporal lo sigue marcando la posición horizontal, así
 * que una rama de arriba nunca "adelanta" a la de abajo que tiene al lado.
 *
 * El espaciado entre paradas es parejo y no proporcional al tiempo real: de
 * los seis hitos, tres no tienen fecha ("Los años siguientes", "Poco después",
 * "Hoy"), así que un eje a escala sería inventar años que nadie confirmó.
 *
 * Las tarjetas son solo texto. Con foto arriba, cada una se comía la mitad
 * del alto disponible y el riel entero había que achicarlo para que entrara
 * en la ventana, con lo que la letra terminaba más chica que antes. Sin foto
 * entran a tamaño real y el texto se puede leer de lejos, que es de lo que
 * se trata un recorrido que se mira de costado.
 *
 * El armado es una grilla de tres filas —rama de arriba, eje, rama de abajo—
 * y una columna por hito, más dos de aire en las puntas. Las filas van en
 * `auto`: con posicionamiento absoluto había que fijar el alto a mano y las
 * tarjetas de abajo se cortaban, y con `1fr` las dos filas se igualaban a la
 * más alta y sobraban ochenta píxeles de aire.
 *
 *
 * CÓMO SE ENGANCHA AL SCROLL
 *
 * El bloque se estira a lo alto tantos píxeles como mida el recorrido
 * horizontal y adentro va un contenedor pegado a la pantalla. Mientras dura
 * ese tramo la sección se queda quieta en su lugar y la rueda del mouse
 * mueve la línea de tiempo hacia la derecha; cuando el tramo se agota, la
 * página sigue bajando sola.
 *
 * Está resuelto así, y no interceptando `wheel` con `preventDefault`, a
 * propósito. Cancelar el evento congela el número del scroll, pero rompe la
 * inercia del trackpad, el avance por teclado y el arrastre de la barra, y
 * obliga a inventar a mano la liberación en las dos puntas: es la receta
 * clásica del "scrolleo y no pasa nada" y del segundo intento para salir.
 * Estirando el bloque, la liberación la hace el navegador —al terminar el
 * recorrido la página sigue de largo, y hacia arriba el camino es simétrico
 * sin una línea más de código—. Lo que ve el visitante es exactamente lo
 * pedido: baja la rueda y lo único que se mueve es la línea del tiempo.
 *
 * El enganche se activa solo si tiene sentido: de `lg` para arriba y sin
 * `prefers-reduced-motion`. Si el riel no entra en la ventana no se apaga el
 * efecto: se achica con `--escala` hasta que entra, con un piso, y recién por
 * debajo de ese piso queda el scroll horizontal nativo, que es también la
 * alternativa accesible.
 */

/** Ancho de cada parada. La tarjeta es más angosta y queda centrada en él. */
const PASO = "35rem";
const TARJETA = "32rem";
/** Largo del tallo que une el nodo del eje con la tarjeta. */
const TALLO = "2.5rem";

/** Alto de la navbar, que queda pegada arriba de todo. */
const CABEZAL = 80;
/** Aire vertical dentro del contenedor pegado, arriba y abajo. */
const RESPIRO = 32;
/** Separación entre la cabecera y el riel. */
const HUECO = 32;
/** Cuánto se acerca la posición dibujada a la real en cada cuadro. */
const SUAVIZADO = 0.16;
/** Piso de rescate: por debajo de esto el riel se leería diminuto. */
const ESCALA_MINIMA = 0.62;

/**
 * Cómo se pinta cada tarjeta. Los hitos de la crónica van en claro; los dos
 * del cierre toman los dos colores del isotipo —el beige y el verde bosque—,
 * que es lo que los despega del relato sin sacarlos de la línea.
 */
const PALETAS = {
  claro: {
    caja: "border-primary-100 bg-card group-hover:border-primary-200",
    titulo: "text-primary-800",
    raya: "bg-primary-300",
    cuerpo: "text-ink-900/85",
  },
  arena: {
    caja: "border-warm-200 bg-surface-sand group-hover:border-warm-300",
    titulo: "text-primary-800",
    raya: "bg-warm-400",
    cuerpo: "text-ink-900/85",
  },
  verde: {
    caja: "border-primary-700 bg-primary-800 group-hover:border-primary-600",
    titulo: "text-cream-50",
    raya: "bg-cream-200",
    cuerpo: "text-cream-100/90",
  },
} as const;

export function HistoryTimeline() {
  const bloque = useRef<HTMLDivElement>(null);
  const cabecera = useRef<HTMLDivElement>(null);
  const marco = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLOListElement>(null);
  const barra = useRef<HTMLSpanElement>(null);

  /**
   * Píxeles de recorrido horizontal y cuánto hay que achicar el riel para que
   * entre en la ventana. En cero el enganche está apagado y el riel se mueve
   * con el scroll horizontal de siempre.
   */
  const [{ recorrido, escala }, setMedida] = useState({
    recorrido: 0,
    escala: 1,
  });
  const [rafaga, setRafaga] = useState(0);
  const pegado = recorrido > 0;

  const medir = useCallback(() => {
    const marcoEl = marco.current;
    const pistaEl = pista.current;
    const cabeceraEl = cabecera.current;
    if (!marcoEl || !pistaEl || !cabeceraEl) return;

    // `offsetParent` nulo es la versión de escritorio oculta por CSS en
    // pantallas chicas: ahí no hay nada que enganchar.
    const visible = marcoEl.offsetParent !== null;
    const anchoOk = window.matchMedia("(min-width: 1024px)").matches;
    const movimientoOk = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (!visible || !anchoOk || !movimientoOk) {
      setMedida({ recorrido: 0, escala: 1 });
      return;
    }

    // Cuánto alto queda para el riel una vez descontados la navbar, el aire
    // del contenedor pegado y la cabecera.
    const paraElRiel =
      window.innerHeight -
      CABEZAL -
      RESPIRO * 2 -
      cabeceraEl.offsetHeight -
      HUECO;
    const k = Math.min(1, paraElRiel / pistaEl.offsetHeight);

    if (k < ESCALA_MINIMA) {
      setMedida({ recorrido: 0, escala: 1 });
      return;
    }

    // El ancho que hay que recorrer es el del riel ya escalado.
    const sobra = pistaEl.offsetWidth * k - marcoEl.clientWidth;
    setMedida(
      sobra > 0 ? { recorrido: sobra, escala: k } : { recorrido: 0, escala: 1 },
    );
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
    // `recorrido` entra a propósito: al pasar a pegado cambia la geometría del
    // marco y hay que volver a medir una vez con la nueva.
  }, [medir, recorrido]);

  useEffect(() => {
    const pistaEl = pista.current;
    const bloqueEl = bloque.current;
    if (!pistaEl || !bloqueEl) return;

    if (!pegado) {
      pistaEl.style.transform = "";
      return;
    }

    let dibujado = 0;
    let cuadro = 0;
    let vivo = false;
    // Para que la ráfaga salga una vez por visita y no en cada cuadro.
    let disparada = false;

    const animar = () => {
      const caja = bloqueEl.getBoundingClientRect();
      const crudo = (CABEZAL - caja.top) / recorrido;
      const avance = Math.min(1, Math.max(0, crudo));

      if (avance > 0.004 && !disparada) {
        disparada = true;
        setRafaga((n) => n + 1);
      }
      // Se rearma recién cuando la sección quedó bien lejos, para que un
      // temblor del scroll en el borde no dispare dos veces seguidas.
      if (crudo < -0.35 || crudo > 1.35) disparada = false;

      // Interpolar y no saltar: la rueda de un mouse avanza de a tirones de
      // cien píxeles, y sin este suavizado el riel se movería a los saltos.
      const destino = avance * recorrido;
      dibujado += (destino - dibujado) * SUAVIZADO;
      if (Math.abs(destino - dibujado) < 0.4) dibujado = destino;

      // El orden importa: primero se escala y después se traslada, así el
      // desplazamiento es en píxeles de pantalla y no en los del riel.
      pistaEl.style.transform = `translate3d(${-dibujado}px, 0, 0) scale(${escala})`;
      if (barra.current) {
        barra.current.style.transform = `scaleX(${dibujado / recorrido})`;
      }

      if (vivo) cuadro = requestAnimationFrame(animar);
    };

    // El bucle corre solo con la sección cerca: el resto del tiempo no hay
    // nada que mover y no tiene sentido pedir cuadros.
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting === vivo) return;
        vivo = entrada.isIntersecting;
        if (vivo) cuadro = requestAnimationFrame(animar);
        else cancelAnimationFrame(cuadro);
      },
      { rootMargin: "300px 0px" },
    );
    observador.observe(bloqueEl);

    return () => {
      observador.disconnect();
      vivo = false;
      cancelAnimationFrame(cuadro);
      pistaEl.style.transform = "";
    };
  }, [pegado, recorrido, escala]);

  return (
    <div
      ref={bloque}
      // El margen de abajo va por fuera del alto calculado: con `padding`
      // entraría dentro de la caja —`box-sizing: border-box`— y le comería
      // recorrido al tramo pegado.
      className={cn(
        "mt-16 mb-20 lg:mt-24 lg:mb-28",
        !pegado && "pb-20 lg:pb-24",
      )}
      style={
        pegado
          ? { height: `calc(100vh - ${CABEZAL}px + ${recorrido}px)` }
          : undefined
      }
    >
      <div
        className={cn(
          "flex flex-col",
          pegado && "sticky top-20 h-[calc(100vh-5rem)] overflow-hidden py-8",
        )}
      >
        <div ref={cabecera} className="container-auris text-center">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary-700 uppercase">
            Nuestra historia
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-balance text-primary-800 xl:text-4xl">
            De Kúspide a AURIS
          </h2>

          {/* La señal de que este tramo se recorre distinto. Una línea fina y
              no un cartel: alcanza para entender que la página no se trabó,
              sin robarle atención a la historia. Se dibuja siempre —invisible
              cuando no hay enganche— para que la cabecera mida igual en los
              dos modos y la medición no oscile. */}
          <span
            aria-hidden
            className={cn(
              "mx-auto mt-5 block h-0.5 w-full max-w-3xl overflow-hidden rounded-full bg-primary-100",
              !pegado && "invisible",
            )}
          >
            <span
              ref={barra}
              className="block h-full w-full origin-left scale-x-0 rounded-full bg-primary-500"
            />
          </span>
        </div>

        {/* El riel se sale del contenedor a propósito: la línea del tiempo
            tiene que llegar hasta los dos bordes de la pantalla para que se
            lea como un recorrido que sigue más allá de lo que se ve. */}
        <div
          ref={marco}
          className={cn(
            "relative",
            pegado
              ? "flex flex-1 items-center overflow-hidden"
              : "overflow-x-auto overscroll-x-contain pb-3 [scrollbar-color:var(--color-primary-300)_transparent] [scrollbar-width:thin]",
          )}
          style={{ marginTop: HUECO }}
        >
          <ol
            ref={pista}
            className="grid w-max shrink-0 origin-left grid-rows-[auto_auto_auto] will-change-transform"
            style={{
              ["--aire" as string]: "clamp(2rem, 9vw, 10rem)",
              gridTemplateColumns: `var(--aire) repeat(${milestones.length}, ${PASO}) var(--aire)`,
            }}
          >
            {/* El eje, una sola pieza de punta a punta. Se desvanece en los
                dos extremos para no terminar en un corte seco. */}
            <span
              aria-hidden
              className="row-start-2 h-px self-center bg-linear-to-r from-transparent via-primary-300 to-transparent"
              style={{ gridColumn: "1 / -1" }}
            />

            {milestones.map((milestone, index) => {
              // Alternancia estricta: los pares ramifican hacia arriba.
              const arriba = index % 2 === 0;
              // La primera columna es el aire de la izquierda.
              const columna = index + 2;
              const paleta = PALETAS[milestone.tone ?? "claro"];

              return (
                // `contents` deja que los tres pedazos del hito se ubiquen
                // directamente en la grilla del riel sin perder la lista.
                <li key={milestone.when} className="contents">
                  <div
                    className={cn(
                      "group relative justify-self-center",
                      arriba
                        ? "row-start-1 self-end"
                        : "row-start-3 self-start",
                    )}
                    style={{
                      gridColumn: columna,
                      width: TARJETA,
                      [arriba ? "paddingBottom" : "paddingTop"]: TALLO,
                    }}
                  >
                    {/* Mismo gesto que las tarjetas de servicios: se levanta
                        un poco, gana sombra y la foto se acerca. En Tailwind
                        v4 `-translate-y-*` sale como propiedad `translate`, no
                        como `transform`, así que la transición la nombra. */}
                    <article
                      className={cn(
                        "rounded-3xl border p-8 shadow-sm transition-[box-shadow,border-color,translate] duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-xl",
                        paleta.caja,
                      )}
                    >
                      <h3
                        className={cn(
                          "font-serif text-2xl leading-snug",
                          paleta.titulo,
                        )}
                      >
                        {milestone.title}
                      </h3>
                      {/* Sin foto, la tarjeta necesita algo que separe el
                          titular del cuerpo. La misma rayita corta que usan
                          los encabezados de sección; se estira en el hover. */}
                      <span
                        aria-hidden
                        className={cn(
                          "mt-4 block h-px w-10 origin-left transition-transform duration-300 ease-out group-hover:scale-x-[2.4]",
                          paleta.raya,
                        )}
                      />
                      <p
                        className={cn(
                          "mt-4 text-[1.0625rem] leading-relaxed text-pretty",
                          paleta.cuerpo,
                        )}
                      >
                        {milestone.description}
                      </p>
                    </article>

                    {/* El tallo ocupa el hueco que dejó el padding. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-1/2 w-px -translate-x-1/2 bg-primary-300",
                        arriba ? "bottom-0" : "top-0",
                      )}
                      style={{ height: TALLO }}
                    />

                    {/* El orbe: sube o baja por ese mismo tallo, siempre desde
                        el eje hacia la tarjeta. Las seis ramas van desfasadas
                        para que no latan todas a la vez. */}
                    <span
                      aria-hidden
                      className="auris-orb absolute left-1/2 size-1.5 rounded-full bg-primary-500 shadow-[0_0_10px_3px_var(--color-primary-200)]"
                      style={
                        {
                          [arriba ? "bottom" : "top"]: 0,
                          "--orb-desde": "0rem",
                          "--orb-hasta": arriba ? `-${TALLO}` : TALLO,
                          "--orb-delay": `${index * 0.42}s`,
                        } as React.CSSProperties
                      }
                    />
                  </div>

                  {/* El nodo sobre el eje. */}
                  <span
                    aria-hidden
                    className="row-start-2 size-3.5 justify-self-center rounded-full bg-primary-500 ring-4 ring-surface-base"
                    style={{ gridColumn: columna }}
                  />

                  {/* La fecha va del lado contrario a la tarjeta: así el eje
                      se lee solo, como una regla, sin subir la vista. */}
                  <p
                    className={cn(
                      "justify-self-center font-serif text-lg whitespace-nowrap text-primary-700",
                      arriba
                        ? "row-start-3 self-start pt-4"
                        : "row-start-1 self-end pb-4",
                    )}
                    style={{ gridColumn: columna }}
                  >
                    {milestone.when}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* La ráfaga va por delante del riel: es un golpe de viento de dos
            segundos y medio, y por detrás de las tarjetas no se vería. */}
        {pegado && <LeafGust trigger={rafaga} className="z-20" />}
      </div>
    </div>
  );
}
