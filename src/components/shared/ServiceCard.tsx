"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import { renderServiceIcon } from "@/lib/icons";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  service: Service;
  className?: string;
  /** `compact` deja la tarjeta sin foto, solo con el ícono. */
  variant?: "photo" | "compact";
};

export function ServiceCard({
  service,
  className,
  variant = "photo",
}: ServiceCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100 bg-card shadow-sm transition-shadow hover:border-primary-200 hover:shadow-lg",
        className,
      )}
    >
      {variant === "photo" && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={service.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-primary-900/50 to-transparent"
          />
        </div>
      )}

      {/* `relative` para que el ícono superpuesto no quede debajo de la foto,
          que al ser `relative` gana el orden de pintado por defecto. */}
      <div className="relative flex flex-1 flex-col p-7">
        <span
          aria-hidden
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-cream-50",
            variant === "photo" && "-mt-13 mb-4 border-4 border-card bg-cream-50 shadow-md",
          )}
        >
          {renderServiceIcon(service.icon, {
            className: "size-6",
            strokeWidth: 1.5,
          })}
        </span>

        <h3
          className={cn(
            "font-serif text-xl text-ink-900",
            variant === "compact" && "mt-6",
          )}
        >
          <Link
            href={`/servicios/${service.slug}`}
            className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          >
            {service.name}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700/80">
          {service.shortDescription}
        </p>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">
          Ver más
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </motion.article>
  );
}
