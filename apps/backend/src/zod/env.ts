import { z } from "zod";

export const envSchema = z.object({
    API_KEY: z.string(),
    JWT_SECRET: z.string(),

    UPLOADS_DIR: z.string(),
    DB_DIR: z.string(),

    DEV_DB_USERNAME: z.string().optional(),
    DEV_DB_PASSWORD: z.string().optional(),

    CLOUDFLARE_R2_BUCKET: z.string(),
    CLOUDFLARE_R2_ACCESS_KEY: z.string(),
    CLOUDFLARE_R2_SECRET_KEY: z.string(),
    CLOUDFLARE_R2_BUCKET_ENDPOINT: z.string(),
})

export type AppEnvVariables = z.infer<typeof envSchema>