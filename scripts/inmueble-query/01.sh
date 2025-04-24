#! /bin/bash
set -eux

#QUERY='page=1&limit=10&categoria=casas'
QUERY='page=1&limit=10'

curl -X GET "http://localhost:5173/api/inmuebles?$QUERY" 
