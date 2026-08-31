import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CTA del sitio. Es el único componente de botón de la capa de marketing, para
 * que todos compartan medidas y comportamiento.
 *
 * El color sí cambia según la sección (`tone`) y el efecto de hover también
 * (`effect`), pero el tamaño, la curva y el gesto de elevación son siempre los
 * mismos. Nada de crecer o encogerse de golpe: la elevación es un `translateY`
 * de 2px con una curva sin rebote, y no hay `scale` en ningún estado.
 *
 * Todos los efectos viven en `globals.css` y son `transition`, así que se
 * deshacen solos —en reversa— cuando el puntero se va.
 */

const tones = {
  /** Verde institucional sólido: la acción principal. */
  primary:
    "bg-linear-to-br from-primary-600 to-primary-800 text-cream-50 shadow-lg shadow-primary-900/25 hover:from-primary-500 hover:to-primary-700 hover:shadow-xl hover:shadow-primary-900/40",
  /** Marrón del logo, para acciones secundarias sobre fondos claros. */
  accent:
    "bg-linear-to-br from-accent-400 to-accent-600 text-cream-50 shadow-lg shadow-accent-700/30 hover:from-accent-500 hover:to-accent-700 hover:shadow-xl hover:shadow-accent-700/40",
  /** Crema sólido, para fondos verdes o fotos oscuras. */
  light:
    "bg-cream-50 text-primary-800 shadow-lg shadow-ink-900/20 hover:shadow-xl hover:shadow-ink-900/30",
  /**
   * Contorno sobre fondo oscuro. Lleva un velo propio y desenfoque de fondo:
   * sin eso, sobre la foto del hero el texto competía con la imagen.
   */
  outlineLight:
    "border border-cream-50/55 bg-ink-900/30 text-cream-50 shadow-lg shadow-ink-900/30 backdrop-blur-xl backdrop-saturate-150 hover:border-cream-50/85 hover:bg-ink-900/40 hover:shadow-xl hover:shadow-ink-900/40",
  /** Contorno verde sobre fondos claros. */
  outlinePrimary:
    "border border-primary-400/70 bg-primary-50/70 text-primary-800 backdrop-blur-sm hover:border-primary-600 hover:text-primary-900",
  /** Discreto, para acciones terciarias sobre fondos claros. */
  soft: "bg-primary-100/80 text-primary-800 backdrop-blur-sm hover:bg-primary-200/90 hover:text-primary-900",
} as const;

/** Capa de color que revela el efecto `fill`, por tono. */
const fillLayers = {
  primary: "bg-linear-to-t from-primary-900 to-primary-600",
  accent: "bg-linear-to-t from-accent-700 to-accent-500",
  light: "bg-linear-to-t from-cream-200 to-cream-50",
  outlineLight: "bg-cream-50/22",
  outlinePrimary: "bg-primary-200/80",
  soft: "bg-primary-300/70",
} as const;

const sizes = {
  /** Único tamaño del sitio: el de los CTA del hero. */
  default: "h-13 px-7 text-base",
  /** Solo donde el ancho es crítico; mantiene la misma altura visual. */
  compact: "h-11 px-5 text-sm",
} as const;

export type ShineTone = keyof typeof tones;
export type ShineEffect = "shine" | "fill" | "halo" | "ring";

type ShineButtonProps = {
  children: ReactNode;
  tone?: ShineTone;
  size?: keyof typeof sizes;
  /** Gesto de hover. Ver `globals.css`. */
  effect?: ShineEffect;
  className?: string;
  /** Si se omite, se renderiza un `<button>` en vez de un enlace. */
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

export function ShineButton({
  children,
  tone = "primary",
  size = "default",
  effect = "shine",
  className,
  href,
  external = false,
  type = "button",
  onClick,
  disabled,
  ...rest
}: ShineButtonProps) {
  const classes = cn(
    "auris-btn group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap",
    // Sin rebote y sin `scale`: solo eleva y asienta.
    "transition-[transform,box-shadow,background-color,border-color,color] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
    "hover:-translate-y-0.5 active:translate-y-0 active:duration-150",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-60",
    tones[tone],
    sizes[size],
    className,
  );

  const content = (
    <>
      {effect === "shine" && (
        <span
          aria-hidden
          className="auris-btn-fx auris-fx-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/45 to-transparent"
        />
      )}

      {effect === "fill" && (
        <span
          aria-hidden
          className={cn(
            "auris-btn-fx auris-fx-fill pointer-events-none absolute inset-0",
            fillLayers[tone],
          )}
        />
      )}

      {effect === "halo" && (
        <span
          aria-hidden
          className="auris-btn-fx auris-fx-halo pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,.55),transparent_65%)]"
        />
      )}

      {effect === "ring" && (
        <span
          aria-hidden
          className="auris-btn-fx auris-fx-ring pointer-events-none absolute inset-0 rounded-full ring-2 ring-current/35"
        />
      )}

      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (!href) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classes}
        {...rest}
      >
        {content}
      </button>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
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
