import type { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

export const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_insegura_para_desarrollo';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const jwtMiddleware = jwt({
        secret: JWT_SECRET,
    });

    return jwtMiddleware(c, next);
}