import { Hono } from 'hono';
import { type InmuebleType, inmuebleSchema, inmuebleRegistroSchema, inmueblesBuscadorQuerySchema } from '@shared/zod';
import { inmueblesService } from '@/services/inmueblesService';
import { zValidator } from '@hono/zod-validator';
import { getUser } from '@/middleware/auth';

export const inmuebles = new Hono()
  .post('/', getUser, async (c) => {
    const body = await c.req.json();
    const parse = inmuebleRegistroSchema.safeParse(body);

    if (!parse.success) {
      return c.json({ error: 'Malformed input', issues: parse.error.issues }, 400);
    }

    const dbInmueble = await inmueblesService.guardar(parse.data);
    if (!dbInmueble) {
      return c.json({ message: "error al guardar el inmueble" }, 500);
    }

    return c.json({
      ok: true,
      inmueble: dbInmueble,
    });
  })
  .get('/', zValidator('query', inmueblesBuscadorQuerySchema), async (c) => {
    const q = c.req.valid('query');

    const data = await inmueblesService.leer(q);
    return c.json(data);
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');

    const data = await inmueblesService.leerPorId(id);
    if (!data) {
      return c.notFound();
    }
    return c.json({ inmueble: data });
  })
  .put('/', getUser, async (c) => {
    const data = await c.req.json();

    const fechaActualizacion = await inmueblesService.actualizar(data);
    if (!fechaActualizacion) {
      return c.json({ ok: false }, 400);
    }

    return c.json({
      ok: true,
      fechaActualizacion,
    });
  })
  .delete('/:id', getUser, async (c) => {
    const id = c.req.param('id');

    const ok = inmueblesService.eliminar(id);
    if (!ok) {
      return c.json({ ok: false }, 400);
    }
    return c.json({ ok: true });
  })

