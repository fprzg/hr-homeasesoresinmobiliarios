import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from 'bun:sqlite';
import * as schema from './schemas';
import { sql } from "drizzle-orm";
import { UsuarioModel } from "./models/usuariosModel";

const sqlite = new Database('db.sqlite');
export const db = drizzle(sqlite, { schema });

export async function initializeDatabase() {
  await db.run(sql`
  CREATE TABLE categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT
  );
`);

  await db.run(sql`
  CREATE TABLE inmuebles (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    categoria TEXT NOT NULL,
    titulo TEXT NOT NULL,
    metadata TEXT NOT NULL,
    contenido TEXT NOT NULL
  );
`);

  await db.run(sql`
  CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

  const result = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table'`);
  console.log(result);

  UsuarioModel.create("mememe", "11001100")
}

//await initializeDatabase();