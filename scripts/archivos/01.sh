#!/bin/bash

API_URL="http://localhost:3000/api/archivos"
FILE_PATH="./mana.jpg"

# Subir un archivo
echo "Subiendo archivo..."
curl -X POST "$API_URL" \
  -F "file=@$FILE_PATH" \
  -F "inmuebleId=123" \
  -F "server=local"

exit

echo ""
echo "---------"

# Cambia aquí el ID que te devuelva el POST
ARCHIVO_ID="pon-aqui-el-id-devuelto"

# Descargar archivo
echo "Descargando archivo..."
curl -X GET "$API_URL/$ARCHIVO_ID" --output descargado.png

echo "Archivo descargado como descargado.png"
echo "---------"

# Actualizar estado a 'en_uso'
echo "Actualizando estado..."
curl -X PUT "$API_URL/$ARCHIVO_ID"

echo ""
echo "---------"

# Eliminar archivo
echo "Eliminando archivo..."
curl -X DELETE "$API_URL/$ARCHIVO_ID"

echo ""
echo "---------"
