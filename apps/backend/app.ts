import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import * as ormSchemas from "./schema";
import { inmueblesRoutes } from "routes/inmuebles";
import { categoriasRoutes } from "./routes/categorias";
import { usuariosRoutes } from "./routes/usuarios";
import { statsRoutes } from "./routes/stats";
import { jwt } from "hono/jwt";

import { drizzle } from "drizzle-orm/better-sqlite3";
import * as sqlite3 from 'sqlite3';

const jwtMiddleware = jwt({
  secret: 'your-secret-key', 
  cookie: 'jwt',
});

const sqlite = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Contexión establecida con la base de datos.");
});
//const db = drizzle(sqlite, { ormSchemas })
const db = drizzle(sqlite)

const app = new Hono();

app.use("*", logger());

const apiRotues = app.basePath("/api")
  .route("/inmueble", inmueblesRoutes(jwtMiddleware, db))
  .route("/categoria", categoriasRoutes(jwtMiddleware, db))
  .route("/usuario", usuariosRoutes(jwtMiddleware, db))
  .route("/stats", statsRoutes(jwtMiddleware, db));

app.get("/api/test", (c) => {
    return c.json({"message": "test"});
})

app.get("*", serveStatic({ root: "./frontend/dist"}))
app.get("*", serveStatic({ path: "./frontend/dist/index.html"}))

export default app;
export type ApiRoutes = typeof apiRotues;