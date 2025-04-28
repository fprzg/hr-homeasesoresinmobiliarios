PRAGMA foreign_keys = ON;

CREATE TABLE
    archivos (
        id TEXT PRIMARY KEY,
        inmueble_id TEXT NOT NULL,
        handle TEXT NOT NULL UNIQUE,
        handle_server TEXT NOT NULL CHECK (handle_server IN ('s3', 'local')),
        estado TEXT CHECK( estado IN ('recibido', 'en_uso')),
        FOREIGN KEY (inmueble_id) REFERENCES inmuebles (id)
    );