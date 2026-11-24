import { NextRequest, NextResponse } from "next/server";
import { getOperationsSessionUser } from "@/lib/operationsAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getOperationsSessionUser(req);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}

