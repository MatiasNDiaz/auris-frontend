import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Teléfono, WhatsApp, correo, horarios y ubicación de AURIS. Escribinos tu consulta sin necesidad de registrarte.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  const { address } = siteConfig;
  const fullAddress = `${address.street}, ${address.city}, ${address.country}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  const details = [
    {
      icon: Phone,
      title: "Teléfono",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      title: "Correo electrónico",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: fullAddress,
      href: directionsUrl,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Estamos para escucharte"
        description="Escribinos por el canal que prefieras. Si necesitás un turno, WhatsApp es la vía más rápida."
      />

      <section className="container-auris py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-8">
              <ul className="space-y-6">
                {details.map((detail) => (
                  <li key={detail.title} className="flex gap-4">
                    <span
                      aria-hidden
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500"
                    >
                      <detail.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {detail.title}
                      </p>
                      <a
                        href={detail.href}
                        target={detail.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          detail.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="mt-0.5 inline-block text-sm text-ink-700/80 transition-colors hover:text-primary-600"
                      >
                        {detail.value}
                      </a>
                    </div>
                  </li>
                ))}

                <li className="flex gap-4">
                  <span
                    aria-hidden
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500"
                  >
                    <Clock className="size-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      Horarios de atención
                    </p>
                    <ul className="mt-1 space-y-0.5 text-sm text-ink-700/80">
                      {siteConfig.hours.map((h) => (
                        <li key={h.days}>
                          {h.days}: {h.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              <WhatsAppButton className="w-full sm:w-auto" />

              {/*
                Mapa: placeholder hasta definir el proveedor (Google Maps embed
                o Leaflet). El botón "Cómo llegar" ya usa la dirección real.
              */}
              <div className="relative overflow-hidden rounded-3xl border border-border">
                <div
                  role="img"
                  aria-label={`Mapa de ubicación de ${siteConfig.name} en ${fullAddress}`}
                  className="aspect-4/3 w-full bg-primary-100"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #e2eae2 0%, #c5d5c5 55%, #9fb89f 100%)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg">
                    <MapPin className="size-6" strokeWidth={1.8} />
                  </span>
                </div>

                <div className="absolute right-4 bottom-4 left-4 flex flex-col gap-3 rounded-2xl bg-cream-50/95 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-ink-700/85">{fullAddress}</p>
                  <Button
                    asChild
                    size="sm"
                    className="shrink-0 rounded-full bg-primary-500 text-cream-50 hover:bg-primary-600"
                  >
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="size-4" aria-hidden />
                      Cómo llegar
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
