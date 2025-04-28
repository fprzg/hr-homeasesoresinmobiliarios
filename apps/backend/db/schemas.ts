import { KeyObject } from 'crypto';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

export const categorias = sqliteTable('categorias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
});

export const inmuebles = sqliteTable('inmuebles', {
  id: text('id').primaryKey(),
  categoria: text('categoria').notNull(),
  titulo: text('titulo').notNull(),
  metadata: text('metadata', { mode: 'json' }).notNull(),
  contenido: text('contenido', { mode: 'json' }).notNull(),
});

export const archivos = sqliteTable('archivos', {
  id: text('id').primaryKey(),
  inmuebleId: text('inmueble_id').notNull().references(() => inmuebles.id),
  handle: text('handle').notNull().unique(),
  handleServer: text('handle_server', { enum: ['s3', 'local']}).notNull(),
  estado: text('estado', { enum: ['recibido', 'en_uso']}),
});