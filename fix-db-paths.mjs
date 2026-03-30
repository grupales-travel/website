// Script: actualiza las rutas .png → .jpg en la base de datos Supabase
// Solo cambia texto en la DB, las imágenes ya están en R2
// Ejecutar con: node fix-db-paths.mjs

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

function pngToJpg(path) {
  if (!path) return path;
  return path.replace(/\.png$/i, ".jpg");
}

console.log("🔧 Actualizando rutas .png → .jpg en la base de datos\n");

// ── Tabla destinations ───────────────────────────────────────────────────────
const { data: destinations, error: fetchError } = await supabase
  .from("destinations")
  .select("id, hero_path, cover_path, map_path");

if (fetchError) {
  console.error("Error al leer destinations:", fetchError.message);
  process.exit(1);
}

let updatedDest = 0;
for (const dest of destinations) {
  const newHero  = pngToJpg(dest.hero_path);
  const newCover = pngToJpg(dest.cover_path);
  const newMap   = pngToJpg(dest.map_path);

  const changed =
    newHero  !== dest.hero_path  ||
    newCover !== dest.cover_path ||
    newMap   !== dest.map_path;

  if (!changed) continue;

  const { error } = await supabase
    .from("destinations")
    .update({ hero_path: newHero, cover_path: newCover, map_path: newMap })
    .eq("id", dest.id);

  if (error) {
    console.error(`  ✗ Error en destino ${dest.id}:`, error.message);
  } else {
    console.log(`  ✓ Destino ${dest.id}: rutas actualizadas`);
    updatedDest++;
  }
}

console.log(`\n   ${updatedDest} destinos actualizados`);

// ── Tabla hero_images ────────────────────────────────────────────────────────
const { data: heroImages, error: heroError } = await supabase
  .from("hero_images")
  .select("id, storage_path");

if (heroError) {
  console.error("Error al leer hero_images:", heroError.message);
  process.exit(1);
}

let updatedHero = 0;
for (const img of heroImages) {
  const newPath = pngToJpg(img.storage_path);
  if (newPath === img.storage_path) continue;

  const { error } = await supabase
    .from("hero_images")
    .update({ storage_path: newPath })
    .eq("id", img.id);

  if (error) {
    console.error(`  ✗ Error en hero_image ${img.id}:`, error.message);
  } else {
    console.log(`  ✓ Hero image ${img.id}: ${img.storage_path} → ${newPath}`);
    updatedHero++;
  }
}

console.log(`   ${updatedHero} hero images actualizadas`);
console.log("\n✅ Listo. Ahora redesplegar en Vercel para reflejar los cambios.");
