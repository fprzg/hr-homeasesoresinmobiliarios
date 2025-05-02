#! /bin/bash

#curl -H "Content-Type: application/json"  -X POST localhost:3000/api/usuarios/login -d '{ "username": "mememe", "password": "11001100"}'

#--silent --output /dev/null --cookie-jar - \

curl \
    -H "Content-Type: application/json" \
    -d '{ "username": "admin", "password": "pa55word"}' \
    --cookie-jar - \
    -X POST localhost:3000/api/auth/login
