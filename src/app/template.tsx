"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { isViewTransitionActive } from "@/components/providers/ViewTransitionProvider";

/**
 * La primera vez que este módulo corre en el navegador es la carga inicial del
 * sitio; de ahí en más, cada montaje del template es una navegación interna.
 *
 * Es lo que distingue los dos casos sin tocar el router: el módulo se carga una
 * sola vez y sobrevive a los cambios de ruta.
 */
let huboNavegacion = false;

/**
 * `template.tsx` se vuelve a montar en cada navegación (a diferencia de
 * `layout.tsx`), así que es el lugar natural para la entrada de página: el
 * contenido nuevo aparece con un fundido y un desplazamiento mínimo.
 *
 * Cuando la navegación va con View Transition nativa el template se queda
 * quieto: su `translateY` es un transform sobre un ancestro del elemento
 * compartido y desplazaría la geometría que captura el navegador, que es
 * exactamente lo que produce el salto que queremos evitar.
 *
 * En la carga inicial tampoco anima, y eso no es un detalle: Framer serializa
 * el `initial` en el HTML del servidor, así que la página entera se servía con
 * `opacity: 0.4` y recién llegaba a opaca cuando el bundle bajaba e hidrataba.
 * Medido en un teléfono con la CPU a 1/4 y 1.6 Mbps: el primer pintado era a
 * los 2,4 s y el contenido seguía translúcido hasta los 6,4 s. Eso es la "capa
 * blanca" que tapaba todo. En una navegación interna el problema no existe
 * —el JS ya está en memoria— y ahí el fundido sigue igual que siempre.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  // Se lee una sola vez, en el montaje, que es cuando corre la transición.
  const [skip] = useState(() => {
    if (typeof window === "undefined") return true;
    if (isViewTransitionActive()) return true;
    const esCargaInicial = !huboNavegacion;
    huboNavegacion = true;
    return esCargaInicial;
  });

  if (reduceMotion || skip) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0.4, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
