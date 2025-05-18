import { z } from "zod";

export const estadosMexico = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

export const bloqueSchema = z.object({
  imagenId: z.string(),
  descripcion: z.string().optional(),
  agregarAPortada: z.boolean().default(false),
})

export const asentamientoSchema = z.object({
  tipo: z.string(),
  calleColonia: z.string().optional(),
  municipio: z.string().optional(),
  codigoPostal: z.string().optional(),
  estado: z.enum(estadosMexico),
});

export const inmuebleBaseSchema = z.object({
  id: z.string(),
  asentamiento: asentamientoSchema,
  precio: z.number().int().gt(0),
  areaTotal: z.number().int().gt(0),
  fechaPublicacion: z.string().datetime(),
  fechaActualizacion: z.string().datetime(),
  titulo: z.string(),
  descripcion: z.string(),
  portada: z.string(),
  contenido: z.array(bloqueSchema),
});

export const casaSchema = inmuebleBaseSchema.extend({
  tipo: z.literal("casa"),
  areaConstruida: z.number().int().gte(0),
  numBanos: z.number().int().gte(0),
  numRecamaras: z.number().int().gte(0),
  numPisos: z.number().int().gte(0),
  numCocheras: z.number().int().gte(0),
  totalAreas: z.number().int().gte(0),
  piscina: z.boolean().default(false),
});

export const terrenoSchema = inmuebleBaseSchema.extend({
  tipo: z.literal("terreno"),
  metrosFrente: z.number().int().gt(0),
  metrosFondo: z.number().int().gt(0),
  tipoPropiedad: z.enum(["privada", "comunal", "ejidal",]),
});

export const inmuebleSchema = z.discriminatedUnion("tipo", [
  casaSchema,
  terrenoSchema,
]);

export type BloqueType = z.infer<typeof bloqueSchema>;
export type AsentamientoType = z.infer<typeof asentamientoSchema>;

export type InmuebleBaseType = z.infer<typeof inmuebleBaseSchema>;
export type CasaType = z.infer<typeof casaSchema>;
export type TerrenoType = z.infer<typeof terrenoSchema>;
export type InmuebleType = z.infer<typeof inmuebleSchema>;

function crearAsentamiento(): AsentamientoType {
  return {
    tipo: "",
    calleColonia: "",
    municipio: "",
    codigoPostal: "",
    estado: "Oaxaca",
  };
}

export function crearBloqueType(): BloqueType {
  return {
    imagenId: "",
    descripcion: "",
    agregarAPortada: false,
  };
}

export function crearInmuebleBase(data?: InmuebleType): InmuebleBaseType {
  return {
    id: data?.id ?? "",
    asentamiento: data?.asentamiento ?? crearAsentamiento(),
    precio: data?.precio ?? 0,
    areaTotal: data?.areaTotal ?? 0,
    fechaPublicacion: data?.fechaPublicacion ?? "",
    fechaActualizacion: data?.fechaActualizacion ?? "",
    titulo: data?.titulo ?? "",
    descripcion: data?.descripcion ?? "",
    portada: data?.portada ?? "",
    contenido: data?.contenido ?? [],
  };
}

export function crearCasa(): CasaType {
  const base = crearInmuebleBase();
  return {
    ...base,
    tipo: "casa",
    areaConstruida: 0,
    numBanos: 0,
    numRecamaras: 0,
    numPisos: 0,
    numCocheras: 0,
    totalAreas: 0,
    piscina: false,
  };
}

export function crearTerreno(): TerrenoType {
  const base = crearInmuebleBase();
  return {
    ...base,
    tipo: "terreno",
    metrosFrente: 0,
    metrosFondo: 0,
    tipoPropiedad: "privada",
  };
}



export const inmueblesBuscadorQuerySchema = z.object({
  page: z.coerce.number().int().default(1),
  pageSize: z.coerce.number().int().default(12),
  tipo: z.enum(["casa", "terreno"]).optional(),

  precioMin: z.coerce.number().int().gt(0).optional(),
  precioMax: z.coerce.number().int().optional(),
  areaMin: z.coerce.number().int().gt(0).optional(),
  areaMax: z.coerce.number().int().optional(),
  estado: z.enum(estadosMexico).optional(),

  areaConstruidaMin: z.coerce.number().int().gte(0).optional(),
  numBanos: z.coerce.number().int().gte(0).optional(),
  numRecamaras: z.coerce.number().int().gte(0).optional(),
  numPisos: z.coerce.number().int().gte(0).optional(),
  numCocheras: z.coerce.number().int().gte(0).optional(),
  totalAreas: z.coerce.number().int().gte(0).optional(),
  piscina: z.coerce.boolean().default(false).optional(),

  metrosFrenteMin: z.coerce.number().int().gt(0).optional(),
  metrosFondoMin: z.coerce.number().int().gt(0).optional(),
  tipoPropiedad: z.enum(["privada", "ejidal", "comunal"]).optional(),
});

export type InmueblesBuscadorQueryType = z.infer<typeof inmueblesBuscadorQuerySchema>;




export const usuarioSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export type usuarioSchema = z.infer<typeof usuarioSchema>;