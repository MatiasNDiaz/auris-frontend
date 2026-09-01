import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { GuidedTour } from "@/components/sections/GuidedTour";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Recorré las instalaciones de AURIS paso a paso: ingreso, recepción, pasillo, consultorios y laboratorio.",
  alternates: { canonical: "/galeria" },
};

export default function GaleriaPage() {
  return (
    <>
      <PageHeader
        surface="sand"
        wave="shoulder"
        waveTone="base"
        eyebrow="Galería"
        title="Nuestros espacios"
        description="Consultorios amplios, luz natural y áreas comunes pensadas para que la espera también sea agradable."
      />
      <GuidedTour />
      <GalleryGrid />
      <CtaBanner />
    </>
  );
}
