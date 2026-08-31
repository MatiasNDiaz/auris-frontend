import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos, para escalonar elementos de una misma sección. */
  delay?: number;
  from?: "up" | "down" | "left" | "right" | "none";
  as?: "div" | "section" | "li" | "article" | "header";
};

/**
 * Scroll-reveal reutilizable: anima una sola vez al entrar en viewport.
 *
 * Es un componente de servidor y no trae JS propio. Solo marca el elemento con
 * `data-reveal`; el estado oculto, la transición y el disparo viven en
 * `globals.css` y en el script inline de `RevealScript`.
 *
 * Antes esto era Framer Motion, y ese era el origen del bug de secciones en
 * blanco: Framer escribe su `initial` como estilo inline en el HTML del
 * servidor, así que el contenido llegaba con `opacity:0` y no aparecía hasta
 * que se descargaba e hidrataba todo el bundle. La animación resultante es la
 * misma —24px, 0.6s, misma curva—, pero ahora el contenido existe visualmente
 * sin depender de React.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  as = "div",
}: RevealProps) {
  const Tag = as as ElementType;

  return (
    <Tag
      className={cn(className)}
      data-reveal={from}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as object) : undefined}
    >
      {children}
    </Tag>
  );
}
