import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// POST /api/revalidate?secret=TU_SECRET&path=/destinos/alma-europea-2026
// Invalida el cache ISR de una ruta específica o de las páginas principales.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path");

  if (path) {
    revalidatePath(path);
  }

  // Siempre revalida las páginas que muestran listados de destinos
  revalidatePath("/");
  revalidatePath("/salidas");

  return NextResponse.json({ ok: true, revalidated: path ?? "all" });
}
