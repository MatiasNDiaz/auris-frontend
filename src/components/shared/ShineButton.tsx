import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CTA con brillo que barre de izquierda a derecha al hacer hover.
 *
 * El barrido es un pseudo-elemento que se traslada con `translate-x`, así que
 * anima en la capa de composición y no fuerza repintados. Todo el movimiento
 * queda anulado bajo `prefers-reduced-motion` (ver `globals.css`).
 */
const tones = {
  /** Verde institucional sólido, para la acción principal. */
  primary:
    "bg-linear-to-br from-primary-600 to-primary-800 text-cream-50 shadow-lg shadow-primary-900/25 hover:shadow-xl hover:shadow-primary-900/35",
  /** Ámbar del isotipo, para WhatsApp y acciones secundarias. */
  accent:
    "bg-linear-to-br from-accent-300 to-accent-500 text-ink-900 shadow-lg shadow-accent-700/25 hover:shadow-xl hover:shadow-accent-700/35",
  /** Claro, para usar sobre fondos verdes o fotos oscuras. */
  light:
    "bg-cream-50 text-primary-800 shadow-lg shadow-ink-900/20 hover:shadow-xl hover:shadow-ink-900/30",
  /** Contorno claro sobre fondo oscuro. */
  outlineLight:
    "border border-cream-50/45 bg-cream-50/5 text-cream-50 backdrop-blur-sm hover:border-cream-50/80 hover:bg-cream-50/15",
} as const;

const sizes = {
  default: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
} as const;

type ShineButtonProps = {
  children: ReactNode;
  href: string;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  className?: string;
  external?: boolean;
  "aria-label"?: string;
};

export function ShineButton({
  children,
  href,
  tone = "primary",
  size = "lg",
  className,
  external = false,
  ...rest
}: ShineButtonProps) {
  const classes = cn(
    "group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap",
    "transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:outline-none",
    tones[tone],
    sizes[size],
    className,
  );

  const content = (
    <>
      {/* Barrido de brillo. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[300%]"
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
