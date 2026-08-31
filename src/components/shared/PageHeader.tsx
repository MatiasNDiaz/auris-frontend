import { LeafScatter } from "./LeafScatter";
import { LeafSprig } from "./LeafSprig";
import { WaveDivider, type WaveVariant } from "./WaveDivider";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Superficie del bloque, para sostener el ritmo de fondos de la página. */
  surface?: "sage" | "sand" | "base";
  /** Curva del borde inferior; cada página usa una distinta. */
  wave?: WaveVariant;
  /** Color de la curva: tiene que ser el fondo de lo que sigue abajo. */
  waveTone?: "sage" | "sand" | "base";
};

const surfaces = {
  sage: "bg-surface-sage",
  sand: "bg-surface-sand",
  base: "bg-surface-base",
} as const;

/** La curva se pinta con `currentColor`, de ahí que el tono vaya en `text-`. */
const waveTones = {
  sage: "text-surface-sage",
  sand: "text-surface-sand",
  base: "text-surface-base",
} as const;

/**
 * Encabezado de las páginas internas. Reusa `SectionHeading` para que el
 * lenguaje visual del título sea exactamente el mismo en toda la navegación,
 * cambiando solo el nivel semántico a `h1`.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  surface = "sage",
  wave = "gentle",
  waveTone = "base",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-40",
        surfaces[surface],
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-20 size-96 rounded-full bg-primary-200/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-warm-200/40 blur-3xl"
      />
      <LeafScatter pattern="b" />
      <LeafSprig palette="green" size="md" flip className="-bottom-4 right-4 h-48 opacity-55" />

      <div className="container-auris relative">
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>

      <WaveDivider variant={wave} className={waveTones[waveTone]} />
    </header>
  );
}
