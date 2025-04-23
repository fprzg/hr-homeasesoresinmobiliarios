import { Hono, type MiddlewareHandler } from "hono";
import * as schemas from "../schema"
import { zValidator } from "@hono/zod-validator";
import { paginacionSchema }from "@shared/zodSchemas/query"
import { createCategoriaSchema } from "@shared/zodSchemas/usuario";
import { sql, eq }from "drizzle-orm"
import z from "zod";

export function categoriasRoutes(jwtMiddleware: MiddlewareHandler, db: any) {
    return new Hono()
        .get('/api/categorias', zValidator('query', paginacionSchema), async (c) => {
            const { page, limit } = c.req.valid('query');
            const offset = (page - 1) * limit;

            const categorias = await db.select().from(schemas.categorias).limit(limit).offset(offset);
            const [{ count }] = await db.select({ count: sql`count(*)` }).from(schemas.categorias);

            return c.json({ data: categorias, total: count, page, limit }, 200);
        })
        .get('/api/categorias/:id', zValidator('query', paginacionSchema), async (c) => {
            const id = z.number().int().parse(Number(c.req.param('id')));
            const { page, limit } = c.req.valid('query');
            const offset = (page - 1) * limit;

            const categoria = await db.select().from(schemas.categorias).where(eq(schemas.categorias.id, id)).get();
            if (!categoria) {
                return c.json({ error: 'Categoría no encontrada' }, 404);
            }

            const inmuebles = await db
                .select()
                .from(schemas.inmuebles)
                .where(eq(schemas.inmuebles.categoria, categoria.nombre))
                .limit(limit)
                .offset(offset);
            const [{ count }] = await db
                .select({ count: sql`count(*)` })
                .from(schemas.inmuebles)
                .where(eq(schemas.inmuebles.categoria, categoria.nombre));

            return c.json({ data: inmuebles, total: count, page, limit }, 200);
        })
        .post(
            '/api/categorias',
            jwtMiddleware,
            zValidator('json', createCategoriaSchema),
            async (c) => {
                const data = c.req.valid('json');
                const categoria = await db.insert(schemas.categorias).values(data).returning().get();
                return c.json(categoria, 201);
            }
        )
        .put(
            '/api/categorias/:id',
            jwtMiddleware,
            zValidator('json', createCategoriaSchema.partial()),
            async (c) => {
                const id = z.number().int().parse(Number(c.req.param('id')));
                const data = c.req.valid('json');
                const categoria = await db
                    .update(schemas.categorias)
                    .set(data)
                    .where(eq(schemas.categorias.id, id))
                    .returning()
                    .get();

                if (!categoria) {
                    return c.json({ error: 'Categoría no encontrada' }, 404);
                }

                return c.json(categoria, 200);
            }
        )
        .delete('/api/categorias/:id', jwtMiddleware, async (c) => {
            const id = z.number().int().parse(Number(c.req.param('id')));
            const result = await db.delete(schemas.categorias).where(eq(schemas.categorias.id, id)).returning().get();

            if (!result) {
                return c.json({ error: 'Categoría no encontrada' }, 404);
            }

            return c.status(204);
        })
}