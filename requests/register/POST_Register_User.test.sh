#!/bin/bash

USERNAME="newuser123"
EMAIL="user123@email.com"
PASSWORD="securepassword12"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data "{\"username\": \"$USERNAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "201" || "$status" == "200" ]]; then
  echo "PASS: POST /users/register registrou o usuário com sucesso."
else
  echo "FAIL: POST /users/register falhou ao registrar o usuário."
  echo "Status: $status"
  echo "Resposta: $body"
fi