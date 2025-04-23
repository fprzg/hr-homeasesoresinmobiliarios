import type { MiddlewareHandler } from "hono";
import * as schemas from "../schema";
import { Hono } from "hono";
import { loginSchema } from "@shared/zodSchemas/categoria";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { usuarioSchema } from "@shared/zodSchemas/categoria";
import { z } from "zod";

export function usuariosRoutes(jwtMiddleware: MiddlewareHandler, db: any) {
    return new Hono()
        .post('/api/usuarios/login', zValidator('json', loginSchema), async (c) => {
            const { email, password } = c.req.valid('json');
            const user = await db.select().from(schemas.usuarios).where(eq(schemas.usuarios.email, email)).get();

            if (!user || user.password !== password) { // Replace with proper password hashing
                return c.json({ error: 'Credenciales inválidas' }, 401);
            }

            //const token = await sign({ id: user.id, email: user.email }, 'your-secret-key');
            const token = "faggot";
            c.header('Set-Cookie', `jwt=${token}; HttpOnly; Path=/`);
            return c.json({ id: user.id, email: user.email }, 200);
        })
        .get('/api/usuarios/:id', jwtMiddleware, async (c) => {
            const id = z.number().int().parse(Number(c.req.param('id')));
            const user = await db.select().from(schemas.usuarios).where(eq(schemas.usuarios.id, id)).get();

            if (!user) {
                return c.json({ error: 'Usuario no encontrado' }, 404);
            }

            return c.json({ id: user.id, email: user.email }, 200);
        })
        .put(
            '/api/usuarios/:id',
            jwtMiddleware,
            zValidator('json', usuarioSchema.partial()),
            async (c) => {
                const id = z.number().int().parse(Number(c.req.param('id')));
                const data = c.req.valid('json');
                const user = await db
                    .update(schemas.usuarios)
                    .set(data)
                    .where(eq(schemas.usuarios.id, id))
                    .returning()
                    .get();

                if (!user) {
                    return c.json({ error: 'Usuario no encontrado' }, 404);
                }

                return c.json({ id: user.id, email: user.email }, 200);
            }
        )
        .delete('/api/usuarios/:id', jwtMiddleware, async (c) => {
        const id = z.number().int().parse(Number(c.req.param('id')));
        const result = await db.delete(schemas.usuarios).where(eq(schemas.usuarios.id, id)).returning().get();

        if (!result) {
            return c.json({ error: 'Usuario no encontrado' }, 404);
        }

        return c.status(204);
    });


}