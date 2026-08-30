import { CalendarClock, HelpCircle, Images, MapPin, Play } from "lucide-react";
import Link from "next/link";
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
    <section className="container-auris -mt-8 pb-4 lg:-mt-14">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {links.map((link, index) => (
          <Reveal as="li" key={link.href} delay={index * 0.07}>
            <Link
              href={link.href}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              <link.icon
                className="size-5 text-primary-500 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={1.6}
                aria-hidden
              />
              <span className="mt-3.5 font-medium text-ink-900">
                {link.title}
              </span>
              <span className="mt-1 text-sm text-ink-700/70">
                {link.description}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
