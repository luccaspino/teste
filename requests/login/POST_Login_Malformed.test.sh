#!/bin/bash

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url 'http://localhost:3000/users/login' \
  --header 'Content-Type: application/json' \
  --data '{}')

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "400" || "$status" == "422" ]]; then
  echo "PASS: POST /users/login retornou erro para corpo malformado."
else
  echo "FAIL: POST /users/login deveria falhar para corpo malformado."
  echo "Status: $status"
  echo "Resposta: $body"
fi