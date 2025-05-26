import { type AppEnvVariables, envSchema } from "@/zod/env";

export type Variables = Record<string, unknown> & AppEnvVariables;
export const envVariables = envSchema.parse(process.env);