CREATE TABLE
    archivos (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at DATETIME CURRENT_TIMESTAMP,
        inmueble_id TEXT,
        add_to_carousel INTEGER NOT NULL CHECK (add_to_carousel IN (0, 1)),
        FOREIGN KEY (inmueble_id) REFERENCES inmuebles (id)
    );