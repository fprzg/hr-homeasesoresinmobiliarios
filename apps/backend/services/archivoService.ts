import { ArchivosModel } from "@/db/models/archivosModel";
import { saveToS3, deleteFromS3, getFromS3 } from "@/lib/s3";
import { saveLocalFile, deleteLocalFile, getLocalFile } from "@/lib/local";
import { nanoid } from "nanoid";
import { type BodyInit } from "bun";

export class ArchivoService {
  static async guardarArchivo(file: File, inmuebleId: string, server: 's3' | 'local') {
    const id = nanoid();
    const handle = `${id}-${file.name}`;

    if (server === 's3') {
      await saveToS3(handle, file);
    } else {
      await saveLocalFile(handle, file);
    }

    await ArchivosModel.crear({
      id,
      inmuebleId,
      handle,
      handleServer: server,
      estado: 'recibido',
    });

    return id;
  }

  static async obtenerArchivo(id: string): Promise<{ body: BodyInit, contentType: string }> {
    const archivo = await ArchivosModel.findById(id);
    if (!archivo) {
      throw new Error('Archivo no encontrado');
    }

    const mime = ArchivoService.getMimeType(archivo.handle);

    if (archivo.handleServer === 's3') {
      const s3File = await getFromS3(archivo.handle);
      if (!s3File) throw new Error('Archivo en S3 no encontrado');
      return { body: s3File, contentType: mime };
    } else {
      const localFile = await getLocalFile(archivo.handle);
      if (!localFile) throw new Error('Archivo local no encontrado');
      return { body: localFile, contentType: mime };
    }
  }

  private static getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream'; // fallback
    }
  }

  static async actualizarEstado(id: string, estado: 'en_uso' | 'recibido') {
    await ArchivosModel.actualizarEstado(id, estado);
  }

  static async eliminarArchivo(id: string) {
    const archivo = await ArchivosModel.findById(id);
    if (!archivo) {
      throw new Error('Archivo no encontrado');
    }

    if (archivo.handleServer === 's3') {
      await deleteFromS3(archivo.handle);
    } else {
      await deleteLocalFile(archivo.handle);
    }

    await ArchivosModel.eliminar(id);
  }
}
