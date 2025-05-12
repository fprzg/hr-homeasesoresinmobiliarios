#!/usr/bin/env bun

import { UsuariosModel } from "../apps/backend/src/db/models/usuarios"

let username = process.env.DEV_DB_USERNAME;
let password = process.env.DEV_DB_PASSWORD;

if (!username || !password) {
    process.exit(1);
}

UsuariosModel.insertar(username, password);