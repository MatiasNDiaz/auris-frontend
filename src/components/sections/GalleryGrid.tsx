"use client";

import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { gallery } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

export function GalleryGrid() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <section className="container-auris py-16 lg:py-20">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
            // Alterna alturas para que la grilla no quede uniforme.
            className={index % 5 === 0 ? "lg:row-span-2" : undefined}
          >
            <button
              type="button"
              onClick={() => setSelected(item)}
              className="group relative block h-full w-full overflow-hidden rounded-3xl focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-cream-100",
                  index % 5 === 0
                    ? "aspect-4/5 h-full lg:aspect-auto lg:min-h-full"
                    : "aspect-4/5",
                )}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.category}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <span className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-ink-900/75 via-ink-900/10 to-transparent p-6 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="mb-3 size-5 text-cream-50" aria-hidden />
                <span className="font-serif text-lg text-cream-50">
                  {item.title}
                </span>
                <span className="mt-0.5 text-xs text-cream-50/80">
                  {item.category}
                </span>
              </span>

              <span className="sr-only">Ampliar: {item.title}</span>
            </button>
          </motion.li>
        ))}
      </ul>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-3xl overflow-hidden border-border bg-cream-50 p-0">
          {selected && (
            <>
              {/* `contain` sobre fondo oscuro: son fotos verticales y
                  recortarlas al abrir se comía media habitación. */}
              <div className="relative aspect-3/4 w-full bg-ink-900 sm:aspect-4/3">
                <Image
                  src={selected.imageUrl}
                  alt={selected.category}
                  fill
                  sizes="(max-width: 768px) 96vw, 768px"
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                <DialogTitle className="font-serif text-2xl text-ink-900">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-ink-700/75">
                  {selected.category}
                </DialogDescription>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
