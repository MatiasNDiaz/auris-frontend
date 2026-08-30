import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Assets derivados de `/LogoAuris.png`, ya recortados al contenido y con el
 * fondo transparente intacto.
 *
 * Van con `unoptimized` a propósito: el optimizador de next/image devuelve un
 * WebP sin canal alfa para este archivo, y la transparencia se aplasta contra
 * blanco (se ve un rectángulo detrás del logo). Como los assets ya están
 * dimensionados y comprimidos, servirlos tal cual no cuesta nada.
 */
const MARK = { src: "/logo-auris-mark.png", width: 320, height: 143 };
const FULL = { src: "/logo-auris-full.png", width: 640, height: 459 };

type LogoProps = {
  /** `mark`: solo el isotipo, junto al nombre. `full`: el logo completo. */
  variant?: "mark" | "full";
  className?: string;
  /** Ancho en px del isotipo (solo `mark`). */
  markWidth?: number;
  /** Color del texto en la variante `mark`. */
  tone?: "dark" | "light";
  priority?: boolean;
};

export function Logo({
  variant = "mark",
  className,
  markWidth = 46,
  tone = "dark",
  priority = false,
}: LogoProps) {
  if (variant === "full") {
    return (
      <Image
        src={FULL.src}
        alt={`${siteConfig.name} — ${siteConfig.tagline}`}
        width={FULL.width}
        height={FULL.height}
        priority={priority}
        unoptimized
        className={cn("h-auto w-full object-contain", className)}
      />
    );
  }

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src={MARK.src}
        alt=""
        width={MARK.width}
        height={MARK.height}
        priority={priority}
        unoptimized
        className="h-auto shrink-0"
        style={{ width: markWidth }}
      />

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-2xl tracking-tight",
            tone === "light" ? "text-cream-50" : "text-primary-800",
          )}
        >
          {siteConfig.name}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] tracking-[0.14em] whitespace-nowrap uppercase",
            tone === "light" ? "text-primary-100" : "text-sand-500",
          )}
        >
          {siteConfig.tagline}
        </span>
      </span>
    </span>
  );
}
