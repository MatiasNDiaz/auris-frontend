"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { renderServiceIcon } from "@/lib/icons";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  service: Service;
  className?: string;
};

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 transition-colors duration-300 group-hover:bg-primary-500 group-hover:text-cream-50"
      >
        {renderServiceIcon(service.icon, {
          className: "size-6",
          strokeWidth: 1.5,
        })}
      </span>

      <h3 className="mt-6 font-serif text-xl text-ink-900">
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

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600">
        Conocer más
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </motion.article>
  );
}
