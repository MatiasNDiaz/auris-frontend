import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { TourViewer } from "@/components/sections/TourViewer";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Recorré las instalaciones de AURIS como si estuvieras adentro: entrá por la puerta y caminá hasta los consultorios y el laboratorio.",
  alternates: { canonical: "/galeria" },
};

export default function GaleriaPage() {
  return (
    <>
      <PageHeader
        surface="sand"
        wave="shoulder"
        waveTone="base"
        eyebrow="Recorrido virtual"
        title="Nuestros espacios"
        description="Entrá por la puerta y caminá el centro: mirá alrededor y tocá los puntos para pasar de un espacio al siguiente."
      />
      {/* El recorrido reemplaza al visor con timeline y a la grilla de fotos:
          ahora se camina de foto en foto tocando las puertas. */}
      <section className="container-auris py-16 lg:py-20">
        <TourViewer />
      </section>
      <CtaBanner />
    </>
  );
}
