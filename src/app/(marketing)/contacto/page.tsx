import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ShineButton } from "@/components/shared/ShineButton";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Teléfono, WhatsApp, correo, horarios y ubicación de AURIS. Escribinos tu consulta sin necesidad de registrarte.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  const { address } = siteConfig;
  const fullAddress = `${address.street}, ${address.neighborhood}, ${address.city}`;
  // Se apunta a las coordenadas reales, no a la dirección como texto: evita que
  // Google resuelva mal la calle y mande a otra cuadra.
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address.lat},${address.lng}`;
  // Mapa embebido centrado en el centro, con marcador.
  const embedUrl = `https://www.google.com/maps?q=${address.lat},${address.lng}&z=16&output=embed`;

  const details = [
    {
      icon: Phone,
      title: "Teléfono",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: siteConfig.whatsapp,
      href: whatsappLink(siteConfig.whatsapp, siteConfig.whatsappMessage),
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
        surface="sand"
        wave="gentle"
        waveTone="sage"
        eyebrow="Contacto"
        title="Estamos para escucharte"
        description="Escribinos por el canal que prefieras. Si necesitás un turno, WhatsApp es la vía más rápida."
      />

      <section className="bg-surface-sage py-16 lg:py-20">
        <div className="container-auris">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="space-y-8">
                <ul className="space-y-6">
                  {details.map((detail) => (
                    <li key={detail.title} className="flex gap-4">
                      <span
                        aria-hidden
                        className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"
                      >
                        <detail.icon className="size-5" strokeWidth={1.6} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">
                          {detail.title}
                        </p>
                        <a
                          href={detail.href}
                          target={
                            detail.href.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            detail.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="mt-0.5 inline-block text-sm text-ink-700/80 transition-colors hover:text-primary-700"
                        >
                          {detail.value}
                        </a>
                      </div>
                    </li>
                  ))}

                  <li className="flex gap-4">
                    <span
                      aria-hidden
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"
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

                {/* Mapa real, embebido sobre las coordenadas del centro. */}
                <div className="relative overflow-hidden rounded-3xl border border-border">
                  <iframe
                    src={embedUrl}
                    title={`Mapa de ubicación de ${siteConfig.name} en ${fullAddress}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="aspect-4/3 w-full border-0"
                  />

                  <div className="absolute right-4 bottom-4 left-4 flex flex-col gap-3 rounded-2xl bg-cream-50/95 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-ink-700/85">{fullAddress}</p>
                    <ShineButton
                      href={directionsUrl}
                      external
                      tone="primary"
                      size="compact"
                      effect="shine"
                      className="shrink-0"
                    >
                      <Navigation className="size-4" aria-hidden />
                      Cómo llegar
                    </ShineButton>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal from="left" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
