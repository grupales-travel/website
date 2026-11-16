import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { OperatorUser } from "@/types/operations";

export const OPERATIONS_COOKIE_NAME = "operaciones_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

const SECRET = process.env.NEXTAUTH_SECRET || process.env.SEED_SECRET || "grupales-operaciones-secret-2026-secure-key";

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
 * Verifica y valida un token firmado, devolviendo el usuario
 */
async function verify(token: string, secret: string): Promise<OperatorUser | null> {
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

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (data.exp && Date.now() > data.exp) return null;
    return (data.user as OperatorUser) || null;
  } catch {
    return null;
  }
}

/**
 * Crea una sesión de operaciones firmada y la guarda en cookies
 */
export async function createOperationsSession(user: OperatorUser): Promise<string> {
  // Eliminamos datos sensibles como passwordHash antes de guardar en sesión
  const safeUser: OperatorUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    city: user.city,
    active: user.active,
    createdAt: user.createdAt,
  };

  const payloadData = {
    user: safeUser,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payloadData)).toString("base64url");
  const token = await sign(payloadB64, SECRET);

  const cookieStore = await cookies();
  cookieStore.set(OPERATIONS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return token;
}

/**
 * Verifica la sesión de operaciones desde un Server Component o Server Action
 */
export async function getOperationsSessionUser(): Promise<OperatorUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(OPERATIONS_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verify(token, SECRET);
  } catch {
    return null;
  }
}

/**
 * Verifica el token desde una Request de Middleware o API Route
 */
export async function verifyOperationsTokenFromRequest(req: NextRequest): Promise<OperatorUser | null> {
  const token = req.cookies.get(OPERATIONS_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verify(token, SECRET);
}

/**
 * Cierra la sesión
 */
export async function clearOperationsSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(OPERATIONS_COOKIE_NAME);
  } catch (err) {
    console.error("Error eliminando sesión de operaciones:", err);
  }
}

