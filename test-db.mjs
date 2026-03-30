import fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf-8");
const env = Object.fromEntries(
  envStr.split("\n").filter(line => line.includes("=")).map(line => {
    const [key, ...rest] = line.split("=");
    return [key.trim(), rest.join("=").trim().replace(/^"|"$/g, "")];
  })
);

fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/destinations?select=title,hero_path,cover_path,slug&active=eq.true`, {
  headers: {
    apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  }
}).then(r => r.json())
  .then(data => {
    data.forEach(d => {
      console.log(d.title);
      console.log("  Hero:", d.hero_path);
      console.log("  Thumb:", d.cover_path);
    });
  }).catch(console.error);
