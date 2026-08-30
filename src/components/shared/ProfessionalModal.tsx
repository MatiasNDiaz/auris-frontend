"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfessionalProfile } from "./ProfessionalProfile";
import type { Professional, Service } from "@/lib/types";

type ProfessionalModalProps = {
  professional: Professional;
  service?: Service;
};

/**
 * Overlay del detalle de un profesional, montado por la intercepting route.
 *
 * Al quedar montado sobre la vista del listado, la foto de la card y la de este
 * overlay comparten `layoutId` en el mismo árbol: es lo que permite el morph
 * fluido de la imagen (y el camino inverso al cerrar).
 */
export function ProfessionalModal({
  professional,
  service,
}: ProfessionalModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  // La navegación real se difiere hasta que termina la animación de salida,
  // así la imagen alcanza a volver a su lugar en la card.
  const close = () => setOpen(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => router.back()}>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Perfil de ${professional.name}`}
          className="fixed inset-0 z-60 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 bg-ink-900/45 backdrop-blur-sm"
          />

          <div className="relative flex min-h-full items-start justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative w-full max-w-5xl rounded-[2rem] bg-cream-50 p-6 shadow-2xl sm:p-10"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <Link
                  href={`/profesionales/${professional.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                >
                  Ver perfil completo
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>

                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar perfil"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <ProfessionalProfile
                professional={professional}
                service={service}
                compact
              />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
