"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Refleja la tabla `contact_submissions` de Supabase. Cuando exista el backend,
 * este mismo esquema se revalida en la Server Action antes de insertar.
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

  const onSubmit = async (values: ContactValues) => {
    // TODO: reemplazar por la Server Action que inserta en `contact_submissions`.
    if (values.website) return; // honeypot completado: descartamos en silencio
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.info("Consulta de contacto (mock):", values);
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
              ¡Recibimos tu consulta!
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-pretty text-ink-700/80">
              Te vamos a responder dentro de las próximas 24 horas hábiles.
              Gracias por escribirnos.
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              className="mt-6 rounded-full text-primary-700 hover:bg-primary-50"
            >
              Enviar otra consulta
            </Button>
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
              Completá el formulario y te respondemos a la brevedad. No hace
              falta registrarse.
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

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="mt-8 w-full rounded-full bg-primary-700 font-semibold text-cream-50 hover:bg-primary-800 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Enviando…
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden />
                  Enviar consulta
                </>
              )}
            </Button>

            <p className="mt-4 text-xs leading-relaxed text-ink-700/60">
              Al enviar aceptás que nos contactemos con vos por los datos
              provistos. No compartimos tu información con terceros.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
