CREATE TABLE
    archivos (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at DATETIME CURRENT_TIMESTAMP
    );