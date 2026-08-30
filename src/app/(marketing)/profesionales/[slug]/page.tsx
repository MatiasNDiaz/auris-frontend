import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProfessionalProfile } from "@/components/shared/ProfessionalProfile";
import {
  getProfessionalBySlug,
  professionals,
} from "@/lib/data/professionals";
import { getServiceBySlug } from "@/lib/data/services";

export function generateStaticParams() {
  return professionals.map((professional) => ({ slug: professional.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/profesionales/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const professional = getProfessionalBySlug(slug);
  if (!professional) return {};

  return {
    title: professional.name,
    description: `${professional.specialty}. ${professional.bio}`,
    alternates: { canonical: `/profesionales/${professional.slug}` },
    openGraph: { images: [professional.photoUrl] },
  };
}

export default async function ProfesionalDetallePage({
  params,
}: PageProps<"/profesionales/[slug]">) {
  const { slug } = await params;
  const professional = getProfessionalBySlug(slug);
  if (!professional) notFound();

  const service = getServiceBySlug(professional.serviceSlug);

  return (
    <>
      <div className="container-auris pt-10 pb-20 lg:pt-14 lg:pb-24">
        <Link
          href="/profesionales"
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Todo el equipo
        </Link>

        <ProfessionalProfile
          professional={professional}
          service={service}
          className="mt-10 lg:mt-14"
        />
      </div>

      <CtaBanner
        title="¿Querés coordinar una consulta?"
        description="Escribinos por WhatsApp y te confirmamos la disponibilidad del profesional."
      />
    </>
  );
}
