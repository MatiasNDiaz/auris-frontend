import { MessageCircle } from "lucide-react";
import { ShineButton } from "./ShineButton";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

type WhatsAppButtonProps = {
  label?: string;
  message?: string;
  className?: string;
  size?: "default" | "lg";
  /** `onDark` es la variante para el hero, sobre la foto de fondo. */
  variant?: "solid" | "outline" | "onDark";
};

/** CTA principal del sitio: no hay reservas con calendario, todo va a WhatsApp. */
export function WhatsAppButton({
  label = "Solicitar turno",
  message = siteConfig.whatsappMessage,
  className,
  size = "lg",
  variant = "solid",
}: WhatsAppButtonProps) {
  // El ámbar del isotipo no contrasta con texto blanco, así que va con texto
  // oscuro; sobre la foto del hero se usa el contorno claro.
  const tone =
    variant === "onDark" ? "outlineLight" : variant === "outline" ? "light" : "accent";

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
