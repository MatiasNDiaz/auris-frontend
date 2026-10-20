"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShineButton } from "@/components/shared/ShineButton";
import { siteConfig } from "@/config/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, whatsappLink } from "@/lib/utils";

/**
 * Lo que se le pide a quien escribe. Se valida acá y nada más: el formulario no
 * guarda en ningún lado, arma un mensaje con estos campos y lo abre en el
 * WhatsApp del centro.
 */
const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre completo.")
    .max(80, "El nombre es demasiado largo."),
  email: z.email("Ingresá un correo electrónico válido."),
  phone: z
    .string()
    .trim()
    .min(6, "Ingresá un teléfono de contacto.")
    .max(30, "El teléfono es demasiado largo."),
  message: z
    .string()
    .trim()
    .min(10, "Contanos brevemente tu consulta (mínimo 10 caracteres).")
    .max(1000, "El mensaje no puede superar los 1000 caracteres."),
  /** Honeypot anti-bots: debe quedar vacío. */
  website: z.string().max(0).optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  /**
   * El enlace de WhatsApp que se armó en el último envío.
   *
   * Se guarda para poder ofrecerlo como botón en la pantalla de confirmación:
   * si el navegador bloqueó la apertura automática —pasa cuando el permiso de
   * ventanas emergentes está restringido—, el mensaje no se pierde y alcanza
   * con un toque para abrirlo.
   */
  const [enlaceWhatsapp, setEnlaceWhatsapp] = useState("");

  /**
   * El formulario no guarda nada: arma el mensaje y lo abre en WhatsApp.
   *
   * Los datos viajan dentro del texto porque `wa.me` solo acepta eso. Van con
   * un rótulo cada uno para que del lado del centro se lea igual de ordenado
   * que en un correo.
   */
  const onSubmit = (values: ContactValues) => {
    if (values.website) return; // honeypot completado: descartamos en silencio

    const texto = [
      "Hola AURIS, quiero hacer una consulta.",
      "",
      `Nombre: ${values.fullName}`,
      `Correo: ${values.email}`,
      `Teléfono: ${values.phone}`,
      "",
      "Consulta:",
      values.message,
    ].join("\n");

    const url = whatsappLink(siteConfig.whatsapp, texto);
    setEnlaceWhatsapp(url);

    // Se intenta en una pestaña nueva para no sacar a nadie del sitio. Si el
    // navegador lo bloquea, `window.open` devuelve `null` y ahí sí se navega
    // en la misma pestaña, que ningún bloqueador frena.
    const pestana = window.open(url, "_blank", "noopener,noreferrer");
    // `assign` y no `location.href = …`: el compilador de React trata la
    // asignación a esa propiedad como una mutación y la rechaza.
    if (!pestana) window.location.assign(url);
  };

  const fields = [
    {
      name: "fullName" as const,
      label: "Nombre y apellido",
      type: "text",
      autoComplete: "name",
      placeholder: "María Pérez",
    },
    {
      name: "email" as const,
      label: "Correo electrónico",
      type: "email",
      autoComplete: "email",
      placeholder: "maria@ejemplo.com",
    },
    {
      name: "phone" as const,
      label: "Teléfono",
      type: "tel",
      autoComplete: "tel",
      placeholder: "+54 11 5555-5555",
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-9">
      <AnimatePresence mode="wait">
        {isSubmitSuccessful ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="py-8 text-center"
            role="status"
          >
            <CheckCircle2
              className="mx-auto size-12 text-primary-700"
              strokeWidth={1.5}
              aria-hidden
            />
            <h3 className="mt-5 font-serif text-2xl text-ink-900">
              Tu consulta está lista
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-pretty text-ink-700/80">
              Se abrió WhatsApp con tus datos ya escritos. Tocá enviar ahí y te
              respondemos a la brevedad.
            </p>

            {/* Por si el navegador bloqueó la apertura automática: el mensaje
                sigue armado y se puede abrir desde acá. */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {enlaceWhatsapp && (
                <ShineButton
                  href={enlaceWhatsapp}
                  external
                  tone="primary"
                  effect="fill"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Abrir WhatsApp
                </ShineButton>
              )}
              <ShineButton
                type="button"
                tone="soft"
                effect="ring"
                onClick={() => reset()}
              >
                Enviar otra consulta
              </ShineButton>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <h2 className="font-serif text-2xl text-ink-900">
              Escribinos tu consulta
            </h2>
            <p className="mt-2 text-sm text-ink-700/75">
              Completá el formulario y se abre WhatsApp con todo escrito. No
              hace falta registrarse.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {fields.map((field, index) => (
                <div
                  key={field.name}
                  className={cn(index === 0 && "sm:col-span-2")}
                >
                  <Label htmlFor={field.name} className="text-ink-900">
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={
                      errors[field.name] ? `${field.name}-error` : undefined
                    }
                    className="mt-2 rounded-xl bg-cream-50"
                    {...register(field.name)}
                  />
                  {errors[field.name] && (
                    <p
                      id={`${field.name}-error`}
                      role="alert"
                      className="mt-1.5 text-sm text-destructive"
                    >
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <Label htmlFor="message" className="text-ink-900">
                  Mensaje
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  maxLength={1000}
                  placeholder="Contanos en qué podemos ayudarte…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  className="mt-2 resize-y rounded-xl bg-cream-50"
                  {...register("message")}
                />
                {errors.message && (
                  <p
                    id="message-error"
                    role="alert"
                    className="mt-1.5 text-sm text-destructive"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>

            {/* Honeypot: invisible para personas, tentador para bots. */}
            <div aria-hidden className="hidden">
              <label htmlFor="website">No completar este campo</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <ShineButton
              type="submit"
              tone="primary"
              effect="fill"
              disabled={isSubmitting}
              className="mt-8 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Abriendo WhatsApp…
                </>
              ) : (
                <>
                  <Send
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                  Enviar por WhatsApp
                </>
              )}
            </ShineButton>

            <p className="mt-4 text-xs leading-relaxed text-ink-700/60">
              Al enviar se abre WhatsApp con tu consulta ya escrita, para que la
              mandes vos. No guardamos tus datos ni los compartimos.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
