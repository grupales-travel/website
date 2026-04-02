import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase-server";
import { uploadToR2, getPresignedUploadUrl } from "@/lib/r2";

// POST /api/admin-upload-url
// FormData: file (opcional para PDFs/videos), folder, slug, contentType
//
// - Imágenes: se suben por el servidor con compresión
// - PDFs y videos: se devuelve una presigned URL para subir directo desde el browser
export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const fd          = await req.formData();
  const folder      = (fd.get("folder") as string) || "misc";
  const slug        = (fd.get("slug")   as string) || `file-${Date.now()}`;
  const contentType = (fd.get("contentType") as string) || "";
  const file        = fd.get("file") as File | null;

  // PDFs y videos → presigned URL (el browser sube directo a R2)
  const isPdfOrVideo =
    contentType.startsWith("video/") ||
    contentType === "application/pdf" ||
    !file;

  if (isPdfOrVideo || !file) {
    const ext = (fd.get("ext") as string) || contentType.split("/").pop() || "bin";
    const storagePath = `${folder}/${slug}.${ext}`;
    const { presignedUrl, publicUrl } = await getPresignedUploadUrl(storagePath, contentType || "application/octet-stream");
    return NextResponse.json({ ok: true, presignedUrl, storagePath, publicUrl });
  }

  // Imágenes → subir por servidor con compresión
  const ext         = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const storagePath = `${folder}/${slug}.${ext}`;
  const buffer      = Buffer.from(await file.arrayBuffer());

  try {
    const publicUrl = await uploadToR2(buffer, storagePath, file.type);
    return NextResponse.json({ ok: true, storagePath, publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al subir archivo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
