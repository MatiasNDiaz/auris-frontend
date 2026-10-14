"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { AnimatedProfessionalImage } from "./AnimatedProfessionalImage";
import { getAreaBySlug } from "@/lib/data/areas";
import { precargarFotoDeFicha } from "@/lib/precarga-foto";
import type { Professional } from "@/lib/types";
import { useViewTransitionRouter } from "@/components/providers/ViewTransitionProvider";
import { cn } from "@/lib/utils";

type ProfessionalCardProps = {
  professional: Professional;
  className?: string;
  sizes?: string;
  /**
   * Nivel del título. Por defecto `h3`, correcto cuando la grilla cuelga de un
   * `h2` de sección. En `/profesionales` las tarjetas van directo bajo el `h1`
   * de la página, así que ahí van en `h2`: saltar de `h1` a `h3` rompe el orden
   * de encabezados.
   */
  nivelTitulo?: 2 | 3;
};

export function ProfessionalCard({
  professional,
  className,
  sizes,
  nivelTitulo = 3,
}: ProfessionalCardProps) {
  const Titulo = nivelTitulo === 2 ? "h2" : "h3";
  const area = getAreaBySlug(professional.areaSlug);
  const photoRef = useRef<HTMLDivElement>(null);
  const navigate = useViewTransitionRouter();
  const href = `/profesionales/${professional.slug}`;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-primary-100 bg-card shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
      // Toda la superficie navega; el <a> de abajo sostiene la accesibilidad
      // y el click derecho / abrir en pestaña nueva.
      onClick={(event) => {
        if (event.defaultPrevented) return;
        navigate(href, photoRef.current);
      }}
      // La ficha pide una variante más grande de la misma foto, así que no
      // reusa la de la tarjeta: se empieza a bajar al apuntar o tocar, no al
      // llegar a la ficha. Ver `precargarFotoDeFicha`.
      onPointerEnter={() => precargarFotoDeFicha(professional.photoUrl)}
      onPointerDown={() => precargarFotoDeFicha(professional.photoUrl)}
    >
      <AnimatedProfessionalImage
        ref={photoRef}
        vtSlug={professional.slug}
        src={professional.photoUrl}
        // Al pasar el cursor por la tarjeta se cruza con su foto 2, igual
        // que en el hero de la ficha. Sin `autoAlterna`: en un listado,
        // doce tarjetas cambiando solas marean.
        hoverSrc={professional.photoHoverUrl}
        objectPosition={professional.fotoFoco}
        hoverObjectPosition={professional.fotoHoverFoco}
        alt={`Retrato de ${professional.name}`}
        sizes={sizes}
        className="aspect-4/5 w-full rounded-t-3xl"
      />

      <div className="flex flex-1 flex-col p-6">
        {/* El área, no el servicio: es lo que distingue a quién hace
            odontopediatría de quién hace estética. */}
        {area && (
          <p className="text-xs font-semibold tracking-[0.14em] text-primary-700 uppercase">
            {area.name}
          </p>
        )}

        <Titulo className="mt-2 font-serif text-xl text-ink-900">
          <Link
            href={href}
            onClick={(event) => {
              // Dejamos que el navegador maneje ctrl/cmd-click y clic del medio.
              if (event.metaKey || event.ctrlKey || event.button !== 0) return;
              event.preventDefault();
              navigate(href, photoRef.current);
            }}
            className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          >
            {professional.name}
          </Link>
        </Titulo>

        <p className="mt-1 text-sm text-ink-700/75">{professional.specialty}</p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">
          Ver perfil
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </motion.article>
  );
}
