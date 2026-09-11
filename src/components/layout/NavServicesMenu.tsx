"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { renderServiceIcon } from "@/lib/icons";
import { listedServices } from "@/lib/data/services";
import { cn } from "@/lib/utils";

/**
 * "Servicios" de la navbar de escritorio, con el listado completo colgando.
 *
 * Se abre con el cursor encima y se cierra al salir, sin click. El enlace sigue
 * llevando a /servicios: el desplegable es un atajo, no un reemplazo, así que
 * quien haga click en el rótulo llega al listado completo igual que antes.
 *
 * El cierre tiene un retardo corto a propósito. El panel nace debajo del
 * rótulo, y sin ese respiro el menú se cierra en el camino diagonal del cursor
 * de una punta del rótulo a la primera fila de la lista.
 *
 * El foco por teclado abre y cierra igual que el cursor —`focusin` / `focusout`
 * sobre todo el bloque—, así que se puede tabular por los ocho servicios sin
 * tocar el mouse, y Escape lo cierra.
 */

/** Cuánto espera antes de cerrar al salir con el cursor. */
const RETARDO_CIERRE = 140;

type NavServicesMenuProps = {
  /** Las mismas clases que llevan el resto de los enlaces de la navbar. */
  className: string;
  activo: boolean;
};

export function NavServicesMenu({ className, activo }: NavServicesMenuProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;
  const panelId = useId();

  const [abierto, setAbierto] = useState(false);
  const cierre = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelarCierre = () => {
    if (cierre.current) clearTimeout(cierre.current);
    cierre.current = null;
  };

  const abrir = () => {
    cancelarCierre();
    setAbierto(true);
  };

  const cerrarConRetardo = () => {
    cancelarCierre();
    cierre.current = setTimeout(() => setAbierto(false), RETARDO_CIERRE);
  };

  useEffect(() => () => cancelarCierre(), []);

  // Al navegar desde el propio panel hay que cerrarlo a mano: si el cursor se
  // queda quieto sobre el bloque, en la página nueva no llega ningún
  // `mouseleave` y el menú quedaría abierto.
  const cerrarYa = () => {
    cancelarCierre();
    setAbierto(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={abrir}
      onMouseLeave={cerrarConRetardo}
      onFocusCapture={abrir}
      onBlurCapture={(evento) => {
        // Solo cierra si el foco se fue del bloque entero, no al saltar de una
        // fila de la lista a la siguiente.
        if (!evento.currentTarget.contains(evento.relatedTarget as Node)) {
          cerrarConRetardo();
        }
      }}
      onKeyDown={(evento) => {
        if (evento.key === "Escape") setAbierto(false);
      }}
    >
      <Link
        href="/servicios"
        aria-current={activo ? "page" : undefined}
        aria-expanded={abierto}
        aria-controls={panelId}
        onClick={cerrarYa}
        className={cn(className, "inline-flex items-center gap-1")}
      >
        Servicios
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 transition-transform duration-200 ease-out",
            abierto && "rotate-180",
          )}
        />
      </Link>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id={panelId}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{
              duration: reduceMotion ? 0.12 : 0.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            // `pt-3` en vez de `mt-3`: el hueco entre el rótulo y el panel
            // queda dentro del área que mantiene el menú abierto, así que
            // cruzarlo con el cursor no lo cierra.
            className="absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-3xl border border-primary-100 bg-cream-50/95 p-2 shadow-xl backdrop-blur-md">
              <ul>
                {listedServices.map((service) => {
                  const enEsta = pathname === `/servicios/${service.slug}`;

                  return (
                    <li key={service.slug}>
                      <Link
                        href={`/servicios/${service.slug}`}
                        aria-current={enEsta ? "page" : undefined}
                        onClick={cerrarYa}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                          enEsta
                            ? "bg-primary-200 text-primary-900"
                            : "text-primary-700 hover:bg-primary-100 hover:text-primary-900",
                        )}
                      >
                        <span
                          aria-hidden
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors duration-200 group-hover:bg-primary-600 group-hover:text-cream-50"
                        >
                          {renderServiceIcon(service.icon, {
                            className: "size-4",
                            strokeWidth: 1.6,
                          })}
                        </span>
                        {service.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/servicios"
                onClick={cerrarYa}
                className="group mt-1 flex items-center justify-between gap-2 rounded-2xl border-t border-primary-100 px-3 py-2.5 text-sm font-semibold text-primary-700 transition-colors duration-200 hover:text-primary-900 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
              >
                Ver todos los servicios
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
