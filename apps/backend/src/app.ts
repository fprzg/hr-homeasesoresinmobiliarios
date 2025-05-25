import { routes } from "./routes";
import { logger } from "./middleware/logger";
import { createDB } from "./db";
import { createFactory } from "hono/factory";
import { type AppEnvVariables, envSchema } from "./zod/env";
import { ArchivosServiceFactory } from "./services/archivosService";
import { S3Client } from "bun";

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

  return [app, apiRoutes];
}

const [app, apiRoutes] = getApp();

export const db = createDB(envVariables);
export const ArchivosService = ArchivosServiceFactory(envVariables);

export default app;
export type ApiRoutes = typeof apiRoutes;

export const s3Storage = new S3Client({
  accessKeyId: envVariables.CLOUDFLARE_R2_ACCESS_KEY,
  secretAccessKey: envVariables.CLOUDFLARE_R2_SECRET_KEY,
  bucket: envVariables.CLOUDFLARE_R2_BUCKET,
  endpoint: envVariables.CLOUDFLARE_R2_BUCKET_ENDPOINT,
});