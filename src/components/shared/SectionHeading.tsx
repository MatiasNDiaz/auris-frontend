import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Nivel semántico del encabezado; el estilo no cambia. */
  as?: "h1" | "h2";
  /** Sobre fondos oscuros el verde no contrasta: se invierte a crema. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Encabezado de sección del sitio: siempre centrado, con el eyebrow enmarcado
 * entre dos filetes y el título en el verde institucional intenso.
 *
 * El lenguaje visual (grosor y color de línea, tracking del eyebrow) es el
 * mismo en todas las secciones a propósito — es lo que hace que se lean como
 * una familia y no como títulos sueltos.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <Reveal className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <div className="mb-5 flex items-center justify-center gap-4">
          <span
            aria-hidden
            className={cn(
              "block h-px w-12 bg-linear-to-r from-transparent",
              light ? "to-cream-50/70" : "to-primary-500",
            )}
          />
          <p
            className={cn(
              "text-xs font-semibold tracking-[0.24em] uppercase",
              light ? "text-cream-50" : "text-primary-700",
            )}
          >
            {eyebrow}
          </p>
          <span
            aria-hidden
            className={cn(
              "block h-px w-12 bg-linear-to-l from-transparent",
              light ? "to-cream-50/70" : "to-primary-500",
            )}
          />
        </div>
      )}

      <Tag
        className={cn(
          "font-serif text-3xl leading-tight text-balance sm:text-4xl lg:text-[2.75rem]",
          light ? "text-cream-50" : "text-primary-800",
        )}
      >
        {title}
      </Tag>

      {/* Filete de cierre: repite el gesto del eyebrow y le da peso al bloque. */}
      <span
        aria-hidden
        className={cn(
          "mx-auto mt-6 block h-0.5 w-16 rounded-full",
          light ? "bg-cream-50/70" : "bg-primary-500",
        )}
      />

      {description && (
        <p
          className={cn(
            "mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg",
            light ? "text-primary-100" : "text-ink-700/80",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
