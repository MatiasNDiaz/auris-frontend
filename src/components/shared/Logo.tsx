import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * El archivo `/LogoAuris.png` es cuadrado y trae isotipo + texto apilados, así
 * que a tamaños chicos la bajada queda ilegible. Estas fracciones recortan solo
 * la hoja, medidas sobre el PNG original.
 */
const LEAF = { x: 0.19, y: 0.168, w: 0.668, h: 0.312 };
const LEAF_RATIO = LEAF.h / LEAF.w;

type LogoProps = {
  /** `mark`: solo la hoja, junto al nombre. `full`: el PNG completo. */
  variant?: "mark" | "full";
  className?: string;
  /** Alto en px del isotipo (solo `mark`). */
  markWidth?: number;
  /** Color del texto en la variante `mark`. */
  tone?: "dark" | "light";
  priority?: boolean;
};

export function Logo({
  variant = "mark",
  className,
  markWidth = 44,
  tone = "dark",
  priority = false,
}: LogoProps) {
  if (variant === "full") {
    return (
      <Image
        src="/LogoAuris.png"
        alt={`${siteConfig.name} — ${siteConfig.tagline}`}
        width={220}
        height={220}
        priority={priority}
        className={cn("h-auto w-full object-contain", className)}
      />
    );
  }

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className="relative block shrink-0 overflow-hidden"
        style={{ width: markWidth, height: markWidth * LEAF_RATIO }}
      >
        <span
          className="absolute block"
          style={{
            width: `${(1 / LEAF.w) * 100}%`,
            aspectRatio: "1 / 1",
            left: `${(-LEAF.x / LEAF.w) * 100}%`,
            top: `${(-LEAF.y / LEAF.h) * 100}%`,
          }}
        >
          <Image
            src="/LogoAuris.png"
            alt=""
            fill
            sizes="120px"
            priority={priority}
            className="object-contain"
          />
        </span>
      </span>

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
            "mt-1 text-[0.6rem] tracking-[0.14em] uppercase",
            tone === "light" ? "text-primary-100" : "text-sand-500",
          )}
        >
          {siteConfig.tagline}
        </span>
      </span>
    </span>
  );
}
