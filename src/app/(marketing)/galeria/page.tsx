import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { TourViewer } from "@/components/sections/TourViewer";
import { PageHeader } from "@/components/shared/PageHeader";
import { bannerDeSeccion } from "@/lib/banners-secciones";

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
        foto={bannerDeSeccion("recorrido")}
        fotoFoco="center 34%"
        fotoAlt="Tres integrantes del equipo conversando en la recepción"
        eyebrow="Recorrido virtual"
        title="Nuestros espacios"
        description="Entrá por la puerta y caminá el centro: mirá alrededor y tocá los puntos para pasar de un espacio al siguiente."
      />
      {/* El recorrido reemplaza al visor con timeline y a la grilla de fotos:
          ahora se camina de foto en foto tocando las puertas. */}
      {/* El fondo va declarado y no heredado del body: la curva del encabezado
          se pinta con el color de lo que sigue, y el del body es apenas más
          claro. Esa diferencia dibujaba una línea recta justo debajo de la
          onda, que es lo que la curva viene a evitar. */}
      <section className="bg-surface-base py-16 lg:py-20">
        <div className="container-auris">
          <TourViewer />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
