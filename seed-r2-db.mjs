import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Cargar variables de entorno desde .env.local
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

// Hero images por defecto
const DEFAULT_HERO_IMAGES = [
  {
    id: 1,
    storage_path: "backgrounds/alma-europea-2026.webp",
    alt: "Alma Europea 2026",
    order: 1,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    storage_path: "backgrounds/costa-rica-2026.jpg",
    alt: "Costa Rica 2026",
    order: 2,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    storage_path: "backgrounds/de-londres-a-viena-2026.jpg",
    alt: "De Londres a Viena",
    order: 3,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    storage_path: "backgrounds/new-york-miami-2026.webp",
    alt: "New York & Miami",
    order: 4,
    active: true,
    created_at: new Date().toISOString(),
  },
];

async function seed() {
  console.log("🚀 Inicializando base de datos JSON en Cloudflare R2...");
  console.log(`   Bucket: ${BUCKET}`);

  // 1. Hero images
  const heroJson = JSON.stringify(DEFAULT_HERO_IMAGES, null, 2);
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "db/hero_images.json",
      Body: Buffer.from(heroJson, "utf-8"),
      ContentType: "application/json",
      CacheControl: "no-cache",
    })
  );
  console.log("  ✓ db/hero_images.json guardado en R2.");

  console.log("\n✅ Base de datos inicializada en Cloudflare R2.");
}

seed().catch(console.error);
