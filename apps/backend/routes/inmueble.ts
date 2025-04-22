import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { inmueblePageSchema } from "@shared/schemas/inmueble"
import type { InmueblePage } from "@shared/schemas/inmueble"

const fakeInmuebles: InmueblePage[] = [
    {
        id: "123",
        slug: "casa-palermo",
        categoria: "casas",
        titulo: "Casa estilo colonial en Palermo",
        metadata: {
            "ubicacion": "Palermo, Buenos Aires",
            "precio": 120000,
            "fechaPublicacion": "2025-04-22T00:00:00Z",
            "portadaUrl": "https://s3.example.com/portada.jpg",
            "tags": ["jardín", "cochera"]
        },
        contenido: {
            "type": "doc",
            "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "Hermosa propiedad de tres habitaciones..." }] },
                { "type": "bloquePersonalizado", "attrs": { "index": 0 } },
                { "type": "paragraph", "content": [{ "type": "text", "text": "Ideal para familias numerosas." }] }
            ]
        },
        bloques: [
            {
                "tipo": "CarruselImagenes",
                "imagenes": [
                    "https://s3.example.com/foto1.jpg",
                    "https://s3.example.com/foto2.jpg"
                ]
            }
        ]
    },
    {
        id: "124",
        slug: "depto-recoletas",
        categoria: "departamentos",
        titulo: "Departamento moderno en Recoleta",
        metadata: {
            "ubicacion": "Recoleta, Buenos Aires",
            "precio": 85000,
            "fechaPublicacion": "2025-04-20T00:00:00Z",
            "portadaUrl": "https://s3.example.com/portada_depto1.jpg",
            "tags": ["balcón", "piscina"]
        },
        contenido: {
            "type": "doc",
            "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "Exclusivo departamento con vista al parque..." }] },
                { "type": "bloquePersonalizado", "attrs": { "index": 0 } },
                { "type": "paragraph", "content": [{ "type": "text", "text": "Perfecto para profesionales jóvenes." }] }
            ]
        },
        bloques: [
            {
                "tipo": "CarruselImagenes",
                "imagenes": [
                    "https://s3.example.com/depto_foto1.jpg",
                    "https://s3.example.com/depto_foto2.jpg"
                ]
            }
        ]
    },
    {
        id: "125",
        slug: "casa-belgrano",
        categoria: "casas",
        titulo: "Casa espaciosa en Belgrano",
        metadata: {
            "ubicacion": "Belgrano, Buenos Aires",
            "precio": 150000,
            "fechaPublicacion": "2025-04-18T00:00:00Z",
            "portadaUrl": "https://s3.example.com/portada_casa2.jpg",
            "tags": ["patio", "quincho"]
        },
        contenido: {
            "type": "doc",
            "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "Amplia casa con cuatro dormitorios..." }] },
                { "type": "bloquePersonalizado", "attrs": { "index": 0 } },
                { "type": "paragraph", "content": [{ "type": "text", "text": "Ideal para reuniones familiares." }] }
            ]
        },
        bloques: [
            {
                "tipo": "CarruselImagenes",
                "imagenes": [
                    "https://s3.example.com/casa_foto1.jpg",
                    "https://s3.example.com/casa_foto2.jpg"
                ]
            }
        ]
    },
    {
        id: "126",
        slug: "loft-san-telmo",
        categoria: "departamentos",
        titulo: "Loft industrial en San Telmo",
        metadata: {
            "ubicacion": "San Telmo, Buenos Aires",
            "precio": 65000,
            "fechaPublicacion": "2025-04-21T00:00:00Z",
            "portadaUrl": "https://s3.example.com/portada_loft.jpg",
            "tags": ["terraza", "estilo industrial"]
        },
        contenido: {
            "type": "doc",
            "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "Moderno loft con diseño abierto..." }] },
                { "type": "bloquePersonalizado", "attrs": { "index": 0 } },
                { "type": "paragraph", "content": [{ "type": "text", "text": "Perfecto para artistas y creativos." }] }
            ]
        },
        bloques: [
            {
                "tipo": "CarruselImagenes",
                "imagenes": [
                    "https://s3.example.com/loft_foto1.jpg",
                    "https://s3.example.com/loft_foto2.jpg"
                ]
            }
        ]
    },
    {
        id: "127",
        slug: "ph-villa-urquiza",
        categoria: "ph",
        titulo: "PH con terraza en Villa Urquiza",
        metadata: {
            "ubicacion": "Villa Urquiza, Buenos Aires",
            "precio": 95000,
            "fechaPublicacion": "2025-04-19T00:00:00Z",
            "portadaUrl": "https://s3.example.com/portada_ph.jpg",
            "tags": ["terraza", "parilla"]
        },
        contenido: {
            "type": "doc",
            "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "PH con amplia terraza y parrilla..." }] },
                { "type": "bloquePersonalizado", "attrs": { "index": 0 } },
                { "type": "paragraph", "content": [{ "type": "text", "text": "Ideal para disfrutar al aire libre." }] }
            ]
        },
        bloques: [
            {
                "tipo": "CarruselImagenes",
                "imagenes": [
                    "https://s3.example.com/ph_foto1.jpg",
                    "https://s3.example.com/ph_foto2.jpg"
                ]
            }
        ]
    },
    {
        id: "128",
        slug: "casa-nunez",
        categoria: "casas",
        titulo: "Casa contemporánea en Núñez",
        metadata: {
            "ubicacion": "Núñez, Buenos Aires",
            "precio": 180000,
            "fechaPublicacion": "2025-04-17T00:00:00Z",
            "portadaUrl": "https://s3.example.com/portada_casa3.jpg",
            "tags": ["piscina", "gimnasio"]
        },
        contenido: {
            "type": "doc",
            "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "Espectacular casa con diseño moderno..." }] },
                { "type": "bloquePersonalizado", "attrs": { "index": 0 } },
                { "type": "paragraph", "content": [{ "type": "text", "text": "Perfecta para un estilo de vida premium." }] }
            ]
        },
        bloques: [
            {
                "tipo": "CarruselImagenes",
                "imagenes": [
                    "https://s3.example.com/nunez_foto1.jpg",
                    "https://s3.example.com/nunez_foto2.jpg"
                ]
            }
        ]
    }
];

export const inmuebleRoute = new Hono()
    .get("/", (c) => {
        return c.json({ "inmuebles": [...fakeInmuebles]});
    })
    .get("/:id", (c) => {
        const id = c.req.param("id");
        const page = fakeInmuebles.find((p) => p.id === id);
        return c.json(page);
    })
    .post("/:id", zValidator("json", inmueblePageSchema), async (c) => {
        const data = await c.req.valid("json");
        const page = inmueblePageSchema.parse(data);
        return c.json(page);
    })
    .put("/:id", zValidator("json", inmueblePageSchema), async (c) => {
        const id = await c.req.param("id");
        const data = await c.req.valid("json");
        const page = inmueblePageSchema.parse(data);

        const index = fakeInmuebles.findIndex(p => p.id === id);
        if (!index) {
            return c.notFound()
        }

        fakeInmuebles[index] = page;
        return c.json({ "inmueble": page });

    })
    .delete("/:id", async (c) => {
        const id = await c.req.param("id");
        const index = fakeInmuebles.findIndex(p => p.id === id);
        if (!index) {
            return c.notFound()
        }
        const deletedPage = fakeInmuebles.splice(index, 1)[0];
        return c.json({"inmueble": deletedPage});
    })
    ;