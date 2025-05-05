#!/usr/bin/env bun

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 1. Preguntar al usuario su nombre
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Ingresa tu nombre de usuario: ', (usuario) => {
    console.log(`Hola, ${usuario}. Iniciando parseo de archivos...`);
    const localidadesDir = path.resolve(__dirname, '../assets/localidades');

    // 2. Leer todos los archivos .txt en la carpeta
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

        rl.close();
    });
});
