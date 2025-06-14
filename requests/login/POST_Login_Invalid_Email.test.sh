#!/bin/bash

USERNAME="notregistered"
PASSWORD="somepassword"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url 'http://localhost:3000/users/login' \
  --header 'Content-Type: application/json' \
  --data "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "401" || "$status" == "400" ]]; then
  echo "PASS: POST /users/login retornou erro para usuário inválido."
else
  echo "FAIL: POST /users/login deveria falhar para usuário inválido."
  echo "Status: $status"
  echo "Resposta: $body"
fi