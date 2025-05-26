import { routes } from "./routes";
import { middlewareLogger } from "./middleware/logger";
import { createDB } from "./db";
import { createFactory } from "hono/factory";
import { S3Client } from "bun";
import { type AppEnvVariables } from "@/zod/env";
import { type Variables, envVariables } from "@/lib/env";

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

  app.use("*", middlewareLogger);

  const apiRoutes = app.basePath("/api")
    .route("/inmuebles", routes.inmuebles)
    .route("/archivos", routes.archivos)
    .route("/auth", routes.auth)

  return [app, apiRoutes];
}

const [app, apiRoutes] = getApp();

export const db = createDB(envVariables);

export default app;
export type ApiRoutes = typeof apiRoutes;

export const s3Storage = new S3Client({
  accessKeyId: envVariables.CLOUDFLARE_R2_ACCESS_KEY,
  secretAccessKey: envVariables.CLOUDFLARE_R2_SECRET_KEY,
  bucket: envVariables.CLOUDFLARE_R2_BUCKET,
  endpoint: envVariables.CLOUDFLARE_R2_BUCKET_ENDPOINT,
});