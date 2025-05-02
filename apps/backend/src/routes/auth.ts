import { Hono } from "hono";
import { generateJwt } from "@/lib/jwt";
import { setCookie, deleteCookie } from "hono/cookie";
import { sessionManager } from "@/session";
import { loginUsuarioSchema } from "@shared/zod";
import { getUser } from "@/middleware/auth";

import { UsuariosModel } from "@/db/models/usuarios";

export const auth = new Hono()
    .post("/login", async (c) => {
        const body = await c.req.json();
        const parsed = loginUsuarioSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ error: parsed.error.flatten() }, 400);
        }

        const { username, password } = parsed.data;
        const valid = await UsuariosModel.autenticar(username, password)
        if (!valid) {
            return c.json({ error: 'Credenciales inválidas' }, 401);
        }

        const token = await generateJwt({ sub: username, role: 'user' });
        setCookie(c, 'auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            path: '/',
        });

        return c.json({ success: true });
    })
    .post("/register", async (c) => {
        const body = await c.req.json();
        const parsed = loginUsuarioSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ error: parsed.error.flatten() }, 400);
        }

        const { username, password } = parsed.data;
        if (await UsuariosModel.existe(username)) {
            return c.json({ error: 'Usuario ya existe' }, 400);
        }

        const usuario = await UsuariosModel.insertar(username, password);
        if (!usuario) {
            return c.json({ error: 'Error al crear el usuario' }, 400);
        }

        return c.json({
            success: true,
            user: { username, createdAt: usuario.createdAt }
        });
    })
    .get("/logout", async (c) => {
        deleteCookie(c, 'auth_token');
        return c.json({ success: true });
    })
    .get("/me", getUser, async (c) => {
        const usuario = c.var.usuario;
        return c.json({
            usuario
        });
    })