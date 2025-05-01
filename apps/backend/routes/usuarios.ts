import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sign } from "hono/jwt";
import { UsuarioModel } from "db/models/usuariosModel";
//import { authMiddleware, JWT_SECRET } from "middleware/auth";
import { loginUsuarioSchema } from "../../../shared/zod/src/usuario";
import { setCookie } from "hono/cookie";

export const usuarios = new Hono()

/*
    .post('/login', zValidator('json', loginUsuarioSchema), async (c) => {
        const loginUsuario = c.req.valid('json');
        const usuario = await UsuarioModel.findByUsername(loginUsuario.username)

        if (!usuario) {
            return c.json({ error: 'NOT_USER' }, 404);
        }

        const checkPwd = await UsuarioModel.authenticate(loginUsuario.username, loginUsuario.password)
        if (!checkPwd) {
            return c.json({ error: 'INVALID_PASSWORD' }, 400);
        }

        const payload = {
            userId: usuario.id,
            username: usuario.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 5,
        }

        const token = await sign(payload, JWT_SECRET)
        setCookie(c, 'jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: '/',
        })

        return c.json({
            userId: usuario.id,
            username: usuario.username,
        })
    })
    .use('/protected/*', authMiddleware)
    .get('/protected/resource', async (c) => {
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
})
*/
