import { S3Client, PutObjectCommand, DeleteObjectCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

// Genera una URL firmada para que el browser suba directamente a R2 (sin pasar por Next.js)
export async function getPresignedUploadUrl(
  storagePath: string,
  contentType: string
): Promise<{ presignedUrl: string; publicUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: storagePath,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
  return { presignedUrl, publicUrl: getPublicUrl(storagePath) };
}

// Configura CORS en el bucket para permitir uploads directos desde el browser
export async function configureCors(): Promise<void> {
  await r2.send(
    new PutBucketCorsCommand({
      Bucket: BUCKET,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ["*"],
            AllowedMethods: ["GET", "PUT"],
            AllowedHeaders: ["Content-Type", "Cache-Control"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  );
}
