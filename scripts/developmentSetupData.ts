#!/usr/bin/env bun

import { db } from "../apps/backend/db/client"
import * as schema from "../apps/backend/db/schemas"
import { type Inmueble } from "../shared/zodSchemas/inmueble";

const username = process.env.DEV_DB_USERNAME || "admin";
const password = process.env.DEV_DB_PASSWORD || "pa55word";

if (!username || !password) {
    process.exit(1);
}

// TODO: Tratar lanzar los errores con catch((err) => {...})
db.insert(schema.usuarios).values({ username, password })
    .then(() => console.log(`✅ Usuario "${username}" insertado con éxito.`))
    .catch((err) => {
        console.error('❌ Error al insertar usuario:', err.message);
        process.exit(1);
    });

db.insert(schema.categorias).values({ nombre: "casas", })


const fakeInmuebles: Inmueble[] = [
    {
        id: "123",
        slug: "casa-palermo",
        categoria: "casas",
        titulo: "Casa estilo colonial en Palermo",
        metadata: {
            descripcion: "Hermosa propiedad de tres habitaciones...",
            ubicacion: "Palermo, Buenos Aires",
            precio: 120000,
            fechaPublicacion: "2025-04-22T00:00:00Z",
            portadaUrl: "https://placehold.co/600x400/000000/FFF",
            tags: ["jardín", "cochera"],
        },
        contenido: [
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://placehold.co/600x400/000ff0/FFF",
                    "https://placehold.co/600x400/000000/FFF",
                ],
            },
        ],
    },
    {
        id: "124",
        categoria: "departamentos",
        titulo: "Departamento moderno en Recoleta",
        metadata: {
                descripcion: "Exclusivo departamento con vista al parque...",
            ubicacion: "Recoleta, Buenos Aires",
            precio: 85000,
            fechaPublicacion: "2025-04-20T00:00:00Z",
            portadaUrl: "https://placehold.co/600x400/000066/FFF",
            tags: ["balcón", "piscina"],
        },
        contenido: [
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://placehold.co/600x400/000ff0/FFF",
                    "https://placehold.co/600x400/0ff000/FFF",
                ],
            },
        ],
    },
    {
        id: "125",
        categoria: "casas",
        titulo: "Casa espaciosa en Belgrano",
        metadata: {
            ubicacion: "Belgrano, Buenos Aires",
            precio: 150000,
            fechaPublicacion: "2025-04-18T00:00:00Z",
            portadaUrl: "https://placehold.co/600x400/006600/FFF",
            tags: ["patio", "quincho"],
            descripcion: "Ideal para reuniones familiares.",
        },
        contenido: [
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://placehold.co/600x400/00fff0/FFF",
                    "https://placehold.co/600x400/0f0000/FFF",
                ],
            },
        ],
    },
    {
        id: "126",
        categoria: "departamentos",
        titulo: "Loft industrial en San Telmo",
        metadata: {
            descripcion: "Moderno loft con diseño abierto...",
            ubicacion: "San Telmo, Buenos Aires",
            precio: 65000,
            fechaPublicacion: "2025-04-21T00:00:00Z",
            portadaUrl: "https://placehold.co/600x400/660000/FFF",
            tags: ["terraza", "estilo industrial"],
        },
        contenido: [
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://placehold.co/600x400/00f0f0/FFF",
                    "https://placehold.co/600x400/0f00f0/FFF",
                ],
            },
        ],
    },
];

fakeInmuebles.map(async (inmueble) => {
    await db.insert(schema.inmuebles).values(inmueble);
});