import { NextRequest, NextResponse } from "next/server";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import { assignRoomPair, unpairRoom } from "@/lib/operationsDb";

export async function POST(req: NextRequest) {
  try {
    const user = await getOperationsSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: "Sesión no válida o expirada. Por favor vuelva a iniciar sesión." }, { status: 401 });
    }

    const { action, pax1Id, pax2Id, roomNumber, paxId } = await req.json();

    if (action === "pair") {
      if (!pax1Id || !pax2Id) {
        return NextResponse.json(
          { error: "Se requieren dos pasajeros para emparejar la habitación" },
          { status: 400 }
        );
      }
      const room = roomNumber || "Habitación Compartida";
      const ok = await assignRoomPair(pax1Id, pax2Id, room);
      return NextResponse.json({ ok });
    }

    if (action === "unpair") {
      if (!paxId) {
        return NextResponse.json({ error: "ID de pasajero no proporcionado" }, { status: 400 });
      }
      const ok = await unpairRoom(paxId);
      return NextResponse.json({ ok });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  } catch (error) {
    console.error("Error en rooming API:", error);
    return NextResponse.json({ error: "Error al gestionar rooming" }, { status: 500 });
  }
}

