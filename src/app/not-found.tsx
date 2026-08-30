import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-auris flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-6xl text-primary-300">404</p>
      <h1 className="mt-6 font-serif text-3xl text-balance text-ink-900 sm:text-4xl">
        No encontramos esta página
      </h1>
      <p className="mt-4 max-w-md text-pretty text-ink-700/80">
        Puede que el enlace haya cambiado o que la página ya no exista. Probá
        volver al inicio o escribinos si necesitás ayuda.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-primary-700 text-cream-50 hover:bg-primary-800"
        >
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden />
            Volver al inicio
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full border-primary-700 text-primary-700 hover:bg-primary-50"
        >
          <Link href="/contacto">Ir a contacto</Link>
        </Button>
      </div>
    </section>
  );
}
