import type { MiddlewareHandler } from "hono";
import * as schemas from "../schema";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

export function statsRoutes(jwtMiddleware: MiddlewareHandler, db: any) {
  return new Hono()
    .get('/api/estadisticas', async (c) => {
      const totalInmuebles = await db.select({ count: sql`count(*)` }).from(schemas.inmuebles).get();
      const totalCategorias = await db.select({ count: sql`count(*)` }).from(schemas.categorias).get();
      const inmueblesPorCategoria = await db
        .select({
          categoria: schemas.inmuebles.categoria,
          count: sql`count(*)`,
        })
        .from(schemas.inmuebles)
        .groupBy(schemas.inmuebles.categoria);

      return c.json({
        totalInmuebles: totalInmuebles.count,
        totalCategorias: totalCategorias.count,
        inmueblesPorCategoria,
      }, 200);
    });

}