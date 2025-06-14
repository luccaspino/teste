#!/bin/bash

USERNAME="duplicateuser"
EMAIL="user@email.com"
PASSWORD="anotherpassword"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data "{\"username\": \"$USERNAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "409" || "$status" == "400" ]]; then
  echo "PASS: POST /users/register retornou erro para e-mail duplicado."
else
  echo "FAIL: POST /users/register deveria falhar para e-mail duplicado."
  echo "Status: $status"
  echo "Resposta: $body"
fi