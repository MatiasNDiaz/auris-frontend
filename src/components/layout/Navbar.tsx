"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "@/components/shared/Logo";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-cream-50/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-auris flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — ${siteConfig.tagline}`}
          className="rounded-md focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
        >
          <Logo priority />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {mainNav.slice(1, -1).map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                  active
                    ? "text-primary-700"
                    : "text-ink-700/80 hover:text-primary-700",
                )}
              >
                {item.label}
                {/* Subrayado que crece desde el centro; en la activa ya está
                    desplegado. `scale-x` anima sin provocar reflow. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3.5 bottom-1 h-0.5 origin-center rounded-full bg-primary-500 transition-transform duration-300 ease-out",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contacto"
            className="group relative hidden rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap text-ink-700/80 transition-colors duration-200 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none lg:inline-flex"
          >
            Contacto
            <span
              aria-hidden
              className="absolute inset-x-3.5 bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-primary-500 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </Link>
          <WhatsAppButton size="default" className="hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
