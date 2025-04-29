import { Hono } from 'hono';
import { db } from '@/db/client';
import { archivos as archivosDBSchema, documentos as documentosDBSchema } from '@/db/schemas';
import { ArchivosService } from '@/services/archivosService';
import { eq } from 'drizzle-orm';

export const archivos = new Hono()
    .post('/', async (c) => {
        const body = await c.req.parseBody();
        const files = Object.values(body).filter(f => f instanceof File) as File[];

        const results = [];

        for (const file of files) {
            try {
                const image = await ArchivosService.save(file);
                await db.insert(archivosDBSchema).values({ ...image });
                results.push({ id: image.id, originalName: image.filename });
            } catch (err) {
                console.error(err);
            }
        }

        return c.json({ imagenes: results });
    })
    .get('/:id', async (c) => {
        const id = c.req.param('id');
        const doc = await db.query.archivos.findFirst({ where: eq(documentosDBSchema.id, id) });
        if (!doc) return c.notFound();
        return c.json(doc);
    })