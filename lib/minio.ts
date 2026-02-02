import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "us-east-1", // required, any value is fine
  endpoint: "https://minio.vayams.in", // ✅ PUBLIC DOMAIN
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // ✅ REQUIRED FOR MINIO
});
