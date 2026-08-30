import { cn } from "@/lib/utils";

/**
 * Stand-in visual para las imágenes que todavía no tienen archivo real
 * (servicios, galería, blog). Genera un degradé estable a partir del `seed`,
 * para que cada tarjeta se vea distinta pero siempre igual entre renders.
 * Cuando lleguen las fotos reales se reemplaza por `next/image`.
 */
const palettes = [
  ["#c5d5c5", "#4a6b52"],
  ["#f6c6a3", "#c1522f"],
  ["#e2eae2", "#749574"],
  ["#fbe4d2", "#e8845a"],
  ["#9fb89f", "#324638"],
  ["#f5e9dc", "#9fb89f"],
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

type PlaceholderProps = {
  seed: string;
  className?: string;
  /** Texto accesible; si se omite, el bloque se marca como decorativo. */
  label?: string;
};

export function Placeholder({ seed, className, label }: PlaceholderProps) {
  const [from, to] = palettes[hashSeed(seed) % palettes.length];
  const angle = (hashSeed(seed) % 90) + 120;

  return (
    <div
      className={cn("relative overflow-hidden bg-cream-100", className)}
      style={{ backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})` }}
      role={label ? "img" : "presentation"}
      aria-label={label}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(255,255,255,.9), transparent 45%), radial-gradient(circle at 80% 75%, rgba(255,255,255,.55), transparent 40%)",
        }}
      />
    </div>
  );
}
