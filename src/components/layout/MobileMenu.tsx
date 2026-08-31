"use client";

import { Menu } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Abrir menú de navegación"
        className="inline-flex size-11 items-center justify-center rounded-full text-primary-800 transition-all duration-200 ease-out hover:-translate-y-px hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none motion-reduce:hover:translate-y-0 xl:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm bg-cream-50 p-0">
        <SheetHeader className="border-b border-primary-100 px-6 py-5">
          <SheetTitle className="sr-only">
            {siteConfig.name} — {siteConfig.tagline}
          </SheetTitle>
          <Logo />
        </SheetHeader>

        <nav className="flex flex-col px-3 py-4">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                // El Sheet sobrevive a la navegación, así que lo cerramos acá.
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-full px-4 py-3 text-base font-medium transition-colors duration-200",
                  active
                    ? "bg-primary-300 text-primary-900"
                    : "text-primary-700/85 hover:bg-primary-200 hover:text-primary-900",
                )}
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
