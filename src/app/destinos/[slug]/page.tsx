import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDestinationBySlugDB, getActiveDestinations } from "@/lib/supabase";
import { DESTINATIONS, getDestinationBySlug } from "@/data/destinations";

// Revalida cada hora + on-demand vía /api/revalidate
export const revalidate = 3600;
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DestinationHero from "@/components/destination/DestinationHero";
import DestinationContent from "@/components/destination/DestinationContent";
import RelatedDestinations from "@/components/destination/RelatedDestinations";
import ContactCTA from "@/components/home/ContactCTA";

interface Props {
  params: Promise<{ slug: string }>;
}

// Genera rutas estáticas combinando Supabase + datos locales
export async function generateStaticParams() {
  const dbDestinations = await getActiveDestinations().catch(() => []);
  const dbSlugs = new Set(dbDestinations.map((d) => d.slug));

  const staticSlugs = DESTINATIONS.filter((d) => d.active && !dbSlugs.has(d.slug)).map((d) => ({
    slug: d.slug,
  }));

  return [
    ...dbDestinations.map((d) => ({ slug: d.slug })),
    ...staticSlugs,
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = (await getDestinationBySlugDB(slug)) ?? getDestinationBySlug(slug);
  if (!destination) return {};

  return {
    title: `${destination.title} ${destination.year} — Grupales Travel`,
    description: destination.description,
    openGraph: {
      title: `${destination.title} — Salida Grupal ${destination.year}`,
      description: destination.description,
      images: [destination.heroImage],
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;

  // Supabase Fetch Concurrente: destino actual + todos para relacionados
  const [destinationDB, allDestinations] = await Promise.all([
    getDestinationBySlugDB(slug).catch(() => null),
    getActiveDestinations().catch(() => DESTINATIONS),
  ]);

  const destination = destinationDB ?? getDestinationBySlug(slug);

  if (!destination || !destination.active) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <DestinationHero destination={destination} />
        <DestinationContent destination={destination} />
        <RelatedDestinations current={destination} allDestinations={allDestinations} />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
