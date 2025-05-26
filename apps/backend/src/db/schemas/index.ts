// @/db/schemas/index.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { type BloqueType } from '@shared/zod';

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

const asentamientos = sqliteTable('asentamientos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tipo: text('tipo').notNull(),
  calleColonia: text('calle_colonia'),
  municipio: text('municipio'),
  codigoPostal: text('codigo_postal'),
  estado: text('estado').notNull(),
});

const inmuebles = sqliteTable('inmuebles', {
  id: text('id').primaryKey(),
  categoria: text('categoria').notNull().$type<"casa" | "terreno">(),
  asentamientoId: integer('asentamiento_id').notNull().references(() => asentamientos.id),
  precio: integer('precio'),
  areaTotal: integer('area_total'),
  fechaPublicacion: text('fecha_publicacion').default(sql`CURRENT_TIMESTAMP`),
  fechaActualizacion: text('fecha_actualizacion').default(sql`CURRENT_TIMESTAMP`),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion').notNull(),
  portada: text('portada').notNull(),
  contenido: text({mode: 'json'}).$type<BloqueType[]>(),
});

const casas = sqliteTable('inmu_casas', {
  id: text('id').primaryKey().references(() => inmuebles.id),
  areaConstruida: integer('area_construida'),
  numAreas: integer('num_areas'),
  numBanos: integer('num_banos'),
  numRecamaras: integer('num_recamaras'),
  numPisos: integer('num_pisos'),
  numCocheras: integer('num_cocheras'),
  piscina: integer('piscina'),
});

const terrenos = sqliteTable('inmu_terrenos', {
  id: text('id').primaryKey().references(() => inmuebles.id),
  metrosFrente: integer('metros_frente'),
  metrosFondo: integer('metros_fondo'),
  tipoPropiedad: text('tipo_propiedad').$type<'privada' | 'comunal' | 'ejidal'>(),
});

const archivos = sqliteTable('archivos', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  mimetype: text('mimetype').notNull(),
  size: integer('size').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  inmuebleId: text('inmueble_id').references(() => inmuebles.id),
  addToCarousel: integer('add_to_carousel', {mode: 'boolean'}).notNull(),
});

const pendienteEliminar = sqliteTable('pendiente_eliminar', {
  id: text('id').primaryKey().references(() => archivos.id),
});

export const schemas = {
  usuarios,
  asentamientos,
  inmuebles,
  casas,
  terrenos,
  archivos,
  pendienteEliminar,
};