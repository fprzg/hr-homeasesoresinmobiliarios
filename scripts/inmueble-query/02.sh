#! /bin/bash

QUERY='page=1&limit=10'

curl -X GET "http://localhost:3000/api/inmuebles?$QUERY" | jq