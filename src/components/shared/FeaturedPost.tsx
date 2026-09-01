import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * Nota destacada: la más reciente, arriba del listado y a dos columnas.
 *
 * No usa `BlogCard` porque no es la misma pieza a otro tamaño: acá el peso lo
 * lleva el titular y la foto acompaña, mientras que en la grilla la foto es lo
 * que engancha. Comparten el chip, la bajada y la fecha para que se lean como
 * la misma familia.
 */
export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-surface-base shadow-sm transition-[box-shadow] duration-[420ms] hover:shadow-xl">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <span className="w-fit rounded-full bg-primary-700 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-[0.12em] text-cream-50 uppercase">
            {post.category}
          </span>

          <h2 className="mt-6 font-serif text-3xl leading-[1.15] text-balance text-primary-800 sm:text-4xl">
            <Link
              href={`/blog/${post.slug}`}
              className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
            >
              {post.title}
            </Link>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-ink-700/85">
            {post.excerpt}
          </p>

          {/* La flecha va en un círculo que se llena al pasar el mouse, como el
              "Ver novedad" de la referencia. */}
          <span className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-primary-800">
            <span
              aria-hidden
              className="inline-flex size-10 items-center justify-center rounded-full border-2 border-primary-700 text-primary-700 transition-[background-color,color,transform] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:bg-primary-700 group-hover:text-cream-50 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              <ArrowRight className="size-4.5" strokeWidth={2.2} />
            </span>
            Leer la nota
          </span>

          <time
            dateTime={post.publishedAt}
            className="mt-8 border-t border-border pt-5 text-xs font-semibold tracking-[0.12em] text-ink-700/60 uppercase"
          >
            {formatDate(post.publishedAt)}
          </time>
        </div>

        {/* En mobile la foto va arriba; el `order` la reacomoda en desktop. */}
        <div className="relative order-first min-h-64 lg:order-last lg:min-h-full">
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </article>
  );
}
