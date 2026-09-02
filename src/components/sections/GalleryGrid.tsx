import Image from "next/image";
import { LeafSprig } from "@/components/shared/LeafSprig";
import { Reveal } from "@/components/shared/Reveal";
import { gallery } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

/**
 * Grilla de fotos del centro.
 *
 * Sin modal: antes cada foto abría un diálogo y eso obligaba a un click para
 * ver algo que ya está en pantalla. Las tarjetas son más grandes y el rótulo
 * aparece al pasar por encima; el recorrido guiado de arriba ya cubre el ver
 * una foto en grande.
 *
 * Como no hay estado, el componente se queda del lado del servidor.
 */
export function GalleryGrid() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <LeafSprig
        palette="green"
        size="lg"
        flip
        seed={13}
        className="bottom-0 right-2 h-52 opacity-45 lg:h-64"
      />
      <ul className="container-auris relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item, index) => (
          <Reveal as="li" key={item.id} delay={(index % 3) * 0.08}>
            <figure className="group relative overflow-hidden rounded-3xl bg-cream-100 shadow-sm transition-shadow duration-300 hover:shadow-xl">
              <div className={cn("relative w-full", "aspect-4/5")}>
                <Image
                  src={item.imageUrl}
                  alt={item.category}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* El rótulo se apoya sobre la foto y sube al pasar el mouse. */}
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-900/85 via-ink-900/35 to-transparent p-5 pt-12">
                <p className="font-serif text-lg text-cream-50">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-cream-50/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.category}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
