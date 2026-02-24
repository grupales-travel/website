import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegionFilter from "@/components/home/RegionFilter";
import ContactCTA from "@/components/home/ContactCTA";
import { getActiveDestinations } from "@/lib/supabase";
import { DESTINATIONS } from "@/data/destinations";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Salidas Grupales 2026 — Grupales Travel",
  description:
    "Explorá todas nuestras salidas grupales acompañadas 2026. Europa, América, Asia, África y Medio Oriente.",
};

export default async function SalidasPage() {
  const destinations = await getActiveDestinations().catch(() => DESTINATIONS);

  return (
    <>
      <Navbar />
      <main>
        <RegionFilter pageMode destinations={destinations} />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
