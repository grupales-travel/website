import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/admin-setup-storage
// Visitar una vez para configurar los buckets de Storage correctamente.
export async function GET(req: NextRequest) {

  const ALLOWED_MIME = [
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/quicktime", "video/webm", "video/mov",
    "application/pdf",
  ];

  const [dest, hero] = await Promise.all([
    supabaseAdmin.storage.updateBucket("destinations", {
      public: true,
      allowedMimeTypes: ALLOWED_MIME,
      fileSizeLimit: 52428800, // 50 MB (máximo del plan gratuito de Supabase)
    }),
    supabaseAdmin.storage.updateBucket("hero-images", {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
      fileSizeLimit: 10485760, // 10 MB
    }),
  ]);

  if (dest.error || hero.error) {
    return NextResponse.json({
      destinations: dest.error?.message ?? "ok",
      "hero-images": hero.error?.message ?? "ok",
    }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Buckets configurados correctamente. Ya podés subir videos.",
    destinations: { allowedMimeTypes: ALLOWED_MIME, fileSizeLimit: "500MB" },
  });
}
