import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

// POST — crear destino
export async function POST(req: NextRequest) {

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("destinations")
    .insert(body)
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/salidas");
  revalidatePath(`/destinos/${data.slug}`);

  return NextResponse.json({ ok: true, id: data.id });
}

// PUT — actualizar destino por id
export async function PUT(req: NextRequest) {

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("destinations")
    .update(body)
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/salidas");
  revalidatePath(`/destinos/${data.slug}`);

  return NextResponse.json({ ok: true });
}

// DELETE — eliminar destino por id
export async function DELETE(req: NextRequest) {

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Obtener el slug antes de borrar para revalidar
  const { data: dest } = await supabaseAdmin
    .from("destinations")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("destinations").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/salidas");
  if (dest?.slug) revalidatePath(`/destinos/${dest.slug}`);

  return NextResponse.json({ ok: true });
}
