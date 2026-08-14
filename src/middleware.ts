import { NextRequest, NextResponse } from "next/server";
import { verifyAdminTokenFromRequest } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir la ruta de login
  if (pathname === "/admin/login") return NextResponse.next();

  const isAuthed = await verifyAdminTokenFromRequest(req);

  if (!isAuthed) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
