#!/bin/bash

USERNAME="invalidemailuser"
EMAIL="not-an-email"
PASSWORD="securepassword"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data "{\"username\": \"$USERNAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "400" || "$status" == "422" ]]; then
  echo "PASS: POST /users/register retornou erro para e-mail inválido."
else
  echo "FAIL: POST /users/register deveria falhar para e-mail inválido."
  echo "Status: $status"
  echo "Resposta: $body"
fi