import { Hono } from 'hono';
import { type InmuebleType, inmuebleSchema, inmueblesBuscadorQuerySchema } from '@shared/zod';
import { InmueblesService } from '@/services/inmueblesService';
import { zValidator } from '@hono/zod-validator';
import { getUser } from '@/middleware/auth';

export const inmuebles = new Hono()
  .post('/', getUser, async (c) => {
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
  .get('/', zValidator('query', inmueblesBuscadorQuerySchema), async (c) => {
    const q = c.req.valid('query');

    const data = await InmueblesService.leer(q);
    return c.json(data);
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');

    const data = await InmueblesService.leerPorId(id);
    if (!data) {
      return c.notFound();
    }
    return c.json({ inmueble: data });
  })
  .put('/', getUser, async (c) => {
    const data = await c.req.json();

    const ok = InmueblesService.actualizar(data);
    if (!ok) {
      return c.json({ ok: false }, 400);
    }

    return c.json({ ok: true });
  })
  .delete('/:id', getUser, async (c) => {
    const id = c.req.param('id');

    const ok = InmueblesService.eliminar(id);
    if (!ok) {
      return c.json({ ok: false }, 400);
    }
    return c.json({ ok: true });
  })

