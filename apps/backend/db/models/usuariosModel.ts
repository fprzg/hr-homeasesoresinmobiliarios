import { db } from '../client';
import { usuarios } from '../schemas';
import { eq } from "drizzle-orm";
import { type UsuarioSchema } from '@shared/zodSchemas/usuario';

export const UsuarioModel = {
  findByEmail: (email: string) => db.query.usuarios.findFirst({ where: eq(usuarios.email, email) }),
  create: (data: UsuarioSchema ) => db.insert(usuarios).values(data),
};
