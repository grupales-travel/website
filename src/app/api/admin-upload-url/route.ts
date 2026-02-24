import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAuth } from "@/lib/supabase-server";

// POST /api/admin-upload-url
// Body: { folder, slug, ext }
// Returns a signed URL to upload directly from the browser to Supabase Storage.
// This bypasses Next.js body size limits completely.
export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { folder, slug, ext } = await req.json();
  if (!folder || !slug || !ext) {
    return NextResponse.json({ error: "Faltan parámetros: folder, slug, ext" }, { status: 400 });
  }

  const storagePath = `${folder}/${slug}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from("destinations")
    .createSignedUploadUrl(storagePath);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const publicUrl = supabaseAdmin.storage
    .from("destinations")
    .getPublicUrl(storagePath).data.publicUrl;

  // Devolvemos el token (para uploadToSignedUrl) y la signedUrl (para PUT directo)
  return NextResponse.json({ token: data.token, signedUrl: data.signedUrl, storagePath, publicUrl });
}
