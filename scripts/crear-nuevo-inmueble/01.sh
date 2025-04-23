#! /bin/bash

BODY='{
    "id": "da4d36f2-f3fd-4727-9d6c-97c294094b0d",
    "slug": "nuevo-inmueble",
    "categoria": "casas",
    "titulo": "",
    "metadata": {
        "ubicacion": "Sip",
        "precio": 0,
        "fechaPublicacion": "2025-04-23T17:25:25.825Z"
    },
    "contenido": [
        {
            "tipo": "Titulo",
            "texto": "Nueva página"
        },
        {
            "tipo": "Descripcion",
            "texto": "Agregar una descripción..."
        }
    ]
}'

curl -H "Content-Type: application/json" -X POST http://localhost:3000/api/inmueble -d "$BODY" | jq