#!/bin/bash

USERNAME="newuser"
EMAIL="user@email.com"
PASSWORD="securepassword"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url 'http://localhost:3000/users/login' \
  --header 'Content-Type: application/json' \
  --data "{\"username\": \"$USERNAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" ]] && [[ "$body" == *"token"* ]]; then
  echo "PASS: POST /users/login autenticou o usuário com sucesso."
else
  echo "FAIL: POST /users/login falhou ao autenticar o usuário."
  echo "Status: $status"
  echo "Resposta: $body"
fi