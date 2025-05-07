PRAGMA foreign_keys = ON;

-- Estados table (2-letter alphabetic clave as id)
CREATE TABLE estados (
    id TEXT PRIMARY KEY CHECK (length(id) = 2 AND id GLOB '[A-Z][A-Z]')
);

-- Municipios table (3-digit clave unique within estado)
CREATE TABLE municipios (
    id INTEGER PRIMARY KEY,
    estado_id TEXT NOT NULL,
    nombre TEXT NOT NULL,
    clave TEXT NOT NULL CHECK (length(clave) = 3 AND clave GLOB '[0-9][0-9][0-9]'),
    UNIQUE (clave, estado_id),
    FOREIGN KEY (estado_id) REFERENCES estados(id)
);

-- Codigos_postales table (normalized postal codes)
CREATE TABLE codigos_postales (
    codigo_postal TEXT PRIMARY KEY CHECK (length(codigo_postal) <= 5 AND codigo_postal GLOB '[0-9]*'),
    ciudad TEXT
);

-- Asentamientos table (normalized settlement data)
CREATE TABLE asentamientos (
    id TEXT PRIMARY KEY, -- NanoID
    tipo TEXT NOT NULL,
    nombre TEXT NOT NULL,
    calle TEXT,
    colonia TEXT,
    municipio_id INTEGER NOT NULL,
    codigo_postal TEXT NOT NULL,
    FOREIGN KEY (municipio_id) REFERENCES municipios(id),
    FOREIGN KEY (codigo_postal) REFERENCES codigos_postales(codigo_postal)
);

-- Inmueble table (base property data)
CREATE TABLE inmueble (
    id TEXT PRIMARY KEY, -- NanoID
    categoria TEXT NOT NULL CHECK (categoria IN ('casa', 'terreno')),
    estado_id TEXT NOT NULL,
    asentamiento_id TEXT NOT NULL,
    precio INTEGER NOT NULL CHECK (precio > 0),
    area_total INTEGER NOT NULL CHECK (area_total > 0),
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    portada TEXT NOT NULL, -- NanoID referencing archivos.id
    contenido TEXT NOT NULL, -- JSON for UI hydration
    FOREIGN KEY (estado_id) REFERENCES estados(id),
    FOREIGN KEY (asentamiento_id) REFERENCES asentamientos(id),
    FOREIGN KEY (portada) REFERENCES archivos(id)
);

-- Inmu_casas table (house-specific data)
CREATE TABLE inmu_casas (
    id TEXT PRIMARY KEY, -- NanoID, same as inmueble.id
    area_construida INTEGER NOT NULL CHECK (area_construida > 0),
    num_banos INTEGER NOT NULL CHECK (num_banos >= 0),
    num_areas INTEGER NOT NULL CHECK (num_areas > 0),
    num_recamaras INTEGER NOT NULL CHECK (num_recamaras > 0),
    num_pisos INTEGER NOT NULL CHECK (num_pisos > 0),
    num_cocheras INTEGER NOT NULL CHECK (num_cocheras >= 0),
    piscina INTEGER NOT NULL CHECK (piscina IN (0, 1)),
    FOREIGN KEY (id) REFERENCES inmueble(id)
);

-- Inmu_terrenos table (terrain-specific data)
CREATE TABLE inmu_terrenos (
    id TEXT PRIMARY KEY, -- NanoID, same as inmueble.id
    metros_frente INTEGER NOT NULL CHECK (metros_frente > 0),
    metros_fondo INTEGER NOT NULL CHECK (metros_fondo > 0),
    tipo_propiedad TEXT NOT NULL CHECK (tipo_propiedad IN ('privada', 'comunal', 'ejidal')),
    uso_suelo TEXT, -- Optional land use (e.g., residential, commercial)
    FOREIGN KEY (id) REFERENCES inmueble(id)
);

-- Indexes for query performance
CREATE INDEX idx_municipios_clave_estado ON municipios(clave, estado_id);
CREATE INDEX idx_inmueble_estado_id ON inmueble(estado_id);
CREATE INDEX idx_inmueble_precio_area ON inmueble(precio, area_total);
CREATE INDEX idx_inmueble_tipo ON inmueble(categoria);
CREATE INDEX idx_inmu_casas_recamaras_areas ON inmu_casas(num_recamaras, num_areas, area_construida);
CREATE INDEX idx_inmu_terrenos_frente_fondo_tipo ON inmu_terrenos(metros_frente, metros_fondo, tipo_propiedad);

-- Trigger to update inmueble.fechaActualizacion on inmu_casas changes
CREATE TRIGGER update_inmueble_casas
AFTER UPDATE ON inmu_casas
FOR EACH ROW
BEGIN
    UPDATE inmueble
    SET fechaActualizacion = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;

-- Trigger to update inmueble.fechaActualizacion on inmu_terrenos changes
CREATE TRIGGER update_inmueble_terrenos
AFTER UPDATE ON inmu_terrenos
FOR EACH ROW
BEGIN
    UPDATE inmueble
    SET fechaActualizacion = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;