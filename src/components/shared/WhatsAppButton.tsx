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
        variant === "solid"
          ? "bg-accent-500 text-white hover:bg-accent-600"
          : "border border-accent-500 bg-transparent text-accent-600 hover:bg-accent-50",
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
