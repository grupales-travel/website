import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAuthorized(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === process.env.NEXTAUTH_SECRET;
}

// POST /api/admin-upload
// FormData: file, folder (backgrounds|portadas|maps|pdfs|videos), slug
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const fd     = await req.formData();
  const file   = fd.get("file") as File | null;
  const folder = (fd.get("folder") as string) || "misc";
  const slug   = (fd.get("slug")   as string) || `file-${Date.now()}`;

  if (!file) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });

  const ext         = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const storagePath = `${folder}/${slug}.${ext}`;
  const buffer      = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("destinations")
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const publicUrl = supabaseAdmin.storage
    .from("destinations")
    .getPublicUrl(storagePath).data.publicUrl;

  return NextResponse.json({ ok: true, storage_path: storagePath, publicUrl });
}
