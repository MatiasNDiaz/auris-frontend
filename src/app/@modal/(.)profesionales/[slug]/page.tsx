import { notFound } from "next/navigation";
import { ProfessionalModal } from "@/components/shared/ProfessionalModal";
import { getProfessionalBySlug } from "@/lib/data/professionals";
import { getServiceBySlug } from "@/lib/data/services";

/**
 * Intercepting route: al navegar a `/profesionales/[slug]` desde dentro del
 * sitio, el detalle se monta como overlay sobre la vista actual en vez de
 * reemplazarla. Eso mantiene montada la card de origen, que es la condición
 * para que el `layoutId` de la foto pueda interpolar entre ambas.
 *
 * Entrando por URL directa o recargando, Next renderiza la página completa
 * `(marketing)/profesionales/[slug]/page.tsx`.
 */
export default async function ProfesionalModalPage({
  params,
}: PageProps<"/profesionales/[slug]">) {
  const { slug } = await params;
  const professional = getProfessionalBySlug(slug);
  if (!professional) notFound();

  return (
    <ProfessionalModal
      professional={professional}
      service={getServiceBySlug(professional.serviceSlug)}
    />
  );
}
