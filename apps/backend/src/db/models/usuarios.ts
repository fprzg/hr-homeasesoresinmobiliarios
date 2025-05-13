import { hash, compare } from "bcrypt";
import { db } from "@/app";
import { schemas } from "@/db/schemas";
import { eq } from "drizzle-orm";

async function get(username: string) {
    const usuario = await db.query.usuarios.findFirst({ where: eq(schemas.usuarios.username, username) });
    return usuario;
}

async function existe(username: string) {
    const existing = await get(username)
    if (existing) {
        return true;
    }
    return false;
}

async function insertar(username: string, password: string) {
    const hashedPassword = await hash(password, 10);
    const [usuario] = await db.insert(schemas.usuarios).values({ username: username, password: hashedPassword, }).returning();
    if (!usuario) {
        return null;
    }
    return usuario;
}

async function autenticar(username: string, password: string) {
    const usuario = await get(username)
    if (!usuario) {
        return false;
    }

    const comparison = await compare(password, usuario.password)
    return comparison;
}

export const UsuariosModel = { existe, get, insertar, autenticar, };