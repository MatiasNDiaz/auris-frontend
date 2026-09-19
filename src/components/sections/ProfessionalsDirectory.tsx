"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { ProfessionalCard } from "@/components/shared/ProfessionalCard";
import { RecepcionistaCard } from "@/components/shared/RecepcionistaCard";
import { areas } from "@/lib/data/areas";
import { professionals } from "@/lib/data/professionals";
import { recepcionistas } from "@/lib/data/recepcionistas";
import { cn } from "@/lib/utils";

const ALL = "todos";
/**
 * Recepción es una opción más del filtro pero no es un área: su gente no
 * atiende pacientes y no está en `areas.ts`. Se le da una clave propia que no
 * puede chocar con ningún `areaSlug`.
 */
const RECEPCION = "recepcion";

/**
 * Listado del equipo, con filtro por el área de cada profesional.
 *
 * Filtra por `areaSlug` y no por el servicio: el servicio es el tratamiento
 * que se ofrece —y casi todo el equipo comparte "odontología"—, mientras que
 * el área distingue a quién hace odontopediatría de quién hace estética.
 *
 * Recepción va aparte, al final: son tarjetas sin ficha detrás, así que
 * mezclarlas con el resto rompería la expectativa de que una tarjeta lleva a
 * algún lado. Con "Todos" se ven las dos grillas, una debajo de la otra.
 */
export function ProfessionalsDirectory() {
  const [filter, setFilter] = useState<string>(ALL);

  const filtered = useMemo(
    () =>
      filter === ALL
        ? professionals
        : filter === RECEPCION
          ? []
          : professionals.filter((p) => p.areaSlug === filter),
    [filter],
  );

  const muestraRecepcion = filter === ALL || filter === RECEPCION;

  // Solo las áreas que hoy tienen gente: una pestaña vacía no sirve de nada.
  const options = [
    { slug: ALL, name: "Todos" },
    ...areas.filter((area) =>
      professionals.some((p) => p.areaSlug === area.slug),
    ),
    ...(recepcionistas.length ? [{ slug: RECEPCION, name: "Recepción" }] : []),
  ];

  return (
    <section className="relative overflow-hidden bg-surface-base py-16 lg:py-20">
      <LeafSprig
        palette="green"
        size="md"
        seed={12}
        className="bottom-0 left-2 h-44 opacity-45"
      />
      <div className="container-auris relative">
        <div
          role="group"
          aria-label="Filtrar profesionales por área"
          className="flex flex-wrap gap-2"
        >
          {options.map((option) => {
            const active = filter === option.slug;

            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setFilter(option.slug)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                  active
                    ? "border-primary-700 bg-primary-700 text-cream-50"
                    : "border-border bg-card text-ink-700/80 hover:border-primary-300 hover:text-primary-700",
                )}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-ink-700/70" aria-live="polite">
          {filter === RECEPCION
            ? `${recepcionistas.length} en recepción`
            : `${filtered.length} ${
                filtered.length === 1
                  ? "profesional disponible"
                  : "profesionales disponibles"
              }`}
        </p>

        <motion.ul
          layout
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((professional) => (
              <motion.li
                key={professional.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <ProfessionalCard
                  professional={professional}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {filtered.length === 0 && !muestraRecepcion && (
          <p className="mt-10 rounded-2xl border border-dashed border-border bg-cream-100 p-8 text-center text-ink-700/75">
            Todavía no tenemos profesionales cargados en esta especialidad.
          </p>
        )}

        {/* Recepción, al final y con su propio encabezado: son tarjetas sin
            ficha detrás, así que van separadas de las del equipo en vez de
            mezcladas en la misma grilla. */}
        {muestraRecepcion && (
          <div className={filter === ALL ? "mt-16" : "mt-8"}>
            {filter === ALL && (
              <div className="mb-8 border-t border-primary-100 pt-10">
                <p className="text-xs font-semibold tracking-[0.24em] text-primary-700 uppercase">
                  Recepción
                </p>
                <h2 className="mt-3 font-serif text-2xl text-primary-800 sm:text-3xl">
                  Recepcionistas
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700/80">
                  Las primeras caras que ves en AURIS.
                </p>
              </div>
            )}

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recepcionistas.map((persona) => (
                <li key={persona.slug}>
                  <RecepcionistaCard
                    recepcionista={persona}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
