import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { type Variables as AppEnvVariables, envVariables } from '../../app';
import { jwtPayloadSchema, type JwtPayload } from "@/src/zod/jwt";

export type Variables = AppEnvVariables & {
    jwtPayload: JwtPayload;
};

interface Options {
    requireServiceRole?: boolean;
}

function validateApiKey(apiKey: string) {
    return apiKey === envVariables.API_KEY;
}

export function auth({ requireServiceRole = false }: Options = {}) {
    return createMiddleware<{ Variables: Variables }>(async (c, next) => {
        const apiKey = c.req.header('apiKey');
        if (!apiKey || !validateApiKey(apiKey)) {
            throw new HTTPException(401, {
                res: Response.json({ error: 'Unauthorized' }, { status: 401 }),
            });
        }

        const jwtToken = c.req.header('authorization')?.replace('Bearer ', '') as string

        let jwtPayload: JwtPayload;
        try {
            jwtPayload = jwtPayloadSchema.parse(
                await verify(jwtToken, envVariables.JWT_SECRET)
            );
        } catch (error) {
            console.error(error);
            throw new HTTPException(401, {
                res: Response.json({ error: 'Unauthorized' }, { status: 401 }),
            });
        }

        if (requireServiceRole && jwtPayload.role != 'service') {
            throw new HTTPException(403, {
                res: Response.json({ error: 'Forbidden' }, { status: 403 }),
            });
        }

        c.set('jwtPayload', jwtPayload);
        await next();
    });
}