"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { SectionHeading } from "@/components/shared/SectionHeading";

/**
 * Recorrido virtual. Hasta que exista el video real, el reproductor muestra un
 * estado vacío: reemplazar el bloque por un <video> o un iframe embebido.
 */
export function VirtualTour() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="recorrido-virtual"
      className="relative overflow-hidden py-20 lg:py-24"
    >
      <LeafSprig
        palette="beige"
        size="md"
        seed={14}
        className="bottom-0 left-2 h-44 opacity-45"
      />
      <div className="container-auris relative">
        <SectionHeading
          eyebrow="Recorrido virtual"
          title="Conocé el centro antes de venir"
          description="Un paseo por la recepción, los consultorios y los espacios comunes."
          className="mb-14"
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative aspect-16/9 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary-500 to-primary-800 shadow-xl"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 25%, rgba(255,255,255,.45), transparent 50%), radial-gradient(circle at 80% 75%, rgba(246,198,163,.6), transparent 45%)",
            }}
          />

          {playing ? (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
              <p className="max-w-md text-pretty text-cream-50/90">
                El video del recorrido virtual todavía no está cargado. Cuando
                esté disponible se reproduce en este espacio.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
            >
              <span
                aria-hidden
                className="inline-flex size-20 items-center justify-center rounded-full bg-cream-50/95 text-primary-700 shadow-lg transition-transform duration-300 group-hover:scale-110"
              >
                <Play className="ml-1 size-8 fill-current" strokeWidth={0} />
              </span>
              <span className="font-medium text-cream-50">
                Reproducir recorrido
              </span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
