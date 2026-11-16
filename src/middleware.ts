import { NextRequest, NextResponse } from "next/server";
import { verifyAdminTokenFromRequest } from "@/lib/auth";
import { verifyOperationsTokenFromRequest } from "@/lib/operationsAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Control de acceso para Portal Operativo (/operaciones)
  if (pathname.startsWith("/operaciones")) {
    if (pathname === "/operaciones/login") {
      return NextResponse.next();
    }

    const isOperatorAuthed = await verifyOperationsTokenFromRequest(req);
    if (!isOperatorAuthed) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/operaciones/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Control de acceso para Panel Admin Web (/admin)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const isAuthed = await verifyAdminTokenFromRequest(req);
    if (!isAuthed) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/operaciones/:path*"],
};
