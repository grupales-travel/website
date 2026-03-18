import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const SUPABASE_URL = "https://osbogszltteyokksbshk.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zYm9nc3psdHRleW9ra3Nic2hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM5MTA0NCwiZXhwIjoyMDg2OTY3MDQ0fQ.efyidfUCQGKoUziVZTCgsMk_6-ifACf5HqIESKWS_-Y";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BUCKET = "destinations";
const BASE = resolve("../"); // one level up from website/

const FILES = [
  {
    local: resolve(BASE, "portada new york & miami.webp"),
    remote: "portadas/new-york-miami-2026.webp",
    mime: "image/webp",
  },
  {
    local: resolve(BASE, "background new york & miami.webp"),
    remote: "backgrounds/new-york-miami-2026.webp",
    mime: "image/webp",
  },
  {
    local: resolve(BASE, "mapa new york & miami.png"),
    remote: "mapas/new-york-miami-2026.png",
    mime: "image/png",
  },
  {
    local: resolve(BASE, "New-York-Miami-2026-Papel.pdf"),
    remote: "itinerarios/new-york-miami-2026.pdf",
    mime: "application/pdf",
  },
];

async function main() {
  // Ensure bucket exists
  const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ["image/*", "application/pdf"],
  });
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    console.error("Failed to create bucket:", bucketErr.message);
    process.exit(1);
  } else {
    console.log(`Bucket "${BUCKET}" ready.\n`);
  }

  for (const f of FILES) {
    console.log(`Uploading ${f.remote} ...`);
    const buffer = readFileSync(f.local);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(f.remote, buffer, {
        contentType: f.mime,
        upsert: true,
      });

    if (error) {
      console.error(`  ERROR: ${error.message}`);
    } else {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(f.remote);
      console.log(`  OK → ${data.publicUrl}`);
    }
  }
  console.log("\nDone.");
}

main();
