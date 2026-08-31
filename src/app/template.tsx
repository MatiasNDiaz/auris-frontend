"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { isViewTransitionActive } from "@/components/providers/ViewTransitionProvider";

/**
 * `template.tsx` se vuelve a montar en cada navegación (a diferencia de
 * `layout.tsx`), así que es el lugar natural para la entrada de página: el
 * contenido nuevo aparece con un fundido y un desplazamiento mínimo.
 *
 * Cuando la navegación va con View Transition nativa el template se queda
 * quieto: su `translateY` es un transform sobre un ancestro del elemento
 * compartido y desplazaría la geometría que captura el navegador, que es
 * exactamente lo que produce el salto que queremos evitar.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  // Se lee una sola vez, en el montaje, que es cuando corre la transición.
  const [skip] = useState(() => isViewTransitionActive());

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
