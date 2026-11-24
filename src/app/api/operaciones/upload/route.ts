import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getOperationsSessionUser } from "@/lib/operationsAuth";
import { uploadToR2 } from "@/lib/r2";
import { getPassengers, savePassenger } from "@/lib/operationsDb";
import { PaxDocumentCategory, PaxDocumentItem } from "@/types/operations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getOperationsSessionUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado. Inicie sesión en el Portal Operativo." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as PaxDocumentCategory) || "otro";
    const paxId = (formData.get("paxId") as string) || "";
    const customName = (formData.get("name") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No se seleccionó ningún archivo." }, { status: 400 });
    }

    // Tamaño máximo: 30MB
    const MAX_SIZE = 30 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el tamaño máximo permitido (30MB)." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const cleanPaxId = paxId ? paxId.replace(/[^a-zA-Z0-9_-]/g, "") : "general";
    const cleanCategory = category ? category.replace(/[^a-zA-Z0-9_-]/g, "") : "doc";
    const fileName = customName || file.name;
    const storagePath = `operaciones/documentos/${cleanPaxId}/${cleanCategory}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicUrl = await uploadToR2(buffer, storagePath, file.type || "application/octet-stream");

    // Si se especificó un pasajero existente, asociar el documento de inmediato en la base de datos
    let updatedPassenger = null;
    if (paxId) {
      const allPassengers = await getPassengers();
      const pax = allPassengers.find((p) => p.id === paxId);

      if (pax) {
        const docItem: PaxDocumentItem = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: fileName,
          category: category,
          url: publicUrl,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.name,
        };

        const existingDocs = pax.documents || [];
        pax.documents = [docItem, ...existingDocs];

        if (category === "dni") {
          pax.docDniUrl = publicUrl;
        } else if (category === "pasaporte") {
          pax.docPassportUrl = publicUrl;
        } else if (category === "visa") {
          pax.docVisaUrl = publicUrl;
          pax.hasUsaVisa = true;
        } else if (category === "vacuna") {
          pax.docVaccineUrl = publicUrl;
          pax.hasYellowFever = true;
        }

        // Si ya tiene DNI o Pasaporte cargado y no está vencido, marcar docs como completo
        if (pax.docsStatus === "incompleto" && (pax.docPassportUrl || pax.docDniUrl)) {
          pax.docsStatus = "completo";
        }

        updatedPassenger = await savePassenger(pax);

        revalidatePath("/operaciones");
        revalidatePath("/operaciones/salidas");
        revalidatePath("/operaciones/pasajeros");
        revalidatePath(`/operaciones/salidas/${pax.departureId}`);
      }
    }

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      storagePath,
      name: fileName,
      category,
      size: file.size,
      passenger: updatedPassenger,
    });
  } catch (err: any) {
    console.error("Error al subir documento operativo:", err);
    return NextResponse.json(
      { error: err?.message || "Error al subir el archivo a la nube." },
      { status: 500 }
    );
  }
}

