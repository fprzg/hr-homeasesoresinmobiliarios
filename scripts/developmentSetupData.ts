#!/usr/bin/env bun

import { UsuariosModel } from "../apps/backend/src/db/models/usuarios"

const username = process.env.DEV_DB_USERNAME || "alicia";
const password = process.env.DEV_DB_PASSWORD || "xoxo1100";

if (!username || !password) {
    process.exit(1);
}

UsuariosModel.insertar(username, password);