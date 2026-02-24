import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data } = supabase.storage
    .from(HERO_BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function getHeroImages(): Promise<HeroImageResolved[]> {
  const { data, error } = await supabase
    .from("hero_images")
    .select("*")
    .eq("active", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching hero images:", error.message);
    return [];
  }

  return (data ?? []).map((img: HeroImage) => ({
    ...img,
    publicUrl: resolveHeroUrl(img.storage_path),
  }));
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
  departure_date: string;       // "13 Ago 2026", "2026", "Consultar", etc.
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

// Resuelve paths de storage a URLs públicas.
// Si el path ya es una URL completa (http/https), lo devuelve tal cual.
export function resolveDestUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return supabase.storage.from(DEST_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Construye el string de fecha para mostrar al usuario.
// Acepta cualquier formato: ISO, ya formateado, "Consultar", solo año, etc.
function buildDepartureLabel(departure: string, returnDate: string | null): string {
  if (!departure) return "";
  if (returnDate) return `${departure} – ${returnDate}`;
  return departure;
}

// Convierte una fila de Supabase al tipo Destination que usa el frontend
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
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("active", true)
    .order("year", { ascending: true })
    .order("departure_date", { ascending: true });

  if (error) {
    console.error("Error fetching destinations:", error.message);
    return [];
  }

  return (data as SupabaseDestination[]).map(toDestination);
}

export async function getDestinationBySlugDB(slug: string) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;
  return toDestination(data as SupabaseDestination);
}

// Solo para el admin — trae todos incluyendo inactivos
export async function getAllDestinationsAdmin() {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("year", { ascending: false })
    .order("departure_date", { ascending: true });

  if (error) {
    console.error("Error fetching all destinations:", error.message);
    return [];
  }

  return data as SupabaseDestination[];
}
