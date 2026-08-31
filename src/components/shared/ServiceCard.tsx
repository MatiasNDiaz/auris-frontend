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
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100 bg-card shadow-sm transition-[box-shadow,border-color] duration-300 ease-out hover:border-primary-200 hover:shadow-xl",
        className,
      )}
    >
      {variant === "photo" && (
        // 16:10 en vez de una altura fija: la foto gana peso en la tarjeta y
        // acompaña el ancho de la columna en cada breakpoint del grid.
        <div className="relative aspect-16/10 w-full overflow-hidden">
          <Image
            src={service.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Se oscurece solo el pie de la foto: es donde apoya el ícono. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-ink-900/45 via-ink-900/5 to-transparent"
          />
        </div>
      )}

      {/* `relative` para que el ícono superpuesto no quede debajo de la foto,
          que al ser `relative` gana el orden de pintado por defecto. */}
      <div className="relative flex flex-1 flex-col p-7">
        <span
          aria-hidden
          className={cn(
            "inline-flex size-12 items-center justify-center self-center rounded-2xl bg-primary-100 text-primary-700 transition-[background-color,color,transform] duration-300 ease-out group-hover:bg-primary-600 group-hover:text-cream-50",
            // En la variante con foto el ícono flota sobre el borde inferior de
            // la imagen: el fondo semitransparente con blur deja ver la foto
            // por detrás y el anillo lo despega sin el borde grueso de antes.
            variant === "photo" &&
              "-mt-13 mb-5 bg-white/90 shadow-md ring-1 ring-primary-200/70 backdrop-blur-sm group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0",
          )}
        >
          {renderServiceIcon(service.icon, {
            className: "size-6",
            strokeWidth: 1.5,
          })}
        </span>

        <h3
          className={cn(
            "font-serif text-[1.375rem] leading-snug font-semibold text-ink-900 transition-colors duration-300 group-hover:text-primary-800",
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
