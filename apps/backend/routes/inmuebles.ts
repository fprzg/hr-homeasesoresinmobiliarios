import { Hono, type MiddlewareHandler } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as inmueble from "@shared/zodSchemas/inmueble";
import * as query from "@shared/zodSchemas/query";
import { z } from "zod";
import { InmuebleModel } from "db/models/inmueblesModel";

export const inmuebles = new Hono()
    .get('/', zValidator('query', query.paginacionSchema), async (c) => {
        const { page, limit, categoria } = c.req.valid('query');
        const [queryInmuebles, count] = await InmuebleModel.query({ page, limit, categoria })

        return c.json(
            {
                data: queryInmuebles,
                total: count,
                page,
                limit
            },
            200);
    })
    .get('/:id', async (c) => {
        const id = z.string().parse(c.req.param('id'));
        const inmueble = await InmuebleModel.read(id);

        if (!inmueble) {
            return c.json({ error: 'Inmueble no encontrado' }, 404);
        }

        return c.json(inmueble, 200);
    })
    .post(
        '/',
        //jwtMiddleware,
        zValidator('json', inmueble.inmuebleSchema),
        async (c) => {
            const data = c.req.valid('json');
            console.log(data);
            const inmueble = await InmuebleModel.insert(data)
            return c.json(inmueble, 201);
        }
    )
    .put(
        '/:id',
        //jwtMiddleware,
        zValidator('json', inmueble.inmuebleSchema.partial()),
        async (c) => {
            const id = z.string().parse(c.req.param('id'));
            const data = c.req.valid('json');
            const inmueble = await InmuebleModel.update(id, data);

            if (!inmueble) {
                return c.json({ error: 'Inmueble no encontrado' }, 404);
            }

            return c.json(inmueble, 200);
        }
    )
    .delete('/:id', //jwtMiddleware,
        async (c) => {
            const id = z.string().parse(c.req.param('id'));
            const result = await InmuebleModel.eliminate(id)

            if (!result) {
                return c.json({ error: 'Inmueble no encontrado' }, 404);
            }

            return c.status(204);
        });