import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Nivel semántico del encabezado; el estilo no cambia. */
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-primary-500 uppercase">
          {eyebrow}
        </p>
      )}
      <Tag className="font-serif text-3xl leading-tight text-balance text-ink-900 sm:text-4xl lg:text-[2.75rem]">
        {title}
      </Tag>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-ink-700/80 sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
