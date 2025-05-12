import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { verifyJwt } from "@/lib/jwt";
import { UsuariosModel } from "@/db/models/usuarios";

type Env = {
    Variables: { usuario: any },
};

export const getUser = createMiddleware<Env>(async (c, next) => {
    const token = getCookie(c, 'auth_token');
    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const payload = await verifyJwt(token);
        const usuario = await UsuariosModel.get(payload.sub);
        if (!usuario) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        c.set('usuario', usuario);
        await next();
    } catch (e) {
        console.error(e);
        return c.json({ error: 'Invalid token' }, { status: 401 })
    }
});