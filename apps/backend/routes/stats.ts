import { sql } from "drizzle-orm";
import { Hono } from "hono";
import * as schema from "../db/schemas"
import { db } from "../db/client"

export const stats = new Hono()
  .get('/', async (c) => {
    const totalInmuebles = await db.select({ count: sql`count(*)` }).from(schema.inmuebles).get();
    const totalCategorias = await db.select({ count: sql`count(*)` }).from(schema.categorias).get();
    const inmueblesPorCategoria = await db
      .select({
        categoria: schema.inmuebles.categoria,
        count: sql`count(*)`,
      })
      .from(schema.inmuebles)
      .groupBy(schema.inmuebles.categoria);

    return c.json({
      totalInmuebles: totalInmuebles?.count,
      totalCategorias: totalCategorias?.count,
      inmueblesPorCategoria,
    }, 200);
  });