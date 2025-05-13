import { Hono } from 'hono';
import { db } from '@/app';
import { schemas } from '@/db/schemas';
import { ArchivosService } from '@/app';
import { eq } from 'drizzle-orm';
import { error } from 'node:console';

export const archivos = new Hono()
    .post('/', async (c) => {
        const body = await c.req.formData();
        //const files = Object.values(body).filter(f => f instanceof File) as File[];
        const files = [] as File[]
        body.forEach((f) => files.push(f as File))

        const results = [];

        for (const file of files) {
            try {
                const image = await ArchivosService.guardar(file);
                console.log(image)
                await db.insert(schemas.archivos).values({ ...image, addToCarousel: 1 });
                results.push({ id: image.id, originalName: image.filename });
            } catch (err) {
                console.error(err);
            }
        }

        return c.json({ imagenes: results });
    })
    .get('/carrusel', async (c) => {
        try {
            const archivosLista = await db.select()
                .from(schemas.archivos)
                .where(eq(schemas.archivos.addToCarousel, 1))
                .limit(20)
                .orderBy(schemas.archivos.createdAt);

            if (archivosLista.length === 0) {
                return c.json({
                    ok: true,
                    message: 'No hay archivos en el carrusel',
                    imagenes: [],
                }, 200);
            }

            const defaultTarget = "";
            const imagenes = archivosLista.map((item) => ({
                imagen: item.id,
                target: item.inmuebleId ?? defaultTarget,
            }));

            console.log(imagenes);

            return c.json({
                ok: true,
                imagenes,
            }, 200);
        } catch (e) {
            console.error("Error al obtener archivos para el carrusel", error);
            return c.json({
                ok: false,
                message: "Error al obtener los archivos del carrusel",
                error: e instanceof Error ? e.message : null,
            })
        }
    })
    .get('/:id', async (c) => {
        const id = c.req.param('id');
        const doc = await db.query.archivos.findFirst({ where: eq(schemas.archivos.id, id) });
        if (!doc) return c.notFound();
        const file = await ArchivosService.leer(id);
        if (!file) return c.notFound();

        return c.body(file.buffer, {
            headers: {
                'Content-Type': doc.mimetype,
                'Content-Length': file.size.toString(),
                'Content-Disposition': `inline; filename="${doc.filename}"`,
            }
        })
    })