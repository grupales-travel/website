// Script de migración: Supabase Storage → Cloudflare R2
// Ejecutar con: node migrate-to-r2.mjs

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

// ── Cargar .env.local ────────────────────────────────────────────────────────
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const eqIdx = line.indexOf("=");
  if (eqIdx === -1 || line.trim().startsWith("#")) continue;
  const key = line.slice(0, eqIdx).trim();
  const val = line.slice(eqIdx + 1).trim();
  if (key) process.env[key] = val;
}

// ── Clientes ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET = process.env.R2_BUCKET;

// ── Compresión ────────────────────────────────────────────────────────────────
async function compressImage(buffer, contentType) {
  if (!contentType?.startsWith("image/")) return buffer;

  const image = sharp(buffer).rotate();

  if (contentType === "image/jpeg" || contentType === "image/jpg") {
    return image.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  }
  if (contentType === "image/png") {
    return image.png({ compressionLevel: 9 }).toBuffer();
  }
  if (contentType === "image/webp") {
    return image.webp({ quality: 85 }).toBuffer();
  }

  return image.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
}

// ── Listar archivos recursivamente ────────────────────────────────────────────
async function listAllFiles(bucket, prefix = "") {
  const files = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 100, offset });

    if (error) throw new Error(`Error listando ${bucket}/${prefix}: ${error.message}`);
    if (!data || data.length === 0) break;

    for (const item of data) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        // Es una carpeta, listar recursivamente
        const subFiles = await listAllFiles(bucket, fullPath);
        files.push(...subFiles);
      } else {
        files.push({ path: fullPath, contentType: item.metadata?.mimetype });
      }
    }

    if (data.length < 100) break;
    offset += 100;
  }

  return files;
}

// ── Migrar un archivo ─────────────────────────────────────────────────────────
async function migrateFile(bucket, filePath, contentType) {
  // Descargar de Supabase
  const { data, error } = await supabase.storage.from(bucket).download(filePath);
  if (error) {
    console.error(`  ✗ Error descargando ${filePath}: ${error.message}`);
    return { ok: false, saved: 0 };
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  const mime = contentType || data.type || "application/octet-stream";

  // Comprimir
  const compressed = await compressImage(buffer, mime);

  const originalKB = (buffer.length / 1024).toFixed(0);
  const compressedKB = (compressed.length / 1024).toFixed(0);
  const savedKB = buffer.length - compressed.length;

  // Subir a R2
  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: filePath,
    Body: compressed,
    ContentType: mime,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  console.log(`  ✓ ${filePath}  (${originalKB}KB → ${compressedKB}KB)`);
  return { ok: true, saved: savedKB };
}

// ── Migrar un bucket completo ─────────────────────────────────────────────────
async function migrateBucket(bucket) {
  console.log(`\n📦 Bucket: ${bucket}`);

  const files = await listAllFiles(bucket);
  console.log(`   ${files.length} archivo(s) encontrado(s)\n`);

  if (files.length === 0) return;

  let ok = 0, fail = 0, totalSavedKB = 0;

  for (const file of files) {
    const result = await migrateFile(bucket, file.path, file.contentType);
    if (result.ok) { ok++; totalSavedKB += result.saved / 1024; }
    else fail++;
  }

  console.log(`\n   Resultado: ✓ ${ok} migrados, ✗ ${fail} errores`);
  console.log(`   Espacio ahorrado: ~${totalSavedKB.toFixed(1)} MB`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("🚀 Migración Supabase Storage → Cloudflare R2\n");
console.log(`   Destino: ${R2_BUCKET}`);

await migrateBucket("hero-images");
await migrateBucket("destinations");

console.log("\n✅ Migración completa. Las imágenes ya están en R2.");
console.log("   Podés eliminar los archivos de Supabase Storage cuando quieras.");
