/*import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "tu-region" });
const bucketName = "tu-bucket";

export async function saveToS3(handle: string, file: File) {
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: handle,
    Body: await file.arrayBuffer(),
    ContentType: file.type
  }));
}

export async function getFromS3(handle: string) {
  const res = await s3.send(new GetObjectCommand({
    Bucket: bucketName,
    Key: handle
  }));
  return res.Body as ReadableStream;
}

export async function deleteFromS3(handle: string) {
  await s3.send(new DeleteObjectCommand({
    Bucket: bucketName,
    Key: handle
  }));
}
*/

export async function saveToS3(handle: string, file: File) {
}

export async function getFromS3(handle: string) {
  return null
}

export async function deleteFromS3(handle: string) {
}