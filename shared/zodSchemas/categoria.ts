import { z } from "zod";

export const categoriaSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(4),
  descripcion: z.string().min(8),
});

export type CategoriaSchema = z.infer<typeof categoriaSchema>;