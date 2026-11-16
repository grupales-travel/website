import { NextResponse } from "next/server";
import { clearOperationsSession } from "@/lib/operationsAuth";

export async function POST() {
  await clearOperationsSession();
  return NextResponse.json({ ok: true });
}

