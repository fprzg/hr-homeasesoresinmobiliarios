#!/usr/bin/env bun

import { db } from "../apps/backend/app"
import * as schema from "../apps/backend/db/schemas"

const username = process.env.DEV_DB_USERNAME || "admin";
const password = process.env.DEV_DB_PASSWORD || "pa55word";

if (!username || !password) {
    process.exit(1);
}

// TODO: Tratar lanzar los errores con catch((err) => {...})
db.insert(schema.usuarios).values({ username, password })
    .then(() => console.log(`✅ Usuario "${username}" insertado con éxito.`))
    .catch((err) => {
        console.error('❌ Error al insertar usuario:', err.message);
        process.exit(1);
    });
