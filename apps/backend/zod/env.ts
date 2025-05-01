import { z } from "zod";

export const envSchema = z.object({
    JWT_SECRET: z.string(),
    DB_DIR: z.string(),
    UPLOADS_DIR: z.string(),
})

export type AppEnvVariables = z.infer<typeof envSchema>