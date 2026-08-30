import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn, whatsappLink } from "@/lib/utils";

type WhatsAppButtonProps = {
  label?: string;
  message?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
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
  return (
    <Button
      asChild
      size={size}
      className={cn(
        "rounded-full font-semibold shadow-sm transition-transform duration-200 hover:-translate-y-0.5",
        // El ámbar del isotipo no da contraste con texto blanco, así que sobre
        // fondo claro va con texto oscuro (solid) o en tono 700 (outline).
        // Sobre la foto del hero el ámbar claro sí contrasta y se usa en línea.
        variant === "solid" &&
          "bg-accent-400 text-ink-900 hover:bg-accent-300",
        variant === "outline" &&
          "border border-accent-400 bg-cream-50 text-accent-700 hover:bg-accent-50",
        variant === "onDark" &&
          "border border-accent-300 bg-transparent text-accent-200 backdrop-blur-sm hover:bg-accent-400 hover:text-ink-900",
        className,
      )}
    >
      <a
        href={whatsappLink(siteConfig.whatsapp, message)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="size-4" aria-hidden />
        {label}
      </a>
    </Button>
  );
}
