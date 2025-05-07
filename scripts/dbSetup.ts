#!/usr/bin/env bun

import { UsuariosModel } from "../apps/backend/src/db/models/usuarios"

const fs = require('fs');
const path = require('path');

function insertarLocalidades(localidadesDir) {
    console.log(`Iniciando parseo de archivos...`);

    fs.readdir(localidadesDir, (err, files) => {
        if (err) {
            console.error('Error al leer la carpeta de localidades:', err);
            rl.close();
            return;
        }

        const txtFiles = files.filter(file => file.endsWith('.txt'));

        if (txtFiles.length === 0) {
            console.log('No se encontraron archivos .txt en la carpeta.');
            rl.close();
            return;
        }

        txtFiles.forEach(file => {
            const filePath = path.join(localidadesDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.trim().split('\n');

            // 3. Buscar línea del encabezado (la primera línea con '|')
            const headerIndex = lines.findIndex(line => line.includes('|'));
            if (headerIndex === -1) {
                console.warn(`No se encontró encabezado válido en ${file}`);
                return;
            }

            const headers = lines[headerIndex].split('|');
            const dataLines = lines.slice(headerIndex + 1);

            const parsed = dataLines.map(line => {
                const values = line.split('|');
                const entry = {};
                headers.forEach((h, i) => {
                    entry[h.trim()] = values[i] ? values[i].trim() : null;
                });
                return entry;
            });

            const outputFileName = file.replace('.txt', '.json');
            const outputPath = path.join(localidadesDir, outputFileName);
            fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), 'utf-8');
            console.log(`Archivo procesado: ${file} -> ${outputFileName}`);
        });

    });
};

let username = process.env.DEV_DB_USERNAME;
let password = process.env.DEV_DB_PASSWORD;

if (!username || !password) {
    process.exit(1);
}

UsuariosModel.insertar(username, password);

//insertarLocalidades(path.resolve(__dirname, '../assets/localidades'));