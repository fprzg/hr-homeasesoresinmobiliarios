import { db } from '../client';
import { usuarios } from '../schemas';
import { eq } from "drizzle-orm";
import { hash, compare } from 'bcrypt'

function findByUsername(username: string) {
  return db.query.usuarios.findFirst({ where: eq(usuarios.username, username) })
}

async function create(username: string, password: string) {
  const hashedPassword = await hashPassword(password);
  await db.insert(usuarios).values({username, password: hashedPassword})
}

export async function hashPassword(password: string) {
  const hashedPassword: string = await hash(password, 10);
  return hashedPassword;
}

async function authenticate(username: string, password: string) {
  const usuario = await db.select().from(usuarios).where(eq(usuarios.username, username)).get();
  if (!usuario) {
    return false;
  }

  const valid = await compare(password, usuario.password);

  return valid;
}

export const UsuarioModel = { findByUsername, create, authenticate };
