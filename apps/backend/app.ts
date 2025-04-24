import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { routes }from "./routes";

const app = new Hono();

app.use("*", logger());

const apiRotues = app.basePath("/api")
  .route("/inmuebles", routes.inmuebles)
  .route("/categorias", routes.categorias)
  .route("/usuarios", routes.usuarios)
  .route("/stats", routes.stats);

app.get("/api/test", (c) => {
  return c.json({ "message": "test" });
})

app.get("*", serveStatic({ root: "./frontend/dist" }))
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }))

export default app;
export type ApiRoutes = typeof apiRotues;