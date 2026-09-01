import { ChevronRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Logo } from "@/components/shared/Logo";
import {
  InstagramIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "@/components/shared/SocialIcons";
import { services } from "@/lib/data/services";
import { mainNav, siteConfig } from "@/config/site";
import { cn, whatsappLink } from "@/lib/utils";

const institutionalLinks = mainNav.filter(
  (item) => !["/", "/servicios"].includes(item.href),
);

/**
 * Los tres canales del centro, con el color propio de cada marca:
 * el degradé de Instagram, el verde de WhatsApp (#25D366) y el rojo del
 * marcador de Google Maps (#EA4335).
 */
const socials = [
  {
    label: "Instagram de AURIS",
    href: siteConfig.social.instagram,
    Icon: InstagramIcon,
    brand:
      "bg-[radial-gradient(circle_at_28%_106%,#fdf497_0%,#fd5949_45%,#d6249f_62%,#285aeb_95%)]",
  },
  {
    label: "Escribinos por WhatsApp",
    href: whatsappLink(siteConfig.whatsapp, siteConfig.whatsappMessage),
    Icon: WhatsAppIcon,
    brand: "bg-[#25D366]",
  },
  {
    label: "Cómo llegar en Google Maps",
    href: siteConfig.address.mapsUrl,
    Icon: MapPinIcon,
    brand: "bg-[#EA4335]",
  },
];

/**
 * Enlaces de las columnas. El gesto son tres cosas a la vez: una flecha que
 * entra desde la izquierda, el texto que se corre para dejarle lugar y un
 * subrayado que crece desde el borde.
 *
 * Todo se anima con `transform` y `opacity` sobre elementos que ya existen —la
 * flecha va absoluta y el hueco está reservado—, así que el hover no mueve el
 * layout de la columna.
 */
const footerLink =
  "group relative block w-fit py-0.5 text-primary-200 transition-colors duration-300 hover:text-cream-50 focus-visible:ring-2 focus-visible:ring-cream-50/60 focus-visible:outline-none";

const footerLinkText =
  "relative block transition-transform duration-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5 group-focus-visible:translate-x-5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0";

const footerLinkRule =
  "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cream-50/70 transition-transform duration-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100";

export function Footer() {
  const { address } = siteConfig;

  return (
    <footer className="relative mt-24 overflow-hidden bg-primary-700 text-primary-100">
      {/* Pocas hojas y grandes: sobre el verde del footer el follaje compite
          con la lectura, así que se prioriza el detalle antes que la cantidad. */}
      <LeafScatter pattern="b" palette="cream" count={2} className="opacity-30" />
      <LeafSprig palette="cream" size="md" flip className="-top-4 right-6 h-44 opacity-35" />
      <div className="container-auris grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* El isotipo va suelto sobre el verde: el logo completo trae el
              texto en gris oscuro y no se leería sin una tarjeta clara. */}
          <Logo markWidth={56} tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-primary-100">
            {siteConfig.tagline}. Atención integral con un enfoque humano,
            profesional y personalizado.
          </p>

          {/* Cada red se enciende con su propio color de marca: el degradé de
              Instagram, el verde de WhatsApp y el rojo del pin de Maps. En
              reposo van todas en el verde del footer para no romper el bloque. */}
          <ul className="mt-6 flex gap-3">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative inline-flex size-11 items-center justify-center overflow-hidden rounded-full bg-primary-600 text-cream-50 transition-[transform,box-shadow] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/30 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {/* Capa de marca: crece desde el centro al pasar el mouse. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 scale-0 rounded-full opacity-0 transition-[transform,opacity] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100",
                      social.brand,
                    )}
                  />
                  <social.Icon className="relative size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-servicios">
          <h2
            id="footer-servicios"
            className="font-sans text-sm font-semibold tracking-[0.16em] text-cream-50 uppercase"
          >
            Servicios
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className={footerLink}
                >
                  <ChevronRight
                    aria-hidden
                    className="absolute top-1/2 left-0 size-3.5 -translate-x-2 -translate-y-1/2 text-cream-50 opacity-0 transition-[transform,opacity] duration-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  />
                  <span className={footerLinkText}>
                    {service.name}
                    <span aria-hidden className={footerLinkRule} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-institucional">
          <h2
            id="footer-institucional"
            className="font-sans text-sm font-semibold tracking-[0.16em] text-cream-50 uppercase"
          >
            El centro
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {institutionalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLink}>
                  <ChevronRight
                    aria-hidden
                    className="absolute top-1/2 left-0 size-3.5 -translate-x-2 -translate-y-1/2 text-cream-50 opacity-0 transition-[transform,opacity] duration-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  />
                  <span className={footerLinkText}>
                    {item.label}
                    <span aria-hidden className={footerLinkRule} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-contacto">
          <h2
            id="footer-contacto"
            className="font-sans text-sm font-semibold tracking-[0.16em] text-cream-50 uppercase"
          >
            Contacto
          </h2>
          <ul className="mt-5 space-y-4 text-sm text-primary-200">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a
                href={address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors duration-200 hover:text-cream-50 hover:underline"
              >
                {address.street}
                <br />
                {address.neighborhood}, {address.city}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="underline-offset-4 transition-colors duration-200 hover:text-cream-50 hover:underline"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a
                href={whatsappLink(siteConfig.whatsapp, siteConfig.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors duration-200 hover:text-cream-50 hover:underline"
              >
                {siteConfig.whatsapp}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a
                href={`mailto:${siteConfig.email}`}
                className="underline-offset-4 transition-colors duration-200 hover:text-cream-50 hover:underline"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {siteConfig.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </section>
      </div>

      <div className="border-t border-primary-600">
        <div className="container-auris flex flex-col gap-2 py-6 text-xs text-primary-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
            reservados.
          </p>
          <p>
            Los contenidos del sitio son informativos y no reemplazan una
            consulta profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
