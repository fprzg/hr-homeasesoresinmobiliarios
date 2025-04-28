import { z } from "zod";

export const bloquePersonalizadoSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("Texto"),
    texto: z.string(),
  }),
  z.object({
    tipo: z.literal("CarruselImagenes"),
    imagenes: z.array(z.string()),
  }),
]);

const metadataSchema = z.object({
  portada: z.string(),
  descripcion: z.string().optional(),
  fechaPublicacion: z.string().datetime(),
  ubicacion: z.string(),
  precio: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const inmuebleSchema = z.object({
  id: z.string(),
  categoria: z.string(),
  titulo: z.string(),
  metadata: metadataSchema,
  contenido: z.array(bloquePersonalizadoSchema),
});

export type BloquePersonalizado = z.infer<typeof bloquePersonalizadoSchema>;
export type Inmueble = z.infer<typeof inmuebleSchema>;

export function crearInmuebleBase(): Inmueble {
  return {
    id: crypto.randomUUID(),
    categoria: "",
    titulo: "",
    metadata: {
      portada: "",
      fechaPublicacion: new Date().toISOString(),
      ubicacion: "",
    },
    contenido: [],
  };
}
