CREATE TABLE
    documentos (
        id TEXT PRIMARY KEY,
        categoria TEXT CHECK (categoria IN ('casa', 'terreno')),
        titulo TEXT NOT NULL,
        portada TEXT NOT NULL,
        metadata TEXT NOT NULL,
        contenido TEXT NOT NULL
    );