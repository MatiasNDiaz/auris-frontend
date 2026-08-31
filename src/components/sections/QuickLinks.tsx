import { CalendarClock, HelpCircle, Images, MapPin, Play } from "lucide-react";
import Link from "next/link";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";

const links = [
  {
    href: "/contacto",
    icon: MapPin,
    title: "Ubicación",
    description: "Cómo llegar y horarios de atención",
  },
  {
    href: "/preguntas-frecuentes",
    icon: HelpCircle,
    title: "Preguntas frecuentes",
    description: "Turnos, coberturas y tratamientos",
  },
  {
    href: "/galeria",
    icon: Images,
    title: "Galería",
    description: "Conocé nuestras instalaciones",
  },
  {
    href: "/sobre-el-centro#recorrido-virtual",
    icon: Play,
    title: "Recorrido virtual",
    description: "Un paseo por nuestros espacios",
  },
  {
    href: "/profesionales",
    icon: CalendarClock,
    title: "Equipo",
    description: "Perfiles y especialidades",
  },
];

export function QuickLinks() {
  return (
    <section className="relative overflow-hidden bg-surface-base py-16 lg:py-20">
      <LeafScatter pattern="c" />
      <LeafSprig palette="green" size="md" flip className="-bottom-6 right-3 h-44 opacity-55" />
      <div className="container-auris relative">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {links.map((link, index) => (
            <Reveal as="li" key={link.href} delay={index * 0.07}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-2xl border border-primary-100 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
              >
                <span
                  aria-hidden
                  className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors duration-200 group-hover:bg-primary-600 group-hover:text-cream-50"
                >
                  <link.icon className="size-5" strokeWidth={1.6} />
                </span>
                <span className="mt-4 font-semibold text-ink-900">
                  {link.title}
                </span>
                <span className="mt-1 text-sm text-ink-700/70">
                  {link.description}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
