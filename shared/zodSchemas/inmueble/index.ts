import { z } from "zod";

export const bloquePersonalizadoSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("Titulo"),
    texto: z.string(),
  }),
  z.object({
    tipo: z.literal("Descripcion"),
    texto: z.string(),
  }),
  z.object({
    tipo: z.literal("CarruselImagenes"),
    imagenes: z.array(z.string().url()),
  }),
  z.object({
    tipo: z.literal("VideoEmbebido"),
    video: z.string().url(),
  }),
  z.object({
    tipo: z.literal("Localizacion"),
    texto: z.string(),
  }),
]);

const metadataSchema = z.object({
  ubicacion: z.string(),
  precio: z.number(),
  fechaPublicacion: z.string().datetime(),
  portadaUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export const inmueblePageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  categoria: z.string(),
  titulo: z.string(),
  metadata: metadataSchema,
  contenido: z.array(bloquePersonalizadoSchema),
});

export type BloquePersonalizadoSchema = z.infer<typeof bloquePersonalizadoSchema>;
export type InmueblePage = z.infer<typeof inmueblePageSchema>;

export function getDefaultInmueblePage() : InmueblePage{
  return {
  	id: crypto.randomUUID(),
  	slug: "nuevo-inmueble",
  	categoria: "casas",
  	titulo: "",
  	metadata: {
    	ubicacion: "",
    	precio: 0,
    	fechaPublicacion: new Date().toISOString(),
			portadaUrl: "",
  	},
  	contenido: [
      {
        tipo: "Titulo",
        texto: "Nueva página",
      },
      {
        tipo: "Descripcion",
        texto: "Agregar una descripción...",
      }
    ],
  };
}
