import { DESTINATIONS } from "@/data/destinations";
import { getDbDestinations, getDbHeroImages } from "@/lib/db";

export const HERO_BUCKET = "hero-images";
export const DEST_BUCKET = "destinations";

// ─────────────────────────────────────────────────────────────────────────────
// HERO IMAGES
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroImage {
  id: number;
  storage_path: string;
  alt: string;
  order: number;
  active: boolean;
  created_at: string;
}

export interface HeroImageResolved extends HeroImage {
  publicUrl: string;
}

export function resolveHeroUrl(storagePath: string): string {
  if (!storagePath) return "";
  if (storagePath.startsWith("http")) {
    if (storagePath.includes("pub-ee00f3f7e024452badbbefab620e13ba.r2.dev/")) {
      return storagePath.replace("https://pub-ee00f3f7e024452badbbefab620e13ba.r2.dev/", "/r2-media/");
    }
    return storagePath;
  }
  return `/r2-media/${storagePath.replace(/^\//, "")}`;
}

export async function getHeroImages(): Promise<HeroImageResolved[]> {
  try {
    const data = await getDbHeroImages();
    const activeOnly = data.filter((img) => img.active);
    activeOnly.sort((a, b) => a.order - b.order);

    return activeOnly.map((img) => ({
      ...img,
      publicUrl: resolveHeroUrl(img.storage_path),
    }));
  } catch (err) {
    console.error("Exception fetching hero images:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DESTINATIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface SupabaseDestination {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  region: string;
  countries: number;
  cities: number;
  days: number;
  year: number;
  departure_date: string;
  return_date: string | null;
  departure_city: string;
  cover_path: string | null;
  hero_path: string | null;
  map_path: string | null;
  itinerary_path: string | null;
  whatsapp_url: string;
  video_urls: string[];
  includes: string[];
  featured: boolean;
  active: boolean;
  partner: boolean;
  badge: string | null;
  created_at: string;
  updated_at: string;
}

export function resolveDestUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) {
    if (path.includes("pub-ee00f3f7e024452badbbefab620e13ba.r2.dev/")) {
      return path.replace("https://pub-ee00f3f7e024452badbbefab620e13ba.r2.dev/", "/r2-media/");
    }
    return path;
  }
  return `/r2-media/${path.replace(/^\//, "")}`;
}

function buildDepartureLabel(departure: string, returnDate: string | null): string {
  if (!departure) return "";
  if (returnDate) return `${departure} – ${returnDate}`;
  return departure;
}

export function toDestination(d: SupabaseDestination) {
  return {
    id: String(d.id),
    slug: d.slug,
    title: d.title,
    tagline: d.tagline,
    countries: d.countries,
    cities: d.cities,
    days: d.days,
    departureDate: buildDepartureLabel(d.departure_date, d.return_date),
    returnDate: d.return_date ?? undefined,
    departureCity: d.departure_city,
    year: d.year,
    region: d.region as import("@/types").Region,
    heroImage: resolveDestUrl(d.hero_path) || resolveDestUrl(d.cover_path),
    thumbnailImage: resolveDestUrl(d.cover_path),
    mapImageUrl: resolveDestUrl(d.map_path) || undefined,
    description: d.description,
    itineraryPdfUrl: resolveDestUrl(d.itinerary_path) || undefined,
    whatsappUrl: d.whatsapp_url,
    videoTestimonials: d.video_urls ?? [],
    includes: d.includes ?? [],
    itineraryDays: [],
    featured: d.featured,
    active: d.active,
    partner: d.partner,
    badge: d.badge ?? undefined,
  };
}

export async function getActiveDestinations() {
  try {
    const data = await getDbDestinations();
    const active = data.filter((d) => d.active);

    active.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.departure_date.localeCompare(b.departure_date);
    });

    const mapped = active.map(toDestination);
    return mapped.filter((d) => !d.partner || d.featured);
  } catch (err) {
    console.error("Error fetching active destinations:", err);
    return DESTINATIONS.filter((d) => !d.partner || d.featured);
  }
}

export async function getDestinationBySlugDB(slug: string) {
  try {
    const data = await getDbDestinations();
    const found = data.find((d) => d.slug === slug && d.active);
    if (!found) return null;
    const dest = toDestination(found);
    if (dest.partner && !dest.featured) return null;
    return dest;
  } catch {
    return null;
  }
}

export async function getAllDestinationsAdmin() {
  try {
    const data = await getDbDestinations();
    const copy = [...data];
    copy.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.departure_date.localeCompare(b.departure_date);
    });
    return copy;
  } catch (err) {
    console.error("Error fetching all destinations for admin:", err);
    return [];
  }
}
