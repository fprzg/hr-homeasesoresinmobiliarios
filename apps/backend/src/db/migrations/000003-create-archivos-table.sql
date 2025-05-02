PRAGMA foreign_keys = ON;

CREATE TABLE archivos (
    id TEXT PRIMARY KEY,
    documento_id TEXT,
    filename TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at INTEGER CURRENT_TIMESTAMP,

    FOREIGN KEY (documento_id) REFERENCES documentos(id)
);
