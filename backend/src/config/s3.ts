// config/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {nanoid} from 'nanoid';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const generateURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getDate()}.jpeg`
  
    const command = new PutObjectCommand({
      Bucket: "creativee-ai",
      Key: imageName,
      ContentType: "image/jpeg"
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 1000 });
  }