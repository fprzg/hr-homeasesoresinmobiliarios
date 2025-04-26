import { z } from "zod";

export const bloquePersonalizadoSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("Texto"),
    texto: z.string(),
  }),
  z.object({
    tipo: z.literal("CarruselImagenes"),
    imagenes: z.array(z.string().url()),
  }),
]);

const metadataSchema = z.object({
  portadaUrl: z.string().url(),
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
      portadaUrl: "https://placehold.co/600x400/666600/FFF",
      fechaPublicacion: new Date().toISOString(),
      ubicacion: "",
    },
    contenido: [],
  };
}
