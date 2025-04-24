import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.number().int(),
  nombre: z.string().min(1),
  password: z.string().min(8).max(80),
  email: z.string().email(),
});

export const loginUsuarioSchema = z.object({
  email: z.string().min(1),
  password: z.string().optional(),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;
export type LoginUsuarioSchema = z.infer<typeof loginUsuarioSchema>;