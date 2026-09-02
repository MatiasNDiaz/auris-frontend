"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Nunca cambia, así que alcanza con una suscripción vacía. */
const noSubscribe = () => () => {};

type CountUpProps = {
  to: number;
  /** Desfasaje del arranque, para escalonar varios números. */
  delay?: number;
  className?: string;
};

/**
 * Número que cuenta desde cero cuando la franja entra en pantalla.
 *
 * En el servidor se pinta el valor final, no un cero: el HTML estático lleva la
 * cifra correcta y alguien con el JavaScript caído ve el número. Del lado del
 * cliente el valor de partida pasa a ser el del conteo, que arranca en cero.
 *
 * Ese "estoy en el cliente" sale de `useSyncExternalStore` —el mismo patrón de
 * `ScrollToTop` y `use-media-query`— y no de un `setState` dentro de un efecto,
 * que dispara un render en cascada por cada número de la franja.
 *
 * `once: true` es lo que hace que el conteo pase una sola vez: volver a subir y
 * bajar sobre la franja no lo reinicia.
 */
export function CountUp({ to, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [counted, setCounted] = useState(0);

  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!inView || reduceMotion) return;

    const controls = animate(0, to, {
      duration: 2,
      delay,
      // Sale rápido y se va frenando: un conteo lineal se lee como un
      // contador de máquina, este como algo que llega a un número.
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setCounted(Math.round(value)),
    });

    return () => controls.stop();
  }, [inView, to, delay, reduceMotion]);

  const shown = hydrated && !reduceMotion ? counted : to;

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("es-AR")}
    </span>
  );
}
