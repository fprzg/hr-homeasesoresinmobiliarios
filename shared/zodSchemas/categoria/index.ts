import {z} from "zod";

export const usuarioSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});