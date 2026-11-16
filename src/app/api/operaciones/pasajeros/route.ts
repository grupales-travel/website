import { NextRequest, NextResponse } from "next/server";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import { deletePassenger, getPassengers, getPassengersByDeparture, savePassenger } from "@/lib/operationsDb";
import { PassengerPax } from "@/types/operations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const departureId = searchParams.get("departureId");

    if (departureId) {
      const passengers = await getPassengersByDeparture(departureId);
      return NextResponse.json(passengers);
    }

    const all = await getPassengers();
    return NextResponse.json(all);
  } catch (error) {
    console.error("Error al obtener pasajeros:", error);
    return NextResponse.json({ error: "Error al cargar pasajeros" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getOperationsSessionUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = (await req.json()) as PassengerPax;
    if (!body.firstName || !body.lastName || !body.departureId) {
      return NextResponse.json(
        { error: "Nombre, apellido y salida asignada son obligatorios" },
        { status: 400 }
      );
    }

    // Registrar quién cargó o modificó el pasajero
    if (!body.createdBy) {
      body.createdBy = user.name;
    }

    const saved = await savePassenger(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Error al guardar pasajero:", error);
    return NextResponse.json({ error: "Error al guardar los datos del pasajero" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getOperationsSessionUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de pasajero no proporcionado" }, { status: 400 });
    }

    const ok = await deletePassenger(id);
    return NextResponse.json({ ok });
  } catch (error) {
    console.error("Error al eliminar pasajero:", error);
    return NextResponse.json({ error: "Error al eliminar pasajero" }, { status: 500 });
  }
}

