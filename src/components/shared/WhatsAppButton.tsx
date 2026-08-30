import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn, whatsappLink } from "@/lib/utils";

type WhatsAppButtonProps = {
  label?: string;
  message?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "solid" | "outline";
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
        // El ámbar del isotipo no da contraste con texto blanco, así que va con
        // texto oscuro; la variante outline usa el tono 700, ya legible.
        variant === "solid"
          ? "bg-accent-400 text-ink-900 hover:bg-accent-300"
          : "border border-accent-400 bg-cream-50 text-accent-700 hover:bg-accent-50",
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
