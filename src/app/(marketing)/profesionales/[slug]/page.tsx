import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfessionalProfile } from "@/components/shared/ProfessionalProfile";
import { getProfessionalBySlug, professionals } from "@/lib/data/professionals";
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
      <ProfessionalProfile professional={professional} service={service} />
    </>
  );
}
