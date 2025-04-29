#!/bin/bash

API_URL="http://localhost:3000/api"
CONTENT_DIRECTORY="./Casas"

for dir in "$CONTENT_DIRECTORY"/*/; do
  echo "Procesando $dir"

  # Obtener imágenes
  images=($(find "$dir" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort))
  if [ ${#images[@]} -eq 0 ]; then
    echo "No hay imágenes en $dir, saltando"
    continue
  fi

  # Subir portada
  portada_id=$(curl -F "file=@${images[0]}" "$API_URL/archivos" | jq -r .id)
  echo "Portada subida: $portada_id"

  # Subir imágenes para carrusel (excluyendo la primera)
  carrusel_ids=()
  for img in "${images[@]:1}"; do
    img_id=$(curl -s -F "file=@$img" "$API_URL/archivos" | jq -r .id)
    echo "Imagen carrusel subida: $img_id"
    carrusel_ids+=("\"$img_id\"")
  done

  # Concatenar textos
  texto=$(find "$dir" -type f -name "*.txt" | sort | xargs cat | jq -Rs .)

  # Construir contenido
  contenido="[ { \"tipo\": \"Texto\", \"texto\": $texto }"
  if [ ${#carrusel_ids[@]} -gt 0 ]; then
    carrusel_block=", { \"tipo\": \"CarruselImagenes\", \"imagenes\": [${carrusel_ids[*]}] }"
    contenido+="$carrusel_block"
  fi
  contenido+=" ]"

  # Generar título a partir del nombre del directorio
  titulo=$(basename "$dir")

  # Construir metadata genérica
  metadata=$(jq -n \
    --arg fecha "$(date -Iseconds)" \
    --arg ubicacion "Ubicación de ejemplo" \
    --argjson precio 123456 \
    '{ fechaPublicacion: $fecha, ubicacion: $ubicacion, precio: $precio }')

  # Construir JSON final
  inmueble=$(jq -n \
    --arg id "inm_$(uuidgen | tr '[:upper:]' '[:lower:]')" \
    --arg categoria "general" \
    --arg titulo "$titulo" \
    --arg portada "$portada_id" \
    --argjson metadata "$metadata" \
    --argjson contenido "$contenido" \
    '{ id: $id, categoria: $categoria, titulo: $titulo, portada: $portada, metadata: $metadata, contenido: $contenido }')

  # Crear el documento
  echo "Creando inmueble: $titulo"
  echo "$inmueble" | curl -s -X POST -H "Content-Type: application/json" -d @- "$API_URL/inmuebles" | jq
done
