import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const inmuebles = sqliteTable('inmuebles', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  categoria: text('categoria').notNull(),
  titulo: text('titulo').notNull(),
  metadata: text('metadata', { mode: 'json' }).notNull(),
  contenido: text('contenido', { mode: 'json' }).notNull(),
});

export const categorias = sqliteTable('categorias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
});

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

export const jwtTokensTable = sqliteTable('jwt_tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => usuarios.id),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at').notNull(), // Unix timestamp
});