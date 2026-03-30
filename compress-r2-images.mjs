// Script: convierte todos los PNG del bucket R2 a JPEG optimizado
// Ejecutar con: node compress-r2-images.mjs

import { readFileSync } from "fs";
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

// ── Cargar .env.local ────────────────────────────────────────────────────────
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const eq = line.indexOf("=");
  if (eq === -1 || line.trim().startsWith("#")) continue;
  process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
}

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET;

// ── Listar todos los archivos ─────────────────────────────────────────────────
async function listAll() {
  const files = [];
  let token;
  do {
    const res = await r2.send(new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }));
    for (const f of (res.Contents ?? [])) files.push(f.Key);
    token = res.NextContinuationToken;
  } while (token);
  return files;
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("🗜  Comprimiendo imágenes PNG en R2 → JPEG\n");

const files = await listAll();
const pngs = files.filter(k => k.toLowerCase().endsWith(".png"));

console.log(`   ${pngs.length} PNGs encontrados\n`);

let totalBefore = 0, totalAfter = 0;

for (const key of pngs) {
  // Descargar
  const { Body, ContentLength } = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of Body) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  totalBefore += buffer.length;

  // Convertir a JPEG quality 82 con mozjpeg
  const jpeg = await sharp(buffer).rotate().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  totalAfter += jpeg.length;

  const newKey = key.replace(/\.png$/i, ".jpg");

  // Subir JPEG
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: newKey,
    Body: jpeg,
    ContentType: "image/jpeg",
    CacheControl: "public, max-age=31536000, immutable",
  }));

  // Borrar PNG original
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

  const before = (buffer.length / 1024).toFixed(0);
  const after = (jpeg.length / 1024).toFixed(0);
  console.log(`  ✓ ${key.split("/").pop()}  →  ${newKey.split("/").pop()}  (${before}KB → ${after}KB)`);
}

console.log(`\n📊 Resumen:`);
console.log(`   Antes:   ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
console.log(`   Después: ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
console.log(`   Ahorro:  ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%`);
console.log("\n✅ Listo.");
