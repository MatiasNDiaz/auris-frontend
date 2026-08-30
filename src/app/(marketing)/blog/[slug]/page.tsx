import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/shared/BlogCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Placeholder } from "@/components/shared/Placeholder";
import { Reveal } from "@/components/shared/Reveal";
import {
  blogPosts,
  getBlogPostBySlug,
  getPublishedPosts,
} from "@/lib/data/blog-posts";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = getPublishedPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  // Contenido mock en markdown liviano: "## " marca subtítulo, el resto párrafo.
  const blocks = post.content.split("\n\n").filter(Boolean);

  return (
    <>
      <article className="container-auris pt-10 pb-20 lg:pt-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Todos los artículos
        </Link>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <time
            dateTime={post.publishedAt}
            className="text-sm font-semibold tracking-[0.16em] text-primary-700 uppercase"
          >
            {formatDate(post.publishedAt)}
          </time>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-balance text-ink-900 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-700/80">
            {post.excerpt}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Placeholder
            seed={post.slug}
            label={`Imagen de portada de ${post.title}`}
            className="mx-auto mt-12 aspect-16/9 w-full max-w-4xl rounded-[2.5rem]"
          />
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl">
          {blocks.map((block, index) =>
            block.startsWith("## ") ? (
              <h2
                key={index}
                className="mt-12 mb-4 font-serif text-2xl text-balance text-ink-900 first:mt-0"
              >
                {block.slice(3)}
              </h2>
            ) : (
              <p
                key={index}
                className="mb-5 text-base leading-[1.75] text-pretty text-ink-700/90"
              >
                {block}
              </p>
            ),
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream-100 py-20 lg:py-24">
          <div className="container-auris">
            <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
              Seguí leyendo
            </h2>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal as="li" key={item.slug} delay={index * 0.08}>
                  <BlogCard post={item} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
