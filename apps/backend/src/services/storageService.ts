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
import { sql, isNull, eq } from 'drizzle-orm';

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
  constructor({ rutinaPurga = false }: { rutinaPurga?: boolean } = {}) {
    const environment = "dev";
    const intervaloMs = environment === "dev" ? 120_000 : 7 * 24 * 60 * 60 * 1000; // 1 min en dev, 7 días en prod

    if (rutinaPurga) {
      setInterval(async () => {
        await this.purgar();
      }, intervaloMs);
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

  private async purgar(): Promise<void> {
    try {

      logger.info("comenzando purga de storageService...");
      const archivos = await db
        .select()
        .from(schemas.pendienteEliminar)
        ;

      const rutinasEliminacion = archivos.map(async (archivo) => {
        const s3File: S3File = s3Storage.file(archivo.id);
        await s3File.delete();
        await db
          .delete(schemas.pendienteEliminar)
          .where(eq(schemas.pendienteEliminar.id, archivo.id))
          ;

        logger.info("archivo eliminado", { "id": archivo.id });
      })

      await Promise.all(rutinasEliminacion);

      const totalMilliseconds = 10 * 1000;
      const cutoffDate = new Date();
      cutoffDate.setTime(cutoffDate.getTime() - totalMilliseconds);

      const archivosHuerfanos = await db
        .select({ id: schemas.archivos.id })
        .from(schemas.archivos)
        .where(sql`${schemas.archivos.createdAt} < ${cutoffDate.toISOString()} AND ${isNull(schemas.archivos.inmuebleId)}`)

      const eliminacionHuerfanos = archivosHuerfanos.map(async (archivo) => {
        const s3File: S3File = s3Storage.file(archivo.id);
        await s3File.delete();
        await db
          .delete(schemas.archivos)
          .where(eq(schemas.archivos.id, archivo.id))
          ;

        logger.info("archivo eliminado", { "id": archivo.id });
      })

      logger.info("purga de storageService finalizada");

    } catch (unkErr) {
      logger.error("error al ejecutar rutinaS3Purge", normalizeError(unkErr));
    }
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

export const storageService: StorageService = new StorageServiceS3({ rutinaPurga: true });