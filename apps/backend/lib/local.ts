import { writeFile, unlink, readFile } from "node:fs/promises";
import { join } from "node:path";

//const uploadDir = process.env.LOCAL_STORAGE_DIR || "./"
const uploadDir = "../../media/uploads/"

export async function saveLocalFile(handle: string, file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, handle), buffer);
}

export async function getLocalFile(handle: string) {
  return await readFile(join(uploadDir, handle));
}

export async function deleteLocalFile(handle: string) {
  await unlink(join(uploadDir, handle));
}
