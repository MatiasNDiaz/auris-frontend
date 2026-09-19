import { AboutPreview } from "@/components/sections/AboutPreview";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Hero } from "@/components/sections/Hero";
import { QuickLinks } from "@/components/sections/QuickLinks";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { StatsBand } from "@/components/sections/StatsBand";
import { StickyTreatment } from "@/components/sections/StickyTreatment";
import { TeamCarousel } from "@/components/sections/TeamCarousel";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { WindReveal } from "@/components/shared/WindReveal";

/**
 * El Hero queda fuera del `WindReveal`: ya tiene su propia entrada y, al estar
 * sobre el pliegue, el fotograma en que el revelado se arma sería visible.
 *
 * `StickyTreatment` tampoco entra: su efecto depende de un `sticky` que se
 * rompería si lo envolviéramos en un contenedor con `transform`.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WindReveal>
        <QuickLinks />
      </WindReveal>
      {/* Servicios y equipo son las dos secciones que el centro quiere mostrar
          primero, así que van juntas y lo más arriba posible. Antes el equipo
          quedaba sexto, a diez pantallas de scroll en un teléfono. */}
      <WindReveal palette="beige">
        <ServicesGrid />
      </WindReveal>
      <WindReveal palette="beige">
        <TeamCarousel />
      </WindReveal>
      <WindReveal>
        <StatsBand />
      </WindReveal>
      <StickyTreatment />
      <WindReveal>
        <AboutPreview />
      </WindReveal>
      <WindReveal>
        <TestimonialsSlider />
      </WindReveal>
      <WindReveal palette="beige">
        <CtaBanner />
      </WindReveal>
    </>
  );
}
