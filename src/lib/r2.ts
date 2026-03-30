import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET!;
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

export function getPublicUrl(storagePath: string): string {
  return `${PUBLIC_URL}/${storagePath}`;
}

// Comprime imágenes antes de subir. PDFs y videos pasan sin cambios.
async function compressImage(buffer: Buffer, contentType: string): Promise<Buffer> {
  if (!contentType.startsWith("image/")) return buffer;

  const image = sharp(buffer).rotate(); // .rotate() respeta el EXIF de orientación

  if (contentType === "image/jpeg" || contentType === "image/jpg") {
    return image.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  }
  if (contentType === "image/png") {
    return image.png({ compressionLevel: 9 }).toBuffer();
  }
  if (contentType === "image/webp") {
    return image.webp({ quality: 85 }).toBuffer();
  }

  // Para otros formatos, comprimir como JPEG (máxima compatibilidad)
  return image.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
}

export async function uploadToR2(
  buffer: Buffer,
  storagePath: string,
  contentType: string
): Promise<string> {
  const compressed = await compressImage(buffer, contentType);

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: storagePath,
      Body: compressed,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return getPublicUrl(storagePath);
}

export async function deleteFromR2(storagePath: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: storagePath,
    })
  );
}
