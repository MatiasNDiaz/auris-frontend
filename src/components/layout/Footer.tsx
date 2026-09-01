import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { LeafScatter } from "@/components/shared/LeafScatter";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Logo } from "@/components/shared/Logo";
import { InstagramIcon } from "@/components/shared/SocialIcons";
import { services } from "@/lib/data/services";
import { mainNav, siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

const institutionalLinks = mainNav.filter(
  (item) => !["/", "/servicios"].includes(item.href),
);

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

          <div className="mt-6 flex gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de AURIS"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary-600 text-cream-50 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-accent-500 hover:text-cream-50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={whatsappLink(siteConfig.whatsapp, siteConfig.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de AURIS"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary-600 text-cream-50 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-accent-500 hover:text-cream-50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
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
                  className="group relative inline-flex w-fit text-primary-200 transition-all duration-200 hover:translate-x-1 hover:text-cream-50 focus-visible:ring-2 focus-visible:ring-cream-50/60 focus-visible:outline-none"
                >
                  {service.name}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cream-50/70 transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
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
                <Link
                  href={item.href}
                  className="group relative inline-flex w-fit text-primary-200 transition-all duration-200 hover:translate-x-1 hover:text-cream-50 focus-visible:ring-2 focus-visible:ring-cream-50/60 focus-visible:outline-none"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cream-50/70 transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
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
