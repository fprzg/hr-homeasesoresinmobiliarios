import { nanoid } from 'nanoid';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { envSchema } from '@/zod/env';


export const ArchivosServiceFactory = (env: unknown) => {
  const parsedEnv = envSchema.parse(env);
  const uploadsDir = parsedEnv.UPLOADS_DIR;

  mkdirSync(uploadsDir, { recursive: true });

  const guardar = async (file: File) => {
    const id = `file_${nanoid()}`;
    const buffer = await file.arrayBuffer();
    const filePath = join(uploadsDir, id);

    await Bun.write(filePath, buffer);

    return {
      id,
      filename: file.name,
      mimetype: file.type,
      size: file.size,
    };
  }

  const leer = async (id: string) => {
    const filePath = join(uploadsDir, id);
    if (!existsSync(filePath)) return null;

    const file = Bun.file(filePath)
    const buffer = await file.arrayBuffer()

    return {
      buffer,
      size: file.size,
    };
  }

  const eliminar = async (id: string) => {
    const filePath = join(uploadsDir, id);
    const file = Bun.file(filePath);
    if (await file.exists()) {
      await file.delete()
    }
    return false;
  }

  return { guardar, leer, eliminar };
}