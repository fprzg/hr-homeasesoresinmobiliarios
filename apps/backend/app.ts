import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { routes }from "./routes";

const app = new Hono();

app.use("*", logger());

const apiRotues = app.basePath("/api")
  .route("/documentos", routes.documentos)
  .route("/archivos", routes.archivos)
  .route("/usuarios", routes.usuarios)

app.get("*", serveStatic({ root: "./frontend/dist" }))
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }))

export default app;
export type ApiRoutes = typeof apiRotues;