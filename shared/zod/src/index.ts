import { z } from "zod";

export const bloqueSchema = z.object({
  imagen: z.string(),
  descripcion: z.string(),
})

export const inmuebleBaseSchema = z.object({
  id: z.string(),
  estado: z.string(),
  asentamiento: z.string(),
  precio: z.number().int().gt(0),
  area_total: z.number().int().gt(0),
  fechaPublicacion: z.string().datetime(),
  fechaActualizacion: z.string().datetime(),
  portada: z.string(),
  contenido: z.array(bloqueSchema),
});

export const casaSchema = inmuebleBaseSchema.extend({
  tipo: z.literal("casa"),
  area_construida: z.number().int().gte(0),
  num_banos: z.number().int().gte(0),
  num_recamaras: z.number().int().gte(0),
  num_pisos: z.number().int().gte(0),
  num_cocheras: z.number().int().gte(0),
  piscina: z.boolean().default(false),
});

export const terrenoSchema = inmuebleBaseSchema.extend({
  tipo: z.literal("terreno"),
  metros_frente: z.number().int().gt(0),
  metros_fondo: z.number().int().gt(0),
  tipo_propiedad: z.enum(["privada", "comunal", "ejidal",]),
});

export const inmuebleSchema = z.discriminatedUnion("tipo", [
  casaSchema,
  terrenoSchema,
]);

export type BloqueType = z.infer<typeof bloqueSchema>;

export type InmuebleBaseType = z.infer<typeof inmuebleBaseSchema>;
export type CasaType = z.infer<typeof casaSchema>;
export type TerrenoType = z.infer<typeof terrenoSchema>;
export type InmuebleType = z.infer<typeof inmuebleSchema>;

function crearInmuebleBase(): InmuebleBaseType {
  return {
    id: "",
    estado: "",
    asentamiento: "",
    precio: 0,
    area_total: 0,
    fechaPublicacion: "",
    fechaActualizacion: "",
    portada: "",
    contenido: [],
  };
}

export function crearCasa(): CasaType {
  const base = crearInmuebleBase();
  return {
    ...base,
    tipo: "casa",
    area_construida: 0,
    num_banos: 0,
    num_recamaras: 0,
    num_pisos: 0,
    num_cocheras: 0,
    piscina: false,
  };
}

export function crearTerreno(): TerrenoType {
  const base = crearInmuebleBase();
  return {
    ...base,
    tipo: "terreno",
    metros_frente: 0,
    metros_fondo: 0,
    tipo_propiedad: "privada",
  };
}





export const usuarioSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

export type usuarioSchema = z.infer<typeof usuarioSchema>;