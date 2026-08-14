import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { getDbDestinations, saveDbDestinations } from "@/lib/db";
import { SupabaseDestination } from "@/lib/supabase";

// POST — crear destino
export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await req.json();
  const destinations = await getDbDestinations();

  const maxId = destinations.reduce((max, d) => Math.max(max, d.id), 0);
  const newId = maxId + 1;
  const now = new Date().toISOString();

  const newDestination: SupabaseDestination = {
    id: newId,
    slug: body.slug || `destino-${newId}`,
    title: body.title || "Nuevo Destino",
    tagline: body.tagline || "",
    description: body.description || "",
    region: body.region || "europa",
    countries: Number(body.countries) || 1,
    cities: Number(body.cities) || 1,
    days: Number(body.days) || 1,
    year: Number(body.year) || 2026,
    departure_date: body.departure_date || "2026",
    return_date: body.return_date || null,
    departure_city: body.departure_city || "Buenos Aires",
    cover_path: body.cover_path || null,
    hero_path: body.hero_path || null,
    map_path: body.map_path || null,
    itinerary_path: body.itinerary_path || null,
    whatsapp_url: body.whatsapp_url || "https://wa.link/ggzwq4",
    video_urls: body.video_urls || [],
    includes: body.includes || [],
    featured: Boolean(body.featured),
    active: body.active !== undefined ? Boolean(body.active) : true,
    partner: Boolean(body.partner),
    badge: body.badge || null,
    created_at: now,
    updated_at: now,
  };

  destinations.push(newDestination);
  await saveDbDestinations(destinations);

  revalidatePath("/");
  revalidatePath("/salidas");
  revalidatePath(`/destinos/${newDestination.slug}`);

  return NextResponse.json({ ok: true, id: newDestination.id });
}

// PUT — actualizar destino por id
export async function PUT(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const idStr = req.nextUrl.searchParams.get("id");
  if (!idStr) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const id = Number(idStr);
  const body = await req.json();
  const destinations = await getDbDestinations();

  const index = destinations.findIndex((d) => d.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Destino no encontrado" }, { status: 404 });
  }

  const existing = destinations[index];
  const updated: SupabaseDestination = {
    ...existing,
    ...body,
    id: existing.id,
    updated_at: new Date().toISOString(),
  };

  destinations[index] = updated;
  await saveDbDestinations(destinations);

  revalidatePath("/");
  revalidatePath("/salidas");
  revalidatePath(`/destinos/${updated.slug}`);

  return NextResponse.json({ ok: true });
}

// DELETE — eliminar destino por id
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const idStr = req.nextUrl.searchParams.get("id");
  if (!idStr) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const id = Number(idStr);
  const destinations = await getDbDestinations();

  const target = destinations.find((d) => d.id === id);
  if (!target) {
    return NextResponse.json({ error: "Destino no encontrado" }, { status: 404 });
  }

  const filtered = destinations.filter((d) => d.id !== id);
  await saveDbDestinations(filtered);

  revalidatePath("/");
  revalidatePath("/salidas");
  if (target.slug) revalidatePath(`/destinos/${target.slug}`);

  return NextResponse.json({ ok: true });
}
