"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const directions = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos, para escalonar elementos de una misma sección. */
  delay?: number;
  from?: keyof typeof directions;
  as?: "div" | "section" | "li" | "article" | "header";
};

/**
 * Scroll-reveal reutilizable. Anima una sola vez al entrar en viewport y
 * respeta `prefers-reduced-motion` a través de la config global de Framer.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, ...directions[from] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
