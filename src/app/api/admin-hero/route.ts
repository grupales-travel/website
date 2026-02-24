import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === process.env.NEXTAUTH_SECRET;
}

function getPublicUrl(storagePath: string) {
  return supabaseAdmin.storage.from("hero-images").getPublicUrl(storagePath).data.publicUrl;
}

// POST — subir imagen nueva
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file  = formData.get("file") as File | null;
  const alt   = (formData.get("alt") as string) || "";
  const order = parseInt((formData.get("order") as string) || "0");

  if (!file) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });

  const ext         = file.name.split(".").pop();
  const storagePath = `portadas/portada-${Date.now()}.${ext}`;
  const buffer      = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from("hero-images")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data, error: dbError } = await supabaseAdmin
    .from("hero_images")
    .insert({ storage_path: storagePath, alt, order, active: true })
    .select("id, storage_path, alt, order, active")
    .single();

  if (dbError) {
    await supabaseAdmin.storage.from("hero-images").remove([storagePath]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    image: { ...data, publicUrl: getPublicUrl(data.storage_path) },
  });
}

// PUT — editar alt / active de una imagen
export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  const { alt, active } = await req.json();
  const { error } = await supabaseAdmin
    .from("hero_images")
    .update({ alt, active })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH — reordenar en batch: [{ id, order }, ...]
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const items: { id: number; order: number }[] = await req.json();
  await Promise.all(
    items.map(({ id, order }) =>
      supabaseAdmin.from("hero_images").update({ order }).eq("id", id)
    )
  );
  return NextResponse.json({ ok: true });
}

// DELETE — eliminar imagen del bucket y de la tabla
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  const { data: img } = await supabaseAdmin
    .from("hero_images").select("storage_path").eq("id", id).single();

  if (img?.storage_path) {
    await supabaseAdmin.storage.from("hero-images").remove([img.storage_path]);
  }

  const { error } = await supabaseAdmin.from("hero_images").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
