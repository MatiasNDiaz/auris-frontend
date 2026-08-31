"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatedNavLogo } from "./AnimatedNavLogo";
import { MobileMenu } from "./MobileMenu";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Ruido de scroll por debajo de esto no cambia el estado de la navbar. */
const DELTA_THRESHOLD = 6;
/** Recién a partir de acá tiene sentido esconderla. */
const HIDE_AFTER = 120;

export function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // El logo queda grande en reposo y pasa al lockup compacto con el cursor
  // encima; es lo único que dispara el efecto.
  const [hovered, setHovered] = useState(false);

  const prevY = useRef(0);
  const hiddenRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - prevY.current;
    prevY.current = y;
    setScrolled(y > 12);

    // En el tope siempre visible, sin necesidad de gesto.
    if (y <= 8) {
      if (hiddenRef.current) {
        hiddenRef.current = false;
        setHidden(false);
      }
      return;
    }

    if (Math.abs(delta) < DELTA_THRESHOLD) return;

    if (delta > 0 && y > HIDE_AFTER) {
      if (!hiddenRef.current) {
        hiddenRef.current = true;
        setHidden(true);
      }
      return;
    }

    if (delta < 0 && hiddenRef.current) {
      hiddenRef.current = false;
      setHidden(false);
    }
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-105%" : "0%" }}
      transition={{
        duration: reduceMotion ? 0 : 0.32,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // El foco por teclado también compacta el logo: si no, al tabular la
      // navbar el nombre quedaría oculto.
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border/70 bg-cream-50/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Grid de tres columnas con los laterales iguales (`1fr`): el bloque
          central queda en el eje de la página igual que con un centrado
          absoluto, pero acá sí reserva espacio, así que el logo y el CTA no
          pueden pisarlo por más que crezcan. */}
      <div className="mx-auto flex h-20 w-full max-w-360 items-center justify-between gap-8 px-5 sm:px-8 lg:px-12 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-12">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — ${siteConfig.tagline}`}
          className="w-fit rounded-md focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none xl:justify-self-start"
        >
          <AnimatedNavLogo hovered={hovered} />
        </Link>

        {/* Centrado absoluto respecto del contenedor: así los enlaces quedan
            en el eje de la página y no desplazados por el ancho del logo o del
            CTA, que son de anchos distintos. */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center justify-center gap-1 xl:flex"
        >
          {mainNav.slice(1).map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-[color,background-color,transform] duration-200 ease-out hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none motion-reduce:hover:translate-y-0",
                  active
                    ? "bg-primary-300 text-primary-900"
                    : "text-primary-700 hover:bg-primary-200 hover:text-primary-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 xl:justify-self-end">
          <WhatsAppButton className="hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
