"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
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
          className="rounded-md font-serif text-2xl leading-none tracking-tight text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
        >
          {siteConfig.name}
          <span className="sr-only"> — {siteConfig.tagline}</span>
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
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none",
                  active
                    ? "text-primary-600"
                    : "text-ink-700/80 hover:text-primary-600",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-primary-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contacto"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-ink-700/80 transition-colors hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none lg:inline-flex"
          >
            Contacto
          </Link>
          <WhatsAppButton size="default" className="hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
