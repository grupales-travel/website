// Script: recomprime las imágenes WebP pesadas del carrusel hero
// Ejecutar con: node compress-hero-images.mjs

import { readFileSync } from "fs";
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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

// Listar todos los archivos
async function listAll() {
  const files = [];
  let token;
  do {
    const res = await r2.send(new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }));
    for (const f of (res.Contents ?? [])) files.push({ key: f.Key, size: f.Size });
    token = res.NextContinuationToken;
  } while (token);
  return files;
}

console.log("🗜  Recomprimiendo imágenes WebP pesadas\n");

const files = await listAll();

// Recomprimir WebP que pesen más de 500KB
const heavyWebPs = files.filter(f => f.key.toLowerCase().endsWith(".webp") && f.size > 500 * 1024);

console.log(`   ${heavyWebPs.length} WebP pesadas encontradas (>500KB)\n`);

let totalBefore = 0, totalAfter = 0;

for (const { key, size } of heavyWebPs) {
  // Descargar
  const { Body } = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of Body) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  totalBefore += buffer.length;

  // Recomprimir como JPEG quality 82 con mozjpeg
  const jpeg = await sharp(buffer).rotate().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  totalAfter += jpeg.length;

  const newKey = key.replace(/\.webp$/i, ".jpg");

  // Subir JPEG
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: newKey,
    Body: jpeg,
    ContentType: "image/jpeg",
    CacheControl: "public, max-age=31536000, immutable",
  }));

  // Reemplazar el WebP original con el JPEG comprimido (borrar viejo, ya subimos nuevo)
  // Nota: si newKey === key no es posible (extensión diferente), así que borramos el webp
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

  console.log(`  ✓ ${key.split("/").pop()}  →  ${newKey.split("/").pop()}  (${(buffer.length/1024).toFixed(0)}KB → ${(jpeg.length/1024).toFixed(0)}KB)`);
}

console.log(`\n📊 Resumen:`);
console.log(`   Antes:   ${(totalBefore/1024/1024).toFixed(1)} MB`);
console.log(`   Después: ${(totalAfter/1024/1024).toFixed(1)} MB`);
console.log(`   Ahorro:  ${((1 - totalAfter/totalBefore)*100).toFixed(0)}%`);
console.log("\n✅ Listo.");
