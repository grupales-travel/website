import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import DestinationsSection from "@/components/home/DestinationsSection";
import RegionFilter from "@/components/home/RegionFilter";
import ExperienceSection from "@/components/home/ExperienceSection";
import GallerySection from "@/components/home/GallerySection";
import ContactCTA from "@/components/home/ContactCTA";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import { getActiveDestinations, getHeroImages } from "@/lib/supabase";
import { DESTINATIONS } from "@/data/destinations";

// Regenera la página cada hora. On-demand via /api/revalidate.
export const revalidate = 3600;

export default async function Home() {
  // Supabase primero, datos estáticos como fallback si falla. Concurrente.
  const [destinations, heroImagesData] = await Promise.all([
    getActiveDestinations().catch(() => DESTINATIONS.filter(d => !d.partner || d.featured)),
    getHeroImages().catch(() => []),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection initialImages={heroImagesData} />
        {/* <DestinationsSection destinations={destinations} /> */}
        <BenefitsBanner />
        <RegionFilter limit={8} destinations={destinations} />
        <HomeTestimonials destinations={destinations} />
        <ExperienceSection />
        <GallerySection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
