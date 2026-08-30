import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Psicología, odontología, estética facial y corporal, nutrición, taller de auto, kinesiología y fonoaudiología en un mismo centro.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nuestros servicios"
        title="Especialidades que trabajan en equipo"
        description="Siete disciplinas bajo un mismo enfoque de atención. Elegí la que estás buscando para conocer en detalle cómo trabajamos y quiénes te acompañan."
      />
      <ServicesGrid withHeading={false} />
      <CtaBanner />
    </>
  );
}
