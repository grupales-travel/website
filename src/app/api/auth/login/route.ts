import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    const inputUser = (username || email || "").trim();
    const inputPass = (password || "").trim();

    const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || "grupales2026!").trim();

    // Aceptamos el usuario configurado (ej: "admin"), o un email tipo "admin@grupalestravel.com" o si coincide con el usuario configurado
    const isUserValid =
      inputUser === expectedUser ||
      inputUser.toLowerCase().startsWith("admin") ||
      inputUser.toLowerCase().includes("grupalestravel");

    const isPasswordValid = inputPass === expectedPass;

    if (!isUserValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const token = await createAdminSession(expectedUser);

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      ...SESSION_COOKIE_OPTIONS,
      value: token,
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
