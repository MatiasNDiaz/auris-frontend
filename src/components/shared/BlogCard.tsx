import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  className?: string;
  /** Prioriza la carga: solo en las tarjetas de la primera fila. */
  priority?: boolean;
};

/**
 * Tarjeta de nota: foto arriba, chip del área, título, bajada y la fecha al pie
 * separada por una regla.
 *
 * La fecha va abajo y no arriba a propósito: en un listado, lo primero que
 * ordena la lectura es el tema, no cuándo se publicó.
 */
export function BlogCard({ post, className, priority = false }: BlogCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-[box-shadow,transform] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-cream-100">
        <Image
          src={post.coverImageUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-primary-100 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.12em] text-primary-800 uppercase">
          {post.category}
        </span>

        <h3 className="mt-4 font-serif text-xl leading-snug text-balance text-ink-900 transition-colors duration-300 group-hover:text-primary-800">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700/80">
          {post.excerpt}
        </p>

        <time
          dateTime={post.publishedAt}
          className="mt-6 border-t border-border pt-4 text-xs font-semibold tracking-[0.12em] text-ink-700/60 uppercase"
        >
          {formatDate(post.publishedAt)}
        </time>
      </div>
    </article>
  );
}
