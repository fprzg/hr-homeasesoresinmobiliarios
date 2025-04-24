import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.number().int(),
  username: z.string().min(1),
  password: z.string().min(8).max(80),
});

export const loginUsuarioSchema = z.object({
  username: z.string().min(1),
  password: z.string(),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;
export type LoginUsuarioSchema = z.infer<typeof loginUsuarioSchema>;