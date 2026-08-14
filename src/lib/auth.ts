import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

// Clave secreta para firmar cookies de sesión
const SECRET = process.env.NEXTAUTH_SECRET || process.env.SEED_SECRET || "grupales-travel-secret-key-2026";

/**
 * Genera un token firmado con HMAC SHA-256
 */
async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const b64Sig = Buffer.from(signature).toString("base64url");
  return `${payload}.${b64Sig}`;
}

/**
 * Verifica y valida un token firmado
 */
async function verify(token: string, secret: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const expectedSig = Buffer.from(sig, "base64url");
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    expectedSig,
    enc.encode(payload)
  );

  if (!isValid) return null;

  // Comprobar expiración
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (data.exp && Date.now() > data.exp) return null;
    return data.username || null;
  } catch {
    return null;
  }
}

/**
 * Crea una sesión de admin y la asigna a la cookie
 */
export async function createAdminSession(username: string): Promise<string> {
  const payloadData = {
    username,
    role: "admin",
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payloadData)).toString("base64url");
  return await sign(payloadB64, SECRET);
}

/**
 * Verifica si el usuario actual tiene una cookie de sesión válida
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const user = await verify(token, SECRET);
    return Boolean(user);
  } catch {
    return false;
  }
}

/**
 * Verifica el token desde una Request de Middleware o API
 */
export async function verifyAdminTokenFromRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const user = await verify(token, SECRET);
  return Boolean(user);
}

/**
 * Configuración de las cookies de sesión
 */
export const SESSION_COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  maxAge: SESSION_MAX_AGE,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function requireAuth(): Promise<NextResponse | null> {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}
