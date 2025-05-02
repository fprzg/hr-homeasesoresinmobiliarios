import { serveStatic } from "hono/bun";
import { routes } from "./routes";
import { getUser } from "@/middleware/auth";
import { logger } from "@/middleware/logger";
import { createDB } from "@/db";
import { createFactory } from "hono/factory";
import { type AppEnvVariables, envSchema } from "./zod/env";

export type Variables = Record<string, unknown> & AppEnvVariables;
export const envVariables = envSchema.parse(process.env);

const factory = createFactory<{ Variables: Variables }>({
  initApp: (app) => {
    app.use(async (c, next) => {
      for (const [key, value] of Object.entries(envVariables)) {
        c.set(key as keyof AppEnvVariables, value);
      }
      await next();
    });
  },
})

export function getApp() {
  const app = factory.createApp();

  app.use("*", logger);

  const apiRoutes = app.basePath("/api")
    .route("/documentos", routes.documentos)
    .route("/archivos", routes.archivos)
    .route("/auth", routes.auth)

    /*
  app.get('/protected', getUser, (c) => {
    const jwtPayload = c.get('jwtPayload');
    return c.json({ message: 'You have access', user: jwtPayload.sub });
  })
    */

  //app.get("*", serveStatic({ root: "./frontend/dist" }))
  //app.get("*", serveStatic({ path: "./frontend/dist/index.html" }))

  return [app, apiRoutes];
}

const [app, apiRoutes] = getApp();

export const db = createDB(envVariables);
export default app;
export type ApiRoutes = typeof apiRoutes;