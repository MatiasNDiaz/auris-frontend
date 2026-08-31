"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { AnimatedProfessionalImage } from "./AnimatedProfessionalImage";
import { getServiceBySlug } from "@/lib/data/services";
import type { Professional } from "@/lib/types";
import { useViewTransitionRouter } from "@/components/providers/ViewTransitionProvider";
import { cn } from "@/lib/utils";

type ProfessionalCardProps = {
  professional: Professional;
  className?: string;
  sizes?: string;
};

export function ProfessionalCard({
  professional,
  className,
  sizes,
}: ProfessionalCardProps) {
  const service = getServiceBySlug(professional.serviceSlug);
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
    >
      <AnimatedProfessionalImage
        ref={photoRef}
        vtSlug={professional.slug}
        src={professional.photoUrl}
        alt={`Retrato de ${professional.name}`}
        sizes={sizes}
        className="aspect-4/5 w-full rounded-t-3xl"
      />

      <div className="flex flex-1 flex-col p-6">
        {service && (
          <p className="text-xs font-semibold tracking-[0.14em] text-primary-700 uppercase">
            {service.name}
          </p>
        )}

        <h3 className="mt-2 font-serif text-xl text-ink-900">
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
        </h3>

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
