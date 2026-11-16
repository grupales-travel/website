import { NextRequest, NextResponse } from "next/server";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import { deleteDeparture, getDepartures, saveDeparture } from "@/lib/operationsDb";
import { DepartureGroup } from "@/types/operations";

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
    const user = await getOperationsSessionUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = (await req.json()) as DepartureGroup;
    if (!body.title || !body.departureDate) {
      return NextResponse.json({ error: "Título y fecha de salida son obligatorios" }, { status: 400 });
    }

    const saved = await saveDeparture(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Error al guardar salida:", error);
    return NextResponse.json({ error: "Error al guardar la salida grupal" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getOperationsSessionUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Solo administradores pueden eliminar salidas" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
    }

    const ok = await deleteDeparture(id);
    return NextResponse.json({ ok });
  } catch (error) {
    console.error("Error al eliminar salida:", error);
    return NextResponse.json({ error: "Error al eliminar salida grupal" }, { status: 500 });
  }
}

