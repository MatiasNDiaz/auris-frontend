import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

const values = [
  "Consultas con tiempo real de escucha, sin apuro",
  "Equipo interdisciplinario que se comunica entre sí",
  "Planes de tratamiento explicados y acordados con vos",
  "Instalaciones accesibles y pensadas para el descanso",
];

export function AboutPreview() {
  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="container-auris grid items-center gap-14 lg:grid-cols-2">
        <Reveal from="right">
          <div className="relative aspect-4/3 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary-300 to-primary-600 shadow-lg">
            <div
              aria-hidden
              className="absolute inset-0 opacity-45"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 25%, rgba(255,255,255,.6), transparent 50%), radial-gradient(circle at 80% 70%, rgba(246,198,163,.65), transparent 45%)",
              }}
            />
            <div className="absolute right-6 bottom-6 left-6 rounded-2xl bg-cream-50/95 px-5 py-4 backdrop-blur-sm">
              <p className="font-serif text-lg text-primary-700">
                Un espacio pensado para bajar un cambio
              </p>
              <p className="mt-1 text-sm text-ink-700/75">
                Luz natural, silencio y consultorios amplios.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal from="left">
          <p className="text-sm font-semibold tracking-[0.18em] text-primary-500 uppercase">
            Sobre el centro
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-balance text-ink-900 sm:text-4xl">
            Salud integral con una mirada humana
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-ink-700/85">
            Nacimos con una convicción simple: la salud mejora cuando quien
            consulta se siente escuchado. Por eso reunimos disciplinas que
            habitualmente funcionan por separado y las hicimos trabajar en
            equipo, con historias clínicas compartidas y criterios comunes.
          </p>

          <ul className="mt-7 space-y-3">
            {values.map((value) => (
              <li key={value} className="flex items-start gap-3 text-ink-700/85">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600"
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed">{value}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-9 rounded-full border-primary-500 text-primary-600 hover:bg-primary-50"
          >
            <Link href="/sobre-el-centro">
              Conocer el centro
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
