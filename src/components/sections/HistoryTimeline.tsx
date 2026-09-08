import Image from "next/image";
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
 * El armado es una grilla de tres filas —rama de arriba, eje, rama de abajo—
 * y una columna por hito, más dos de aire en las puntas. Las filas de las
 * ramas son `auto`, así que cada una mide lo que mide su tarjeta más alta y el
 * riel ocupa lo mínimo: con posicionamiento absoluto había que adivinar ese
 * alto y las tarjetas de abajo se cortaban, y con `1fr` las dos filas se
 * igualaban a la más alta y sobraban ochenta píxeles de aire.
 *
 * Por ahora el riel se recorre con el scroll horizontal nativo. Ese mismo
 * modo es el que va a quedar como alternativa cuando el visitante pide menos
 * movimiento, así que no es andamio descartable.
 */

/** Ancho de cada parada. La tarjeta es más angosta y queda centrada en él. */
const PASO = "24.5rem";
const TARJETA = "21rem";
/** Largo del tallo que une el nodo del eje con la tarjeta. */
const TALLO = "2rem";

export function HistoryTimeline() {
  return (
    <div className="relative">
      <div className="container-auris">
        <p className="text-xs font-semibold tracking-[0.24em] text-primary-700 uppercase">
          Nuestra historia
        </p>
        <div className="mt-3 flex items-end justify-between gap-8">
          <h2 className="font-serif text-3xl leading-tight text-balance text-primary-800 xl:text-4xl">
            De Kúspide a AURIS
          </h2>
          <p className="mb-1 shrink-0 text-sm text-ink-700/70">
            Seis momentos, de izquierda a derecha.
          </p>
        </div>
      </div>

      {/* El riel se sale del contenedor a propósito: la línea del tiempo tiene
          que llegar hasta los dos bordes de la pantalla para que se lea como
          un recorrido que sigue más allá de lo que se ve. */}
      <div className="mt-8 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-color:var(--color-primary-300)_transparent] [scrollbar-width:thin]">
        <ol
          className="grid w-max grid-rows-[auto_auto_auto]"
          style={{
            ["--aire" as string]: "clamp(2rem, 9vw, 10rem)",
            gridTemplateColumns: `var(--aire) repeat(${milestones.length}, ${PASO}) var(--aire)`,
          }}
        >
          {/* El eje, una sola pieza de punta a punta. Se desvanece en los dos
              extremos para no terminar en un corte seco contra el borde. */}
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

            return (
              // `contents` deja que los tres pedazos del hito se ubiquen
              // directamente en la grilla del riel sin perder la lista.
              <li key={milestone.when} className="contents">
                <div
                  className={cn(
                    "relative justify-self-center",
                    arriba ? "row-start-1 self-end" : "row-start-3 self-start",
                  )}
                  style={{
                    gridColumn: columna,
                    width: TARJETA,
                    [arriba ? "paddingBottom" : "paddingTop"]: TALLO,
                  }}
                >
                  <article className="overflow-hidden rounded-3xl border border-primary-100 bg-card shadow-sm">
                    <div className="relative aspect-12/5 w-full bg-cream-100">
                      <Image
                        src={milestone.image}
                        alt={milestone.alt}
                        fill
                        sizes="336px"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-serif text-lg leading-snug text-primary-800">
                        {milestone.title}
                      </h3>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-pretty text-ink-700/80">
                        {milestone.description}
                      </p>
                    </div>
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
                </div>

                {/* El nodo sobre el eje. */}
                <span
                  aria-hidden
                  className="row-start-2 size-3.5 justify-self-center rounded-full bg-primary-500 ring-4 ring-surface-base"
                  style={{ gridColumn: columna }}
                />

                {/* La fecha va del lado contrario a la tarjeta: así el eje se
                    lee solo, como una regla, sin subir la vista a cada rama. */}
                <p
                  className={cn(
                    "font-serif text-lg whitespace-nowrap text-primary-700 justify-self-center",
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
    </div>
  );
}
