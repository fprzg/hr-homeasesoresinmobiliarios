import { db } from "db/client";
import { type Inmueble } from "@shared/zodSchemas/inmueble";
import * as schema from "../schemas";
import { eq } from "drizzle-orm";
import * as query from "@shared/zodSchemas/query"
import {sql } from "drizzle-orm"

async function read(id: string) {
    const inmueble = await db.select().from(schema.inmuebles).where(eq(schema.inmuebles.id, id)).get();
    return inmueble;
}

async function insert(data: Inmueble) {
    const value = await db.insert(schema.inmuebles).values(data).returning().get()
    return value;
}

async function update(id: string, data: any) {
    const inmueble = await db
        .update(schema.inmuebles)
        .set(data)
        .where(eq(schema.inmuebles.id, id))
        .returning()
        .get();
    return inmueble;
}

async function eliminate(id: string) {
    const result = await db.
        delete(schema.inmuebles).
        where(eq(schema.inmuebles.id, id)).
        returning()
        .get();
    return result;
}

async function f_query({ page, limit, categoria }: query.PaginacionSchema) {
    const offset = (page - 1) * limit;

    let query_: any;
    if (categoria) {
        query_ = db.select().from(schema.inmuebles).where(eq(schema.inmuebles.categoria, categoria));
    } else {
        query_ = db.select().from(schema.inmuebles);
    }

    const inmuebles = await query_.limit(limit).offset(offset);
    //const [{ count }] = await db.select({ count: sql`count(*)` }).from(schema.inmuebles);
    const count = await db.select({ count: sql`count(*)` }).from(schema.inmuebles);

    return [inmuebles, count]

}

export const InmuebleModel = { read, insert, update, eliminate, query: f_query }