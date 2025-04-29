import { nanoid } from 'nanoid';
import { mkdirSync, existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { fileTypeFromBuffer } from 'file-type';

const UPLOAD_DIR = '../../media/uploads'; // ajustado a ruta relativa al runtime
mkdirSync(UPLOAD_DIR, { recursive: true });

async function save(file: File) {
  const id = `file_${nanoid()}`;
  const buffer = await file.arrayBuffer();
  const filePath = join(UPLOAD_DIR, id);

  await Bun.write(filePath, buffer);

  return {
    id,
    filename: file.name,
    mimetype: file.type,
    size: file.size,
  };
}

async function get(id: string) {
  const filePath = join(UPLOAD_DIR, id);
  if (!existsSync(filePath)) return null;

  const file = Bun.file(filePath)
  const buffer = await file.arrayBuffer()

  return {
    id,
    buffer,
    mimetype: file?.type || 'application/octet-stream',
    size: file.size,
  };
}

async function delete_(id: string) {
  const filePath = join(UPLOAD_DIR, id);
  const file = Bun.file(filePath);
  if (await file.exists()) {
    await file.delete()
  }
  return false;
}

export const ArchivosService = { save, get, delete: delete_ };
