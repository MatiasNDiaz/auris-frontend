import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Odontología, odontopediatría funcional, alineadores y ortodoncia, bruxismo y disfunciones, estética facial y corporal, fonoaudiología, psicología y taller de adultos mayores en un mismo centro.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        surface="sand"
        wave="slope"
        waveTone="sage"
        eyebrow="Nuestros servicios"
        title="Especialidades que trabajan en equipo"
        description="Ocho especialidades bajo un mismo enfoque de atención. Elegí la que estás buscando para conocer en detalle cómo trabajamos y quiénes te acompañan."
      />
      <ServicesGrid withHeading={false} />
      <CtaBanner />
    </>
  );
}
