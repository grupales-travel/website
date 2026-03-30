import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase-server";
import { uploadToR2, getPublicUrl } from "@/lib/r2";

// POST /api/admin-upload
// FormData: file, folder (backgrounds|portadas|maps|pdfs|videos), slug
export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const fd     = await req.formData();
  const file   = fd.get("file") as File | null;
  const folder = (fd.get("folder") as string) || "misc";
  const slug   = (fd.get("slug")   as string) || `file-${Date.now()}`;

  if (!file) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });

  const ext         = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const storagePath = `${folder}/${slug}.${ext}`;
  const buffer      = Buffer.from(await file.arrayBuffer());

  try {
    const publicUrl = await uploadToR2(buffer, storagePath, file.type);
    return NextResponse.json({ ok: true, storage_path: storagePath, publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al subir archivo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
