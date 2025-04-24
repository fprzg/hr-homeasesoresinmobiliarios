CREATE TABLE
    inmuebles (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        categoria TEXT NOT NULL,
        titulo TEXT NOT NULL,
        metadata TEXT NOT NULL,
        contenido TEXT NOT NULL
    );