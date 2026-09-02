"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { ProfessionalCard } from "@/components/shared/ProfessionalCard";
import { professionals } from "@/lib/data/professionals";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

const ALL = "todos";

/** Listado del equipo con filtro por servicio. */
export function ProfessionalsDirectory() {
  const [filter, setFilter] = useState<string>(ALL);

  const filtered = useMemo(
    () =>
      filter === ALL
        ? professionals
        : professionals.filter((p) => p.serviceSlug === filter),
    [filter],
  );

  const options = [
    { slug: ALL, name: "Todos" },
    ...services.map((s) => ({ slug: s.slug, name: s.name })),
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
          aria-label="Filtrar profesionales por servicio"
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
          {filtered.length}{" "}
          {filtered.length === 1
            ? "profesional disponible"
            : "profesionales disponibles"}
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

        {filtered.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-border bg-cream-100 p-8 text-center text-ink-700/75">
            Todavía no tenemos profesionales cargados en esta especialidad.
          </p>
        )}
      </div>
    </section>
  );
}
