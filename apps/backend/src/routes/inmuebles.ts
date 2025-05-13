import { Hono } from 'hono';
import { type InmuebleType, inmuebleSchema } from '@shared/zod';
import { nanoid } from 'nanoid';
import { InmueblesService } from '@/db/models/inmuebles';

export const inmuebles = new Hono()
  .post('/', async (c) => {
    const body = await c.req.json();
    const parse = inmuebleSchema.safeParse(body);

    if (!parse.success) {
      return c.json({ error: 'Malformed input', issues: parse.error.issues }, 400);
    }

    const ok = InmueblesService.guardar(parse.data);
    if (!ok) {
      return c.json({ message: "Internal server error" }, 500);
    }

    return c.json({ ok: true });
  })
  .get('/', async (c) => {
    const inmuebles = await InmueblesService.leer();
    return c.json({inmuebles})
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');

    const data = await InmueblesService.leerPorId(id);
    if (!data) {
      return c.notFound();
    }
    return c.json({ inmueble: data });
  })
  .put('/', async (c) => {
    const data = await c.req.json();

    const ok = InmueblesService.actualizar(data);
    if (!ok) {
      return c.json({ ok: false }, 400);
    }

    return c.json({ ok: true });
  })
  .delete('/:id', async (c) => {
    const id = c.req.param('id');

    const ok = InmueblesService.eliminar(id);
    if (!ok) {
      return c.json({ ok: false }, 400);
    }
    return c.json({ ok: true });
  })

