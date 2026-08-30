import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProfessionalsDirectory } from "@/components/sections/ProfessionalsDirectory";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Profesionales",
  description:
    "Conocé al equipo de AURIS: psicología, odontología, estética, nutrición, kinesiología y fonoaudiología.",
  alternates: { canonical: "/profesionales" },
};

export default function ProfesionalesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nuestro equipo"
        title="Quiénes te acompañan"
        description="Profesionales matriculados, con formación continua y una manera compartida de entender el cuidado. Filtrá por especialidad para encontrar a quien estás buscando."
      />
      <ProfessionalsDirectory />
      <CtaBanner />
    </>
  );
}
