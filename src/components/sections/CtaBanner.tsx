import { CalendarCheck, Leaf } from "lucide-react";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ShineButton } from "@/components/shared/ShineButton";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

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
          {/* Igual que el footer: el banner es el cierre de la página y el
              CTA tiene que ganar por encima del follaje. */}
          <LeafScatter pattern="c" palette="cream" count={2} className="opacity-35" />
          <LeafSprig palette="cream" size="md" seed={3} className="bottom-0 left-4 h-40 opacity-40" />
          <Leaf
            aria-hidden
            className="absolute -right-6 -bottom-8 size-40 -rotate-12 text-primary-500/20"
            strokeWidth={1}
          />

          <div className="relative flex flex-col items-center gap-9 text-center">
            <SectionHeading
              title={title}
              description={description}
              tone="light"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <ShineButton href="/contacto" tone="light">
                Solicitar turno
                <CalendarCheck
                  className="size-4 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden
                />
              </ShineButton>
              <WhatsAppButton label="Hablar por WhatsApp" variant="onDark" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
