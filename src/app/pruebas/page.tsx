import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import RedesignShowcase from "@/components/pruebas/RedesignShowcase";
import RegionFilter from "@/components/home/RegionFilter";
import ExperienceSection from "@/components/home/ExperienceSection";
import GallerySection from "@/components/home/GallerySection";
import ContactCTA from "@/components/home/ContactCTA";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import { getActiveDestinations, getHeroImages } from "@/lib/supabase";
import { DESTINATIONS } from "@/data/destinations";
import Link from "next/link";
import { Beaker, Eye, ArrowRight, ShieldCheck } from "lucide-react";

// Forzar revalidación dinámica para pruebas siempre frescas
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Laboratorio de Pruebas | Grupales Travel",
  description: "Entorno aislado para probar diseños, componentes y cambios antes de publicar en la web oficial.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PruebasPage() {
  const [destinations, heroImagesData] = await Promise.all([
    getActiveDestinations().catch(() => DESTINATIONS.filter(d => !d.partner || d.featured)),
    getHeroImages().catch(() => []),
  ]);

  return (
    <>
      {/* Barra flotante indicadora de Modo Pruebas */}
      <aside aria-label="Aviso de entorno de pruebas" className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl bg-amber-950/90 backdrop-blur-md border border-amber-500/40 text-amber-100 px-4 py-2.5 rounded-2xl shadow-2xl shadow-black/50 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2.5 font-medium">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <Beaker className="w-4 h-4 text-amber-400" />
          <span>
            <strong>Modo Pruebas / Laboratorio:</strong> Trabajando en borrador aislado. Los cambios aquí <strong>no afectan</strong> la web oficial.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver web original
          </Link>
        </div>
      </aside>

      <Navbar />
      
      <main className="relative pt-6">
        {/* Aquí probamos los nuevos componentes y cambios experimentales */}
        <HeroSection initialImages={heroImagesData} />
        <BenefitsBanner />

        {/* ── SECCIÓN DE PRUEBAS: NUEVO FORMATO EDITORIAL DE PRODUCTOS ── */}
        <RedesignShowcase destinations={destinations} />

        <RegionFilter limit={8} destinations={destinations} />
        <HomeTestimonials destinations={destinations} heroImages={heroImagesData} />
        <ExperienceSection />
        <GallerySection />
        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}
