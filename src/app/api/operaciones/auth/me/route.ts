import { NextResponse } from "next/server";
import { getOperationsSessionUser } from "@/lib/operationsAuth";

export async function GET() {
  const user = await getOperationsSessionUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}

