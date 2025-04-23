import {z} from "zod";

export const categoriaSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
});

export const createCategoriaSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
});