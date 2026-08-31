"use client";

import { ArrowUp } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/** A partir de acá el botón tiene sentido: ya hay camino de vuelta. */
const SHOW_AFTER = 600;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/**
 * Botón flotante de vuelta al tope, presente en todas las páginas.
 *
 * Lee el scroll con `useSyncExternalStore` en vez de un efecto con `setState`:
 * el snapshot del servidor es `false` —oculto— y no provoca renders en cascada
 * ni desajustes de hidratación. Es el mismo patrón de `lib/use-media-query.ts`.
 *
 * Nunca se desmonta: entra y sale con opacidad y desplazamiento, y en estado
 * oculto queda sin eventos, así que no bloquea nada de la página.
 */
export function ScrollToTop() {
  const visible = useSyncExternalStore(
    subscribe,
    () => window.scrollY > SHOW_AFTER,
    () => false,
  );

  const toTop = useCallback(() => {
    // El sitio no tiene `scroll-behavior: smooth` global —competía con las
    // View Transitions—, así que el suavizado se pide acá y solo acá.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Volver arriba"
      tabIndex={visible ? undefined : -1}
      aria-hidden={!visible}
      className={cn(
        "group fixed right-5 bottom-5 z-50 inline-flex size-11 items-center justify-center rounded-full sm:right-7 sm:bottom-7",
        // Verde plano, no degradé: a 44px un degradé se lee como una mancha.
        // El aro claro lo despega del fondo sin necesidad de una sombra grande.
        "bg-primary-700 text-cream-50 ring-1 ring-cream-50/25 shadow-md shadow-ink-900/20 backdrop-blur-sm",
        "transition-[opacity,transform,background-color,box-shadow] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:bg-primary-800 hover:shadow-lg hover:shadow-ink-900/28 active:translate-y-0 active:duration-150",
        "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:outline-none",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {/* La flecha acompaña el gesto del botón: sube un poco al pasar el mouse. */}
      <ArrowUp
        className="size-4.5 transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        strokeWidth={2.4}
        aria-hidden
      />
    </button>
  );
}
