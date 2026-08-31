import { AboutPreview } from "@/components/sections/AboutPreview";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Hero } from "@/components/sections/Hero";
import { QuickLinks } from "@/components/sections/QuickLinks";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
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
      <WindReveal palette="beige">
        <ServicesGrid />
      </WindReveal>
      {/* Va pegado a servicios: la foto es de un tratamiento estético. */}
      <StickyTreatment />
      <WindReveal>
        <AboutPreview />
      </WindReveal>
      <WindReveal palette="beige">
        <TeamCarousel />
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
