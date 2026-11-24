import { NextResponse } from "next/server";
import { clearOperationsSession, OPERATIONS_COOKIE_NAME } from "@/lib/operationsAuth";

export async function POST() {
  await clearOperationsSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(OPERATIONS_COOKIE_NAME);
  return res;
}

