"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { mainNav, siteConfig } from "@/config/site";
import { listedServices } from "@/lib/data/services";
import { renderServiceIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const FILA =
  "rounded-full px-4 py-3 text-base font-medium transition-colors duration-200";
const FILA_ACTIVA = "bg-primary-300 text-primary-900";
const FILA_QUIETA =
  "text-primary-700/85 hover:bg-primary-200 hover:text-primary-900";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // El acordeón de servicios arranca abierto si ya estás dentro de un servicio:
  // así el menú muestra dónde estás parado sin pedir un toque extra.
  const [serviciosAbierto, setServiciosAbierto] = useState(() =>
    pathname.startsWith("/servicios"),
  );
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Abrir menú de navegación"
        className="inline-flex size-11 items-center justify-center rounded-full text-primary-800 transition-all duration-200 ease-out hover:-translate-y-px hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none motion-reduce:hover:translate-y-0 xl:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col bg-cream-50 p-0"
      >
        <SheetHeader className="border-b border-primary-100 px-6 py-5">
          <SheetTitle className="sr-only">
            {siteConfig.name} — {siteConfig.tagline}
          </SheetTitle>
          <Logo />
        </SheetHeader>

        <nav className="flex flex-col overflow-y-auto px-3 py-4">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            // En táctil no hay "pasar el cursor", así que Servicios se abre y
            // se cierra con un toque. La fila queda partida en dos blancos: el
            // rótulo sigue llevando a /servicios y el chevrón —con su propia
            // área de 44 px— despliega la lista. Si el toque hiciera las dos
            // cosas, no habría forma de llegar al listado completo.
            if (item.href === "/servicios") {
              return (
                <div key={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full pr-1 transition-colors duration-200",
                      active ? FILA_ACTIVA : "hover:bg-primary-200",
                    )}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        FILA,
                        "flex-1",
                        active ? "text-primary-900" : "text-primary-700/85",
                      )}
                    >
                      {item.label}
                    </Link>

                    <button
                      type="button"
                      onClick={() => setServiciosAbierto((v) => !v)}
                      aria-expanded={serviciosAbierto}
                      aria-label={
                        serviciosAbierto
                          ? "Ocultar la lista de servicios"
                          : "Ver la lista de servicios"
                      }
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-primary-700 transition-colors duration-200 hover:bg-primary-300/60 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                    >
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-5 transition-transform duration-300 ease-out",
                          serviciosAbierto && "rotate-180",
                        )}
                      />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {serviciosAbierto && (
                      <motion.div
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { height: "auto", opacity: 1 }
                        }
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{
                          duration: reduceMotion ? 0.15 : 0.32,
                          ease: [0.32, 0.08, 0.24, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-1 ml-4 space-y-0.5 border-l border-primary-100 pl-3">
                          {listedServices.map((service) => {
                            const enEsta =
                              pathname === `/servicios/${service.slug}`;

                            return (
                              <li key={service.slug}>
                                <Link
                                  href={`/servicios/${service.slug}`}
                                  aria-current={enEsta ? "page" : undefined}
                                  onClick={() => setOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[0.9375rem] transition-colors duration-200",
                                    enEsta
                                      ? "bg-primary-200 font-medium text-primary-900"
                                      : "text-primary-700/85 hover:bg-primary-100 hover:text-primary-900",
                                  )}
                                >
                                  <span
                                    aria-hidden
                                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700"
                                  >
                                    {renderServiceIcon(service.icon, {
                                      className: "size-4",
                                      strokeWidth: 1.6,
                                    })}
                                  </span>
                                  {service.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                // El Sheet sobrevive a la navegación, así que lo cerramos acá.
                onClick={() => setOpen(false)}
                className={cn(FILA, active ? FILA_ACTIVA : FILA_QUIETA)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border p-6">
          <WhatsAppButton className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
