import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public/testimonios");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".webp"));

async function convert() {
  for (const file of files) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace(".webp", ".jpg"));
    await sharp(input).flatten({ background: '#ffffff' }).jpeg({ quality: 85 }).toFile(output);
    console.log(`Converted ${file} to jpg`);
  }
}

convert().catch(console.error);
