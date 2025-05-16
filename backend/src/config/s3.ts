// config/s3.ts
import AWS from "aws-sdk";
import {nanoid} from 'nanoid';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const generateURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getDate()}.jpeg`
  
    return await s3.getSignedUrlPromise('putObject', {
      Bucket: "creativee-ai",
      Key: imageName,
      Expires: 1000,
      ContentType: "image/jpeg"
    })
  }