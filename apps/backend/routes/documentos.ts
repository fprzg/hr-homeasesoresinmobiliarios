import { Hono } from 'hono';
import { type Documento, documentoSchema } from '@shared/zod';
import { db } from '@/db/client';
import { documentos as documentosDBSchema, archivos } from '@/db/schemas';
import { nanoid } from 'nanoid';
import { eq, inArray } from 'drizzle-orm';
import { ArchivosService } from '@/services/archivosService';

export const documentos = new Hono()
  .post('/', async (c) => {
    const body = await c.req.json();
    body.id = nanoid();
    console.log(body);
    const parse = documentoSchema.safeParse(body);

    if (!parse.success) {
      return c.json({ error: 'Datos inválidos', issues: parse.error.issues }, 400);
    }

    const data = parse.data;

    const portada = await db.query.archivos.findFirst({ where: eq(archivos.id, data.portada) });
    if (!portada) return c.json({ error: 'Portada no encontrada' }, 400);

    const documentoImagenes = data.contenido
      .filter(b => b.tipo === 'CarruselImagenes')
      .flatMap((b) => b.imagenes);

    const encontrados = await db.select().from(archivos).where(inArray(archivos.id, documentoImagenes));
    const encontradosSet = new Set(encontrados.map(img => img.id));
    const faltantes = documentoImagenes.filter(id => !encontradosSet.has(id));

    if (faltantes.length > 0) {
      return c.json({ error: 'Imágenes no encontradas', faltantes }, 400);
    }

    const nuevoDocumento = {
      id: `doc_${nanoid()}`,
      categoria: data.categoria,
      titulo: data.titulo,
      portada: data.portada,
      metadata: data.metadata,
      contenido: data.contenido,
    };
    await db.insert(documentosDBSchema).values(nuevoDocumento);

    return c.json({ ok: true });
  })
  .get('/', async (c) => {
    const data = await db.select().from(documentosDBSchema);
    return c.json({ documentos: data });
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    console.log(id);
    const doc = await db.query.documentos.findFirst({ where: eq(documentosDBSchema.id, id) });
    if (!doc) return c.notFound();
    return c.json({ documento: doc });
  })
  .put('/:id', async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();

    const documentoNuevoImagenes = new Set<string>([
      data.portada,
      ...data.contenido.flatMap((bloque: any) =>
        bloque.tipo === 'CarruselImagenes' ? bloque.imagenes : []
      )
    ]);

    const dbImages = await db.select().from(archivos).where(inArray(archivos.id, [...documentoNuevoImagenes]));
    const invalid = dbImages.filter(img => img.documento_id !== null && img.documento_id !== id);
    if (dbImages.length !== documentoNuevoImagenes.size || invalid.length > 0) {
      return c.json({ error: "Una o más imágenes no son válidas o pertenecen a otro documento" }, 400);
    }

    const documentoAnterior = await db.query.documentos.findFirst({ where: eq(documentosDBSchema.id, id) });
    if (!documentoAnterior) return c.notFound(); // TODO: Mejorar este error

    const documentoAnteriorContenido = JSON.parse(documentoAnterior.contenido as any as string);
    const documentoAnteriorImagenes = new Set<string>([
      documentoAnterior.portada,
      ...documentoAnteriorContenido.flatMap(
        (bloque: any) => bloque.tipo === 'CarruselImagenes' ? bloque.imagenes : []
      )
    ]);

    const imagenesHuerfanas = [...documentoAnteriorImagenes].filter(imgId => !documentoNuevoImagenes.has(imgId));

    await db.update(documentosDBSchema).set({ ...data }).where(eq(documentosDBSchema.id, id));

    await db.update(archivos)
      .set({ documento_id: id })
      .where(inArray(archivos.id, [...documentoNuevoImagenes]))

    for (const imgId of imagenesHuerfanas) {
      const img = await db.query.archivos.findFirst({ where: eq(archivos.id, imgId) });
      if (img) {
        ArchivosService.delete(img.id)
        await db.delete(archivos).where(eq(archivos.id, imgId));
      }
    }

    return c.json({ ok: true, id });
  })
  .delete('/:id', async (c) => {
    const id = c.req.param('id');

    const imgs = await db.select().from(archivos).where(eq(archivos.documento_id, id));
    for (const img of imgs) {
      ArchivosService.delete(img.id);
    }

    await db.delete(documentosDBSchema).where(eq(documentosDBSchema.id, id));
    return c.json({ ok: true, id });
  })

