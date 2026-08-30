import { AboutPreview } from "@/components/sections/AboutPreview";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Hero } from "@/components/sections/Hero";
import { QuickLinks } from "@/components/sections/QuickLinks";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TeamCarousel } from "@/components/sections/TeamCarousel";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <ServicesGrid />
      <AboutPreview />
      <TeamCarousel />
      <TestimonialsSlider />
      <CtaBanner />
    </>
  );
}
