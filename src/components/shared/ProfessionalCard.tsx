"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatedProfessionalImage } from "./AnimatedProfessionalImage";
import { getServiceBySlug } from "@/lib/data/services";
import type { Professional } from "@/lib/types";
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

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <AnimatedProfessionalImage
        slug={professional.slug}
        src={professional.photoUrl}
        alt={`Retrato de ${professional.name}`}
        sizes={sizes}
        className="aspect-4/5 w-full"
      />

      <div className="flex flex-1 flex-col p-6">
        {service && (
          <p className="text-xs font-semibold tracking-[0.14em] text-primary-500 uppercase">
            {service.name}
          </p>
        )}
        <h3 className="mt-2 font-serif text-xl text-ink-900">
          {/* El link cubre toda la card para que el área de click sea la tarjeta entera. */}
          <Link
            href={`/profesionales/${professional.slug}`}
            className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          >
            {professional.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink-700/75">{professional.specialty}</p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600">
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
