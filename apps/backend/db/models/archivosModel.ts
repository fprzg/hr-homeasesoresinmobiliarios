import { db } from '@/db/client'; // tu conexión de drizzle
import { archivos } from '@/db/schemas'; // el schema que mostraste
import { eq } from 'drizzle-orm';

export class ArchivosModel {
    static async crear(data: {
        id: string;
        inmuebleId: string;
        handle: string;
        handleServer: 's3' | 'local';
        estado?: 'recibido' | 'en_uso';
    }) {
        await db.insert(archivos).values({
            id: data.id,
            inmuebleId: data.inmuebleId,
            handle: data.handle,
            handleServer: data.handleServer,
            estado: data.estado || 'recibido',
        });
    }

    static async findById(id: string) {
        const result = await db
            .select()
            .from(archivos)
            .where(eq(archivos.id, id))
            .limit(1);

        return result[0] || null;
    }

    static async actualizarEstado(id: string, estado: 'recibido' | 'en_uso') {
        await db
            .update(archivos)
            .set({ estado })
            .where(eq(archivos.id, id));
    }

    static async eliminar(id: string) {
        await db
            .delete(archivos)
            .where(eq(archivos.id, id));
    }
}
