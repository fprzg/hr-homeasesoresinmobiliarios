import { Hono, type MiddlewareHandler } from "hono";
import { zValidator } from "@hono/zod-validator";
import { inmueble, query } from "@shared/zodSchemas";
import * as schemas from "../schema";
import { z } from "zod";
import {eq, and} from "drizzle-orm";
import { sql } from "drizzle-orm";

export function inmueblesRoutes(jwtMiddleware: MiddlewareHandler, db: any) {
    return new Hono()
        .get('/api/inmuebles', zValidator('query', query.paginacionSchema), async (c) => {
            const { page, limit, categoria } = c.req.valid('query');
            const offset = (page - 1) * limit;

            let query = db.select().from(schemas.inmuebles);
            if (categoria) {
                query = query.where(eq(schemas.inmuebles.categoria, categoria));
            }

            const inmuebles = await query.limit(limit).offset(offset);
            const [{ count }] = await db.select({ count: sql`count(*)` }).from(schemas.inmuebles);

            return c.json({ data: inmuebles, total: count, page, limit }, 200);
        })
        .get('/api/inmuebles/:id', async (c) => {
            const id = z.string().parse(c.req.param('id'));
            const inmueble = await db.select().from(schemas.inmuebles).where(eq(schemas.inmuebles.id, id)).get();

            if (!inmueble) {
                return c.json({ error: 'Inmueble no encontrado' }, 404);
            }

            return c.json(inmueble, 200);
        })
        .post(
            '/api/inmuebles',
            jwtMiddleware,
            zValidator('json', inmueble.inmueblePageSchema),
            async (c) => {
                const data = c.req.valid('json');
                const inmueble = await db.insert(schemas.inmuebles).values(data).returning().get();
                return c.json(inmueble, 201);
            }
        )
        .put(
            '/api/inmuebles/:id',
            jwtMiddleware,
            zValidator('json', inmueble.inmueblePageSchema.partial()),
            async (c) => {
                const id = z.string().parse(c.req.param('id'));
                const data = c.req.valid('json');
                const inmueble = await db
                    .update(schemas.inmuebles)
                    .set(data)
                    .where(eq(schemas.inmuebles.id, id))
                    .returning()
                    .get();

                if (!inmueble) {
                    return c.json({ error: 'Inmueble no encontrado' }, 404);
                }

                return c.json(inmueble, 200);
            }
        )
        .delete('/api/inmuebles/:id', jwtMiddleware, async (c) => {
            const id = z.string().parse(c.req.param('id'));
            const result = await db.delete(schemas.inmuebles).where(eq(schemas.inmuebles.id, id)).returning().get();

            if (!result) {
                return c.json({ error: 'Inmueble no encontrado' }, 404);
            }

            return c.status(204);
        });
}