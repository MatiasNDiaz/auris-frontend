import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";

type CtaBannerProps = {
  title?: string;
  description?: string;
};

export function CtaBanner({
  title = "Dar el primer paso es más fácil de lo que parece",
  description = "Escribinos y coordinamos un turno con el profesional adecuado. Si no sabés por dónde empezar, te ayudamos a elegir.",
}: CtaBannerProps) {
  return (
    <section className="container-auris py-20 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary-600 px-7 py-14 text-center sm:px-14 lg:py-20">
          <div
            aria-hidden
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(246,198,163,.7), transparent 45%), radial-gradient(circle at 85% 80%, rgba(197,213,197,.6), transparent 45%)",
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl leading-tight text-balance text-cream-50 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-pretty text-primary-100">
              {description}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-cream-50/40 bg-transparent font-semibold text-cream-50 hover:bg-cream-50/10 hover:text-cream-50"
              >
                <Link href="/contacto">Ver datos de contacto</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
