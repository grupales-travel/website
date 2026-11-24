import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import { deleteDeparture, getDepartures, saveDeparture } from "@/lib/operationsDb";
import { DepartureGroup } from "@/types/operations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const departures = await getDepartures();
    return NextResponse.json(departures);
  } catch (error) {
    console.error("Error al obtener salidas:", error);
    return NextResponse.json({ error: "Error al cargar salidas grupales" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOperationsSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: "Sesión no válida o expirada. Por favor vuelva a iniciar sesión." }, { status: 401 });
    }

    const body = (await req.json()) as DepartureGroup;
    if (!body.title || !body.departureDate) {
      return NextResponse.json({ error: "Título y fecha de salida son obligatorios." }, { status: 400 });
    }

    // Asegurar ID único
    if (!body.id) {
      body.id = `dep-${Date.now()}`;
    }

    const saved = await saveDeparture(body);

    revalidatePath("/operaciones");
    revalidatePath("/operaciones/salidas");
    revalidatePath(`/operaciones/salidas/${saved.id}`);
    revalidatePath("/operaciones/pasajeros");
    revalidatePath("/operaciones/rooming");
    revalidatePath("/operaciones/aereos");
    revalidatePath("/operaciones/logistica");

    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("Error al guardar salida:", error);
    return NextResponse.json({ error: error?.message || "Error al guardar la salida grupal" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getOperationsSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (user.role !== "admin" && user.role !== "operaciones") {
      return NextResponse.json({ error: "Permiso insuficiente para eliminar salidas" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
    }

    const ok = await deleteDeparture(id);

    revalidatePath("/operaciones");
    revalidatePath("/operaciones/salidas");
    revalidatePath("/operaciones/pasajeros");
    revalidatePath("/operaciones/rooming");
    revalidatePath("/operaciones/aereos");
    revalidatePath("/operaciones/logistica");

    return NextResponse.json({ ok });
  } catch (error) {
    console.error("Error al eliminar salida:", error);
    return NextResponse.json({ error: "Error al eliminar salida grupal" }, { status: 500 });
  }
}

