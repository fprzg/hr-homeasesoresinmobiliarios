import { createFactory } from "hono/factory";
import { type AppEnvVariables, envSchema } from "./zod/env";

export type Variables = Record<string, unknown> & AppEnvVariables;
export const envVariables = envSchema.parse(process.env);

export const factory = createFactory<{Variables: Variables}>({
    initApp: (app) => {
        app.use( async (c, next) => {
            for (const [key, value] of Object.entries(envVariables)) {
                c.set(key as keyof AppEnvVariables, value);
            }
            await next();
        });
    },
})