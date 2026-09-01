import { MessageCircle } from "lucide-react";
import { ShineButton, type ShineTone } from "./ShineButton";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

type WhatsAppButtonProps = {
  label?: string;
  message?: string;
  className?: string;
  size?: "default" | "compact";
  /** `onDark` es la variante para el hero, sobre la foto de fondo. */
  variant?: "solid" | "outline" | "onDark";
  /**
   * Fuerza un tono concreto, por encima de `variant`. Lo usa la ficha de
   * profesional para que el botón tome el acento de la persona.
   */
  tone?: ShineTone;
};

/** CTA principal del sitio: no hay reservas con calendario, todo va a WhatsApp. */
export function WhatsAppButton({
  label = "Solicitar turno",
  message = siteConfig.whatsappMessage,
  className,
  size = "default",
  variant = "solid",
  tone: toneOverride,
}: WhatsAppButtonProps) {
  // WhatsApp y "Solicitar turno" son la acción principal del sitio: el CTA
  // sólido va en el verde institucional. Sobre fondos verdes o fotos oscuras
  // se usan las variantes clara (`outline`) y de contorno (`onDark`).
  const tone =
    toneOverride ??
    (variant === "onDark"
      ? "outlineLight"
      : variant === "outline"
        ? "light"
        : "primary");

  return (
    <ShineButton
      href={whatsappLink(siteConfig.whatsapp, message)}
      external
      tone={tone}
      size={size}
      className={className}
    >
      <MessageCircle
        className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
        aria-hidden
      />
      {label}
    </ShineButton>
  );
}
