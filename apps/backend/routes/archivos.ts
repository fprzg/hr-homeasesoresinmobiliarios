import { Hono } from "hono";
import { ArchivoService } from "@/services/archivoService";

export const archivos = new Hono()
    .get('/:id', async (c) => {
        const id = c.req.param('id');

        try {
            const { body, contentType } = await ArchivoService.obtenerArchivo(id);

            return new Response(body, {
                headers: {
                    'Content-Type': contentType,
                }
            });
        } catch (err) {
            console.error(err);
            return c.text('Archivo no encontrado', 404);
        }
    })
    .post('/', async (c) => {
        const formData = await c.req.formData();
        const file = formData.get('file') as File;
        const inmuebleId = formData.get('inmuebleId') as string;
        const server = (formData.get('server') || 's3') as 's3' | 'local';

        if (!file || !inmuebleId) {
            return c.text('Faltan datos necesarios', 400);
        }

        try {
            const id = await ArchivoService.guardarArchivo(file, inmuebleId, server);
            return c.json({ id });
        } catch (err) {
            console.error(err);
            return c.text('Error al guardar el archivo', 500);
        }
    })
    .put('/:id', async (c) => {
        const id = c.req.param('id');

        try {
            await ArchivoService.actualizarEstado(id, 'en_uso');
            return c.text('Estado actualizado a en_uso');
        } catch (err) {
            console.error(err);
            return c.text('Error al actualizar el estado', 500);
        }
    })
    .delete('/:id', async (c) => {
        const id = c.req.param('id');

        try {
            await ArchivoService.eliminarArchivo(id);
            return c.text('Archivo eliminado exitosamente');
        } catch (err) {
            console.error(err);
            return c.text('Error al eliminar archivo', 500);
        }
    })