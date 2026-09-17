import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfessionalProfile } from "@/components/shared/ProfessionalProfile";
import { getProfessionalBySlug, professionals } from "@/lib/data/professionals";
import { getFicha } from "@/lib/data/fichas";
import { getServiceBySlug } from "@/lib/data/services";
import { fotosDeProfesional } from "@/lib/fotos-profesional";

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
  const index = professionals.indexOf(professional);
  const fotos = fotosDeProfesional(professional.slug);

  return (
    <>
      <ProfessionalProfile
        // El hero se lee del disco en cada request: en desarrollo, una foto
        // recién subida aparece al recargar sin reiniciar el servidor.
        professional={
          fotos.hero ? { ...professional, photoUrl: fotos.hero } : professional
        }
        service={service}
        ficha={getFicha(professional)}
        fotos={fotos}
        // Se alterna de una ficha a la siguiente para variar el ritmo.
        fotoCifras={index % 2 === 0 ? "izquierda" : "derecha"}
      />
    </>
  );
}
