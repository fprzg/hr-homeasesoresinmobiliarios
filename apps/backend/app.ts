import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { routes } from "./routes";
import { factory } from "./factory";
import { auth } from "./middleware/auth";


const app = factory.createApp();

app.use("*", logger());

const apiRotues = app.basePath("/api")
  .route("/documentos", routes.documentos)
  .route("/archivos", routes.archivos)
  .route("/usuarios", routes.usuarios)

app.get('/protected', auth(), (c) => {
  const jwtPayload = c.get('jwtPayload');
  return c.json({ message: 'You have access', user: jwtPayload.sub });
})

//app.get("*", serveStatic({ root: "./frontend/dist" }))
//app.get("*", serveStatic({ path: "./frontend/dist/index.html" }))

export default app;
export type ApiRoutes = typeof apiRotues;