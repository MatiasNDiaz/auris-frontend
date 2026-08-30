import type { Metadata } from "next";
import { BlogCard } from "@/components/shared/BlogCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { getPublishedPosts } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre salud, bienestar y cuidado escritos por el equipo de AURIS.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notas del equipo"
        description="Escribimos sobre lo que más nos consultan: cuándo pedir ayuda, cómo sostener un cambio de hábitos y qué esperar de cada tratamiento."
      />

      <section className="container-auris py-16 lg:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal as="li" key={post.slug} delay={(index % 3) * 0.1}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </ul>

        {posts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-cream-100 p-10 text-center text-ink-700/75">
            Todavía no publicamos artículos. Volvé pronto.
          </p>
        )}
      </section>
    </>
  );
}
