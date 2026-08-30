import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/shared/SocialIcons";
import { services } from "@/lib/data/services";
import { mainNav, siteConfig } from "@/config/site";

const institutionalLinks = mainNav.filter(
  (item) => !["/", "/servicios"].includes(item.href),
);

export function Footer() {
  const { address } = siteConfig;

  return (
    <footer className="mt-24 bg-primary-700 text-primary-100">
      <div className="container-auris grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="w-fit rounded-2xl bg-cream-50 px-4 py-3">
            <Logo variant="full" className="w-32" />
          </div>
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
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary-600 transition-colors hover:bg-accent-500 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de AURIS"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary-600 transition-colors hover:bg-accent-500 focus-visible:ring-2 focus-visible:ring-cream-50 focus-visible:outline-none"
            >
              <FacebookIcon className="size-4" />
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
                  className="text-primary-200 transition-colors hover:text-cream-50"
                >
                  {service.name}
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
                  className="text-primary-200 transition-colors hover:text-cream-50"
                >
                  {item.label}
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
              <span>
                {address.street}
                <br />
                {address.city}, {address.country}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-cream-50"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-cream-50"
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
