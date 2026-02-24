import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DESTINATIONS } from "@/data/destinations";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/seed?secret=TU_SECRET
// Inserta/actualiza todos los destinos estáticos en Supabase.
// Usar una sola vez. Después deshabilitar o eliminar esta ruta.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mapear el array estático al formato de la tabla Supabase
  const rows = DESTINATIONS.map((d) => ({
    slug:           d.slug,
    title:          d.title,
    tagline:        d.tagline ?? "",
    description:    d.description ?? "",
    region:         d.region,
    countries:      d.countries,
    cities:         d.cities,
    days:           d.days,
    year:           d.year,
    departure_date: d.departureDate,
    return_date:    d.returnDate ?? null,
    departure_city: "Buenos Aires",

    // hero_path y cover_path se guardan como URLs completas.
    // resolveDestUrl() los detecta y los devuelve tal cual (empieza con http).
    hero_path:       d.heroImage   || null,
    cover_path:      d.thumbnailImage || null,
    map_path:        d.mapImageUrl  ?? null,
    itinerary_path:  d.itineraryPdfUrl ?? null,

    whatsapp_url:    d.whatsappUrl,
    video_urls:      d.videoTestimonials ?? [],
    includes:        d.includes ?? [],
    featured:        d.featured,
    active:          d.active,
    partner:         d.partner ?? false,
  }));

  // Upsert: si ya existe el slug, actualiza. Así es idempotente.
  const { data, error } = await supabaseAdmin
    .from("destinations")
    .upsert(rows, { onConflict: "slug" })
    .select("slug");

  if (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    inserted: data?.length ?? 0,
    slugs: data?.map((r: { slug: string }) => r.slug),
  });
}
