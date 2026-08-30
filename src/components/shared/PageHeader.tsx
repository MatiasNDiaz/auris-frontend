import { Reveal } from "./Reveal";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/** Encabezado común a todas las páginas internas. */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-cream-100 py-16 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-20 size-96 rounded-full bg-primary-100/70 blur-3xl"
      />

      <div className="container-auris relative">
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-primary-700 uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-4xl leading-tight text-balance text-ink-900 sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-700/85">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </header>
  );
}
