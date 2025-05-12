CREATE TABLE
    asentamientos (
        id INTEGER PRIMARY KEY,
        tipo TEXT NOT NULL,
        calle_colonia TEXT,
        municipio TEXT,
        codigo_postal TEXT,
        estado TEXT NOT NULL
    );

CREATE TABLE
    inmuebles (
        id TEXT PRIMARY KEY,
        categoria TEXT NOT NULL CHECK (categoria IN ('casa', 'terreno')),
        asentamiento_id INTEGER NOT NULL,
        precio INTEGER,
        area_total INTEGER,
        fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        portada TEXT NOT NULL,
        contenido TEXT NOT NULL,
        FOREIGN KEY (asentamiento_id) REFERENCES asentamientos (id)
    );

CREATE TABLE
    inmu_casas (
        id TEXT PRIMARY KEY,
        area_construida INTEGER,
        num_areas INTEGER,
        num_banos INTEGER,
        num_recamaras INTEGER,
        num_pisos INTEGER,
        num_cocheras INTEGER,
        piscina INTEGER CHECK (piscina IN (0, 1)),
        FOREIGN KEY (id) REFERENCES inmuebles (id)
    );

CREATE TABLE
    inmu_terrenos (
        id TEXT PRIMARY KEY,
        metros_frente INTEGER,
        metros_fondo INTEGER,
        tipo_propiedad TEXT CHECK (
            tipo_propiedad IN ('privada', 'comunal', 'ejidal')
        ),
        FOREIGN KEY (id) REFERENCES inmuebles (id)
    );

CREATE INDEX idx_asentamiento_estado_id ON asentamientos (estado);
CREATE INDEX idx_inmueble_precio_area ON inmuebles (precio, area_total);
CREATE INDEX idx_inmueble_tipo ON inmuebles (categoria);
CREATE INDEX idx_inmu_casas_recamaras_areas ON inmu_casas (area_construida, num_areas, num_recamaras);
CREATE INDEX idx_inmu_terrenos_frente_fondo_tipo ON inmu_terrenos (metros_frente, metros_fondo, tipo_propiedad);

CREATE TRIGGER update_inmueble_casas AFTER
UPDATE ON inmu_casas FOR EACH ROW BEGIN
UPDATE inmuebles
SET
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE
    id = OLD.id;

END;

CREATE TRIGGER update_inmueble_terrenos AFTER
UPDATE ON inmu_terrenos FOR EACH ROW BEGIN
UPDATE inmuebles
SET
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE
    id = OLD.id;

END;