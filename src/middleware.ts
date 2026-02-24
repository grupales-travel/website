import { NextRequest, NextResponse } from "next/server";

// Protege todas las rutas que empiecen con /admin
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Deja pasar la página de login
  if (pathname === "/admin/login") return NextResponse.next();

  // Verifica la cookie de sesión
  const session = req.cookies.get("admin_session")?.value;
  if (!session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
