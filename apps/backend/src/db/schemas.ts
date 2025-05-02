import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

const categorias = sqliteTable('categorias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
});

const documentos = sqliteTable('documentos', {
  id: text('id').primaryKey(),
  categoria: text('categoria').notNull(),
  titulo: text('titulo').notNull(),
  portada: text('portada').notNull(),
  metadata: text('metadata', { mode: 'json' }).notNull(),
  contenido: text('contenido', { mode: 'json' }).notNull(),
});

const archivos = sqliteTable('archivos', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  mimetype: text('mimetype').notNull(),
  size: integer('size').notNull(),
  createdAt: integer('created_at').default(Date.now()),
  documento_id: text('documento_id').references(() => documentos.id, { onDelete: 'cascade' }),
});

export const schemas = { usuarios, categorias, documentos, archivos };