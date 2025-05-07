CREATE TABLE
    archivos (
        id TEXT PRIMARY KEY,
        inmueble_id TEXT,
        filename TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at INTEGER CURRENT_TIMESTAMP,
        FOREIGN KEY (inmueble_id) REFERENCES inmuebles (id)
    );