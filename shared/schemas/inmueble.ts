import { z } from "zod";

export const bloquePersonalizadoSchema = z.discriminatedUnion("tipo", [
    z.object({
        tipo: z.literal("CarruselImagenes"),
        imagenes: z.array(z.string().url()),
    }),
    z.object({
        tipo: z.literal("Cita"),
        author: z.string(),
        texto: z.string(),
    }),
    z.object({
        tipo: z.literal("Testimonio"),
        nombre: z.string(),
        texto: z.string(),
        avatarUrl: z.string().url().optional(),
    }),
    z.object({
        tipo: z.literal("Separador"),
        estilo: z.enum(["linea", "espacio"]).optional(),
    }),
]);

const metadataSchema = z.object({
    ubicacion: z.string(),
    precio: z.number(),
    fechaPublicacion: z.string().datetime(),
    portadaUrl: z.string().url(),
    videoUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
});

const tiptapNodeSchema = z.object({
    type: z.string(),
    attrs: z.record(z.any()).optional(),
    content: z.array(z.any()).optional(),
    text: z.string().optional(),
});

export const inmueblePageSchema = z.object({
    id: z.string(),
    slug: z.string(),
    categoria: z.string(),
    titulo: z.string(),
    metadata: metadataSchema,
    contenido: z.object({
        type: z.literal("doc"),
        content: z.array(tiptapNodeSchema),
    }),
    bloques: z.array(bloquePersonalizadoSchema),
});

export type InmueblePage = z.infer<typeof inmueblePageSchema>