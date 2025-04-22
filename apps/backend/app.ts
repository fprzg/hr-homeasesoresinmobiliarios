import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { testRoute } from "./routes/test";
import { inmuebleRoute } from "routes/inmueble";

const app = new Hono();

app.use("*", logger());

//const apiRotues = app.basePath("/api").route("/expenses", expensesRoute)
const apiRotues = app.basePath("/api").route("/inmueble", inmuebleRoute);

app.get("/test", (c) => {
    return c.json({"message": "test"});
})

app.get("*", serveStatic({ root: "./frontend/dist"}))
app.get("*", serveStatic({ path: "./frontend/dist/index.html"}))

export default app;
export type ApiRoutes = typeof apiRotues;