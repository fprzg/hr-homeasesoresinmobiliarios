import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { usuarioSchema, loginUsuarioSchema } from "@shared/zodSchemas/usuario";
import { z } from "zod";
import * as schema from "../db/schemas"
import { db } from "../db/client"
import { jwtMiddleware } from "../services/auth";
import { sign } from "hono/jwt";

export const usuarios = new Hono()
    .post('/login', zValidator('json', loginUsuarioSchema), async (c) => {
        const { email, password } = c.req.valid('json');
        const user = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email)).get();

        if (!user || user.password !== password) { // Replace with proper password hashing
            return c.json({ error: 'Credenciales inválidas' }, 401);
        }

        const token = await sign({ id: user.id, email: user.email }, 'your-secret-key');
        c.header('Set-Cookie', `jwt=${token}; HttpOnly; Path=/`);
        return c.json({ id: user.id, email: user.email }, 200);
    })
    .get('/api/usuarios/:id', jwtMiddleware, async (c) => {
        const id = z.number().int().parse(Number(c.req.param('id')));
        const user = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, id)).get();

        if (!user) {
            return c.json({ error: 'Usuario no encontrado' }, 404);
        }

        return c.json({ id: user.id, email: user.email }, 200);
    })
    .put(
        '/:id',
        jwtMiddleware,
        zValidator('json', usuarioSchema.partial()),
        async (c) => {
            const id = z.number().int().parse(Number(c.req.param('id')));
            const data = c.req.valid('json');
            const user = await db
                .update(schema.usuarios)
                .set(data)
                .where(eq(schema.usuarios.id, id))
                .returning()
                .get();

            if (!user) {
                return c.json({ error: 'Usuario no encontrado' }, 404);
            }

            return c.json({ id: user.id, email: user.email }, 200);
        }
    )
    .delete('/:id', jwtMiddleware, async (c) => {
        const id = z.number().int().parse(Number(c.req.param('id')));
        const result = await db.delete(schema.usuarios).where(eq(schema.usuarios.id, id)).returning().get();

        if (!result) {
            return c.json({ error: 'Usuario no encontrado' }, 404);
        }

        return c.status(204);
    });
