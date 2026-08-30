"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Placeholder } from "./Placeholder";
import type { BlogPost } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <Placeholder seed={post.slug} className="aspect-16/9 w-full" />

      <div className="flex flex-1 flex-col p-6">
        <time
          dateTime={post.publishedAt}
          className="text-xs font-semibold tracking-[0.14em] text-primary-700 uppercase"
        >
          {formatDate(post.publishedAt)}
        </time>

        <h3 className="mt-3 font-serif text-xl leading-snug text-balance text-ink-900">
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

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700">
          Leer artículo
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </motion.article>
  );
}
