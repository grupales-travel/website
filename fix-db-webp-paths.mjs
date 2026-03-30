// Script: actualiza rutas .webp → .jpg en la DB para archivos que fueron convertidos en R2
// Verifica primero qué archivos existen realmente en R2 antes de cambiar la DB
// Ejecutar con: node fix-db-webp-paths.mjs

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { S3Client, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

// ── Cargar .env.local ────────────────────────────────────────────────────────
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const eq = line.indexOf("=");
  if (eq === -1 || line.trim().startsWith("#")) continue;
  process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
}

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

const BUCKET = process.env.R2_BUCKET;

// Listar todos los archivos en R2
async function listAllR2Files() {
  const files = new Set();
  let token;
  do {
    const res = await r2.send(new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }));
    for (const f of (res.Contents ?? [])) files.add(f.Key);
    token = res.NextContinuationToken;
  } while (token);
  return files;
}

// Si el path es .webp y en R2 existe .jpg (y no el .webp), devuelve el .jpg
function resolveCorrectPath(path, r2Files) {
  if (!path) return path;
  if (!path.toLowerCase().endsWith(".webp")) return path;
  const jpgPath = path.replace(/\.webp$/i, ".jpg");
  if (!r2Files.has(path) && r2Files.has(jpgPath)) return jpgPath;
  return path; // .webp todavía existe, no cambiar
}

console.log("🔧 Verificando y actualizando rutas .webp → .jpg en la base de datos\n");

const r2Files = await listAllR2Files();
console.log(`   ${r2Files.size} archivos encontrados en R2\n`);

// ── Tabla destinations ───────────────────────────────────────────────────────
const { data: destinations, error } = await supabase
  .from("destinations")
  .select("id, hero_path, cover_path, map_path");

if (error) { console.error("Error:", error.message); process.exit(1); }

let updated = 0;
for (const dest of destinations) {
  const newHero  = resolveCorrectPath(dest.hero_path, r2Files);
  const newCover = resolveCorrectPath(dest.cover_path, r2Files);
  const newMap   = resolveCorrectPath(dest.map_path, r2Files);

  const changed = newHero !== dest.hero_path || newCover !== dest.cover_path || newMap !== dest.map_path;
  if (!changed) continue;

  const { error: updateError } = await supabase
    .from("destinations")
    .update({ hero_path: newHero, cover_path: newCover, map_path: newMap })
    .eq("id", dest.id);

  if (updateError) {
    console.error(`  ✗ Destino ${dest.id}:`, updateError.message);
  } else {
    if (newHero  !== dest.hero_path)  console.log(`  ✓ Destino ${dest.id} hero:  ${dest.hero_path} → ${newHero}`);
    if (newCover !== dest.cover_path) console.log(`  ✓ Destino ${dest.id} cover: ${dest.cover_path} → ${newCover}`);
    updated++;
  }
}

// ── Tabla hero_images ────────────────────────────────────────────────────────
const { data: heroImages, error: heroError } = await supabase
  .from("hero_images")
  .select("id, storage_path");

if (heroError) { console.error("Error:", heroError.message); process.exit(1); }

let updatedHero = 0;
for (const img of heroImages) {
  const newPath = resolveCorrectPath(img.storage_path, r2Files);
  if (newPath === img.storage_path) continue;

  const { error: updateError } = await supabase
    .from("hero_images")
    .update({ storage_path: newPath })
    .eq("id", img.id);

  if (updateError) {
    console.error(`  ✗ Hero ${img.id}:`, updateError.message);
  } else {
    console.log(`  ✓ Hero ${img.id}: ${img.storage_path} → ${newPath}`);
    updatedHero++;
  }
}

console.log(`\n   ${updated} destinos actualizados`);
console.log(`   ${updatedHero} hero images actualizadas`);
console.log("\n✅ Listo. Ejecutá el deploy en Vercel.");
