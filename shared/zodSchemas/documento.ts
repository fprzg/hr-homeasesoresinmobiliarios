import { z } from "zod";

export const bloqueDocumentoSchema = z.discriminatedUnion("tipo", [
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
  fechaPublicacion: z.string().datetime(),
  ubicacion: z.string(),
  precio: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const documentoSchema = z.object({
  id: z.string(),
  categoria: z.enum(["casa", "terreno"]),
  titulo: z.string(),
  portada: z.string(),
  metadata: metadataSchema,
  contenido: z.array(bloqueDocumentoSchema),
});

export type BloqueDocumento = z.infer<typeof bloqueDocumentoSchema>;
export type Documento = z.infer<typeof documentoSchema>;

export function crearDocumentoBase(): Documento {
  return {
    id: "",
    categoria: "casa",
    titulo: "",
    portada: "",
    metadata: {
      fechaPublicacion: new Date().toISOString(),
      ubicacion: "",
    },
    contenido: [],
  };
}
