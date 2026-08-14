import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadToR2, deleteFromR2, getPublicUrl } from "@/lib/r2";
import { getDbHeroImages, saveDbHeroImages } from "@/lib/db";

// POST — subir imagen o video nuevo
export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const alt = (formData.get("alt") as string) || "";
  const order = parseInt((formData.get("order") as string) || "0");

  let storagePath = formData.get("storagePath") as string | null;

  if (!storagePath) {
    if (!file) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const isVideo = file.type.startsWith("video/") || ["mp4", "mov", "webm", "m4v"].includes(ext);
    const folderName = isVideo ? "testimonios-home" : "portadas";
    storagePath = `${folderName}/portada-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await uploadToR2(buffer, storagePath, file.type);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al subir archivo";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const images = await getDbHeroImages();
  const maxId = images.reduce((max, img) => Math.max(max, img.id), 0);
  const newId = maxId + 1;

  const newImg = {
    id: newId,
    storage_path: storagePath,
    alt,
    order,
    active: true,
    created_at: new Date().toISOString(),
  };

  images.push(newImg);
  await saveDbHeroImages(images);

  return NextResponse.json({
    ok: true,
    image: { ...newImg, publicUrl: getPublicUrl(newImg.storage_path) },
  });
}

// PUT — editar alt / active de una imagen
export async function PUT(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const idStr = req.nextUrl.searchParams.get("id");
  if (!idStr) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  const id = Number(idStr);
  const { alt, active } = await req.json();
  const images = await getDbHeroImages();

  const index = images.findIndex((img) => img.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
  }

  if (alt !== undefined) images[index].alt = alt;
  if (active !== undefined) images[index].active = Boolean(active);

  await saveDbHeroImages(images);
  return NextResponse.json({ ok: true });
}

// PATCH — reordenar en batch: [{ id, order }, ...]
export async function PATCH(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const items: { id: number; order: number }[] = await req.json();
  const images = await getDbHeroImages();

  const map = new Map(items.map((i) => [i.id, i.order]));
  images.forEach((img) => {
    if (map.has(img.id)) {
      img.order = map.get(img.id)!;
    }
  });

  await saveDbHeroImages(images);
  return NextResponse.json({ ok: true });
}

// DELETE — eliminar imagen de R2 y de la tabla
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const idStr = req.nextUrl.searchParams.get("id");
  if (!idStr) return NextResponse.json({ error: "Falta el id" }, { status: 400 });

  const id = Number(idStr);
  const images = await getDbHeroImages();

  const target = images.find((img) => img.id === id);
  if (target?.storage_path) {
    await deleteFromR2(target.storage_path).catch(() => {});
  }

  const filtered = images.filter((img) => img.id !== id);
  await saveDbHeroImages(filtered);

  return NextResponse.json({ ok: true });
}
