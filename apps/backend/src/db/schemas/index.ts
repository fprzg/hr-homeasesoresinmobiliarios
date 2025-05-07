import { sqliteTable, text, integer, real, index, unique, check } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const categorias = sqliteTable('categorias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
});

// Estados table
export const estados = sqliteTable('estados', {
  //id: text('id').primaryKey().$type<string>().notNull()
  id: text('id').primaryKey()
}
);

// Municipios table
export const municipios = sqliteTable('municipios', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  estadoId: text('estado_id').notNull().references(() => estados.id),
  nombre: text('nombre').notNull(),
  clave: text('clave').notNull()
}, (table) => ({
  uniqueClaveEstado: unique().on(table.clave, table.estadoId),
}));

// Codigos_postales table
export const codigosPostales = sqliteTable('codigos_postales', {
  codigoPostal: text('codigo_postal').primaryKey().notNull(),
  ciudad: text('ciudad'),
});

// Asentamientos table
export const asentamientos = sqliteTable('asentamientos', {
  id: text('id').primaryKey().$type<string>().notNull(), // NanoID
  tipo: text('tipo').notNull(),
  nombre: text('nombre').notNull(),
  calle: text('calle'),
  colonia: text('colonia'),
  municipioId: integer('municipio_id').notNull().references(() => municipios.id),
  codigoPostal: text('codigo_postal').notNull().references(() => codigosPostales.codigoPostal),
});

// Inmueble table
export const inmueble = sqliteTable('inmueble', {
  id: text('id').primaryKey().$type<string>().notNull(), // NanoID
  tipoInmueble: text('tipo_inmueble').notNull(),
    //.check('tipo_inmueble_check', 'tipo_inmueble' in ['casa', 'terreno']),
  estadoId: text('estado_id').notNull().references(() => estados.id),
  asentamientoId: text('asentamiento_id').notNull().references(() => asentamientos.id),
  precio: integer('precio').notNull(),//.check('precio_positive', 'precio' > 0),
  areaTotal: integer('area_total').notNull(),//.check('area_total_positive', 'area_total' > 0),
  fechaPublicacion: text('fechaPublicacion').default('CURRENT_TIMESTAMP').notNull(),
  fechaActualizacion: text('fechaActualizacion').default('CURRENT_TIMESTAMP').notNull(),
  portada: text('portada').notNull(), // Assuming archivos table exists
  contenido: text('contenido').notNull(), // JSON
});

// Inmu_casas table
export const casas = sqliteTable('inmu_casas', {
  id: text('id').primaryKey().$type<string>().notNull().references(() => inmueble.id), // NanoID
  areaConstruida: integer('area_construida').notNull(),
  numBanos: integer('num_banos').notNull(),
  numAreas: integer('num_areas').notNull(),
  numRecamaras: integer('num_recamaras').notNull(),
  numPisos: integer('num_pisos').notNull(),
  numCocheras: integer('num_cocheras').notNull(),
  piscina: integer('piscina').notNull(),
});

// Inmu_terrenos table
export const terrenos = sqliteTable('inmu_terrenos', {
  id: text('id').primaryKey().$type<string>().notNull().references(() => inmueble.id), // NanoID
  metrosFrente: integer('metros_frente').notNull(),
  metrosFondo: integer('metros_fondo').notNull(),
  tipoPropiedad: text('tipo_propiedad').notNull(),
    //.check('tipo_propiedad_check', 'tipo_propiedad' in ['privada', 'comunal', 'ejidal']),
  usoSuelo: text('uso_suelo'),
});

// Relations
export const estadosRelations = relations(estados, ({ many }) => ({
  municipios: many(municipios),
  inmuebles: many(inmueble),
}));

export const municipiosRelations = relations(municipios, ({ one, many }) => ({
  estado: one(estados, {
    fields: [municipios.estadoId],
    references: [estados.id],
  }),
  asentamientos: many(asentamientos),
}));

export const codigosPostalesRelations = relations(codigosPostales, ({ many }) => ({
  asentamientos: many(asentamientos),
}));

export const asentamientosRelations = relations(asentamientos, ({ one, many }) => ({
  municipio: one(municipios, {
    fields: [asentamientos.municipioId],
    references: [municipios.id],
  }),
  codigoPostal: one(codigosPostales, {
    fields: [asentamientos.codigoPostal],
    references: [codigosPostales.codigoPostal],
  }),
  inmuebles: many(inmueble),
}));

export const inmuebleRelations = relations(inmueble, ({ one }) => ({
  estado: one(estados, {
    fields: [inmueble.estadoId],
    references: [estados.id],
  }),
  asentamiento: one(asentamientos, {
    fields: [inmueble.asentamientoId],
    references: [asentamientos.id],
  }),
  casa: one(casas, {
    fields: [inmueble.id],
    references: [casas.id],
  }),
  terreno: one(terrenos, {
    fields: [inmueble.id],
    references: [terrenos.id],
  }),
}));

export const inmuCasasRelations = relations(casas, ({ one }) => ({
  inmueble: one(inmueble, {
    fields: [casas.id],
    references: [inmueble.id],
  }),
}));

export const inmuTerrenosRelations = relations(terrenos, ({ one }) => ({
  inmueble: one(inmueble, {
    fields: [terrenos.id],
    references: [inmueble.id],
  }),
}));

const archivos = sqliteTable('archivos', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  mimetype: text('mimetype').notNull(),
  size: integer('size').notNull(),
  createdAt: integer('created_at').default(Date.now()),
  documento_id: text('inmueble_id').references(() => inmueble.id, { onDelete: 'cascade' }),
});

export const schemas = { usuarios, categorias, inmueble, casas, terrenos, archivos };