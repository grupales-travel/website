import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const eqIdx = line.indexOf("=");
  if (eqIdx === -1 || line.trim().startsWith("#")) continue;
  const key = line.slice(0, eqIdx).trim();
  const val = line.slice(eqIdx + 1).trim();
  if (key) process.env[key] = val;
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

async function syncBackupToR2() {
  console.log("🚀 Subiendo datos extraídos del backup a Cloudflare R2...");

  const destsText = readFileSync("../.tmp/destinations.json", "utf-8");
  const heroText = readFileSync("../.tmp/hero_images.json", "utf-8");

  const dests = JSON.parse(destsText);
  const heroes = JSON.parse(heroText);

  console.log(`📦 Encontrados: ${dests.length} destinos y ${heroes.length} imágenes de hero.`);

  // 1. Escribir db/destinations.json
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "db/destinations.json",
      Body: Buffer.from(JSON.stringify(dests, null, 2), "utf-8"),
      ContentType: "application/json",
      CacheControl: "no-cache",
    })
  );
  console.log("  ✓ db/destinations.json actualizado exitosamente en R2.");

  // 2. Escribir db/hero_images.json
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "db/hero_images.json",
      Body: Buffer.from(JSON.stringify(heroes, null, 2), "utf-8"),
      ContentType: "application/json",
      CacheControl: "no-cache",
    })
  );
  console.log("  ✓ db/hero_images.json actualizado exitosamente en R2.");

  console.log("\n🎉 Sincronización completa con Cloudflare R2!");
}

syncBackupToR2().catch(console.error);
