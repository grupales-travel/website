import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { DESTINATIONS } from "@/data/destinations";
import { SupabaseDestination, HeroImage } from "@/lib/supabase";

const BUCKET = process.env.R2_BUCKET!;
const DESTINATIONS_KEY = "db/destinations.json";
const HERO_IMAGES_KEY = "db/hero_images.json";

// Fallback inicial para hero images
const DEFAULT_HERO_IMAGES: HeroImage[] = [
  {
    id: 1,
    storage_path: "backgrounds/alma-europea-2026.webp",
    alt: "Alma Europea 2026",
    order: 1,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    storage_path: "backgrounds/costa-rica-2026.jpg",
    alt: "Costa Rica 2026",
    order: 2,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    storage_path: "backgrounds/de-londres-a-viena-2026.jpg",
    alt: "De Londres a Viena",
    order: 3,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    storage_path: "backgrounds/new-york-miami-2026.webp",
    alt: "New York & Miami",
    order: 4,
    active: true,
    created_at: new Date().toISOString(),
  },
];

/**
 * Convierte el array estático de `DESTINATIONS` al formato `SupabaseDestination` para inicializar R2
 */
function getStaticDestinationsAsDb(): SupabaseDestination[] {
  return DESTINATIONS.map((d, idx) => ({
    id: idx + 1,
    slug: d.slug,
    title: d.title,
    tagline: d.tagline || "",
    description: d.description || "",
    region: d.region,
    countries: d.countries,
    cities: d.cities,
    days: d.days,
    year: d.year,
    departure_date: d.departureDate || "2026",
    return_date: d.returnDate || null,
    departure_city: d.departureCity || "Buenos Aires",
    cover_path: d.thumbnailImage ? d.thumbnailImage.replace(/^\/r2-media\//, "") : null,
    hero_path: d.heroImage ? d.heroImage.replace(/^\/r2-media\//, "") : null,
    map_path: d.mapImageUrl ? d.mapImageUrl.replace(/^\/r2-media\//, "") : null,
    itinerary_path: d.itineraryPdfUrl ? d.itineraryPdfUrl.replace(/^\/r2-media\//, "") : null,
    whatsapp_url: d.whatsappUrl || "https://wa.link/ggzwq4",
    video_urls: d.videoTestimonials || [],
    includes: d.includes || [],
    featured: d.featured,
    active: d.active,
    partner: d.partner || false,
    badge: d.badge || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Lee un archivo JSON desde Cloudflare R2
 */
async function readJsonFromR2<T>(key: string): Promise<T | null> {
  try {
    const res = await r2.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    if (!res.Body) return null;
    const text = await res.Body.transformToString();
    return JSON.parse(text) as T;
  } catch (err: unknown) {
    const code = (err as { name?: string; code?: string })?.name || (err as { name?: string; code?: string })?.code;
    if (code === "NoSuchKey" || code === "NotFound") {
      return null;
    }
    console.error(`[R2 DB] Error leyendo ${key}:`, err);
    return null;
  }
}

/**
 * Escribe un archivo JSON en Cloudflare R2
 */
async function writeJsonToR2<T>(key: string, data: T): Promise<void> {
  const jsonStr = JSON.stringify(data, null, 2);
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(jsonStr, "utf-8"),
      ContentType: "application/json",
      CacheControl: "no-cache",
    })
  );
}

// ─── DESTINATIONS ────────────────────────────────────────────────────────────

export async function getDbDestinations(): Promise<SupabaseDestination[]> {
  const data = await readJsonFromR2<SupabaseDestination[]>(DESTINATIONS_KEY);
  if (data && Array.isArray(data)) {
    return data;
  }
  // Si no existe en R2 aún, devuelve los estáticos y los guarda
  const initial = getStaticDestinationsAsDb();
  await saveDbDestinations(initial).catch(err => console.error("Error inicializando R2 DB destinations:", err));
  return initial;
}

export async function saveDbDestinations(destinations: SupabaseDestination[]): Promise<void> {
  await writeJsonToR2(DESTINATIONS_KEY, destinations);
}

// ─── HERO IMAGES ─────────────────────────────────────────────────────────────

export async function getDbHeroImages(): Promise<HeroImage[]> {
  const data = await readJsonFromR2<HeroImage[]>(HERO_IMAGES_KEY);
  if (data && Array.isArray(data)) {
    return data;
  }
  // Si no existe en R2 aún, guarda y devuelve el fallback
  await saveDbHeroImages(DEFAULT_HERO_IMAGES).catch(err => console.error("Error inicializando R2 DB hero images:", err));
  return DEFAULT_HERO_IMAGES;
}

export async function saveDbHeroImages(images: HeroImage[]): Promise<void> {
  await writeJsonToR2(HERO_IMAGES_KEY, images);
}
