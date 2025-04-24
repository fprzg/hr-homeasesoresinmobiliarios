#!/usr/bin/env bun

import { db } from "../db/client"
import * as schema from "../db/schemas"
import { type Inmueble } from "@shared/zodSchemas/inmueble";

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
            ubicacion: "Palermo, Buenos Aires",
            precio: 120000,
            fechaPublicacion: "2025-04-22T00:00:00Z",
            portadaUrl: "https://s3.example.com/portada.jpg",
            tags: ["jardín", "cochera"],
        },
        contenido: [
            { tipo: "Descripcion", texto: "Hermosa propiedad de tres habitaciones..." },
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://s3.example.com/foto1.jpg",
                    "https://s3.example.com/foto2.jpg",
                ],
            },
            { tipo: "Descripcion", texto: "Ideal para familias numerosas." },
        ],
    },
    {
        id: "124",
        slug: "depto-recoletas",
        categoria: "departamentos",
        titulo: "Departamento moderno en Recoleta",
        metadata: {
            ubicacion: "Recoleta, Buenos Aires",
            precio: 85000,
            fechaPublicacion: "2025-04-20T00:00:00Z",
            portadaUrl: "https://s3.example.com/portada_depto1.jpg",
            tags: ["balcón", "piscina"],
        },
        contenido: [
            {
                tipo: "Descripcion",
                texto: "Exclusivo departamento con vista al parque...",
            },
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://s3.example.com/depto_foto1.jpg",
                    "https://s3.example.com/depto_foto2.jpg",
                ],
            },
            { tipo: "Descripcion", texto: "Perfecto para profesionales jóvenes." },
        ],
    },
    {
        id: "125",
        slug: "casa-belgrano",
        categoria: "casas",
        titulo: "Casa espaciosa en Belgrano",
        metadata: {
            ubicacion: "Belgrano, Buenos Aires",
            precio: 150000,
            fechaPublicacion: "2025-04-18T00:00:00Z",
            portadaUrl: "https://s3.example.com/portada_casa2.jpg",
            tags: ["patio", "quincho"],
        },
        contenido: [
            { tipo: "Descripcion", texto: "Amplia casa con cuatro dormitorios..." },
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://s3.example.com/casa_foto1.jpg",
                    "https://s3.example.com/casa_foto2.jpg",
                ],
            },
            { tipo: "Descripcion", texto: "Ideal para reuniones familiares." },
        ],
    },
    {
        id: "126",
        slug: "loft-san-telmo",
        categoria: "departamentos",
        titulo: "Loft industrial en San Telmo",
        metadata: {
            ubicacion: "San Telmo, Buenos Aires",
            precio: 65000,
            fechaPublicacion: "2025-04-21T00:00:00Z",
            portadaUrl: "https://s3.example.com/portada_loft.jpg",
            tags: ["terraza", "estilo industrial"],
        },
        contenido: [
            { tipo: "Descripcion", texto: "Moderno loft con diseño abierto..." },
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://s3.example.com/loft_foto1.jpg",
                    "https://s3.example.com/loft_foto2.jpg",
                ],
            },
            { tipo: "Descripcion", texto: "Perfecto para artistas y creativos." },
        ],
    },
    {
        id: "127",
        slug: "ph-villa-urquiza",
        categoria: "ph",
        titulo: "PH con terraza en Villa Urquiza",
        metadata: {
            ubicacion: "Villa Urquiza, Buenos Aires",
            precio: 95000,
            fechaPublicacion: "2025-04-19T00:00:00Z",
            portadaUrl: "https://s3.example.com/portada_ph.jpg",
            tags: ["terraza", "parilla"],
        },
        contenido: [
            { tipo: "Descripcion", texto: "PH con amplia terraza y parrilla..." },
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://s3.example.com/ph_foto1.jpg",
                    "https://s3.example.com/ph_foto2.jpg",
                ],
            },
            { tipo: "Descripcion", texto: "Ideal para disfrutar al aire libre." },
        ],
    },
    {
        id: "128",
        slug: "casa-nunez",
        categoria: "casas",
        titulo: "Casa contemporánea en Núñez",
        metadata: {
            ubicacion: "Núñez, Buenos Aires",
            precio: 180000,
            fechaPublicacion: "2025-04-17T00:00:00Z",
            portadaUrl: "https://s3.example.com/portada_casa3.jpg",
            tags: ["piscina", "gimnasio"],
        },
        contenido: [
            { tipo: "Descripcion", texto: "Espectacular casa con diseño moderno..." },
            {
                tipo: "CarruselImagenes",
                imagenes: [
                    "https://s3.example.com/nunez_foto1.jpg",
                    "https://s3.example.com/nunez_foto2.jpg",
                ],
            },
            { tipo: "Descripcion", texto: "Perfecta para un estilo de vida premium." },
        ],
    },
];

fakeInmuebles.map(async (inmueble) => {
    await db.insert(schema.inmuebles).values(inmueble);
});