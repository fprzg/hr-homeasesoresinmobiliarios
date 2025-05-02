import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite";
import * as schema from './schemas';
import { envSchema } from "@/src/zod/env";

export function createDB(env: unknown) {
  const parsedEnv = envSchema.parse(env);
  const sqlite = Database.open(parsedEnv.DB_DIR);
  return drizzle(sqlite, { schema });
}
