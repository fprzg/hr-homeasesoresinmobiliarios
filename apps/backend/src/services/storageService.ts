import { nanoid } from 'nanoid';
import { db, s3Storage } from '@/app';
import type { S3File } from 'bun';
import { envSchema } from '@/zod/env';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { envVariables } from '@/lib/env';
import { schemas } from '@/db/schemas';
import { logger } from '@/lib/logger';
import { normalizeError } from '@shared/types';

export interface StorageService {
  //leer(id: string): File;
  guardar(file: File): Promise<{ id: string, filename: string, mimetype: string, size: number } | undefined>;
  programarEliminacion(id: string): Promise<boolean>;
}

/*
const uploadsDir = parsedEnv.UPLOADS_DIR;
mkdirSync(uploadsDir, { recursive: true });

export class ArchivosServiceLocalFS implements ArchivosService {
  async guardar(file: File) {
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

  async leer(id: string) {
    const filePath = join(uploadsDir, id);
    if (!existsSync(filePath)) return null;

    const file = Bun.file(filePath)
    const buffer = await file.arrayBuffer()

    return {
      buffer,
      size: file.size,
    };
  }

  // TODO: marcarlos como "pendientes de eliminar"
  async eliminar(id: string) {
    const filePath = join(uploadsDir, id);
    const file = Bun.file(filePath);
    if (await file.exists()) {
      await file.delete()
    }
    return false;
  }
}
  */

export class StorageServiceS3 implements StorageService {
  async guardar(file: File) {
    const id = `file_${nanoid()}`;
    try {
      const s3File: S3File = s3Storage.file(id)
      await s3File.write(await file.arrayBuffer(), { type: file.type });

      logger.info("se guardó el archivo", { "id": id });

      return {
        id,
        filename: file.name,
        mimetype: file.type,
        size: file.size,
      };
    } catch (unkErr) {
      logger.error("error al guardar archivo", normalizeError(unkErr), { "id": id, "filename": file.name, "mimetype": file.type, "size": file.size });
      return undefined;
    }
  }

  /*
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
    */

  private async eliminar(id: string): Promise<boolean> {
    try {
      const s3File: S3File = s3Storage.file(id);
      await s3File.delete();
      return true;
    } catch (e) {
      if (e instanceof Error) {
        console.log(`error al eliminar archivo ${id}: ${e.message}`);
      }
    }
    return false;
  }

  async programarEliminacion(id: string): Promise<boolean> {
    try {
      await db
        .insert(schemas.pendienteEliminar)
        .values({
          id: id,
        })
        ;

      logger.info("se programó la eliminación del archivo", { "id": id });

      return true;
    } catch (unkErr) {
      logger.error("error al programar eliminación del archivo", normalizeError(unkErr), { id });
      return false;
    }
  }
}

export const storageService: StorageService = new StorageServiceS3();