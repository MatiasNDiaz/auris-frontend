import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProfessionalsDirectory } from "@/components/sections/ProfessionalsDirectory";
import { PageHeader } from "@/components/shared/PageHeader";
import { bannerDeSeccion } from "@/lib/banners-secciones";

export const metadata: Metadata = {
  title: "Profesionales",
  description:
    "Conocé al equipo de AURIS: odontología, odontopediatría funcional, alineadores y ortodoncia, bruxismo y disfunciones, estética facial y corporal, fonoaudiología, psicología y taller de adultos mayores.",
  alternates: { canonical: "/profesionales" },
};

export default function ProfesionalesPage() {
  return (
    <>
      <PageHeader
        surface="sage"
        wave="hueco"
        waveTone="base"
        foto={bannerDeSeccion("profesionales")}
        masAlto
        fotoFoco="center 100%"
        fotoAlt="El equipo de AURIS en la recepción del centro"
        eyebrow="Nuestro equipo"
        title="Quiénes te acompañan"
        description="Profesionales matriculados, con formación continua y una manera compartida de entender el cuidado. Filtrá por especialidad para encontrar a quien estás buscando."
      />
      <ProfessionalsDirectory />
      <CtaBanner />
    </>
  );
}
