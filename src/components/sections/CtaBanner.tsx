import { CalendarCheck, Leaf } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";

type CtaBannerProps = {
  title?: string;
  description?: string;
};

export function CtaBanner({
  title = "¿Listo para dar el primer paso?",
  description = "Estamos acá para acompañarte en tu camino hacia una vida más saludable y equilibrada.",
}: CtaBannerProps) {
  return (
    <section className="container-auris py-20 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary-700 px-7 py-12 sm:px-12 lg:px-16 lg:py-14">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 20%, rgba(136,185,79,.85), transparent 45%), radial-gradient(circle at 88% 85%, rgba(253,210,110,.5), transparent 42%)",
            }}
          />
          <Leaf
            aria-hidden
            className="absolute -top-6 -left-4 size-32 rotate-12 text-primary-500/25"
            strokeWidth={1}
          />
          <Leaf
            aria-hidden
            className="absolute -right-6 -bottom-8 size-40 -rotate-12 text-primary-500/20"
            strokeWidth={1}
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="flex items-center gap-3 font-serif text-3xl leading-tight text-balance text-cream-50 sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-pretty text-primary-100">
                {description}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-cream-50 font-semibold text-primary-800 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-cream-100"
              >
                <Link href="/contacto">
                  Solicitar turno
                  <CalendarCheck className="size-4" aria-hidden />
                </Link>
              </Button>
              <WhatsAppButton label="Hablar por WhatsApp" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
