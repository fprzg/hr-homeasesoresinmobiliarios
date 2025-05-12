import { serveStatic } from "hono/bun";
import { routes } from "./routes";
import { logger } from "./middleware/logger";
import { createDB } from "./db";
import { createFactory } from "hono/factory";
import { type AppEnvVariables, envSchema } from "./zod/env";
import { ArchivosServiceFactory } from "./services/archivosService";
import path from "node:path";

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
    .route("/inmuebles", routes.inmuebles)
    .route("/archivos", routes.archivos)
    .route("/auth", routes.auth)

  if (envVariables.ENV !== "dev" && envVariables.ENV !== "development") {
    app.get("*", serveStatic({ root: envVariables.FRONT_STATIC }))
    app.get("*", serveStatic({ path: path.join(envVariables.FRONT_STATIC, "index.html") }))
  }

  return [app, apiRoutes];
}

const [app, apiRoutes] = getApp();

export const db = createDB(envVariables);
export const ArchivosService = ArchivosServiceFactory(envVariables);

export default app;
export type ApiRoutes = typeof apiRoutes;