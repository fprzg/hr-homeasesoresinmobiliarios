import { z } from "zod";

export const envSchema = z.object({
    API_KEY: z.string(),
    JWT_SECRET: z.string(),

    UPLOADS_DIR: z.string(),
    DB_DIR: z.string(),
    FRONT_STATIC: z.string(),

    DEV_DB_USERNAME: z.string().optional(),
    DEV_DB_PASSWORD: z.string().optional(),
})

export type AppEnvVariables = z.infer<typeof envSchema>